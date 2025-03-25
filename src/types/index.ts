export type Asset = {
  symbol: string;
  name: string;
  icon: string;
  address?: string;
  out: {
    symbol: string;
    name: string;
    icon: string;
    address: string;
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
