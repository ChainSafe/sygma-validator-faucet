import React, { useState } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { DemoAbi as Abi } from '../../abi';
import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';

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

export function ConnectWallet(): JSX.Element {
  const [web3, setWeb3] = useState<Web3 | null>(null);

  const onConnect = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const provider = await web3Modal.connect();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const web3 = new Web3(provider);
    setWeb3(web3);
  };

  const disconnectWeb3Modal = (): void => {
    web3Modal.clearCachedProvider();
    console.log('cleared cached provider');
  };

  const callContractMethod = (): void => {
    if (web3) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const contract: Contract<typeof Abi> = new web3.eth.Contract(
        Abi,
        '0x9d15e18Aed0568FB829b857BA1acd1ac8fd68474',
      );
    }
  };

  return (
    <>
      <button onClick={onConnect}>+</button>
      <button onClick={disconnectWeb3Modal}>-</button>

      <button onClick={callContractMethod}>Call contract method</button>
    </>
  );
}
