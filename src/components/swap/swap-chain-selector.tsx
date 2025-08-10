import { cn } from "@/lib/utils";
import type { SwapChain } from "@/types";

interface SwapChainSelectorProps {
  chains: SwapChain[];
  selectedChain: SwapChain;
  setSelectedChain: (chain: SwapChain) => void;
}

export const SwapChainSelector = ({
  chains,
  selectedChain,
  setSelectedChain,
}: SwapChainSelectorProps) => {
  return (
    <div className="p-4 w-full flex flex-col gap-4">
      <span className="text-lg font-semibold">Select Chain</span>
      <div className="flex flex-col gap-3 w-full overflow-y-scroll max-h-60">
        {chains.map((chain) => (
          <div
            key={chain.chainId}
            onClick={() => setSelectedChain(chain)}
            className={cn(
              "w-full flex gap-3 items-center p-3 border border-transparent rounded-sm hover:cursor-pointer text-foreground/80",
              selectedChain.chainId === chain.chainId
                ? "bg-input/60 border-border text-foreground"
                : "hover:bg-input/20 hover:border-border/40"
            )}
          >
            <img
              src={`/icons/${chain.icon || 'eth.webp'}`}
              alt={chain.name}
              className="size-8"
              onError={(e) => {
                // Fallback to ETH icon if chain icon fails to load
                e.currentTarget.src = '/icons/eth.webp';
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{chain.name}</span>
              <span className="text-xs text-muted-foreground">
                Chain ID: {chain.chainId}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};