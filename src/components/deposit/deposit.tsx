import { useMemo, useState } from "react";
import { NumberInput } from "../ui/number-input";
import { TokenSelectDialog } from "./token-select-dialog";
import { SelectBtn } from "../selector/select-btn";
import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";
import { useDeposit } from "@/hooks/use-deposit";

export const Deposit = () => {
  const { input, output } = useDeposit();

  return (
    <div className="bg-card w-lg h-1/2 rounded-md border p-4 flex flex-col gap-8 items-start">
      <h1 className="text-xl font-semibold">Deposit</h1>

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
          selectedChain={input.selectedChain}
          setSelectedChain={input.setSelectedChain}
          selectedAsset={input.selectedAsset}
          setSelectedAsset={input.setSelectedAsset}
        />
      </div>
      <ArrowDown className="size-8 w-full" />
      <div className="flex w-full">
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
          selectedAsset={input.selectedAsset}
          selectedChain={input.selectedChain}
          readOnly
        />
      </div>
      <Button className="w-full" variant={"outline"}>
        Deposit
      </Button>
    </div>
  );
};
