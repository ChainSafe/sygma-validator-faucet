import {
  DEPOSIT_ADAPTER_ORIGIN_GOERLI,
  DEPOSIT_ADAPTER_ORIGIN_SEPOLIA,
} from '../contracts/addresses';

export interface Network {
  chainId: NetworksChainID; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrl: string;
}

export enum NetworksChainID {
  GOERLI = '0x5',
  SEPOLIA = '0xaa36a7',
  HOLESKY = '0x4268',
}

export const networks: Network[] = [
  {
    chainId: NetworksChainID.GOERLI,
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Goerli test network',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://ethereum-goerli.publicnode.com'],
    blockExplorerUrl: 'https://goerli.etherscan.io/',
  },
  {
    chainId: NetworksChainID.SEPOLIA,
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'Sepolia test network',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc2.sepolia.org'],
    blockExplorerUrl: 'https://sepolia.etherscan.io/',
  },
];

export function getNetwork(chainId: string): Network {
  switch (chainId) {
    case '0x5':
      return networks[0];
    case '0xaa36a7':
      return networks[1];
    default:
      throw new Error(`ChainId: ${chainId} dose not exist on list!`);
  }
}

export const getDomainID = (chainIdHex: string): bigint => {
  switch (chainIdHex) {
    case NetworksChainID.GOERLI:
      return 1n;
    case NetworksChainID.SEPOLIA:
      return 4n;
    default:
      throw new Error(`There is no DomainID for that networkChainId`);
  }
};

export const getDepositAdapterOriginAddress = (chainIdHex: string): string => {
  switch (chainIdHex) {
    case NetworksChainID.GOERLI:
      return DEPOSIT_ADAPTER_ORIGIN_GOERLI;
    case NetworksChainID.SEPOLIA:
      return DEPOSIT_ADAPTER_ORIGIN_SEPOLIA;
    default:
      throw new Error(`There is no Deposit Adapter Origin address for that chain id`);
  }
};
