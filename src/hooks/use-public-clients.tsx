import { usePublicClient } from "wagmi";
import { useMemo } from "react";

export const usePublicClients = (chainIds: number[]) => {
  const clients = chainIds.map((id) => usePublicClient({ chainId: id }));

  return useMemo(() => {
    const map: Record<number, ReturnType<typeof usePublicClient>> = {};
    chainIds.forEach((id, index) => {
      map[id] = clients[index];
    });
    return map;
  }, [chainIds.join(","), clients]);
};
