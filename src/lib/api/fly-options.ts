import { queryOptions } from "@tanstack/react-query";
import {
  getFlyChains,
  getFlyTokens,
  getFlyQuote,
  getFlySwapStatus,
  type FlyQuoteRequest,
} from "./fly-api";

// Query options for Fly protocol API calls
export function getFlyCharnsOptions() {
  return queryOptions({
    queryKey: ["fly-chains"],
    queryFn: () => getFlyChains(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function getFlyTokensOptions(networkName?: string, offset: number = 0) {
  return queryOptions({
    queryKey: ["fly-tokens", networkName, offset],
    queryFn: () => getFlyTokens(networkName, offset),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function getFlyQuoteOptions(request: FlyQuoteRequest) {
  return queryOptions({
    queryKey: ["fly-quote", request],
    queryFn: () => getFlyQuote(request),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 2, // 2 minutes
    enabled: Boolean(
      request.fromTokenAddress &&
        request.toTokenAddress &&
        request.amount &&
        request.fromAddress &&
        request.toAddress
    ),
  });
}

export function getFlySwapStatusOptions(swapId: string) {
  return queryOptions({
    queryKey: ["fly-swap-status", swapId],
    queryFn: () => getFlySwapStatus(swapId),
    refetchInterval: (query) => {
      // Stop polling if completed or failed
      if (
        query.state.data?.status === "completed" ||
        query.state.data?.status === "failed"
      ) {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    enabled: Boolean(swapId),
  });
}
