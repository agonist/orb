import { cn } from "@/lib/utils";
import type { Asset, Chain } from "@/types";
import { ChevronDown } from "lucide-react";

type Props = {
  assetIcon: string;
  assetSymbol: string;
  chainName: string;
  readOnly?: boolean;
};

export const SelectBtn = ({
  assetIcon,
  assetSymbol,
  chainName,
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
      <img src={`/icons/${assetIcon}`} alt={assetSymbol} className="size-7" />
      <div className="flex flex-col items-start grow">
        <span className="text-sm font-semibold">{assetSymbol}</span>
        <span className="text-xs">on {chainName}</span>
      </div>
      {!readOnly && <ChevronDown size={16} strokeWidth={2} />}
    </div>
  );
};
