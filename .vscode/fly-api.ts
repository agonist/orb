// Fly Protocol API Client
// Based on the API documentation from docs.fly.trade

// Note: This is a placeholder API URL - the actual Fly protocol API endpoints may be different
// For development, we'll use fallback data since we don't have the real API endpoints
const FLY_API_BASE_URL = "https://api.fly.trade/v1";

// API Response Types
export interface FlyChain {
  chainId: number;
  name: string;
  symbol: string;
  icon?: string;
  rpcUrl: string;
  explorerUrl: string;
  isMainnet: boolean;
}

export interface FlyToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  icon?: string;
  isNative?: boolean;
}

export interface FlyQuoteRequest {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  slippage: number;
  fromAddress: string;
  toAddress: string;
  gasless: boolean;
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

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Fly API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get supported chains
  async getChains(): Promise<FlyChain[]> {
    return this.request<FlyChain[]>("/chains");
  }

  // Get supported tokens for a specific chain
  async getTokens(chainId?: number): Promise<FlyToken[]> {
    const endpoint = chainId ? `/tokens?chainId=${chainId}` : "/tokens";
    return this.request<FlyToken[]>(endpoint);
  }

  // Get swap quote
  async getQuote(request: FlyQuoteRequest): Promise<FlyQuoteResponse> {
    const params = new URLSearchParams({
      fromTokenAddress: request.fromTokenAddress,
      toTokenAddress: request.toTokenAddress,
      amount: request.amount,
      slippage: request.slippage.toString(),
      fromAddress: request.fromAddress,
      toAddress: request.toAddress,
      gasless: request.gasless.toString(),
    });

    if (request.affiliateAddress) {
      params.append("affiliateAddress", request.affiliateAddress);
    }
    if (request.affiliateFeeInPercentage) {
      params.append("affiliateFeeInPercentage", request.affiliateFeeInPercentage.toString());
    }

    return this.request<FlyQuoteResponse>(`/aggregator/quote-in?${params.toString()}`);
  }

  // Get transaction data for self-execution
  async getTransaction(quoteId: string): Promise<FlyTransactionResponse> {
    return this.request<FlyTransactionResponse>(`/aggregator/transaction-in?quoteId=${quoteId}`);
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
export const getFlyTokens = (chainId?: number) => flyApi.getTokens(chainId);
export const getFlyQuote = (request: FlyQuoteRequest) => flyApi.getQuote(request);
export const getFlyTransaction = (quoteId: string) => flyApi.getTransaction(quoteId);
export const executeFlySwap = (params: Parameters<typeof flyApi.executeSwap>[0]) => flyApi.executeSwap(params);
export const getFlySwapStatus = (swapId: string) => flyApi.getSwapStatus(swapId);