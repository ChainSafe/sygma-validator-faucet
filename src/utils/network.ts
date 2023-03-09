interface Network {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
}

const networks: Network[] = [
  {
    chainId: "0x507",
    chainName: "Moonbase Alpha",
    nativeCurrency: {
      name: 'Moonbase DEV',
      symbol: 'DEV',
      decimals: 18,
    },
    rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
  },
  {
    chainId: "0x13881",
    chainName: "Mumbai",
    nativeCurrency: {
      name: 'Mumbai DEV',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
  },
];

export function getNetwork(chainId: string): Network {
  switch (chainId) {
    case "0x507":
      return networks[0];
    case "0x13881":
      return networks[1];
    default:
      throw new Error(`ChainId: ${chainId} dose not exist on list!`);
  }
}
