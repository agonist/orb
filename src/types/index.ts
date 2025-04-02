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
