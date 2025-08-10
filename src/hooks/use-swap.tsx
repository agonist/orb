import { getSwapChainsOptions, getSwapTokensOptions } from "@/lib/api/options";
import {
  getFlyQuoteOptions,
  getFlyTokenSearchOptions,
  getFlyDistributionsOptions,
  getFlyAllowanceOptions,
} from "@/lib/api/fly-options";
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

  // Initialize with preferred chains: From = Ethereum, To = Sonic (fallbacks if unavailable)
  const initialFromChain =
    swapChains.find((c) => c.name?.toLowerCase() === "ethereum") ||
    swapChains[0] ||
    {};
  const initialToChain =
    swapChains.find((c) => c.name?.toLowerCase() === "sonic") ||
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
  const { data: toTokensBase = [] } = useQuery(
    getSwapTokensOptions(toInput.selectedChain?.name)
  );

  // If the selected asset came from search (address may not be in base list), ensure we can fetch price by address
  const { data: toTokensSearch = [] } = useQuery(
    getFlyTokenSearchOptions(
      toInput.selectedChain?.name?.toLowerCase(),
      toInput.selectedAsset?.symbol || toInput.selectedAsset?.address
    )
  );

  const toTokens = useMemo(() => {
    // merge by address/symbol with priority to search results when present
    const map = new Map<string, any>();
    for (const t of toTokensBase) {
      const key = (t.address || t.symbol).toLowerCase();
      map.set(key, t);
    }
    for (const t of toTokensSearch) {
      const key = (t.address || t.symbol).toLowerCase();
      map.set(key, t);
    }
    return Array.from(map.values());
  }, [toTokensBase, toTokensSearch]);

  // Always enforce output chain/token to Sonic + LSD
  const sonicChain = useMemo(
    () =>
      swapChains.find((c) => c.name?.toLowerCase() === "sonic") ||
      swapChains[0] ||
      {},
    [swapChains]
  );

  useEffect(() => {
    // Force to-chain to Sonic if user somehow changes it
    if (toInput.selectedChain?.name?.toLowerCase() !== "sonic" && sonicChain) {
      toInput.setSelectedChain(sonicChain);
    }
  }, [toInput.selectedChain, sonicChain]);

  // Fetch LSD token info explicitly on Sonic for robust defaults
  const { data: lsdSearch = [] } = useQuery(
    getFlyTokenSearchOptions("sonic", "LSD")
  );

  useEffect(() => {
    // If no to-asset or it's not LSD, set LSD from search/base tokens
    const currentSymbol = (toInput.selectedAsset?.symbol || "").toLowerCase();
    const isLsd = currentSymbol === "lsd";
    if (isLsd) return;

    const all = [...(toTokens || []), ...(lsdSearch || [])];
    const lsd = all.find((t: any) => (t.symbol || "").toLowerCase() === "lsd");
    if (lsd) {
      toInput.setSelectedAsset({
        symbol: lsd.symbol,
        name: lsd.name,
        icon: lsd.icon,
        decimals: lsd.decimals,
        address: lsd.address,
        out: {
          symbol: lsd.symbol,
          name: lsd.name,
          icon: lsd.icon,
          address: lsd.address,
          tellerAddress: lsd.address,
        },
      });
    }
  }, [toTokens, lsdSearch, toInput.selectedAsset]);

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
      const lsdToken =
        toTokens.find((t: any) => t.symbol?.toLowerCase() === "lsd") ||
        toTokens.find((t: any) => t.name?.toLowerCase().includes("lsd"));
      const chosen = lsdToken || toTokens[0];
      toInput.setSelectedAsset({
        symbol: chosen.symbol,
        name: chosen.name,
        icon: chosen.icon,
        decimals: chosen.decimals,
        address: chosen.address,
        out: {
          symbol: chosen.symbol,
          name: chosen.name,
          icon: chosen.icon,
          address: chosen.address,
          tellerAddress: chosen.address,
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
          address: token.address,
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
          address: token.address,
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
  const [gasless, setGasless] = useState(false);

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

    // API expects slippage as decimal (e.g., 0.005 for 0.5%)
    const slippageDecimal = slippage / 100;
    return {
      fromNetwork: (fromInput.selectedChain?.name || "").toLowerCase(),
      toNetwork: (toInput.selectedChain?.name || "").toLowerCase(),
      fromTokenAddress: fromInput.selectedAsset.address,
      toTokenAddress: toInput.selectedAsset.address,
      sellAmount: (
        parsedValue * Math.pow(10, fromInput.selectedAsset.decimals)
      ).toString(),
      slippageIn: slippageDecimal,
      slippageOut: slippageDecimal,
      gasless,
      fromAddress: address,
      toAddress: address,
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

  // Fetch distributions after quote arrives
  const { data: distributions } = useQuery(
    getFlyDistributionsOptions((quote as any)?.id)
  );

  // Check allowance for from-token on from network, spender = router/verifyingContract
  const routerAddress =
    (quote as any)?.typedData?.domain?.verifyingContract ||
    (quote as any)?.targetAddress;
  const { data: allowanceRes } = useQuery(
    getFlyAllowanceOptions({
      networkName: fromInput.selectedChain?.name?.toLowerCase(),
      walletAddress: address,
      tokenAddress: fromInput.selectedAsset?.address, // native doesn't need approval
      spenderAddress: routerAddress,
    })
  );
  const hasSufficientAllowance = useMemo(() => {
    if (!fromInput.selectedAsset?.address) return true; // native
    const amount = parseFloat(fromInput.value) || 0;
    if (amount <= 0) return true;
    const needed =
      amount * Math.pow(10, fromInput.selectedAsset.decimals || 18);
    const current = Number(allowanceRes?.allowance || 0);
    return current >= needed;
  }, [allowanceRes, fromInput.value, fromInput.selectedAsset]);

  // Update toInput value when quote changes (supports quote-in amountOut or quote toAmount)
  useEffect(() => {
    const rawOut = (quote as any)?.amountOut ?? (quote as any)?.toAmount;
    if (rawOut && toInput.selectedAsset.decimals != null) {
      const toAmount =
        parseFloat(rawOut) / Math.pow(10, toInput.selectedAsset.decimals);
      toInput.handleChange(toAmount.toString());
    }
  }, [quote, toInput.selectedAsset.decimals]);

  // USD labels based on Fly token usdPrice
  function findUsdPrice(tokens: any[], selected: any): number {
    if (!tokens || tokens.length === 0 || !selected) return 0;
    const selAddr = (selected.address || "").toLowerCase();
    let token = selAddr
      ? tokens.find((t: any) => (t.address || "").toLowerCase() === selAddr)
      : undefined;
    if (!token) {
      const selSym = (selected.symbol || "").toLowerCase();
      token = tokens.find(
        (t: any) => (t.symbol || "").toLowerCase() === selSym
      );
    }
    const price = parseFloat(token?.usdPrice ?? "0");
    return isNaN(price) ? 0 : price;
  }

  const fromUsdLabel = useMemo(() => {
    const amount = parseFloat(fromInput.value) || 0;
    if (!amount) return "$0.00";
    const price = findUsdPrice(fromTokens as any[], fromInput.selectedAsset);
    return `$${(amount * price).toFixed(2)}`;
  }, [fromInput.value, fromInput.selectedAsset, fromTokens]);

  const toUsdLabel = useMemo(() => {
    const amount = parseFloat(toInput.value) || 0;
    if (!amount) return "$0.00";
    const price = findUsdPrice(toTokens as any[], toInput.selectedAsset);
    return `$${(amount * price).toFixed(2)}`;
  }, [toInput.value, toInput.selectedAsset, toTokens]);

  // Current unit prices (define before delta computation)
  const fromTokenPriceUsd = useMemo(
    () => findUsdPrice(fromTokens as any[], fromInput.selectedAsset),
    [fromTokens, fromInput.selectedAsset]
  );
  const toTokenPriceUsd = useMemo(
    () => findUsdPrice(toTokens as any[], toInput.selectedAsset),
    [toTokens, toInput.selectedAsset]
  );

  // Out USD delta vs In USD (percentage)
  const outUsdDeltaPercent = useMemo(() => {
    const inAmount = parseFloat(fromInput.value) || 0;
    const outAmount = parseFloat(toInput.value) || 0;
    if (!inAmount || !outAmount) return null;
    const inUsd = inAmount * (fromTokenPriceUsd || 0);
    const outUsd = outAmount * (toTokenPriceUsd || 0);
    if (inUsd <= 0 || outUsd <= 0) return null;
    const delta = ((outUsd - inUsd) / inUsd) * 100;
    return delta;
  }, [fromInput.value, toInput.value, fromTokenPriceUsd, toTokenPriceUsd]);

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
    quoteRequest: quoteRequest as any,
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
    distributions,
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
    fromUsdLabel,
    toUsdLabel,
    fromTokenPriceUsd,
    toTokenPriceUsd,
    outUsdDeltaPercent,
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
