import { queryOptions } from "@tanstack/react-query";
import { getDeposit, getTokensPrice } from "./queries";

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
