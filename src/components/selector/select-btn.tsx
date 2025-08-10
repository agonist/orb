import { cn } from "@/lib/utils";
import type { Asset, Chain } from "@/types";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import { TokenIcon } from "../ui/token-icon";

type Props = {
  assetIcon: string;
  assetSymbol: string;
  chainName: string;
  readOnly?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SelectBtn = forwardRef<HTMLButtonElement, Props>(
  (
    {
      assetIcon,
      assetSymbol,
      chainName,
      readOnly = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={readOnly}
        className={cn(
          "flex rounded-l-none gap-4 items-center border-l-transparent hover:border-l-1 p-2 pl-4 border rounded-r-sm text-foreground/80 bg-input/30 h-16 w-44 ",
          "transition-all duration-200 ease-in-out",
          !readOnly &&
            "hover:cursor-pointer dark:hover:bg-input/60 hover:border-ring",
          readOnly && "cursor-default opacity-75",
          className
        )}
        {...props}
      >
        <TokenIcon src={assetIcon} alt={assetSymbol} className="size-7" />
        <div className="flex flex-col items-start grow">
          <span className="text-sm font-semibold">{assetSymbol}</span>
          <span className="text-xs">on {chainName}</span>
        </div>
        {!readOnly && <ChevronDown size={16} strokeWidth={2} />}
      </button>
    );
  }
);
