import { useEffect, useState } from 'react';
import { Contract } from 'web3';
import { EventLog } from 'web3-eth-contract';
import { Heading } from '../../components/Heading';
import { useStorage } from '../../context/StorageContext';
import { useEnsuredWallet } from '../../context/WalletContext';
import { bridgeABI } from '../../contracts';
import { getBridgeAddress, getDomainID, NetworksChainID } from '../../utils/network';

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
    void (async () => {
      if (steps === TX_STEPS.Initializig) {
        const accounts = await wallet.web3.eth.getAccounts();
        const networkChainId = await wallet.web3.eth.getChainId();

        // @ts-ignore
        const originBridgeContract: Contract<typeof bridgeABI> =
          new wallet.web3.eth.Contract(
            bridgeABI,
            getBridgeAddress(wallet.web3.utils.toHex(networkChainId) as NetworksChainID),
            {
              from: accounts[0],
              provider: wallet.web3.provider,
            },
          );
        const { depositContractCalldata } = storage.data;
        if (!depositContractCalldata) return;
        const interval1 = setInterval(() => {
          void (async () => {
            const logs = await originBridgeContract.getPastEvents('Deposit');
            const log = logs.filter((log) => {
              const eventLog = log as EventLog;
              console.log(eventLog.returnValues.data);
              console.log(depositContractCalldata.pubkey.slice(2));
              console.log(
                (eventLog.returnValues.data as string).includes(
                  depositContractCalldata.pubkey.slice(2),
                ),
              );

              return (eventLog.returnValues.data as string).includes(
                depositContractCalldata.pubkey.slice(2),
              );
            }) as EventLog[];

            if (log.length) {
              setLogCompareData({
                originDomainID: getDomainID(networkChainId),
                depositNonce: log[0].returnValues.depositNonce as bigint,
              });
              setSteps(TX_STEPS.SendingFunds);
            }
          })();
        }, 5000);
        return () => clearInterval(interval1);
      }

      // TODO - improve either with contract.events, or maybe axios.get(`${BEACONCHAIN_URL}/api/v1/validator/${pubkeys.join(',',)}/deposits`)
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

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const interval2 = setInterval(() => {
          void (async () => {
            const pastEvents = await goerliBridgeContract.getPastEvents(
              'ProposalExecution',
            );
            pastEvents.forEach((log) => {
              const pastLog = log as EventLog;
              if (
                pastLog.returnValues.depositNonce == logCompareData?.depositNonce &&
                pastLog.returnValues.originDomainID == logCompareData?.originDomainID
              ) {
                setSteps(TX_STEPS.Success);
              }
            });
          })();
        }, 1000 * 5);
        return () => clearInterval(interval2);
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
