import { useId, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SwapToken, TokenBalance } from "@/types";

interface SwapTokenSelectorProps {
  tokens: SwapToken[];
  selectedToken: SwapToken;
  setSelectedToken: (token: SwapToken) => void;
  balances: TokenBalance[];
}

export const SwapTokenSelector = ({
  tokens,
  selectedToken,
  setSelectedToken,
  balances,
}: SwapTokenSelectorProps) => {
  const id = useId();
  const [search, setSearch] = useState("");

  function findAndFormatBalance(symbol: string) {
    const balance = balances.find((b) => b.symbol === symbol)?.balance;
    return parseFloat(Number(balance).toFixed(6)).toString();
  }

  const filteredTokens = tokens.filter((token) => {
    const searchLower = search.toLowerCase();
    return (
      token.name.toLowerCase().includes(searchLower) ||
      token.symbol.toLowerCase().includes(searchLower) ||
      token.address?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 w-full flex flex-col gap-4">
      <span className="text-lg font-semibold">Select Token</span>
      <div className="relative">
        <Input
          id={id}
          className="peer pe-9 ps-9"
          placeholder="Search by name, symbol or address"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} />
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full overflow-y-scroll max-h-80">
        {filteredTokens.map((token) => (
          <div
            onClick={() => setSelectedToken(token)}
            className={cn(
              "w-full flex gap-2 items-center p-2 border border-transparent rounded-sm hover:cursor-pointer text-foreground/80",
              selectedToken.symbol === token.symbol
                ? "bg-input/60 border-border text-foreground"
                : "hover:bg-input/20 hover:border-border/40"
            )}
            key={`${token.symbol}-${token.chainId}-${token.address}`}
          >
            <img
              src={`/icons/${token.icon || "usdc.webp"}`}
              alt={token.name}
              className="size-8"
              onError={(e) => {
                // Fallback to USDC icon if token icon fails to load
                e.currentTarget.src = "/icons/usdc.webp";
              }}
            />
            <div className="flex flex-col w-full">
              <span className="text-sm font-semibold">{token.symbol}</span>
              <div className="flex gap-1 w-full">
                <span className="text-xs grow">{token.name}</span>
                <span className="text-xs">
                  {findAndFormatBalance(token.symbol)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
