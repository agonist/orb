import { cn } from "@/lib/utils";
import type { Chain } from "@/types";

type Props = {
  chainsList: Chain[];
  selectedChain: Chain;
  setSelectedChain: (chain: Chain) => void;
};

export const ChainSelector = ({
  chainsList,
  selectedChain,
  setSelectedChain,
}: Props) => {
  return (
    <div className="w-72 border-r p-4 flex flex-col gap-4">
      <span className="text-lg font-semibold">Chains</span>
      <div className="flex flex-col gap-3">
        {chainsList.map((chain) => (
          <div
            onClick={() => setSelectedChain(chain)}
            key={chain.name}
            className={cn(
              "flex gap-2 items-center p-2 border border-transparent rounded-sm hover:cursor-pointer text-foreground/80",
              selectedChain.name === chain.name
                ? "bg-input/60 border-border text-foreground"
                : "hover:bg-input/20 hover:border-border/40"
            )}
          >
            <img
              src={`/icons/${chain.icon}`}
              alt={chain.name}
              className="w-6 h-6 p-1 bg-background rounded-xs"
            />
            <span>{chain.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
