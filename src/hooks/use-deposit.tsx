import type { Asset } from "@/types";
import type { Chain } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDepositOptions, getTokensPriceOptions } from "@/lib/api/options";
import {
  useAccount,
  useBlockNumber,
  useReadContract,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import { useTokenBalances } from "./use-tokens-balance";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { TellerAbi } from "@/abi/teller";

export function useDeposit() {
  const { isConnected, address } = useAccount();

  const { data: deposit } = useSuspenseQuery(getDepositOptions());
  const { data: tokensPrice } = useSuspenseQuery(getTokensPriceOptions());

  const tokensBalance = useTokenBalances(deposit.chains);

  const [selectedChain, setSelectedChain] = useState<Chain>(deposit.chains[1]);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(
    deposit.chains[1].assets[0]
  );

  const [inValue, setInValue] = useState<string>("");

  // Add new states for tracking approval status
  const [isApprovalNeeded, setIsApprovalNeeded] = useState(true);

  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: selectedAsset.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [
      address as `0x${string}`,
      selectedAsset.out.address as `0x${string}`,
    ],
    query: {
      enabled: isConnected && !!address,
    },
  });

  useEffect(() => {
    console.log(allowance);
  }, [allowance]);

  // Prepare approve transaction
  const { data: approveConfig } = useSimulateContract({
    address: selectedAsset.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "approve",
    args: [
      selectedAsset.out.address as `0x${string}`,
      parseUnits(inValue || "0", selectedAsset.decimals),
    ],
    query: {
      enabled: isConnected && Number(inValue) > 0,
    },
  });

  // Approve hook
  const { writeContract: approve, isPending: isApprovePending } =
    useWriteContract({
      mutation: {
        onSuccess: () => {
          refetchAllowance();
        },
      },
    });

  // Prepare deposit transaction
  const { data: depositConfig, error: depositError } = useSimulateContract({
    address: "0x358CFACf00d0B4634849821BB3d1965b472c776a" as `0x${string}`,
    abi: TellerAbi,
    functionName: "deposit",
    args: [
      selectedAsset.address as `0x${string}`,
      parseUnits(inValue || "0", selectedAsset.decimals),
      0n,
    ],
    query: {
      enabled:
        isConnected &&
        Number(inValue) > 0 &&
        !isApprovalNeeded &&
        !!allowance &&
        allowance > 0n,
    },
  });

  // Deposit hook
  const { writeContract: depositz, isPending: isDepositPending } =
    useWriteContract({
      mutation: {
        onSuccess: () => {
          refetchAllowance();
        },
      },
    });

  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    refetchAllowance();
  }, [blockNumber]);

  // Make sure the input is a number, skip when ending with a dot
  const handleInChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setInValue(val);
    }
  };

  useEffect(() => {
    if (depositError) {
      console.error(depositError);
    }
  }, [depositError]);

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

  // Check if approval is needed whenever allowance or input changes
  useEffect(() => {
    if (!inValue || inValue === "0") {
      setIsApprovalNeeded(false);
      return;
    }

    // If allowance is null/undefined or 0, we need approval
    if (!allowance || allowance === 0n) {
      setIsApprovalNeeded(true);
      return;
    }

    try {
      const parsedInput = parseUnits(inValue, selectedAsset.decimals);
      setIsApprovalNeeded(BigInt(allowance.toString()) < parsedInput);
    } catch (e) {
      console.error("Error checking approval:", e);
      setIsApprovalNeeded(true); // Better to be safe and require approval if there's an error
    }
  }, [allowance, inValue, selectedAsset]);

  const handleDeposit = () => {
    if (isApprovalNeeded) {
      approve(approveConfig?.request!);
    } else {
      depositz(depositConfig?.request!);
    }
  };

  // Update deposit button state
  const depositBtn = useMemo(() => {
    let btnText = "Deposit";
    let isDisabled = !isConnected || !inValue || inValue === "0";

    if (isApprovalNeeded) {
      btnText = isApprovePending ? "Approving" : "Approve";
      isDisabled = false;
    } else if (isDepositPending) {
      btnText = "Depositing";
      isDisabled = true;
    }

    return {
      isConnected,
      isApprovalNeeded,
      isApproving: isApprovePending,
      isDepositing: isDepositPending,
      handleDeposit,
      btnText,
      isDisabled,
    };
  }, [
    allowance,
    isConnected,
    inValue,
    isApprovalNeeded,
    isApprovePending,
    isDepositPending,
    handleDeposit,
  ]);

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
