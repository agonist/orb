import type { SwapChain, SwapToken } from "@/types";
import { getFlyChains, getFlyTokens } from "./fly-api";

// Transform Fly protocol data to our internal types
function transformFlyChain(flyChain: any): SwapChain {
  // Map network name to symbol and other properties - MUST match API's exact network names
  const chainMapping: Record<string, { symbol: string; rpcUrl: string; explorerUrl: string }> = {
    ethereum: { symbol: "ETH", rpcUrl: "https://eth.llamarpc.com", explorerUrl: "https://etherscan.io" },
    polygon: { symbol: "MATIC", rpcUrl: "https://polygon.llamarpc.com", explorerUrl: "https://polygonscan.com" },
    bsc: { symbol: "BNB", rpcUrl: "https://bsc.llamarpc.com", explorerUrl: "https://bscscan.com" },
    avalanche: { symbol: "AVAX", rpcUrl: "https://avalanche.llamarpc.com", explorerUrl: "https://snowtrace.io" },
    arbitrum: { symbol: "ETH", rpcUrl: "https://arb1.arbitrum.io/rpc", explorerUrl: "https://arbiscan.io" },
    optimism: { symbol: "ETH", rpcUrl: "https://mainnet.optimism.io", explorerUrl: "https://optimistic.etherscan.io" },
    polygonzk: { symbol: "ETH", rpcUrl: "https://zkevm-rpc.com", explorerUrl: "https://zkevm.polygonscan.com" },
    base: { symbol: "ETH", rpcUrl: "https://mainnet.base.org", explorerUrl: "https://basescan.org" },
    zksync: { symbol: "ETH", rpcUrl: "https://mainnet.era.zksync.io", explorerUrl: "https://explorer.zksync.io" },
    blast: { symbol: "ETH", rpcUrl: "https://rpc.blast.io", explorerUrl: "https://blastscan.io" },
    manta: { symbol: "ETH", rpcUrl: "https://pacific-rpc.manta.network/http", explorerUrl: "https://pacific-explorer.manta.network" },
    scroll: { symbol: "ETH", rpcUrl: "https://rpc.scroll.io", explorerUrl: "https://scrollscan.com" },
    fantom: { symbol: "FTM", rpcUrl: "https://rpc.ftm.tools", explorerUrl: "https://ftmscan.com" },
    taiko: { symbol: "ETH", rpcUrl: "https://rpc.mainnet.taiko.xyz", explorerUrl: "https://taikoscan.io" },
    metis: { symbol: "METIS", rpcUrl: "https://andromeda.metis.io/?owner=1088", explorerUrl: "https://andromeda-explorer.metis.io" },
    solana: { symbol: "SOL", rpcUrl: "https://api.mainnet-beta.solana.com", explorerUrl: "https://solscan.io" },
    sonic: { symbol: "SONIC", rpcUrl: "https://rpc.soniclabs.com", explorerUrl: "https://sonicscan.com" },
    ink: { symbol: "INK", rpcUrl: "https://rpc-gel.inkonchain.com", explorerUrl: "https://explorer.inkonchain.com" },
    linea: { symbol: "ETH", rpcUrl: "https://rpc.linea.build", explorerUrl: "https://lineascan.build" },
    berachain: { symbol: "BERA", rpcUrl: "https://rpc.berachain.com", explorerUrl: "https://beratrail.io" },
    abstract: { symbol: "ETH", rpcUrl: "https://api.testnet.abs.xyz", explorerUrl: "https://explorer.testnet.abs.xyz" },
    unichain: { symbol: "ETH", rpcUrl: "https://rpc.unichain.org", explorerUrl: "https://uniscan.xyz" },
  };

  const mapping = chainMapping[flyChain.name] || { 
    symbol: flyChain.name.toUpperCase(), 
    rpcUrl: "", 
    explorerUrl: "" 
  };

  return {
    chainId: flyChain.chainId,
    name: flyChain.name.charAt(0).toUpperCase() + flyChain.name.slice(1),
    symbol: mapping.symbol,
    icon: flyChain.logoUrl, // Use the full logoUrl directly
    rpcUrl: mapping.rpcUrl,
    explorerUrl: mapping.explorerUrl,
    isMainnet: true,
  };
}

function transformFlyToken(flyToken: any): SwapToken {
  // Check if token is native (ETH, MATIC, BNB, etc.) based on address
  const isNative = flyToken.address === "0x0000000000000000000000000000000000000000" ||
                   flyToken.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

  return {
    symbol: flyToken.symbol,
    name: flyToken.name,
    decimals: flyToken.decimals,
    address: flyToken.address,
    chainId: flyToken.network.chainId,
    icon: flyToken.logoUrl || null, // Use the logoUrl directly
    isNative: isNative,
    usdPrice: flyToken.usdPrice,
  };
}

// Fetch all supported chains for swapping
export async function getSwapChains(): Promise<SwapChain[]> {
  console.log("Fetching chains from Fly protocol API...");
  
  try {
    const flyChains = await getFlyChains();
    console.log("✅ Successfully fetched chains from Fly API:", flyChains);
    return flyChains.map(transformFlyChain);
  } catch (error) {
    console.error("❌ Failed to fetch swap chains from Fly API:", error);
    console.log("🔄 Using fallback chain data");
    
    // Return fallback data if API fails
    return [
      {
        chainId: 1,
        name: "Ethereum",
        symbol: "ETH",
        icon: "eth.webp",
        rpcUrl: "https://eth.llamarpc.com",
        explorerUrl: "https://etherscan.io",
        isMainnet: true,
      },
      {
        chainId: 146,
        name: "Sonic",
        symbol: "SONIC", 
        icon: "sonic.webp",
        rpcUrl: "https://rpc.soniclabs.com",
        explorerUrl: "https://sonicscan.com",
        isMainnet: true,
      },
      {
        chainId: 137,
        name: "Polygon",
        symbol: "MATIC",
        icon: "eth.webp",
        rpcUrl: "https://polygon.llamarpc.com",
        explorerUrl: "https://polygonscan.com",
        isMainnet: true,
      },
      {
        chainId: 56,
        name: "BNB Chain",
        symbol: "BNB",
        icon: "eth.webp",
        rpcUrl: "https://bsc.llamarpc.com", 
        explorerUrl: "https://bscscan.com",
        isMainnet: true,
      },
    ];
  }
}

// Fetch supported tokens for swapping (all chains or specific chain)
export async function getSwapTokens(networkName?: string): Promise<SwapToken[]> {
  console.log("Fetching tokens from Fly protocol API...", networkName ? `for network ${networkName}` : "for all networks");

  try {
    const flyTokens = await getFlyTokens(networkName);
    console.log("✅ Successfully fetched tokens from Fly API:", flyTokens.length, "tokens");
    return flyTokens.map(transformFlyToken);
  } catch (error) {
    console.error("❌ Failed to fetch swap tokens from Fly API:", error);
    console.log("🔄 Using fallback token data");

    const allTokens = [
      // Ethereum tokens
      {
        symbol: "ETH",
        name: "Ethereum",
        decimals: 18,
        address: "0x0000000000000000000000000000000000000000",
        chainId: 1,
        icon: "eth.webp",
        isNative: true,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        chainId: 1,
        icon: "usdc.webp",
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        decimals: 6,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        chainId: 1,
        icon: "usdt.webp",
      },
      {
        symbol: "WBTC",
        name: "Wrapped Bitcoin",
        decimals: 8,
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        chainId: 1,
        icon: "wbtc.webp",
      },
      // Sonic tokens
      {
        symbol: "SONIC",
        name: "Sonic",
        decimals: 18,
        address: "0x0000000000000000000000000000000000000000",
        chainId: 146,
        icon: "sonic.webp",
        isNative: true,
      },
      {
        symbol: "USDC.e",
        name: "USD Coin (Bridged)",
        decimals: 6,
        address: "0x29219dd400f2bf60e5a23d13be72b486d4038894",
        chainId: 146,
        icon: "usdc.webp",
      },
      {
        symbol: "wETH",
        name: "Wrapped Ethereum",
        decimals: 18,
        address: "0x50c42dEAcD8Fc9773493ED674b675bE577f2634b",
        chainId: 146,
        icon: "weth.webp",
      },
      // Polygon tokens
      {
        symbol: "MATIC",
        name: "Polygon",
        decimals: 18,
        address: "0x0000000000000000000000000000000000000000",
        chainId: 137,
        icon: "eth.webp", // Using eth.webp as fallback
        isNative: true,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        chainId: 137,
        icon: "usdc.webp",
      },
      // BNB Chain tokens
      {
        symbol: "BNB",
        name: "BNB",
        decimals: 18,
        address: "0x0000000000000000000000000000000000000000",
        chainId: 56,
        icon: "eth.webp", // Using eth.webp as fallback
        isNative: true,
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        decimals: 18,
        address: "0x55d398326f99059ff775485246999027b3197955",
        chainId: 56,
        icon: "usdt.webp",
      },
    ];

    // Filter by chainId if provided
    if (chainId) {
      return allTokens.filter(token => token.chainId === chainId);
    }

    return allTokens;
  }
}

// Legacy compatibility: transform swap data to deposit format for existing components
export async function getSwapData() {
  const chains = await getSwapChains();
  
  const swapData = {
    chains: await Promise.all(
      chains.map(async (chain) => {
        const tokens = await getSwapTokens(chain.name);
        
        return {
          name: chain.name,
          icon: chain.icon,
          symbol: chain.symbol,
          chainId: chain.chainId,
          assets: tokens.map(token => ({
            symbol: token.symbol,
            name: token.name,
            icon: token.icon,
            decimals: token.decimals,
            address: token.isNative ? undefined : token.address,
            // For compatibility with existing deposit interface
            out: {
              symbol: token.symbol,
              name: token.name,
              icon: token.icon, 
              address: token.address,
              tellerAddress: token.address, // Placeholder for compatibility
            },
          })),
        };
      })
    ),
  };

  return swapData;
}