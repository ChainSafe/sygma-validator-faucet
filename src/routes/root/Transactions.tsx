import { useContext, useEffect, useState } from 'react';
import {
  Environment,
  TransferStatusResponse,
  getTransferStatusData,
} from '@buildwithsygma/sygma-sdk-core';
import { Heading } from '../../components/Heading';
import ProgressSteps from '../../components/ProgressSteps/ProgressSteps';
import { useStorage } from '../../context/StorageContext';
import { getNetwork } from '../../utils/network';
import { useEnsuredWallet } from '../../context/WalletContext';
import { FlowContext } from '../../context/FlowContext';

export function Transactions(): JSX.Element {
  const { data, update } = useStorage();
  const wallet = useEnsuredWallet();
  const [{ depositComplete }] = useContext(FlowContext);

  const [transferStatusData, setTransferStatusData] = useState<TransferStatusResponse>();
  const [depositTxHash, setDepositTxHash] = useState<string | null>(null);

  const depositUrl = `${getNetwork(wallet.chainId).blockExplorerUrl}tx/${
    depositTxHash ?? ''
  }`;

  useEffect(() => {
    if (data.depositTxHash) {
      setDepositTxHash(data.depositTxHash);
    }
  }, [data.depositTxHash, depositComplete]);

  useEffect(() => {
    let controller: AbortController;
    let interval: number | undefined;
    if (!depositTxHash) return;
    // eslint-disable-next-line
    interval = setInterval(() => {
      controller = new AbortController();
      void getTransferStatusData(Environment.TESTNET, depositTxHash).then(
        (transferStatus) => {
          update({ transferStatus });
          setTransferStatusData(transferStatus);
          if (transferStatus.status === 'executed') {
            clearInterval(interval);
            controller.abort();
          }
        },
      );
    }, 2000) as unknown as number;

    return () => {
      if (interval) clearInterval(interval);
      if (controller) controller.abort();
    };
  }, [depositTxHash]);

  return (
    <>
      <Heading>Step 4: Transactions</Heading>
      <ProgressSteps transferStatus={transferStatusData} depositUrl={depositUrl} />
    </>
  );
}
