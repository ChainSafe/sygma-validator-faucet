import web3 from 'web3/lib/web3';
import {
  BRIDGE_ADDRESS_GOERLI,
  BRIDGE_ADDRESS_MOONBASE,
  BRIDGE_ADDRESS_MUMBAI,
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
}

export enum NetworksChainID {
  GOERLI = '0x5',
  MOONBASE = '0x507',
  MUMBAI = '0x13881',
}

export const networks: Network[] = [
  {
    chainId: NetworksChainID.MOONBASE,
    chainName: 'Moonbase Alpha',
    nativeCurrency: {
      name: 'Moonbase DEV',
      symbol: 'DEV',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
  },
  {
    chainId: NetworksChainID.MUMBAI,
    chainName: 'Mumbai',
    nativeCurrency: {
      name: 'Mumbai DEV',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
  },
];

export function getNetwork(chainId: string): Network {
  switch (chainId) {
    case '0x507':
      return networks[0];
    case '0x13881':
      return networks[1];
    default:
      throw new Error(`ChainId: ${chainId} dose not exist on list!`);
  }
}

export const getBridgeAddress = (networkChainId: NetworksChainID): string => {
  switch (networkChainId) {
    case NetworksChainID.GOERLI:
      return BRIDGE_ADDRESS_GOERLI;
    case NetworksChainID.MOONBASE:
      return BRIDGE_ADDRESS_MOONBASE;
    case NetworksChainID.MUMBAI:
      return BRIDGE_ADDRESS_MUMBAI;
    default:
      throw new Error(`Bridge contract not available for networkChainId`);
  }
};

export const getDomainID = (networkChainId: bigint): bigint => {
  const chainIdHex = web3.utils.toHex(networkChainId) as NetworksChainID;
  switch (chainIdHex) {
    case NetworksChainID.GOERLI:
      return 1n;
    case NetworksChainID.MOONBASE:
      return 2n;
    case NetworksChainID.MUMBAI:
      return 3n;
    default:
      throw new Error(`There is no DomainID for that networkChainId`);
  }
};
