import { useEffect, useState } from 'react';
import { Contract, eth, utils } from 'web3';
import { Heading } from '../../components/Heading';
import ProgressSteps from '../../components/ProgressSteps/ProgressSteps';
import { useStorage } from '../../context/StorageContext';
import { useEnsuredWallet } from '../../context/WalletContext';
import { bridgeABI } from '../../contracts';
import { getBridgeAddress, getDomainID, NetworksChainID } from '../../utils/network';

enum TX_STEPS {
  Initializig,
  SendingFunds,
  Success,
  Faliure,
}

export function Transactions(): JSX.Element {
  const wallet = useEnsuredWallet();
  const storage = useStorage();

  const [steps, setSteps] = useState<TX_STEPS>(TX_STEPS.Initializig);
  const [logCompareData, setLogCompareData] = useState<{
    originDomainID: bigint;
    depositNonce: bigint;
  } | null>(null);

  useEffect(() => {
    void (async () => {
      if (steps === TX_STEPS.Initializig) {
        const bridgeAddress = getBridgeAddress(wallet.chainId as NetworksChainID);
        const { depositContractCalldata } = storage.data;

        if (!depositContractCalldata) return;
        const originBridgeContract = new wallet.web3.eth.Contract(
          bridgeABI,
          bridgeAddress,
        );

        const nonce: bigint = await new Promise((resolve) => {
          const originInterval = setInterval(() => {
            void originBridgeContract.getPastEvents('Deposit').then((logs) => {
              const filteredLog = logs.filter((log) => {
                if (typeof log === 'string' || typeof log.returnValues.data !== 'string')
                  return false;
                return log.returnValues.data.includes(depositContractCalldata.pubkey);
              }) as eth.contract.EventLog[];
              if (filteredLog.length)
                resolve(filteredLog[0].returnValues.depositNonce as bigint);
              clearInterval(originInterval);
            });
          }, 1000 * 5);
        });

        setLogCompareData({
          originDomainID: getDomainID(wallet.chainId),
          depositNonce: nonce,
        });
        setSteps(TX_STEPS.SendingFunds);
      }

      if (steps === TX_STEPS.SendingFunds) {
        await wallet.ensureNetwork(NetworksChainID.GOERLI);

        const goerliBridgeContract: Contract<typeof bridgeABI> =
          new wallet.web3.eth.Contract(
            bridgeABI,
            getBridgeAddress(NetworksChainID.GOERLI),
          );

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const successInterval = setInterval(() => {
          void (async () => {
            const pastEvents = await goerliBridgeContract.getPastEvents(
              'ProposalExecution',
            );
            pastEvents.forEach((log) => {
              const pastLog = log as eth.contract.EventLog;
              const logDepositNonce = utils.toBigInt(
                (pastLog.returnValues.depositNonce as string).toString(),
              );
              const sentTxDepositNonce = utils.toBigInt(
                logCompareData?.depositNonce.toString(),
              );
              const logOriginDomainID = utils.toBigInt(
                (pastLog.returnValues.originDomainID as string).toString(),
              );
              const sentTxOriginDomainID = utils.toBigInt(
                logCompareData?.originDomainID.toString(),
              );
              if (
                logDepositNonce == sentTxDepositNonce &&
                logOriginDomainID == sentTxOriginDomainID
              ) {
                setSteps(TX_STEPS.Success);
                clearInterval(successInterval);
                clearInterval(failedInterval);
              }
            });
          })();
        }, 1000 * 5);

        const failedInterval = setInterval(() => {
          void (async () => {
            const pastEvents = await goerliBridgeContract.getPastEvents(
              'FailedHandlerExecution',
            );
            pastEvents.forEach((log) => {
              const pastLog = log as eth.contract.EventLog;
              if (
                pastLog.returnValues.depositNonce == logCompareData?.depositNonce &&
                pastLog.returnValues.originDomainID == logCompareData?.originDomainID
              ) {
                setSteps(TX_STEPS.Faliure);
                clearInterval(failedInterval);
                clearInterval(successInterval);
              }
            });
          })();
        }, 1000 * 5);
      }
    })();
  }, [steps]);

  return (
    <>
      <Heading>Step 4: Transactions</Heading>
      {steps < TX_STEPS.Faliure ? (
        <ProgressSteps step={steps} />
      ) : (
        <p>Could not launch a validator on Goerli</p>
      )}
    </>
  );
}
