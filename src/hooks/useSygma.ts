import { useContext, useEffect, useState } from 'react';
import {
  Config,
  Environment,
  EthereumConfig,
  FeeHandlerType,
} from '@buildwithsygma/sygma-sdk-core';
import { utils } from 'web3';
import { useEnsuredWallet } from '../context/WalletContext';
import { useStorage } from '../context/StorageContext';
import { FlowActionTypes, FlowContext } from '../context/FlowContext';

interface SygmaSDK {
  basicFeeContractAddress: string | null;
  originBridgeAddress: string | null;
  depositTxHashCallback: (txHash: string) => void;
}

export function useSygmaSDK(): SygmaSDK {
  const wallet = useEnsuredWallet();
  const storage = useStorage();
  const [, dispatch] = useContext(FlowContext);

  const [basicFeeContractAddress, setBasicFeeContractAddress] = useState<string | null>(
    null,
  );
  const [originBridgeAddress, setOriginBridgeAddress] = useState<string | null>(null);

  const depositTxHashCallback = (depositTxHash: string): void => {
    dispatch({ type: FlowActionTypes.DEPOSIT_COMPLETE, payload: true });
    storage.update({ depositTxHash });
  };

  useEffect(() => {
    void (async () => {
      try {
        const sygmaConfig = new Config();
        await sygmaConfig.init(
          utils.hexToNumber(wallet.chainId) as number,
          Environment.TESTNET,
        );
        const sourceDomainConfig = sygmaConfig.getSourceDomainConfig() as EthereumConfig;

        const basicFeeHandler = sourceDomainConfig.feeHandlers.find(
          (e) => e.type === FeeHandlerType.BASIC,
        );
        if (!basicFeeHandler || !sourceDomainConfig)
          throw new Error('Failed to get Sygma contract addresses');
        setBasicFeeContractAddress(basicFeeHandler.address);
        setOriginBridgeAddress(sourceDomainConfig.bridge);
      } catch (e) {
        console.log('Failed to init sygma config.');
        throw e;
      }
    })();
  }, [wallet.web3]);

  return {
    basicFeeContractAddress,
    originBridgeAddress,
    depositTxHashCallback,
  };
}
