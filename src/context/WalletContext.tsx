import {createContext, PropsWithChildren, useContext, useState} from "react";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import Web3 from "web3";
import {EIP1193Provider} from "web3-types/lib/web3_base_provider";
import {getNetwork} from "../utils/network";

const web3Modal = new Web3Modal({
  network: 'goerli',
  theme: 'light',
  cacheProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: import.meta.env.REACT_APP_INFURA_PROJECT_ID,
      },
    },
  },
});

interface WalletContextInterface {
  web3: Web3 | null;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  ensureNetwork: (network: string) => Promise<boolean>;
}

/**
* There is dummy reason that you need to provide a default state to a provider
 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
* */
const defaultState: WalletContextInterface = {
  web3: null,
  connect: () => { return Promise.resolve(false) },
  disconnect: () => {},
  ensureNetwork: (network: string) => { return Promise.resolve(false) },
};

const WalletContext = createContext<WalletContextInterface>(defaultState);

export function WalletContextProvider({ children }: PropsWithChildren) {
  const [web3, setWeb3] = useState<Web3 | null>(null);

  const connect = async (): Promise<boolean> => {
    if (web3 !== null) return true;

    try {
      const provider = await web3Modal.connect();
      setWeb3(new Web3(provider));
      return true;
    } catch (error) {
      console.error(error);
      // TODO: better handling error if connection fails for any reason!
      return false;
    }
  };

  const disconnect = (): void => {
    web3Modal.clearCachedProvider();
    setWeb3(null);
    console.log('cleared cached provider');
  };

  const ensureNetwork = async (network: string): Promise<boolean> => {
    if (web3 === null) return false;
    const chainId = await web3.eth.getChainId();
    const chainIdHex = `0x${chainId.toString(16)}`;

    console.log("start", network, chainIdHex);

    if (network === chainIdHex) return true;
    const provider = web3.currentProvider as EIP1193Provider<{}>;

    console.log("before switch");

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: network,
        }]
      });
      return true;
    } catch (switchError) {
      console.log(switchError);

      // TODO remove ts ignore;
      // @ts-ignore
      if (switchError.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [getNetwork(network)]
        });
        return true;
      }
    }

    return true;
  };

  return (
    <WalletContext.Provider value={{ web3, connect, disconnect, ensureNetwork }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);

type EnsuredWeb3WalletContext = Omit<WalletContextInterface, 'web3'> & { web3: Web3 };
export const useEnsuredWallet = (): EnsuredWeb3WalletContext => {
  const wallet = useWallet();
  if (!wallet.web3) throw new Error("Wallet not connected");
  return wallet as EnsuredWeb3WalletContext;
};

