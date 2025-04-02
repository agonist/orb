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
            tellerAddress: "0x358CFACf00d0B4634849821BB3d1965b472c776a",
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
            tellerAddress: "0x358CFACf00d0B4634849821BB3d1965b472c776a",
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
            tellerAddress: "0x31A5A9F60Dc3d62fa5168352CaF0Ee05aA18f5B8",
          },
        },
        {
          symbol: "wETH",
          name: "Wrapped Ethereum",
          icon: "weth.webp",
          decimals: 18,
          address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
          out: {
            symbol: "scETH",
            name: "Sonic ETH",
            icon: "scETH.png",
            address: "0x3bcE5CB273F0F148010BbEa2470e7b5df84C7812",
            tellerAddress: "0x31A5A9F60Dc3d62fa5168352CaF0Ee05aA18f5B8",
          },
        },
        {
          symbol: "wstETH",
          name: "Wrapped liquid staked Ether",
          icon: "wsteth.webp",
          decimals: 18,
          address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
          out: {
            symbol: "scETH",
            name: "Sonic ETH",
            icon: "scETH.png",
            address: "0x3bcE5CB273F0F148010BbEa2470e7b5df84C7812",
            tellerAddress: "0x31A5A9F60Dc3d62fa5168352CaF0Ee05aA18f5B8",
          },
        },
        {
          symbol: "weETH",
          name: "Wrapped eETH",
          icon: "weeth.webp",
          decimals: 18,
          address: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
          out: {
            symbol: "scETH",
            name: "Sonic ETH",
            icon: "scETH.png",
            address: "0x3bcE5CB273F0F148010BbEa2470e7b5df84C7812",
            tellerAddress: "0x31A5A9F60Dc3d62fa5168352CaF0Ee05aA18f5B8",
          },
        },
        {
          symbol: "stETH",
          name: "stETH",
          icon: "steth.svg",
          decimals: 18,
          address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
          out: {
            symbol: "scETH",
            name: "Sonic ETH",
            icon: "scETH.png",
            address: "0x3bcE5CB273F0F148010BbEa2470e7b5df84C7812",
            tellerAddress: "0x31A5A9F60Dc3d62fa5168352CaF0Ee05aA18f5B8",
          },
        },
        {
          symbol: "GHO",
          name: "GHO",
          icon: "gho.webp",
          decimals: 18,
          address: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
          out: {
            symbol: "scUSD",
            name: "Sonic USD",
            icon: "scUSD.png",
            address: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE",
            tellerAddress: "0x358CFACf00d0B4634849821BB3d1965b472c776a",
          },
        },
        {
          symbol: "DAI",
          name: "DAI",
          icon: "dai.svg",
          decimals: 18,
          address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          out: {
            symbol: "scUSD",
            name: "Sonic USD",
            icon: "scUSD.png",
            address: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE",
            tellerAddress: "0x358CFACf00d0B4634849821BB3d1965b472c776a",
          },
        },
        {
          symbol: "USDS",
          name: "USDS",
          icon: "usds.svg",
          decimals: 18,
          address: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
          out: {
            symbol: "scUSD",
            name: "Sonic USD",
            icon: "scUSD.png",
            address: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE",
            tellerAddress: "0x358CFACf00d0B4634849821BB3d1965b472c776a",
          },
        },
        {
          symbol: "eBTC",
          name: "ether.fi BTC",
          icon: "ebtc.webp",
          decimals: 8,
          address: "0x657e8C867D8B37dCC18fA4Caead9C45EB088C642",
          out: {
            symbol: "scBTC",
            name: "Sonic BTC",
            icon: "scBTC.png",
            address: "0xBb30e76d9Bb2CC9631F7fC5Eb8e87B5Aff32bFbd",
            tellerAddress: "0xAce7DEFe3b94554f0704d8d00F69F273A0cFf079",
          },
        },
        {
          symbol: "wBTC",
          name: "Wrapped Bitcoin",
          icon: "wbtc.webp",
          decimals: 8,
          address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          out: {
            symbol: "scBTC",
            name: "Sonic BTC",
            icon: "scBTC.png",
            address: "0xBb30e76d9Bb2CC9631F7fC5Eb8e87B5Aff32bFbd",
            tellerAddress: "0xAce7DEFe3b94554f0704d8d00F69F273A0cFf079",
          },
        },
        {
          symbol: "LBTC",
          name: "Lombard Staked Bitcoin",
          icon: "lbtc.webp",
          decimals: 8,
          address: "0x8236a87084f8B84306f72007F36F2618A5634494",
          out: {
            symbol: "scBTC",
            name: "Sonic BTC",
            icon: "scBTC.png",
            address: "0xBb30e76d9Bb2CC9631F7fC5Eb8e87B5Aff32bFbd",
            tellerAddress: "0xAce7DEFe3b94554f0704d8d00F69F273A0cFf079",
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
            tellerAddress: "0x358CFACf00d0B4634849821BB3d1965b472c776a",
          },
        },
        {
          symbol: "wETH",
          name: "Wrapped Ethereum",
          icon: "eth.webp",
          decimals: 18,
          address: "0x50c42dEAcD8Fc9773493ED674b675bE577f2634b",
          out: {
            symbol: "scETH",
            name: "Sonic ETH",
            icon: "scETH.png",
            address: "0x3bcE5CB273F0F148010BbEa2470e7b5df84C7812",
            tellerAddress: "0x31A5A9F60Dc3d62fa5168352CaF0Ee05aA18f5B8",
          },
        },
        {
          symbol: "wBTC",
          name: "Wrapped Bitcoin",
          icon: "wbtc.webp",
          decimals: 8,
          address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
          out: {
            symbol: "scBTC",
            name: "Sonic BTC",
            icon: "scBTC.png",
            address: "0xBb30e76d9Bb2CC9631F7fC5Eb8e87B5Aff32bFbd",
            tellerAddress: "0xAce7DEFe3b94554f0704d8d00F69F273A0cFf079",
          },
        },
        {
          symbol: "LBTC",
          name: "Lombard Staked Bitcoin",
          icon: "lbtc.webp",
          decimals: 8,
          address: "0xecAc9C5F704e954931349Da37F60E39f515c11c1",
          out: {
            symbol: "scBTC",
            name: "Sonic BTC",
            icon: "scBTC.png",
            address: "0xBb30e76d9Bb2CC9631F7fC5Eb8e87B5Aff32bFbd",
            tellerAddress: "0xAce7DEFe3b94554f0704d8d00F69F273A0cFf079",
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
      symbol: "USDC.e",
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
