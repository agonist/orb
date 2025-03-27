import type { Asset, Chain } from "@/types";
import { useState, useMemo } from "react";
import { getTokensPriceOptions } from "@/lib/api/options";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useDepositInput(initialChain: Chain, initialAsset: Asset) {
  const { data: tokensPrice } = useSuspenseQuery(getTokensPriceOptions());
  const [selectedChain, setSelectedChain] = useState<Chain>(initialChain);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(initialAsset);
  const [inValue, setInValue] = useState<string>("");

  const handleInChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setInValue(val);
    }
  };

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

  return {
    selectedChain,
    selectedAsset,
    setSelectedChain,
    setSelectedAsset,
    inValue,
    inUsd,
    handleInChange,
    output,
  };
}
