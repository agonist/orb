import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { SelectBtn } from "../selector/select-btn";

interface Props {
  assetIcon: string;
  assetSymbol: string;
  chainName: string;
  onTokenSelect?: () => void;
}

export const SimpleTokenDialog = ({
  assetIcon,
  assetSymbol,
  chainName,
  onTokenSelect,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log("SimpleTokenDialog rendered", {
    assetIcon,
    assetSymbol,
    chainName,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SelectBtn
          assetIcon={assetIcon}
          assetSymbol={assetSymbol}
          chainName={chainName}
        />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="flex flex-col gap-4">
          <DialogTitle>Select Token</DialogTitle>
          <DialogDescription className="sr-only">
            Test dialog content
          </DialogDescription>
          <p>This is a test dialog to check if the dialog system is working.</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                console.log("Token selected: ETH");
                onTokenSelect?.();
                setIsOpen(false);
              }}
              className="p-2 border rounded hover:bg-gray-100"
            >
              ETH - Ethereum
            </button>
            <button
              onClick={() => {
                console.log("Token selected: USDC");
                onTokenSelect?.();
                setIsOpen(false);
              }}
              className="p-2 border rounded hover:bg-gray-100"
            >
              USDC - USD Coin
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
