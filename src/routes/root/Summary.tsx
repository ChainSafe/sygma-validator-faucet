import { useNavigate } from 'react-router-dom';
import Contract from 'web3-eth-contract';
import { useState } from 'react';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useEnsuredWallet } from '../../context/WalletContext';
import { Networks, getNetwork } from '../../utils/network';
import { DepositAdapterABI, DEPOSIT_ADAPTER_ORIGIN } from '../../contracts';
import { DepositDataJSON } from '../../components/JSONDropzone/validation';
import { useStorage } from '../../context/StorageContext';

export function Summary(): JSX.Element {
  const wallet = useEnsuredWallet();
  const [network, setNetwork] = useState<Networks | null>(null);
  const [errorMsg, seteErrorMsg] = useState<string>();

  const storage = useStorage();

  // mocks
  const value = '{value}';
  const currency = '{currency}';

  const navigate = useNavigate();

  //TODO - improve code
  const handleBridgeClick = async (): Promise<void> => {
    console.log(!network || !storage.data.json);
    if (!network || !storage.data.json) return;

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
      // @ts-ignore
      ['bytes', 'bytes', 'bytes', 'bytes32'],
      [
        `0x${depositDataJSON.pubkey}`,
        `0x${depositDataJSON.withdrawal_credentials}`,
        `0x${depositDataJSON.signature}`,
        `0x${depositDataJSON.deposit_data_root}`,
      ],
    );
    try {
      const depositMethod = depositAdapterContract.methods.deposit(
        1,
        depositContractCalldata,
        '0x',
      );

      const gas = await depositMethod.estimateGas({ value: '3201000000000000000' });
      const result = await depositMethod.send({
        from: accounts[0],
        gas: gas.toString(),
        value: '3201000000000000000',
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

  const handleChooseNetwork = async (network: Networks): Promise<void> => {
    const isSwitched = await wallet.ensureNetwork(network);
    if (isSwitched) setNetwork(network);
    else seteErrorMsg('To ensure selected network accept network switch prompt.');
  };

  return (
    <>
      <Heading>Step 3: Summary</Heading>
      Chose network:
      {/* eslint-disable @typescript-eslint/no-misused-promises */}
      <Button
        onClick={(): Promise<void> => handleChooseNetwork(Networks.MOONBASE)}
        variant={'primary'}
      >
        MOONBASE
      </Button>
      <Button
        variant={'primary'}
        onClick={(): Promise<void> => handleChooseNetwork(Networks.MUMBAI)}
      >
        MUMBAI
      </Button>
      {errorMsg && <p>{errorMsg}</p>}
      <div>
        You’re about to launch a validator on Goerli with {value} {currency} from{' '}
        {network && getNetwork(network).chainName}. Is that correct?
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      {network && (
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
