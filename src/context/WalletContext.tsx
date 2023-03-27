import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { Web3BaseProvider } from 'web3-types';
import { getNetwork } from '../utils/network';

const web3Modal = new Web3Modal({
  network: 'goerli',
  theme: 'light',
  cacheProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnect,
      options: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        infuraId: import.meta.env.REACT_APP_INFURA_PROJECT_ID,
      },
    },
  },
});

interface WalletContextInterface {
  web3: Web3 | null;
  account: string | null;
  chainId: string;
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
  account: null,
  chainId: '',
  connect: () => {
    return Promise.resolve(false);
  },
  disconnect: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ensureNetwork: (_network: string) => {
    return Promise.resolve(false);
  },
};

const WalletContext = createContext<WalletContextInterface>(defaultState);

async function getChainId(web3: Web3): Promise<`0x${string}`> {
  const chainId = await web3.eth.getChainId();
  return `0x${chainId.toString(16)}`;
}

export function WalletContextProvider({ children }: PropsWithChildren): JSX.Element {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [chainId, setChainId] = useState('');
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (web3 === null || !web3.currentProvider) return;
    const provider = web3.currentProvider;

    // there is typing error https://github.com/web3/web3.js/issues/5939
    // @ts-ignore
    provider.on('chainChanged', (chainId: unknown) => {
      if (typeof chainId !== 'string') return;
      // TODO: validate if is valid chain ID hex
      setChainId(chainId);
    });
    // @ts-ignore
    provider.on('accountsChanged', (accounts: string[]) => {
      if (!accounts[0]) return;
      setAccount(accounts[0]);
    });

    return () => {
      if (!provider.removeAllListeners) return;
      provider.removeAllListeners('chainChanged');
      provider.removeAllListeners('accountsChanged');
    };
  }, [web3]);

  const connect = async (): Promise<boolean> => {
    if (web3 !== null) return true;

    try {
      const provider = (await web3Modal.connect()) as Web3BaseProvider;

      const instance = new Web3(provider);
      const chainId = await getChainId(instance);
      const accounts = await instance.eth.getAccounts();

      setChainId(chainId);
      setWeb3(instance);
      setAccount(accounts[0]);
      return true;
    } catch (error) {
      console.error(error);
      // TODO: better handling error if connection fails for any reason!
      return false;
    }
  };

  const disconnect = (): void => {
    web3Modal.clearCachedProvider();
    console.log('cleared cached provider');

    if (web3 === null || !web3.currentProvider) return;
    const provider = web3.currentProvider;
    setWeb3(null);

    if (!provider.removeAllListeners) return;
    provider.removeAllListeners('chainChanged');
    provider.removeAllListeners('accountsChanged');
  };

  const ensureNetwork = async (network: string): Promise<boolean> => {
    if (web3 === null || !web3.currentProvider) return false;
    const chainId = await getChainId(web3);

    if (network === chainId) return true;
    const provider = web3.currentProvider;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: network,
          },
        ],
      });
      return true;
    } catch (switchError) {
      console.log(switchError);

      // TODO remove ts ignore;
      // @ts-ignore
      if (switchError.code === 4902 || switchError.code === 4001) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [getNetwork(network)],
        });
        return true;
      }
    }
    return false;
  };

  return (
    <WalletContext.Provider
      value={{ web3, account, chainId, connect, disconnect, ensureNetwork }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = (): WalletContextInterface => useContext(WalletContext);

type EnsuredWeb3WalletContext = Omit<WalletContextInterface, 'web3'> & { web3: Web3 };
export const useEnsuredWallet = (): EnsuredWeb3WalletContext => {
  const wallet = useWallet();
  if (!wallet.web3) throw new Error('Wallet not connected');
  return wallet as EnsuredWeb3WalletContext;
};
