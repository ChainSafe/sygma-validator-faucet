import { useNavigate } from 'react-router-dom';
import Contract from 'web3-eth-contract';
import { useEffect, useState } from 'react';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useEnsuredWallet } from '../../context/WalletContext';
import { NetworksChainID, getNetwork } from '../../utils/network';
import { DepositAdapterABI, DEPOSIT_ADAPTER_ORIGIN } from '../../contracts';
import { DepositDataJSON } from '../../components/JSONDropzone/validation';
import { useStorage } from '../../context/StorageContext';

// mocks
const value = '{value}';
const currency = '{currency}';

export function Summary(): JSX.Element {
  const wallet = useEnsuredWallet();
  const storage = useStorage();
  const navigate = useNavigate();

  const [selectedNetwork, setSelectedNetwork] = useState<NetworksChainID | null>(null);
  const [manuallyChaingedNetwork, setManuallyChaingedNetwork] = useState<string | null>(
    null,
  );

  const [errorMsg, setErrorMsg] = useState<string>();

  useEffect(() => {
    if (wallet.web3.currentProvider) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const provider = wallet.web3.currentProvider as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      provider.on('chainChanged', (chainId: number) => {
        setManuallyChaingedNetwork(chainId.toString());
      });
    }
  }, [wallet.web3]);

  //TODO - improve code
  const handleBridgeClick = async (): Promise<void> => {
    if (!selectedNetwork || !storage.data.json) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const accounts = await wallet.web3.eth.getAccounts();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // @ts-ignore
    const depositAdapterContract: Contract<typeof DepositAdapterABI> =
      new wallet.web3.eth.Contract(DepositAdapterABI, DEPOSIT_ADAPTER_ORIGIN, {
        from: accounts[0],
        provider: wallet.web3.provider,
      });
    const depositDataJSON: DepositDataJSON = storage.data.json;

    const depositContractCalldata = wallet.web3.eth.abi.encodeParameters(
      ['bytes', 'bytes', 'bytes', 'bytes32'],
      [
        `0x${depositDataJSON.pubkey}`,
        `0x${depositDataJSON.withdrawal_credentials}`,
        `0x${depositDataJSON.signature}`,
        `0x${depositDataJSON.deposit_data_root}`,
      ],
    );

    //check for manually chainged network before calling contract method
    if (manuallyChaingedNetwork && manuallyChaingedNetwork !== selectedNetwork) {
      setSelectedNetwork(null),
        setErrorMsg(
          'Selected network does not match network in provider, select network again before contract call',
        );
      return;
    }

    try {
      //read deposit fee from contract
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const depositFee = await depositAdapterContract.methods._depositFee().call();
      const depositFeeBigint = wallet.web3.utils.toBigInt(depositFee);

      const BRIDGE_FEE = '0.001';
      const bridgeFeeWei = wallet.web3.utils.toWei(BRIDGE_FEE, 'ether');
      const bridgeFeeBigint = wallet.web3.utils.toBigInt(bridgeFeeWei);

      const value = depositFeeBigint + bridgeFeeBigint;

      const depositMethod = depositAdapterContract.methods.deposit(
        1,
        depositContractCalldata,
        '0x',
      );

      const gas = await depositMethod.estimateGas({ value: value.toString() });
      const result = await depositMethod.send({
        from: accounts[0],
        gas: gas.toString(),
        value: value.toString(),
      });
      
      console.log(result);
      navigate('/transactions');
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  const handleBackClick = (): void => {
    wallet.disconnect();
  };

  const handleChooseNetwork = async (network: NetworksChainID): Promise<void> => {
    const isSwitched = await wallet.ensureNetwork(network);
    if (isSwitched) setSelectedNetwork(network);
    else setErrorMsg('To ensure selected network accept network switch prompt.');
  };

  return (
    <>
      <Heading>Step 3: Summary</Heading>
      Chose network:
      <Button
        variant={'primary'}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={(): Promise<void> => handleChooseNetwork(NetworksChainID.MOONBASE)}
      >
        MOONBASE {selectedNetwork === NetworksChainID.MOONBASE && 'is selected'}
      </Button>
      <Button
        variant={'primary'}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={(): Promise<void> => handleChooseNetwork(NetworksChainID.MUMBAI)}
      >
        MUMBAI {selectedNetwork === NetworksChainID.MUMBAI && 'is selected'}
      </Button>
      {errorMsg && <p>{errorMsg}</p>}
      <div>
        You’re about to launch a validator on Goerli with {value} {currency} from{' '}
        {selectedNetwork && getNetwork(selectedNetwork).chainName}. Is that correct?
      </div>
      {selectedNetwork && (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <Button variant={'primary'} onClick={handleBridgeClick}>
          Bridge Funds
        </Button>
      )}
      <Button variant={'primary'} onClick={handleBackClick}>
        Back
      </Button>
    </>
  );
}
