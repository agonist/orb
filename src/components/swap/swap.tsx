import { NumberInput } from "../ui/number-input";
import { TokenSelectDialog } from "../deposit/token-select-dialog";
import { ArrowUpDown, Settings, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useSwap } from "@/hooks/use-swap";
import { CustomConnectButton } from "../custom-wallet-connect";
import { BalanceLabel } from "../balance-label";
import { SwapSettings } from "./swap-settings";
import { SwapRoute } from "./swap-route";
import { useState } from "react";

type Props = {
  onSettingsClick?: () => void;
};

export const Swap = ({ onSettingsClick }: Props) => {
  const {
    fromInput,
    toInput,
    swapBtn,
    legacyChainsFormat,
    tokensBalance,
    fromBalance,
    toBalance,
    quote,
    fromUsdLabel,
    toUsdLabel,
    settings,
    fromTokenPriceUsd,
    toTokenPriceUsd,
    outUsdDeltaPercent,
    distributions,
    reverseSwap,
    isLoadingQuote,
  } = useSwap();

  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-card w-lg rounded-md border p-4 flex flex-col items-start">
      <div className="flex w-full">
        <h1 className="text-xl font-semibold grow">Swap</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings />
        </Button>
      </div>

      {showSettings && (
        <SwapSettings
          settings={settings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* From Token Section */}
      <div className="flex flex-col w-full mt-6">
        <div className="flex w-full">
          <NumberInput
            className="rounded-r-none"
            type="text"
            placeholder="0"
            label="From"
            bottomLabel={fromUsdLabel}
            value={fromInput.value}
            onChange={(e) => fromInput.handleChange(e.target.value)}
          />
          <TokenSelectDialog
            chainsList={legacyChainsFormat}
            selectedChain={fromInput.selectedChain}
            setSelectedChain={fromInput.setSelectedChain}
            selectedAsset={fromInput.selectedAsset}
            setSelectedAsset={fromInput.setSelectedAsset}
            balances={tokensBalance.balances}
          />
        </div>
        <BalanceLabel
          value={fromBalance}
          onValueClicked={() => {
            fromInput.handleChange(fromBalance);
          }}
        />
      </div>

      {/* Swap Direction Button */}
      <div className="flex w-full justify-center my-4">
        <Button
          variant="outline"
          size="icon"
          onClick={reverseSwap}
          className="rounded-full"
        >
          <ArrowUpDown className="size-4" />
        </Button>
      </div>

      {/* To Token Section */}
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <NumberInput
            className="rounded-r-none"
            readOnly={!quote}
            type="text"
            placeholder="0"
            label="To"
            bottomLabel={(() => {
              if (outUsdDeltaPercent == null) return toUsdLabel;
              const color =
                outUsdDeltaPercent >= 0 ? "text-green-500" : "text-red-500";
              return (
                <span>
                  {toUsdLabel}
                  <span className={`ml-1 ${color}`}>
                    ({outUsdDeltaPercent >= 0 ? "+" : ""}
                    {outUsdDeltaPercent.toFixed(2)}%)
                  </span>
                </span>
              );
            })()}
            value={isLoadingQuote ? "..." : toInput.value}
            onChange={(e) =>
              toInput.handleChange && toInput.handleChange(e.target.value)
            }
          />
          <TokenSelectDialog
            chainsList={legacyChainsFormat}
            selectedChain={toInput.selectedChain}
            setSelectedChain={() => {
              /* enforced to Sonic */
            }}
            selectedAsset={toInput.selectedAsset}
            setSelectedAsset={() => {
              /* enforced to LSD */
            }}
            balances={tokensBalance.balances}
          />
        </div>
        <BalanceLabel
          value={toBalance}
          onValueClicked={() => {
            // For "to" token, we might want to show available balance for reference
          }}
        />
      </div>

      {/* Swap Route Display */}
      {quote && (
        <SwapRoute
          quote={quote as any}
          slippagePercent={settings.slippage}
          fromTokenPriceUsd={fromTokenPriceUsd}
          toTokenPriceUsd={toTokenPriceUsd}
        />
      )}

      {/* Swap Button */}
      <div className="flex w-full mt-6">
        {swapBtn.isConnected ? (
          <Button
            disabled={swapBtn.isDisabled}
            onClick={swapBtn.handleSwap}
            className="w-full bg-blue-500 hover:bg-blue-400 font-bold shadow-[0_0_10px_rgba(59,130,246,0.7),0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.9),0_0_25px_rgba(59,130,246,0.6)] hover:cursor-pointer"
          >
            {swapBtn.isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              swapBtn.btnText
            )}
          </Button>
        ) : (
          <CustomConnectButton className="w-full" />
        )}
      </div>
    </div>
  );
};
