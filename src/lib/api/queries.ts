import type { Deposit } from "@/types";

export const dummyDeposit = {
  chains: [
    {
      name: "Ethereum",
      icon: "eth.webp",
      symbol: "ETH",
      chainId: 1,
      assets: [
        {
          symbol: "USDC",
          name: "USD Coin",
          icon: "usdc.webp",
          decimals: 6,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          out: {
            symbol: "scUSD",
            name: "Sonic USD",
            icon: "scUSD.png",
            address: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE",
          },
        },
        {
          symbol: "USDT",
          name: "USD Tether",
          icon: "usdt.webp",
          decimals: 6,
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          out: {
            symbol: "scUSD",
            name: "Sonic USD",
            icon: "scUSD.png",
            address: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE",
          },
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          icon: "eth.webp",
          decimals: 18,
          address: undefined,
          out: {
            symbol: "scETH",
            name: "Sonic ETH",
            icon: "scETH.png",
            address: "0x3bcE5CB273F0F148010BbEa2470e7b5df84C7812",
          },
        },
      ],
    },
    {
      name: "Sonic",
      symbol: "SONIC",
      chainId: 146,
      icon: "sonic.webp",
      assets: [
        {
          symbol: "USDC.e",
          name: "USD Circle",
          icon: "usdc.webp",
          decimals: 6,
          address: "0x29219dd400f2bf60e5a23d13be72b486d4038894",
          out: {
            symbol: "scUSD",
            name: "Sonic USD",
            icon: "scUSD.png",
            address: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE",
          },
        },
        {
          symbol: "wBTC",
          name: "Wrapped Bitcoin",
          icon: "wbtc.webp",
          decimals: 8,
          address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
          out: {
            symbol: "scUSD",
            name: "Sonic USD",
            icon: "scUSD.png",
            address: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE",
          },
        },
      ],
    },
  ],
} as Deposit;

export async function getDeposit(): Promise<Deposit> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return dummyDeposit;
}

export async function getTokensPrice() {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return [
    {
      symbol: "USDC",
      price: 1,
    },
    {
      symbol: "USDT",
      price: 1,
    },
    {
      symbol: "ETH",
      price: 2212.33,
    },
    {
      symbol: "wBTC",
      price: 88902.33,
    },
  ];
}
