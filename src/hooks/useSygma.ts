import { useCallback, useEffect, useState } from 'react';
import {
  Config,
  Environment,
  EthereumConfig,
  FeeHandlerType,
  TransferStatusResponse,
  getTransferStatusData,
} from '@buildwithsygma/sygma-sdk-core';
import { utils } from 'web3';
import { useEnsuredWallet } from '../context/WalletContext';
import { getNetwork } from '../utils/network';

interface SygmaSDK {
  basicFeeContractAddress: string | null;
  originBridgeAddress: string | null;
  depositTxHashCallback: (txHash: string) => void;
  depositUrl: string | null;
  transferStatus: TransferStatusResponse | null;
}

export function useSygmaSDK(): SygmaSDK {
  const wallet = useEnsuredWallet();
  const [basicFeeContractAddress, setBasicFeeContractAddress] = useState<string | null>(
    null,
  );
  const [originBridgeAddress, setOriginBridgeAddress] = useState<string | null>(null);
  const [depositUrl, setDepositUrl] = useState<string | null>(null);
  const [transferStatus, setTransferStatus] = useState<TransferStatusResponse | null>(
    null,
  );

  useEffect(() => {
    void (async () => {
      try {
        const sygmaConfig = new Config();
        await sygmaConfig.init(
          utils.hexToNumber(wallet.chainId) as number,
          Environment.TESTNET,
        );
        const sourceDomainConfig = sygmaConfig.getSourceDomainConfig() as EthereumConfig;
        console.log('sygmaConfig');
        console.log(sygmaConfig);
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

  const depositTxHashCallback = useCallback((txHash: string) => {
    let controller: AbortController;
    let interval: number | undefined;
    setDepositUrl(`${getNetwork(wallet.chainId).blockExplorerUrl}tx/${txHash}`);
    try {
      interval = setInterval(() => {
        controller = new AbortController();
        void getTransferStatusData(Environment.TESTNET, txHash).then((transferStatus) => {
          console.log(transferStatus);
          setTransferStatus(transferStatus);
        });
      }, 2000) as unknown as number;
    } catch (e) {
      setTransferStatus(null);
      throw e;
    }

    return () => {
      if (interval) clearInterval(interval);
      if (controller) controller.abort();
    };
  }, []);

  return {
    basicFeeContractAddress,
    originBridgeAddress,
    depositTxHashCallback,
    depositUrl,
    transferStatus,
  };
}
