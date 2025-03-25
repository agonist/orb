import type { Asset } from "@/types";
import type { Chain } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDepositOptions, getTokensPriceOptions } from "@/lib/api/options";
import { useAccount } from "wagmi";
import { useTokenBalances } from "./use-tokens-balance";
export function useDeposit() {
  const { isConnected } = useAccount();

  const { data: deposit } = useSuspenseQuery(getDepositOptions());
  const { data: tokensPrice } = useSuspenseQuery(getTokensPriceOptions());

  const tokensBalance = useTokenBalances(deposit.chains);

  const [selectedChain, setSelectedChain] = useState<Chain>(deposit.chains[0]);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(
    deposit.chains[0].assets[0]
  );

  const [inValue, setInValue] = useState<string>("");

  useEffect(() => {
    console.log(selectedChain);
    console.log(selectedAsset);
  }, [selectedChain, selectedAsset]);

  // Make sure the input is a number, skip when ending with a dot
  const handleInChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setInValue(val);
    }
  };

  useEffect(() => {
    console.log(tokensBalance);
  }, [tokensBalance]);

  const inUsd = useMemo(() => {
    const price = tokensPrice.find(
      (t) => t.symbol === selectedAsset.symbol
    )?.price;

    if (!price || inValue === "") return "$0.00";

    const cleanValue = inValue.toString().endsWith(".")
      ? inValue.toString().slice(0, -1)
      : inValue;

    return `$${(Number(cleanValue) * price).toFixed(2)}`;
  }, [inValue, selectedAsset, tokensPrice]);

  const output = useMemo(() => {
    const outNative = inValue;
    const outUsd = inUsd;

    return {
      outNative,
      outUsd,
    };
  }, [inValue, inUsd]);

  const inBalance = useMemo(() => {
    return (
      tokensBalance.find((t) => t.symbol === selectedAsset.symbol)?.balance ??
      "0"
    );
  }, [tokensBalance, selectedAsset]);

  const depositBtn = useMemo(() => {
    return {
      isConnected,
    };
  }, []);

  return {
    input: {
      selectedChain,
      selectedAsset,
      setSelectedChain,
      setSelectedAsset,
      inValue,
      inUsd,
      handleInChange,
    },
    output,
    depositBtn,
    chainsList: deposit.chains,
    tokensBalance,
    inBalance,
  };
}
