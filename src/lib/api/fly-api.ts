// Fly Protocol API Client
// Based on the API documentation from docs.fly.trade

// Fly protocol API base URL - from https://api.fly.trade/swagger
const FLY_API_BASE_URL = "https://api.fly.trade";

// API Response Types
export interface FlyChain {
  id: number;
  name: string;
  chainId: number;
  logoUrl: string;
}

export interface FlyToken {
  id: string;
  name: string;
  symbol: string;
  contractName: string;
  contractSymbol: string;
  permit: string;
  address: string;
  decimals: number;
  displayDecimals: number;
  isReliable: boolean;
  logoUrl: string | null;
  usdPrice: string;
  highestPriority: number;
  network: {
    id: number;
    name: string;
    chainId: number;
    logoUrl: string;
  };
}

export interface FlyQuoteRequest {
  fromNetwork: string; // e.g., 'ethereum'
  toNetwork: string; // e.g., 'sonic'
  fromTokenAddress: string;
  toTokenAddress: string;
  sellAmount: string;
  slippageIn: number; // decimal (0.005 for 0.5%)
  slippageOut: number; // decimal (0.005 for 0.5%)
  gasless: boolean;
  fromAddress?: string;
  toAddress?: string;
  affiliateAddress?: string;
  affiliateFeeInPercentage?: number;
}

export interface FlyQuoteResponse {
  id: string;
  fromToken: FlyToken;
  toToken: FlyToken;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  route: FlyRouteStep[];
  priceImpact: number;
  fees: FlyFee[];
  validUntil: number;
}

export interface FlyRouteStep {
  protocol: string;
  fromChainId: number;
  toChainId: number;
  fromToken: FlyToken;
  toToken: FlyToken;
  percentage: number;
}

export interface FlyFee {
  type: "gas" | "protocol" | "affiliate";
  amount: string;
  token: FlyToken;
}

export interface FlyTransactionResponse {
  to: string;
  data: string;
  value: string;
  gasLimit: string;
  gasPrice?: string;
}

export interface FlySwapStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  fromTxHash?: string;
  toTxHash?: string;
  error?: string;
}

// API Client Class
class FlyApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = FLY_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log(`🚀 Making request to: ${url}`);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        console.log(
          `❌ API request failed: ${response.status} ${response.statusText}`
        );
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`✅ API request successful`);
      return data;
    } catch (error) {
      console.error(`❌ Fly API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get supported chains
  async getChains(): Promise<FlyChain[]> {
    return this.request<FlyChain[]>("/token-manager/networks");
  }

  // Get supported tokens for a specific chain with pagination and search
  async getTokens(
    networkName?: string,
    offset: number = 0,
    searchValue?: string
  ): Promise<FlyToken[]> {
    const body = {
      networkNames: networkName
        ? [networkName]
        : [
            "ethereum",
            "polygon",
            "bsc",
            "avalanche",
            "arbitrum",
            "optimism",
            "base",
            "sonic",
          ],
      // Fly API supports searchValue as array; use array when provided
      searchValue:
        searchValue && searchValue.trim().length > 0 ? [searchValue] : "",
      exact: false,
      offset,
      exclude: [],
    };

    return this.request<FlyToken[]>("/token-manager/tokens", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // Get swap quote
  async getQuote(request: FlyQuoteRequest): Promise<FlyQuoteResponse> {
    // Cross-network when networks differ; otherwise same-network
    const isCross = request.fromNetwork !== request.toNetwork;

    if (isCross) {
      const params = new URLSearchParams({
        fromNetwork: request.fromNetwork,
        toNetwork: request.toNetwork,
        fromTokenAddress: request.fromTokenAddress,
        toTokenAddress: request.toTokenAddress,
        sellAmount: request.sellAmount,
        slippageIn: request.slippageIn.toString(),
        slippageOut: request.slippageOut.toString(),
        gasless: request.gasless.toString(),
      });
      if (request.fromAddress)
        params.append("fromAddress", request.fromAddress);
      if (request.toAddress) params.append("toAddress", request.toAddress);
      if (request.affiliateAddress)
        params.append("affiliateAddress", request.affiliateAddress);
      if (request.affiliateFeeInPercentage)
        params.append(
          "affiliateFeeInPercentage",
          request.affiliateFeeInPercentage.toString()
        );
      return this.request<FlyQuoteResponse>(
        `/aggregator/quote-in?${params.toString()}`
      );
    }

    const params = new URLSearchParams({
      network: request.fromNetwork,
      fromTokenAddress: request.fromTokenAddress,
      toTokenAddress: request.toTokenAddress,
      sellAmount: request.sellAmount,
      slippage: request.slippageIn.toString(),
      gasless: request.gasless.toString(),
    });
    if (request.fromAddress) params.append("fromAddress", request.fromAddress);
    if (request.toAddress) params.append("toAddress", request.toAddress);
    if (request.affiliateAddress)
      params.append("affiliateAddress", request.affiliateAddress);
    if (request.affiliateFeeInPercentage)
      params.append(
        "affiliateFeeInPercentage",
        request.affiliateFeeInPercentage.toString()
      );
    return this.request<FlyQuoteResponse>(
      `/aggregator/quote?${params.toString()}`
    );
  }

  // Get transaction data for self-execution
  async getTransaction(
    quoteId: string,
    isCrossNetwork: boolean
  ): Promise<FlyTransactionResponse> {
    const endpoint = isCrossNetwork
      ? "/aggregator/transaction-in"
      : "/aggregator/transaction";
    return this.request<FlyTransactionResponse>(
      `${endpoint}?quoteId=${quoteId}`
    );
  }

  // Execute gasless swap
  async executeSwap(params: {
    networkName: string;
    quoteId: string;
    swapSignature: string;
    permitSignature?: string;
    permitDeadline?: number;
  }): Promise<FlySwapStatus> {
    return this.request<FlySwapStatus>("/user-manager/execute-swap-in", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Get swap status
  async getSwapStatus(swapId: string): Promise<FlySwapStatus> {
    return this.request<FlySwapStatus>(`/user-manager/swap/${swapId}`);
  }
}

// Export singleton instance
export const flyApi = new FlyApiClient();

// Export individual API functions for React Query
export const getFlyChains = () => flyApi.getChains();
export const getFlyTokens = (
  networkName?: string,
  offset: number = 0,
  searchValue?: string
) => flyApi.getTokens(networkName, offset, searchValue);
export const getFlyQuote = (request: FlyQuoteRequest) =>
  flyApi.getQuote(request);
export const getFlyTransaction = (quoteId: string) =>
  flyApi.getTransaction(quoteId);
export const executeFlySwap = (
  params: Parameters<typeof flyApi.executeSwap>[0]
) => flyApi.executeSwap(params);
export const getFlySwapStatus = (swapId: string) =>
  flyApi.getSwapStatus(swapId);
