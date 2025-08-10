import { getSwapChainsOptions, getSwapTokensOptions } from "@/lib/api/options";
import { getFlyQuoteOptions } from "@/lib/api/fly-options";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTokenBalances } from "./use-tokens-balance";
import { useWatchChain } from "./use-switch-chain";
import { useDebouncedValue } from "./use-debounced-value";
import { useSwapExecution } from "./use-swap-execution";
import type { SwapSettings } from "@/types";
import type { FlyQuoteRequest } from "@/lib/api/fly-api";

// Hook for managing swap input state
function useSwapInput(initialChain: any, initialAsset: any, isOutput = false) {
  const [value, setValue] = useState("");
  const [selectedChain, setSelectedChain] = useState(initialChain);
  const [selectedAsset, setSelectedAsset] = useState(initialAsset);
  const [inUsd, setInUsd] = useState("$0.00");

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    // TODO: Calculate USD value based on token price
    const usdValue = parseFloat(newValue) || 0;
    setInUsd(`$${usdValue.toFixed(2)}`);
  }, []);

  return {
    value,
    selectedChain,
    selectedAsset,
    inUsd,
    outUsd: inUsd, // For compatibility with output token
    handleChange,
    setSelectedChain,
    setSelectedAsset,
  };
}

// Main hook for swap logic
export function useSwap() {
  const { address, isConnected } = useAccount();

  // Fetch chains from Fly API
  const { data: swapChains } = useSuspenseQuery(getSwapChainsOptions());

  // Initialize with first available chains
  const initialFromChain = swapChains[0] || {};
  const initialToChain =
    swapChains.find((c) => c.chainId !== initialFromChain.chainId) ||
    swapChains[0] ||
    {};

  // Input states - these will track the selected chains
  const fromInput = useSwapInput(initialFromChain, {}, false);
  const toInput = useSwapInput(initialToChain, {}, true);

  // Fetch tokens for selected chains
  const { data: fromTokens = [] } = useQuery(
    getSwapTokensOptions(fromInput.selectedChain?.name)
  );
  const { data: toTokens = [] } = useQuery(
    getSwapTokensOptions(toInput.selectedChain?.name)
  );

  // Update selected assets when tokens are loaded
  useEffect(() => {
    if (fromTokens.length > 0 && !fromInput.selectedAsset?.symbol) {
      const firstToken = fromTokens[0];
      fromInput.setSelectedAsset({
        symbol: firstToken.symbol,
        name: firstToken.name,
        icon: firstToken.icon,
        decimals: firstToken.decimals,
        address: firstToken.address,
        out: {
          symbol: firstToken.symbol,
          name: firstToken.name,
          icon: firstToken.icon,
          address: firstToken.address,
          tellerAddress: firstToken.address,
        },
      });
    }
  }, [fromTokens]);

  useEffect(() => {
    if (toTokens.length > 0 && !toInput.selectedAsset?.symbol) {
      const firstToken = toTokens[0];
      toInput.setSelectedAsset({
        symbol: firstToken.symbol,
        name: firstToken.name,
        icon: firstToken.icon,
        decimals: firstToken.decimals,
        address: firstToken.address,
        out: {
          symbol: firstToken.symbol,
          name: firstToken.name,
          icon: firstToken.icon,
          address: firstToken.address,
          tellerAddress: firstToken.address,
        },
      });
    }
  }, [toTokens]);

  // Create legacy format for token balances hook
  const legacyChainsFormat = useMemo(() => {
    // Build chain data with tokens for display
    return swapChains.map((chain) => {
      let assets = [];

      // Use loaded tokens for from chain
      if (
        chain.chainId === fromInput.selectedChain?.chainId &&
        fromTokens.length > 0
      ) {
        assets = fromTokens.map((token) => ({
          symbol: token.symbol,
          name: token.name,
          icon: token.icon,
          decimals: token.decimals,
          address: token.isNative ? undefined : token.address,
          out: {
            symbol: token.symbol,
            name: token.name,
            icon: token.icon,
            address: token.address,
            tellerAddress: token.address,
          },
        }));
      }
      // Use loaded tokens for to chain
      else if (
        chain.chainId === toInput.selectedChain?.chainId &&
        toTokens.length > 0
      ) {
        assets = toTokens.map((token) => ({
          symbol: token.symbol,
          name: token.name,
          icon: token.icon,
          decimals: token.decimals,
          address: token.isNative ? undefined : token.address,
          out: {
            symbol: token.symbol,
            name: token.name,
            icon: token.icon,
            address: token.address,
            tellerAddress: token.address,
          },
        }));
      }

      return {
        name: chain.name,
        icon: chain.icon,
        symbol: chain.symbol,
        chainId: chain.chainId,
        assets: assets,
      };
    });
  }, [
    swapChains,
    fromInput.selectedChain,
    toInput.selectedChain,
    fromTokens,
    toTokens,
  ]);

  const tokensBalance = useTokenBalances(legacyChainsFormat);

  // Swap settings
  const [slippage, setSlippage] = useState(0.5);
  const [gasless, setGasless] = useState(true);

  useWatchChain(fromInput.selectedChain);

  // Debounce the input value to avoid too many API calls
  const debouncedFromValue = useDebouncedValue(fromInput.value, 500);

  // Build quote request
  const quoteRequest: FlyQuoteRequest | null = useMemo(() => {
    if (
      !address ||
      !debouncedFromValue ||
      !fromInput.selectedAsset.address ||
      !toInput.selectedAsset.address
    ) {
      return null;
    }

    const parsedValue = parseFloat(debouncedFromValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return null;
    }

    return {
      fromTokenAddress: fromInput.selectedAsset.address,
      toTokenAddress: toInput.selectedAsset.address,
      amount: (
        parsedValue * Math.pow(10, fromInput.selectedAsset.decimals)
      ).toString(),
      slippage,
      fromAddress: address,
      toAddress: address,
      gasless,
    };
  }, [
    address,
    debouncedFromValue,
    fromInput.selectedAsset,
    toInput.selectedAsset,
    slippage,
    gasless,
  ]);

  // Fetch swap quote with debounced input
  const disabledQuoteOptions = {
    queryKey: ["fly-quote", "disabled"],
    // Provide a no-op queryFn to avoid warnings when disabled configuration is used
    queryFn: async () => null as any,
    enabled: false,
  } as const;

  const { data: quote, isLoading: isLoadingQuote } = useQuery(
    quoteRequest
      ? getFlyQuoteOptions(quoteRequest)
      : (disabledQuoteOptions as any)
  );

  // Update toInput value when quote changes
  useEffect(() => {
    if (quote?.toAmount && toInput.selectedAsset.decimals) {
      const toAmount =
        parseFloat(quote.toAmount) /
        Math.pow(10, toInput.selectedAsset.decimals);
      toInput.handleChange(toAmount.toString());
    }
  }, [quote, toInput.selectedAsset.decimals]);

  // Reverse swap function
  const reverseSwap = useCallback(() => {
    const tempChain = fromInput.selectedChain;
    const tempAsset = fromInput.selectedAsset;
    const tempValue = fromInput.value;

    fromInput.setSelectedChain(toInput.selectedChain);
    fromInput.setSelectedAsset(toInput.selectedAsset);
    fromInput.handleChange(toInput.value);

    toInput.setSelectedChain(tempChain);
    toInput.setSelectedAsset(tempAsset);
    toInput.handleChange(tempValue);
  }, [fromInput, toInput]);

  // Swap execution logic
  const onSwapSuccess = useCallback(() => {
    tokensBalance.refetchBalance();
    fromInput.handleChange(""); // Clear input after successful swap
  }, [tokensBalance, fromInput]);

  const swapExecution = useSwapExecution({
    quote: quote as any, // Type cast for now since API returns different format
    gasless,
    onSuccess: onSwapSuccess,
  });

  // Swap button state
  const swapBtn = useMemo(() => {
    let btnText = "Swap";
    let isDisabled =
      !isConnected || !fromInput.value || fromInput.value === "0" || !quote;
    let isLoading = swapExecution.isLoading;

    const fromBalance =
      tokensBalance.balances.find(
        (t) => t.symbol === fromInput.selectedAsset.symbol
      )?.balance ?? "0";

    if (Number(fromBalance) < Number(fromInput.value)) {
      isDisabled = true;
      btnText = "Insufficient balance";
    } else if (isLoadingQuote) {
      btnText = "Getting quote...";
      isDisabled = true;
      isLoading = true;
    } else if (!quote) {
      btnText = "Enter an amount";
      isDisabled = true;
    } else if (swapExecution.isExecuting) {
      btnText = gasless ? "Executing swap..." : "Confirm in wallet";
      isDisabled = true;
      isLoading = true;
    } else if (swapExecution.isTransactionPending) {
      btnText = "Transaction pending...";
      isDisabled = true;
      isLoading = true;
    } else if (swapExecution.isTransactionConfirming) {
      btnText = "Confirming...";
      isDisabled = true;
      isLoading = true;
    }

    if (swapExecution.executionError) {
      btnText = "Swap failed - Try again";
      isDisabled = false;
      isLoading = false;
    }

    return {
      isConnected,
      handleSwap: swapExecution.executeSwap,
      btnText,
      isDisabled,
      isLoading,
    };
  }, [
    isConnected,
    fromInput.value,
    fromInput.selectedAsset,
    tokensBalance.balances,
    quote,
    isLoadingQuote,
    swapExecution,
    gasless,
  ]);

  // Get balances for selected assets
  const fromBalance = useMemo(() => {
    return (
      tokensBalance.balances.find(
        (t) => t.symbol === fromInput.selectedAsset.symbol
      )?.balance ?? "0"
    );
  }, [tokensBalance.balances, fromInput.selectedAsset]);

  const toBalance = useMemo(() => {
    return (
      tokensBalance.balances.find(
        (t) => t.symbol === toInput.selectedAsset.symbol
      )?.balance ?? "0"
    );
  }, [tokensBalance.balances, toInput.selectedAsset]);

  return {
    fromInput,
    toInput,
    swapBtn,
    legacyChainsFormat,
    tokensBalance,
    fromBalance,
    toBalance,
    quote,
    settings: {
      slippage,
      gasless,
      setSlippage,
      setGasless,
    },
    reverseSwap,
    isLoadingQuote,
  };
}
