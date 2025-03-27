import { useSimulateContract, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { TellerAbi } from "@/abi/teller";
import type { Asset } from "@/types";

export function useDepositTransaction(
  selectedAsset: Asset,
  inValue: string,
  isApprovalNeeded: boolean,
  allowance: bigint | undefined,
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

  const { writeContract: deposit, isPending: isDepositPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        // Handle success
      },
    },
  });

  return {
    depositConfig,
    deposit,
    isDepositPending,
    depositError,
  };
}