import { ArrowRight } from "lucide-react";
import type { SwapQuote } from "@/types";

interface Props {
  quote: SwapQuote;
}

export const SwapRoute = ({ quote }: Props) => {
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
              <span className="text-muted-foreground">
                {step.percentage}%
              </span>
            </div>
            {index < quote.route.length - 1 && (
              <ArrowRight className="size-3 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Quote Details */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price Impact:</span>
          <span className={quote.priceImpact > 5 ? "text-red-500" : "text-green-500"}>
            {quote.priceImpact.toFixed(2)}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Gas:</span>
          <span>{parseFloat(quote.estimatedGas).toFixed(6)} ETH</span>
        </div>

        {quote.fees?.length > 0 && (
          <div className="space-y-1">
            <span className="text-muted-foreground">Fees:</span>
            {quote.fees.map((fee, index) => (
              <div key={index} className="flex justify-between ml-2">
                <span className="text-muted-foreground capitalize">
                  {fee.type}:
                </span>
                <span>
                  {parseFloat(fee.amount).toFixed(6)} {fee.token.symbol}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground">Valid Until:</span>
          <span>
            {new Date(quote.validUntil * 1000).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};