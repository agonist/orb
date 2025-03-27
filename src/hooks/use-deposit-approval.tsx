import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { erc20Abi, parseUnits } from "viem";
import type { Asset } from "@/types";
import toast from "react-hot-toast";

export function useDepositApproval(selectedAsset: Asset, inValue: string) {
  const { isConnected, address } = useAccount();
  const [isApprovalNeeded, setIsApprovalNeeded] = useState(true);

  const {
    data: allowance,
    refetch: refetchAllowance,
    isRefetching,
  } = useReadContract({
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

  const {
    writeContractAsync: approve,
    data: approveResult,
    isPending: isApprovePending,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success("Approval successful");
      },
    },
  });

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: approveResult ? approveResult : undefined,
  });

  useEffect(() => {
    if (isSuccess) {
      refetchAllowance();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isRefetching) return;

    if (!inValue || inValue === "0") {
      setIsApprovalNeeded(false);
      return;
    }
    if (!allowance || allowance === 0n) {
      setIsApprovalNeeded(true);
      return;
    }
    try {
      const parsedInput = parseUnits(inValue, selectedAsset.decimals);
      setIsApprovalNeeded(BigInt(allowance.toString()) < parsedInput);
    } catch (e) {
      console.error("Error checking approval:", e);
      setIsApprovalNeeded(true);
    }
  }, [allowance, inValue, selectedAsset, isRefetching]);

  return {
    isApprovalNeeded,
    approveConfig,
    approve,
    isApprovePending: isApprovePending || isRefetching,
    refetchAllowance,
    allowance,
  };
}
