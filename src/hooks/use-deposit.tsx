import type { Asset } from "@/types";
import type { Chain } from "@/types";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDepositOptions, getTokensPriceOptions } from "@/lib/api/options";

export function useDeposit() {
  const { data: deposit } = useSuspenseQuery(getDepositOptions());
  const { data: tokensPrice } = useSuspenseQuery(getTokensPriceOptions());

  const [selectedChain, setSelectedChain] = useState<Chain>(deposit.chains[0]);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(
    deposit.chains[0].assets[0]
  );

  const [inValue, setInValue] = useState<string>("");

  // Make sure the input is a number, skip when ending with a dot
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
  }, [selectedAsset, inValue]);

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
  };
}
