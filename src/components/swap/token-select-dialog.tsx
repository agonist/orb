import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { SelectBtn } from "../selector/select-btn";
import { SwapChainSelector } from "./swap-chain-selector";
import { SwapTokenSelector } from "./swap-token-selector";
import type { SwapChain, SwapToken, TokenBalance } from "@/types";

interface Props {
  chains: SwapChain[];
  tokens: SwapToken[];
  selectedChain: SwapChain;
  setSelectedChain: (chain: SwapChain) => void;
  selectedToken: SwapToken;
  setSelectedToken: (token: SwapToken) => void;
  balances: TokenBalance[];
  label?: string;
}

export const TokenSelectDialog = ({
  chains,
  tokens,
  selectedChain,
  setSelectedChain,
  selectedToken,
  setSelectedToken,
  balances,
  label = "Select Token",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"chain" | "token">("chain");

  // Filter tokens for the selected chain
  const chainTokens = tokens.filter(
    (token) => token.chainId === selectedChain.chainId
  );

  const handleChainSelect = (chain: SwapChain) => {
    setSelectedChain(chain);
    setStep("token");
  };

  const handleTokenSelect = (token: SwapToken) => {
    setSelectedToken(token);
    setIsOpen(false);
    setStep("chain"); // Reset for next time
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setStep("chain"); // Reset step when closing
      }}
    >
      <DialogTrigger asChild>
        <SelectBtn
          assetIcon={selectedToken.icon || "usdc.webp"}
          assetSymbol={selectedToken.symbol}
          chainName={selectedChain.name}
        />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="flex flex-col gap-4">
          {step === "chain" ? (
            <>
              <div className="flex items-center justify-between">
                <DialogTitle>Select Chain</DialogTitle>
                <DialogDescription className="sr-only">
                  Pick a chain to see its tokens
                </DialogDescription>
              </div>
              <SwapChainSelector
                chains={chains}
                selectedChain={selectedChain}
                setSelectedChain={handleChainSelect}
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep("chain")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to chains
                </button>
                <DialogTitle>{label}</DialogTitle>
                <DialogDescription className="sr-only">
                  Choose a token for the selected chain
                </DialogDescription>
              </div>
              <SwapTokenSelector
                tokens={chainTokens}
                selectedToken={selectedToken}
                setSelectedToken={handleTokenSelect}
                balances={balances}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
