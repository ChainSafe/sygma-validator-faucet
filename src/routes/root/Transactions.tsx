import { useEffect, useState } from 'react';
import { Contract } from 'web3';
import { EventLog } from 'web3-eth-contract';
import { Heading } from '../../components/Heading';
import { useStorage } from '../../context/StorageContext';
import { useEnsuredWallet } from '../../context/WalletContext';
import { bridgeABI } from '../../contracts';
import { getBridgeAddress, getDomainID, NetworksChainID } from '../../utils/network';

interface DepositLogReturnValues {
  data: string;
  depositNonce: bigint;
  destinationDomainID: bigint;
  handlerResponse: string;
  resourceID: string;
  user: string;
}

enum TX_STEPS {
  Initializig,
  SendingFunds,
  Success,
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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      if (steps === TX_STEPS.Initializig) {
        const accounts = await wallet.web3.eth.getAccounts();
        const networkChainId = await wallet.web3.eth.getChainId();

        // @ts-ignore
        const depositAdapterContract: Contract<typeof bridgeABI> =
          new wallet.web3.eth.Contract(
            bridgeABI,
            getBridgeAddress(wallet.web3.utils.toHex(networkChainId) as NetworksChainID),
            {
              from: accounts[0],
              provider: wallet.web3.provider,
            },
          );
        const transactionHash = storage.data.txReceiptHash;

        const logs = await depositAdapterContract.getPastEvents('Deposit');

        logs.forEach((log) => {
          const eventLog = log as EventLog;
          if (
            eventLog.transactionHash?.toLowerCase() === transactionHash?.toLowerCase()
          ) {
            const logReturnValues =
              eventLog.returnValues as unknown as DepositLogReturnValues;
            setLogCompareData({
              originDomainID: getDomainID(networkChainId),
              depositNonce: logReturnValues.depositNonce,
            });
            setSteps(TX_STEPS.SendingFunds);
          }
        });
      }

      // TODO - add retry with .getPastEvents method if user initally reject network change
      if (steps === TX_STEPS.SendingFunds) {
        await wallet.ensureNetwork(NetworksChainID.GOERLI);

        const accounts = await wallet.web3.eth.getAccounts();

        // @ts-ignore
        const goerliBridgeContract: Contract<typeof bridgeABI> =
          new wallet.web3.eth.Contract(
            bridgeABI,
            getBridgeAddress(NetworksChainID.GOERLI),
            {
              from: accounts[0],
              provider: wallet.web3.provider,
            },
          );

        // const events = goerliBridgeContract.events.ProposalExecution();
        // events.on('data', (log) => {
        //   const pastLog = log as EventLog;
        //   if (pastLog.returnValues.depositNonce == logCompareData?.depositNonce && pastLog.returnValues.originDomainID == logCompareData?.originDomainID) {
        //     setSteps(TX_STEPS.Success);
        //   }
        // });
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const interval = setInterval(async () => {
          const pastEvents = await goerliBridgeContract.getPastEvents(
            'ProposalExecution',
          );
          pastEvents.forEach((log) => {
            const pastLog = log as EventLog;
            console.log('log');
            console.log(log);
            if (
              pastLog.returnValues.depositNonce == logCompareData?.depositNonce &&
              pastLog.returnValues.originDomainID == logCompareData?.originDomainID
            ) {
              setSteps(TX_STEPS.Success);
              return () => clearInterval(interval);
            } else {
              return () => clearInterval(interval);
            }
          });
        }, 1000 * 5);
        return () => clearInterval(interval);
      }
    })();
  }, [steps]);

  return (
    <>
      <Heading>Step 4: Transactions</Heading>
      <h1>{steps === 0 && 'Initializig'} </h1>
      <h1>{steps === 1 && 'Sending funds... Please accept network change to Goerli'} </h1>
      <h1>{steps === 2 && 'Success'} </h1>
    </>
  );
}
