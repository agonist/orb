import { useId, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TokenIcon } from "../ui/token-icon";
import type { Asset, TokenBalance } from "@/types";

interface AssetSelectorProps {
  assets: Asset[];
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  balances: TokenBalance[];
  chainId?: number;
  onReachEnd?: () => void;
  isFetchingMore?: boolean;
  onSearchChange?: (value: string) => void;
  searchQuery?: string;
}

export const AssetSelector = ({
  assets,
  selectedAsset,
  setSelectedAsset,
  balances,
  chainId,
  onReachEnd,
  isFetchingMore,
  onSearchChange,
  searchQuery,
}: AssetSelectorProps) => {
  const id = useId();
  const [search, setSearch] = useState(searchQuery ?? "");

  function getBalanceNum(symbol: string) {
    const raw = balances.find(
      (b) => b.symbol === symbol && (chainId == null || b.chainId === chainId)
    )?.balance;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }

  function findAndFormatBalance(symbol: string) {
    const n = getBalanceNum(symbol);
    return n.toFixed(6).replace(/\.0+$/, ".0");
  }

  const filteredAssets = (assets || [])
    .filter((asset) => {
      const searchLower = search.toLowerCase();
      return (
        asset.name.toLowerCase().includes(searchLower) ||
        asset.symbol.toLowerCase().includes(searchLower) ||
        asset.address?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const stableSet = new Set([
        "usdc",
        "usdc.e",
        "usdt",
        "dai",
        "usds",
        "gho",
      ]);

      const aBalance = getBalanceNum(a.symbol);
      const bBalance = getBalanceNum(b.symbol);

      const aHasBal = aBalance > 0 ? 1 : 0;
      const bHasBal = bBalance > 0 ? 1 : 0;

      if (aHasBal !== bHasBal) return bHasBal - aHasBal;

      const aIsNative = !a.address ? 1 : 0;
      const bIsNative = !b.address ? 1 : 0;
      if (aIsNative !== bIsNative) return bIsNative - aIsNative;

      const aIsStable = stableSet.has(a.symbol.toLowerCase()) ? 1 : 0;
      const bIsStable = stableSet.has(b.symbol.toLowerCase()) ? 1 : 0;
      if (aIsStable !== bIsStable) return bIsStable - aIsStable;

      if (aBalance !== bBalance) return bBalance - aBalance;
      return a.symbol.localeCompare(b.symbol);
    });

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b">
        <span className="text-lg font-semibold">Assets</span>
      </div>
      <div className="p-4">
        <div className="relative">
          <Input
            id={id}
            className="peer pe-9 ps-9"
            placeholder="Search by name, symbol or address"
            type="search"
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              onSearchChange?.(val);
            }}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search size={16} strokeWidth={2} />
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-2 px-4 pb-4 overflow-y-auto flex-1"
        onScroll={(e) => {
          const el = e.currentTarget;
          if (
            onReachEnd &&
            el.scrollTop + el.clientHeight >= el.scrollHeight - 16
          ) {
            onReachEnd();
          }
        }}
      >
        {filteredAssets.map((asset) => (
          <div
            onClick={() => setSelectedAsset(asset)}
            className={cn(
              "w-full flex gap-3 items-center p-3 border rounded-md hover:cursor-pointer text-foreground/80 transition-all",
              selectedAsset.symbol === asset.symbol
                ? "bg-primary/10 border-primary/50 text-foreground"
                : "border-transparent hover:bg-muted hover:border-border"
            )}
            key={`${asset.symbol}-${asset.address ?? "native"}`}
          >
            <TokenIcon
              src={asset.icon}
              alt={asset.name}
              className="w-10 h-10"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{asset.symbol}</span>
                <span className="text-sm font-medium">
                  {findAndFormatBalance(asset.symbol)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground truncate">
                {asset.name}
              </span>
            </div>
          </div>
        ))}
        {isFetchingMore && (
          <div className="py-3 text-center text-sm text-muted-foreground">
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
};
