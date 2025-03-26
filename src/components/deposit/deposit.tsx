import { NumberInput } from "../ui/number-input";
import { TokenSelectDialog } from "./token-select-dialog";
import { SelectBtn } from "../selector/select-btn";
import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";
import { useDeposit } from "@/hooks/use-deposit";
import { CustomConnectButton } from "../custom-wallet-connect";
import { BalanceLabel } from "../balance-label";

export const Deposit = () => {
  const { input, output, depositBtn, chainsList, tokensBalance, inBalance } =
    useDeposit();

  return (
    <div className="bg-card w-lg  rounded-md border p-4 flex flex-col  items-start">
      <h1 className="text-xl font-semibold">Deposit</h1>

      <div className="flex flex-col w-full mt-6">
        <div className="flex w-full">
          <NumberInput
            className="rounded-r-none"
            type="text"
            placeholder="0"
            label="Deposit"
            bottomLabel={input.inUsd}
            value={input.inValue}
            onChange={(e) => input.handleInChange(e.target.value)}
          />
          <TokenSelectDialog
            chainsList={chainsList}
            selectedChain={input.selectedChain}
            setSelectedChain={input.setSelectedChain}
            selectedAsset={input.selectedAsset}
            setSelectedAsset={input.setSelectedAsset}
            balances={tokensBalance}
          />
        </div>
        <BalanceLabel
          value={inBalance}
          onValueClicked={() => {
            input.handleInChange(inBalance);
          }}
        />
      </div>

      <ArrowDown className="size-8 w-full text-muted-foreground" />
      <div className="flex w-full mt-6">
        <NumberInput
          className="rounded-r-none"
          readOnly
          type="text"
          placeholder="0"
          label="You receive"
          bottomLabel={output.outUsd}
          value={output.outNative}
          onChange={(e) => input.handleInChange(e.target.value)}
        />
        <SelectBtn
          assetIcon={input.selectedAsset.out.icon}
          assetSymbol={input.selectedAsset.out.symbol}
          chainName={input.selectedChain.name}
          readOnly
        />
      </div>
      <div className="flex w-full mt-6">
        {depositBtn.isConnected ? (
          <Button
            disabled={depositBtn.isDisabled}
            onClick={depositBtn.handleDeposit}
            className="w-full bg-teal-500 hover:bg-teal-400 font-bold"
          >
            {depositBtn.btnText}
          </Button>
        ) : (
          <CustomConnectButton className="w-full " />
        )}
      </div>
    </div>
  );
};
