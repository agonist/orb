import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChainSelector } from "../selector/chain-selector";
import { AssetSelector } from "../selector/asset-selector";
import { useMemo, useRef, useState } from "react";
import type { Asset, Chain, TokenBalance } from "@/types";
import { SelectBtn } from "../selector/select-btn";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFlyTokens } from "@/lib/api/fly-api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type Props = {
  chainsList: Chain[];
  selectedChain: Chain;
  setSelectedChain: (chain: Chain) => void;
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  balances: TokenBalance[];
};

export const TokenSelectDialog = ({
  chainsList,
  selectedChain,
  setSelectedChain,
  selectedAsset,
  setSelectedAsset,
  balances,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [uiSelectedChain, setUiSelectedChain] = useState(selectedChain);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const onAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setSelectedChain(uiSelectedChain);
    setOpen(false);
  };

  // Infinite tokens for the currently highlighted chain
  const {
    data: tokenPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<any[]>({
    queryKey: ["fly-tokens-infinite", uiSelectedChain?.name, debouncedSearch],
    initialPageParam: 0,
    getNextPageParam: (lastPage: any[] | undefined, allPages: any[][]) => {
      // If the API returns less than a page (assume 20), we stop
      const pageSize = 20;
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return allPages.reduce((acc, page) => acc + (page?.length ?? 0), 0);
    },
    queryFn: async ({ pageParam = 0 }) => {
      return await getFlyTokens(
        uiSelectedChain?.name.toLowerCase(),
        pageParam as number,
        debouncedSearch || undefined
      );
    },
    enabled: Boolean(uiSelectedChain?.name),
    refetchOnMount: "always",
    staleTime: 0,
    retry: 0,
  });

  const allFetchedTokens = useMemo(() => {
    const flat = (tokenPages?.pages ?? []).flat();
    return flat as any[];
  }, [tokenPages]);

  // Map fetched tokens to Asset type for the existing selector component
  const fetchedAssets: Asset[] = useMemo(() => {
    return allFetchedTokens.map((t: any) => ({
      symbol: t.symbol,
      name: t.name,
      icon: t.logoUrl || t.icon,
      decimals: t.decimals,
      address: t.isNative ? undefined : t.address,
      out: {
        symbol: t.symbol,
        name: t.name,
        icon: t.logoUrl || t.icon,
        address: t.address,
        tellerAddress: t.address,
      },
    }));
  }, [allFetchedTokens]);

  // Reset pagination when chain changes
  const prevChainName = useRef<string | undefined>(uiSelectedChain?.name);
  if (prevChainName.current !== uiSelectedChain?.name) {
    prevChainName.current = uiSelectedChain?.name;
    // Reset by refetching the first page and letting infiniteQuery rebuild pages
    // Explicitly provide pageParam to satisfy types
    // Refetch with options to satisfy type signature
    refetch({ throwOnError: false });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SelectBtn
          assetIcon={selectedAsset.icon}
          assetSymbol={selectedAsset.symbol}
          chainName={selectedChain.name}
        />
      </DialogTrigger>
      <DialogContent className="flex p-0 min-w-7xl max-w-7xl w-full max-h-[80vh] h-[600px] overflow-hidden">
        <DialogTitle className="sr-only">Select chain and asset</DialogTitle>
        <DialogDescription className="sr-only">
          Choose a chain on the left and a token on the right
        </DialogDescription>
        <ChainSelector
          chainsList={chainsList}
          selectedChain={uiSelectedChain}
          setSelectedChain={setUiSelectedChain}
        />

        <AssetSelector
          balances={balances}
          assets={
            fetchedAssets.length > 0 ? fetchedAssets : uiSelectedChain.assets
          }
          selectedAsset={selectedAsset}
          setSelectedAsset={onAssetSelect}
          chainId={uiSelectedChain.chainId}
          onReachEnd={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          isFetchingMore={isFetchingNextPage}
          onSearchChange={setSearch}
          searchQuery={search}
        />
      </DialogContent>
    </Dialog>
  );
};
