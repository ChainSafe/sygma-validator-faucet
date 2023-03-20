import { useEffect } from 'react';
import { Heading } from '../../components/Heading';
import { useStorage } from '../../context/StorageContext';
import { useEnsuredWallet, useWallet } from '../../context/WalletContext';
import { bridgeABI, BRIDGE_ADDRESS_GOERLI, BRIDGE_ADDRESS_MOONBASE, BRIDGE_ADDRESS_MUMBAI } from "../../contracts"
import Contract from 'web3-eth-contract';
import { NetworksChainID } from '../../utils/network';

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


export function Transactions(): JSX.Element {
  const wallet = useEnsuredWallet()
  const storage = useStorage()

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

      const depositEvent = depositAdapterContract.events.Deposit()
      console.log("depositEvent")
      console.log(depositEvent)

      depositEvent.on('connected', (event: any) => {
        console.log("connected")
        console.log(event);
      }
      )
      depositEvent.on('data', (event: any) => {
        console.log('data');
        console.log(event);
      })
      depositEvent.on('error', (event: any) => {
        console.log('error');
        console.log(event);
      })
      depositEvent.on('changed', (event: any) => {
        console.log('changed');
        console.log(event);
      })
    })()
  }, [])

  return (
    <>
      <Heading>Step 4: Transactions</Heading>
    </>
  );
}
