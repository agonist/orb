import { cn } from "@/lib/utils";
import type { Asset, Chain } from "@/types";
import { ChevronDown } from "lucide-react";

type Props = {
  selectedAsset: Asset;
  selectedChain: Chain;
  readOnly?: boolean;
};

export const SelectBtn = ({
  selectedAsset,
  selectedChain,
  readOnly = false,
}: Props) => {
  return (
    <div
      className={cn(
        "flex rounded-l-none gap-4 items-center border-l-transparent hover:border-l-1 p-2 pl-4 border rounded-r-sm hover:cursor-pointer text-foreground/80 bg-input/30 h-16 w-44 ",
        "transition-all duration-200 ease-in-out",
        !readOnly && "dark:hover:bg-input/60 hover:border-ring"
      )}
    >
      <img
        src={`/icons/${selectedAsset.icon}`}
        alt={selectedAsset.name}
        className="size-7"
      />
      <div className="flex flex-col items-start grow">
        <span className="text-sm font-semibold">{selectedAsset.symbol}</span>
        <span className="text-xs">on {selectedChain.name}</span>
      </div>
      {!readOnly && <ChevronDown size={16} strokeWidth={2} />}
    </div>
  );
};
