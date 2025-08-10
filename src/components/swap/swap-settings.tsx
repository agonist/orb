import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import type { SwapSettings as SwapSettingsType } from "@/types";

interface Props {
  settings: {
    slippage: number;
    gasless: boolean;
    setSlippage: (slippage: number) => void;
    setGasless: (gasless: boolean) => void;
  };
  onClose: () => void;
}

export const SwapSettings = ({ settings, onClose }: Props) => {
  const presetSlippages = [0.1, 0.5, 1.0];

  return (
    <div className="w-full bg-muted/50 rounded-md p-4 mt-4 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Swap Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Slippage Settings */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">
          Slippage Tolerance (%)
        </label>
        <div className="flex gap-2 mb-2">
          {presetSlippages.map((preset) => (
            <Button
              key={preset}
              variant={settings.slippage === preset ? "default" : "outline"}
              size="sm"
              onClick={() => settings.setSlippage(preset)}
            >
              {preset}%
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.1"
            min="0.1"
            max="50"
            value={settings.slippage}
            onChange={(e) => settings.setSlippage(parseFloat(e.target.value) || 0.5)}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>

      {/* Gasless Settings */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Gasless Mode</label>
            <p className="text-xs text-muted-foreground">
              Let Fly protocol handle gas costs
            </p>
          </div>
          <Button
            variant={settings.gasless ? "default" : "outline"}
            size="sm"
            onClick={() => settings.setGasless(!settings.gasless)}
          >
            {settings.gasless ? "ON" : "OFF"}
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>• Higher slippage increases success chance but may result in worse prices</p>
        <p>• Gasless mode lets Fly protocol cover your gas fees</p>
      </div>
    </div>
  );
};