import { useEffect, useState } from 'react';
import { utils } from 'web3';
import { useEnsuredWallet } from '../context/WalletContext';
import {
  BasicFeeHandlerABI,
  MOONBASE_BASIC_FEE_ADDRESS,
  MUMBAI_BASIC_FEE_ADDRESS,
} from '../contracts';

const BRIDGE_FEE = '0.001';
const bridgeFeeWei = utils.toWei(BRIDGE_FEE, 'ether');
const defaultFee = utils.toBigInt(bridgeFeeWei);

const getAddressByChainID = (chainID: string): string | false => {
  switch (chainID) {
    case '0x507':
      return MOONBASE_BASIC_FEE_ADDRESS;
    case '0x13881':
      return MUMBAI_BASIC_FEE_ADDRESS;
    default:
      return false;
  }
};

export function useBasicFee(): [bigint] {
  const wallet = useEnsuredWallet();

  const [fee, setFee] = useState(defaultFee);

  useEffect(() => {
    const address = getAddressByChainID(wallet.chainId);
    if (!address) return;

    new wallet.web3.eth.Contract(BasicFeeHandlerABI, address).methods
      ._fee()
      .call()
      .then((result) => {
        setFee(utils.toBigInt(result));
      })
      .catch((error) => {
        console.error('useBasicFee error', error);
        setFee(defaultFee);
      });
  }, [wallet.web3, wallet.chainId]);

  return [fee];
}
