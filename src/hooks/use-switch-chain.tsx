import type { Chain } from "@/types";
import { useEffect } from "react";
import { useSwitchChain } from "wagmi";

export function useWatchChain(selectedChain: Chain) {
  const { chains, switchChain } = useSwitchChain();

  useEffect(() => {
    const chain = chains.find((c) => c.id === selectedChain.chainId);

    if (chain) {
      switchChain({ chainId: chain.id });
    }
  }, [chains, selectedChain, switchChain]);
}
