import {createContext, PropsWithChildren, useContext, useState} from "react";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import Web3 from "web3";

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
}

/**
* There is dummy reason that you need to provide a default state to a provider
 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
* */
const defaultState: WalletContextInterface = {
  web3: null,
  connect: () => { return Promise.resolve(false) },
  disconnect: () => {},
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

  return (
    <WalletContext.Provider value={{ web3, connect, disconnect }}>
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

