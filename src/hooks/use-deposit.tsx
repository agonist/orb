import { getDepositOptions } from "@/lib/api/options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useDepositApproval } from "./use-deposit-approval";
import { useDepositInput } from "./use-deposit-input";
import { useDepositTransaction } from "./use-deposit-tx";
import { useTokenBalances } from "./use-tokens-balance";

// Main hook for deposit logic
export function useDeposit() {
  const { isConnected } = useAccount();
  const { data: deposit } = useSuspenseQuery(getDepositOptions());
  const tokensBalance = useTokenBalances(deposit.chains);

  const input = useDepositInput(deposit.chains[1], deposit.chains[1].assets[0]);

  const approval = useDepositApproval(input.selectedAsset, input.inValue);

  const onDepositSuccess = () => {
    approval.refetchAllowance();
    tokensBalance.refetchBalance();
  };

  const transaction = useDepositTransaction(
    input.selectedAsset,
    input.inValue,
    approval.isApprovalNeeded,
    approval.allowance,
    onDepositSuccess
  );

  const handleDeposit = () => {
    if (approval.isApprovalNeeded) {
      approval.approve(approval.approveConfig?.request!);
    } else {
      transaction.deposit(transaction.depositConfig?.request!);
    }
  };

  // Get the deposit button text and status
  const depositBtn = useMemo(() => {
    let btnText = "Deposit";
    let isDisabled = !isConnected || !input.inValue || input.inValue === "0";
    let isLoading = false;

    const inBalance =
      tokensBalance.balances.find(
        (t) => t.symbol === input.selectedAsset.symbol
      )?.balance ?? "0";

    if (Number(inBalance) < Number(input.inValue)) {
      isDisabled = true;
      btnText = "Insufficient balance";
    } else if (approval.isApprovalNeeded) {
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

  // Get the balance of the selected asset
  const inBalance = useMemo(() => {
    return (
      tokensBalance.balances.find(
        (t) => t.symbol === input.selectedAsset.symbol
      )?.balance ?? "0"
    );
  }, [tokensBalance.balances, input.selectedAsset]);

  return {
    input,
    depositBtn,
    chainsList: deposit.chains,
    tokensBalance,
    inBalance,
  };
}
