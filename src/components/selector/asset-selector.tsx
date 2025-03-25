import { useId } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Asset } from "@/types";

interface AssetSelectorProps {
  assets: Asset[];
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
}

export const AssetSelector = ({
  assets,
  selectedAsset,
  setSelectedAsset,
}: AssetSelectorProps) => {
  const id = useId();

  return (
    <div className="p-4 w-full flex flex-col gap-4">
      <span className="text-lg font-semibold">Assets</span>
      <div className="relative">
        <Input
          id={id}
          className="peer pe-9 ps-9"
          placeholder="Search by name, symbol or address"
          type="search"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} />
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        {assets.map((asset) => (
          <div
            onClick={() => setSelectedAsset(asset)}
            className={cn(
              "w-full flex gap-2 items-center p-2 border border-transparent rounded-sm hover:cursor-pointer text-foreground/80",
              selectedAsset.symbol === asset.symbol
                ? "bg-input/60 border-border text-foreground"
                : "hover:bg-input/20 hover:border-border/40"
            )}
            key={asset.symbol}
          >
            <img
              src={`/icons/${asset.icon}`}
              alt={asset.name}
              className="size-8"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{asset.symbol}</span>
              <span className="text-xs">{asset.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
