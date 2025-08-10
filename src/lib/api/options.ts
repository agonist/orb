import { queryOptions } from "@tanstack/react-query";
import { getDeposit, getTokensPrice } from "./queries";
import { getSwapData, getSwapChains, getSwapTokens } from "./swap-queries";

// Legacy deposit options
export function getDepositOptions() {
  return queryOptions({
    queryKey: ["deposit"],
    queryFn: () => getDeposit(),
  });
}

export function getTokensPriceOptions() {
  return queryOptions({
    queryKey: ["tokens-price"],
    queryFn: () => getTokensPrice(),
  });
}

// New swap options using Fly protocol API
export function getSwapOptions() {
  return queryOptions({
    queryKey: ["swap-data"],
    queryFn: () => getSwapData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function getSwapChainsOptions() {
  return queryOptions({
    queryKey: ["swap-chains"],
    queryFn: () => getSwapChains(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function getSwapTokensOptions(networkName?: string, offset: number = 0) {
  return queryOptions({
    queryKey: ["swap-tokens", networkName, offset],
    queryFn: () => getSwapTokens(networkName?.toLocaleLowerCase(), offset),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    enabled: !!networkName, // Only fetch when we have a network name
  });
}
