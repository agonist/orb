import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseUnits } from "viem";
import { TellerAbi } from "@/abi/teller";
import type { Asset } from "@/types";
import toast from "react-hot-toast";
import { useEffect } from "react";

export function useDepositTransaction(
  selectedAsset: Asset,
  inValue: string,
  isApprovalNeeded: boolean,
  allowance: bigint | undefined,
  onDepositSuccess: () => void
) {
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
        Number(inValue) > 0 &&
        !isApprovalNeeded &&
        !!allowance &&
        allowance > 0n,
    },
  });

  const {
    writeContractAsync: deposit,
    data: depositResult,
    isPending: isDepositPending,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success("Deposit successful");
      },
    },
  });

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: depositResult ? depositResult : undefined,
  });

  useEffect(() => {
    if (isSuccess) {
      onDepositSuccess();
    }
  }, [isSuccess]);

  return {
    depositConfig,
    deposit,
    isDepositPending,
    depositError,
  };
}
