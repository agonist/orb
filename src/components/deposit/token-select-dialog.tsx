import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChainSelector } from "../selector/chain-selector";
import { AssetSelector } from "../selector/asset-selector";
import { useState } from "react";
import type { Asset, Chain } from "@/types";
import { SelectBtn } from "../selector/select-btn";

type Props = {
  chainsList: Chain[];
  selectedChain: Chain;
  setSelectedChain: (chain: Chain) => void;
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
};

export const TokenSelectDialog = ({
  chainsList,
  selectedChain,
  setSelectedChain,
  selectedAsset,
  setSelectedAsset,
}: Props) => {
  const [open, setOpen] = useState(false);

  const onAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <SelectBtn
          assetIcon={selectedAsset.icon}
          assetSymbol={selectedAsset.symbol}
          chainName={selectedChain.name}
        />
      </DialogTrigger>
      <DialogContent className="flex p-0 md:min-w-2xl h-2/3">
        <ChainSelector
          chainsList={chainsList}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
        />

        <AssetSelector
          assets={selectedChain.assets}
          selectedAsset={selectedAsset}
          setSelectedAsset={onAssetSelect}
        />
      </DialogContent>
    </Dialog>
  );
};
