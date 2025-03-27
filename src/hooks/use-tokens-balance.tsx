import { useAccount } from "wagmi";
import { useEffect, useState, useMemo } from "react";
import { erc20Abi, getContract, formatUnits } from "viem";
import { usePublicClients } from "./use-public-clients";
import type { Chain, TokenBalance } from "@/types";

export const useTokenBalances = (chains: Chain[]) => {
  const { address } = useAccount();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const chainIds = useMemo(() => chains.map((c) => c.chainId), [chains]);
  const publicClients = usePublicClients(chainIds);

  const fetchBalance = async () => {
    if (!address) return;

    const fetchPromises = chains.flatMap((chain) => {
      const client = publicClients[chain.chainId];
      if (!client) return [];

      const nativeSymbol = chain.symbol;
      const promises: Promise<TokenBalance>[] = [];

      const hasNativeInAssets = chain.assets.some(
        (asset) => !asset.address && asset.symbol === nativeSymbol
      );

      if (!hasNativeInAssets) {
        const nativePromise = client
          .getBalance({ address })
          .then((balance) => ({
            symbol: nativeSymbol,
            name: chain.name,
            address: undefined,
            balance: formatUnits(balance, 18),
            chain: chain.name,
            chainId: chain.chainId,
          }));
        promises.push(nativePromise);
      }

      chain.assets.forEach((asset) => {
        const tokenAddress = asset.address;

        if (!tokenAddress && asset.symbol === nativeSymbol) {
          const nativePromise = client
            .getBalance({ address })
            .then((balance) => ({
              symbol: asset.symbol,
              name: asset.name,
              address: undefined,
              balance: formatUnits(balance, asset.decimals),
              chain: chain.name,
              chainId: chain.chainId,
            }));
          promises.push(nativePromise);
        } else if (tokenAddress) {
          const contract = getContract({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            client,
          });

          const tokenPromise = Promise.all([
            contract.read.balanceOf([address]),
            contract.read.decimals(),
          ]).then(([rawBalance, decimals]) => ({
            symbol: asset.symbol,
            name: asset.name,
            address: tokenAddress,
            balance: formatUnits(rawBalance as bigint, decimals as number),
            chain: chain.name,
            chainId: chain.chainId,
          }));
          promises.push(tokenPromise);
        }
      });

      return promises;
    });

    const results = await Promise.allSettled(fetchPromises);
    return results
      .filter(
        (result): result is PromiseFulfilledResult<TokenBalance> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);
  };

  const refetchBalance = () => {
    fetchBalance()
      .then((res) => {
        setBalances(res ?? []);
      })
      .catch((err) => {
        console.error(err);
        setBalances([]);
      });
  };

  useEffect(() => {
    refetchBalance();
  }, [chains, address]);

  return { balances, refetchBalance: refetchBalance };
};
