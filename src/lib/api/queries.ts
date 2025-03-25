const dummyDeposit = {
  chains: [
    {
      name: "Ethereum",
      icon: "eth.webp",
      assets: [
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
    },
    {
      name: "Sonic",
      icon: "sonic.webp",
      assets: [
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
    },
  ],
} as const;

export async function getDeposit() {
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
