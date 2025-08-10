import { ArrowRight } from "lucide-react";
import type { SwapQuote } from "@/types";

interface Props {
  quote: any; // Supports both quote and quote-in shapes
  slippagePercent?: number; // e.g., 0.5 for 0.5%
  fromTokenPriceUsd?: number;
  toTokenPriceUsd?: number;
}

export const SwapRoute = ({
  quote,
  slippagePercent,
  fromTokenPriceUsd,
  toTokenPriceUsd,
}: Props) => {
  if (!quote || !quote.route?.length) {
    return null;
  }

  return (
    <div className="w-full bg-muted/30 rounded-md p-3 mt-4">
      <div className="text-sm font-medium mb-2">Swap Route</div>

      {/* Route Steps */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto">
        {quote.route.map((step, index) => (
          <div key={index} className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col items-center text-xs">
              <span className="font-medium">{step.protocol}</span>
              <span className="text-muted-foreground">{step.percentage}%</span>
            </div>
            {index < quote.route.length - 1 && (
              <ArrowRight className="size-3 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Quote Details */}
      <div className="space-y-2 text-xs">
        {/* Slippage */}
        {typeof slippagePercent === "number" && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Slippage:</span>
            <span>{slippagePercent}%</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Price Impact:</span>
          <span
            className={
              (quote.priceImpact ?? 0) > 5 ? "text-red-500" : "text-green-500"
            }
          >
            {Number(quote.priceImpact ?? 0).toFixed(2)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Gas:</span>
          <span>
            {quote.estimatedGas
              ? `${parseFloat(quote.estimatedGas).toFixed(6)} ETH`
              : quote.resourceEstimate?.gasLimit
                ? `${quote.resourceEstimate.gasLimit} gas`
                : "—"}
          </span>
        </div>

        {/* Out amount and effective rate */}
        {(() => {
          const rawOut = quote.amountOut ?? quote.toAmount;
          const rawIn =
            quote.fromAmount ??
            quote.typedData?.message?.srcAmountIn ??
            quote.typedData?.message?.amountIn;
          if (!rawOut || !rawIn) return null;
          const out = Number(rawOut);
          const inAmt = Number(rawIn);
          if (!isFinite(out) || !isFinite(inAmt) || inAmt <= 0) return null;
          const rate = out / inAmt; // token-out per token-in in raw units
          // If we have USD unit prices, compute USD value per 1 in-token and per 1 out-token
          const inUsd = fromTokenPriceUsd
            ? `$${fromTokenPriceUsd.toFixed(4)}`
            : undefined;
          const outUsd = toTokenPriceUsd
            ? `$${toTokenPriceUsd.toFixed(6)}`
            : undefined;
          return (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective Rate:</span>
                <span>{rate.toFixed(6)} out / in</span>
              </div>
              {(inUsd || outUsd) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Unit Prices (USD):
                  </span>
                  <span>
                    {inUsd ?? "—"} → {outUsd ?? "—"}
                  </span>
                </div>
              )}
            </>
          );
        })()}

        {/* Fees summary (supports quote-in "value" and quote "amount + token") */}
        {Array.isArray(quote.fees) &&
          quote.fees.length > 0 &&
          (() => {
            const toNum = (v: any) => (v == null ? NaN : parseFloat(String(v)));
            const feeMap: Record<string, number> = {};
            for (const f of quote.fees) {
              const t = String(f.type || "").toLowerCase();
              const n = toNum(f.value ?? f.amount);
              if (!isNaN(n)) feeMap[t] = n;
            }
            const gas = feeMap["gas"];
            const bridge = feeMap["bridge"];
            const relayer = feeMap["relayer"];
            return (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Gas / Bridge / Relayer:
                </span>
                <span>
                  {gas != null ? `$${gas.toFixed(4)}` : "—"} /{" "}
                  {bridge != null ? `$${bridge.toFixed(4)}` : "—"} /{" "}
                  {relayer != null ? `$${relayer.toFixed(4)}` : "—"}
                </span>
              </div>
            );
          })()}

        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground">Valid Until:</span>
          <span>
            {quote.validUntil
              ? new Date(quote.validUntil * 1000).toLocaleTimeString()
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
};
