import { useEffect, useState } from 'react';
import { Heading } from '../../components/Heading';
import { useStorage } from '../../context/StorageContext';
import { useEnsuredWallet, useWallet } from '../../context/WalletContext';
import { bridgeABI, BRIDGE_ADDRESS_GOERLI, BRIDGE_ADDRESS_MOONBASE, BRIDGE_ADDRESS_MUMBAI } from "../../contracts"
import Contract, { EventLog } from 'web3-eth-contract';
import { getNetwork, NetworksChainID } from '../../utils/network';
import { forEach } from 'lodash';

const getBridgeAddress = (networkChainId: NetworksChainID) => {
  switch (networkChainId) {
    case NetworksChainID.GOERLI:
      return BRIDGE_ADDRESS_GOERLI;
      break;
    case NetworksChainID.MOONBASE:
      return BRIDGE_ADDRESS_MOONBASE;
      break;
    case NetworksChainID.MUMBAI:
      return BRIDGE_ADDRESS_MUMBAI;
      break;
    default:
      throw new Error(`Bridge contract not available for networkChainId: ${networkChainId}`)
  }
}

interface DepositLogReturnValues {
  data: string;
  depositNonce: bigint;
  destinationDomainID: bigint;
  handlerResponse: string;
  resourceID: string;
  user: string;
}

export function Transactions(): JSX.Element {
  const wallet = useEnsuredWallet()
  const storage = useStorage()

  const [steps, setSteps] = useState(0);
  const [logCompareData, setLogCompareData] = useState<{ originDomainID: bigint, depositNonce: bigint } | null>(null);

  useEffect(() => {
    (async () => {

      const accounts = await wallet.web3.eth.getAccounts();
      const networkChainId = await wallet.web3.eth.getChainId();
      console.log(networkChainId)
      // @ts-ignore
      const depositAdapterContract: Contract<typeof bridgeABI> =
        new wallet.web3.eth.Contract(bridgeABI, getBridgeAddress(wallet.web3.utils.toHex(networkChainId) as NetworksChainID), {
          from: accounts[0],
          provider: wallet.web3.provider,
        });

      const transactionHash = storage.data.txReceipt?.transactionHash
      const logs = await depositAdapterContract.getPastEvents("Deposit");
      logs.forEach((log) => {
        const eventLog = log as EventLog
        console.log("DepositLog")
        console.log(log)
        if (eventLog.transactionHash === transactionHash) {
          const logReturnValues = eventLog.returnValues as unknown as DepositLogReturnValues;
          console.log(logReturnValues)
          setLogCompareData({ originDomainID: logReturnValues.destinationDomainID, depositNonce: logReturnValues.depositNonce })
          setSteps(steps+1);
        }
      })
      console.log(logs)

      // TODO - add retry with .getPastEvents method if user initally reject network change
      try{
        if(steps === 1) {
          const isSwitched = wallet.ensureNetwork(NetworksChainID.GOERLI);
          if(!isSwitched) {
            throw new Error("swith to goerli")
          }
        }
        // @ts-ignore
        const goerliBridgeContract: Contract<typeof bridgeABI> =
        new wallet.web3.eth.Contract(bridgeABI, getBridgeAddress(NetworksChainID.GOERLI), {
          from: accounts[0],
          provider: wallet.web3.provider,
        });

        const events = goerliBridgeContract.events.ProposalExecution()
        events.on("data", (eventLog) => {
          console.log("ProposalExecution log")
          console.log(eventLog)
          const logData = (eventLog.data) as unknown as {originDomainID: bigint, depositNonce: bigint}

          if(logData == logCompareData) {
            console.log("success")
            setSteps(steps + 1 )
          }
        })
      }catch(e){
        console.log(e)
        throw e
      }
      


    })()
  }, [])

  return (
    <>
      <Heading>Step 4: Transactions</Heading>
      <h1>{steps === 0} Initializig</h1>
      <h1>{steps === 1} Sending funds... Please accept network change to Goerli</h1>
      <h1>{steps === 2} Success!</h1>
    </>
  );
}
