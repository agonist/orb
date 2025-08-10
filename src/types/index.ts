// Existing deposit-related types (kept for backward compatibility)
export type Asset = {
  symbol: string;
  name: string;
  icon: string;
  decimals: number;
  address?: string;
  out: {
    symbol: string;
    name: string;
    icon: string;
    address: string;
    tellerAddress: string;
  };
};

export type Chain = {
  name: string;
  icon: string;
  symbol: string;
  chainId: number;
  assets: Asset[];
};

export type Deposit = {
  chains: Chain[];
};

export type TokenBalance = {
  symbol: string;
  name: string;
  address?: string;
  balance: string;
  chain: string;
  chainId: number;
};

// New swap-related types for Fly protocol integration
export type SwapToken = {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  chainId: number;
  icon?: string;
  isNative?: boolean;
  usdPrice?: string;
};

export type SwapChain = {
  chainId: number;
  name: string;
  symbol: string;
  icon?: string;
  rpcUrl: string;
  explorerUrl: string;
  isMainnet: boolean;
};

export type SwapQuote = {
  id: string;
  fromToken: any; // Using any for now since Fly API returns different format
  toToken: any;   // Using any for now since Fly API returns different format
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  route: SwapRouteStep[];
  priceImpact: number;
  fees: SwapFee[];
  validUntil: number;
};

export type SwapRouteStep = {
  protocol: string;
  fromChainId: number;
  toChainId: number;
  fromToken: any; // Using any for now since Fly API returns different format
  toToken: any;   // Using any for now since Fly API returns different format
  percentage: number;
};

export type SwapFee = {
  type: "gas" | "protocol" | "affiliate";
  amount: string;
  token: any; // Using any for now since Fly API returns different format
};

export type SwapTransaction = {
  to: string;
  data: string;
  value: string;
  gasLimit: string;
  gasPrice?: string;
};

export type SwapStatus = {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  fromTxHash?: string;
  toTxHash?: string;
  error?: string;
};

export type SwapSettings = {
  slippage: number;
  gasless: boolean;
  affiliateAddress?: string;
  affiliateFee?: number;
};
