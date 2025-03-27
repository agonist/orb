import { getDepositOptions } from "@/lib/api/options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useDepositApproval } from "./use-deposit-approval";
import { useDepositInput } from "./use-deposit-input";
import { useDepositTransaction } from "./use-deposit-tx";
import { useTokenBalances } from "./use-tokens-balance";

export function useDeposit() {
  const { isConnected } = useAccount();
  const { data: deposit } = useSuspenseQuery(getDepositOptions());
  const tokensBalance = useTokenBalances(deposit.chains);

  const input = useDepositInput(deposit.chains[1], deposit.chains[1].assets[0]);

  const approval = useDepositApproval(input.selectedAsset, input.inValue);

  const transaction = useDepositTransaction(
    input.selectedAsset,
    input.inValue,
    approval.isApprovalNeeded,
    approval.allowance
  );

  const handleDeposit = () => {
    if (approval.isApprovalNeeded) {
      approval.approve(approval.approveConfig?.request!);
    } else {
      transaction.deposit(transaction.depositConfig?.request!);
    }
  };

  const depositBtn = useMemo(() => {
    let btnText = "Deposit";
    let isDisabled = !isConnected || !input.inValue || input.inValue === "0";
    let isLoading = false;

    if (approval.isApprovalNeeded) {
      btnText = approval.isApprovePending ? "Approving" : "Approve";
      isDisabled = false;
      isLoading = approval.isApprovePending;
    } else if (transaction.isDepositPending) {
      btnText = "Depositing";
      isDisabled = true;
      isLoading = transaction.isDepositPending;
    }

    return {
      isConnected,
      isApprovalNeeded: approval.isApprovalNeeded,
      isApproving: approval.isApprovePending,
      isDepositing: transaction.isDepositPending,
      handleDeposit,
      btnText,
      isDisabled,
      isLoading,
    };
  }, [
    isConnected,
    input.inValue,
    approval.isApprovalNeeded,
    approval.isApprovePending,
    transaction.isDepositPending,
    handleDeposit,
  ]);

  const inBalance = useMemo(() => {
    return (
      tokensBalance.find((t) => t.symbol === input.selectedAsset.symbol)
        ?.balance ?? "0"
    );
  }, [tokensBalance, input.selectedAsset]);

  return {
    input,
    depositBtn,
    chainsList: deposit.chains,
    tokensBalance,
    inBalance,
  };
}
