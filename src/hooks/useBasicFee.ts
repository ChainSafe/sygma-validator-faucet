import { useEffect, useState } from 'react';
import { utils } from 'web3';
import { useEnsuredWallet } from '../context/WalletContext';
import { BasicFeeHandlerABI } from '../contracts';
import { useSygmaSDK } from './useSygma';

const BRIDGE_FEE = '0.001';
const bridgeFeeWei = utils.toWei(BRIDGE_FEE, 'ether');
const defaultFee = utils.toBigInt(bridgeFeeWei);

export function useBasicFee(): [bigint] {
  const wallet = useEnsuredWallet();
  const { basicFeeContractAddress } = useSygmaSDK();

  const [fee, setFee] = useState(defaultFee);

  useEffect(() => {
    if (!basicFeeContractAddress) return;

    new wallet.web3.eth.Contract(BasicFeeHandlerABI, basicFeeContractAddress).methods
      ._fee()
      .call()
      .then((result) => {
        setFee(utils.toBigInt(result.toString()));
      })
      .catch((error) => {
        console.error('useBasicFee error', error);
        setFee(defaultFee);
      });
  }, [wallet.web3, wallet.chainId]);

  return [fee];
}
