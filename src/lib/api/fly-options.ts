import { queryOptions } from "@tanstack/react-query";
import {
  getFlyChains,
  getFlyTokens,
  getFlyQuote,
  getFlySwapStatus,
  type FlyQuoteRequest,
  getFlyBalances,
  type FlyBalanceRequest,
  getFlyDistributions,
  getFlyAllowance,
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

export function getFlyTokenSearchOptions(
  networkName?: string,
  searchValue?: string
) {
  return queryOptions({
    queryKey: ["fly-token-search", networkName, searchValue],
    queryFn: () => getFlyTokens(networkName, 0, searchValue),
    enabled: Boolean(networkName && searchValue),
    staleTime: 1000 * 30, // 30s
    gcTime: 1000 * 60 * 5, // 5m
  });
}

export function getFlyQuoteOptions(request: FlyQuoteRequest) {
  return queryOptions({
    queryKey: ["fly-quote", request],
    queryFn: () => getFlyQuote(request),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 2, // 2 minutes
    enabled: Boolean(
      request.fromNetwork &&
        request.toNetwork &&
        request.fromTokenAddress &&
        request.toTokenAddress &&
        request.sellAmount
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

export function getFlyBalancesOptions(params: FlyBalanceRequest) {
  return queryOptions({
    queryKey: ["fly-balances", params],
    queryFn: () => getFlyBalances(params),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    enabled: Boolean(
      params.walletAddresses?.length && params.networkNames?.length
    ),
  });
}

export function getFlyDistributionsOptions(quoteId?: string) {
  return queryOptions({
    queryKey: ["fly-distributions", quoteId],
    queryFn: () => getFlyDistributions(quoteId as string),
    enabled: Boolean(quoteId),
    staleTime: 0,
    gcTime: 1000 * 60,
  });
}

export function getFlyAllowanceOptions(params: {
  networkName?: string;
  walletAddress?: string;
  tokenAddress?: string;
  spenderAddress?: string;
}) {
  return queryOptions({
    queryKey: ["fly-allowance", params],
    queryFn: () => getFlyAllowance(params as any),
    enabled: Boolean(
      params.networkName &&
        params.walletAddress &&
        params.tokenAddress &&
        params.spenderAddress
    ),
    staleTime: 0,
    gcTime: 1000 * 60,
  });
}
