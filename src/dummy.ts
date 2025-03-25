import type { Asset } from "./types";

const chainsList = [
  {
    name: "Ethereum",
    icon: "eth.webp",
  },
  {
    name: "Sonic",
    icon: "sonic.webp",
  },
];

const assetsList = {
  Ethereum: [
    {
      symbol: "USDC",
      name: "USD Coin",
      icon: "usdc.webp",
    },
    {
      symbol: "USDT",
      name: "USD Tether",
      icon: "usdt.webp",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "eth.webp",
    },
  ],
  Sonic: [
    {
      symbol: "USDC",
      name: "USD Circle",
      icon: "usdc.webp",
    },
    {
      symbol: "wBTC",
      name: "Wrapped Bitcoin",
      icon: "wbtc.webp",
    },
  ],
} as Record<string, Asset[]>;

export { chainsList, assetsList };
