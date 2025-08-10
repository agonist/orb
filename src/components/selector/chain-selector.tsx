import { cn } from "@/lib/utils";
import { TokenIcon } from "../ui/token-icon";
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
    <div className="w-72 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <span className="text-lg font-semibold">Chains</span>
      </div>
      <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
        {chainsList.map((chain) => (
          <div
            onClick={() => setSelectedChain(chain)}
            key={chain.chainId}
            className={cn(
              "flex gap-3 items-center p-3 border rounded-md hover:cursor-pointer text-foreground/80 transition-all",
              selectedChain.name === chain.name
                ? "bg-primary/10 border-primary/50 text-foreground"
                : "border-transparent hover:bg-muted hover:border-border"
            )}
          >
            <TokenIcon src={chain.icon} alt={chain.name} className="w-8 h-8" />
            <span className="font-medium capitalize">{chain.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
