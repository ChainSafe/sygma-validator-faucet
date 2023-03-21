import { useNavigate } from 'react-router-dom';
import Contract from 'web3-eth-contract';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useEnsuredWallet } from '../../context/WalletContext';
import { getNetwork, Networks } from '../../utils/network';
import AccountInfo from '../../components/AccountInfo/AccountInfo';
import { InfoBox } from '../../components/lib';
import { DEPOSIT_ADAPTER_ORIGIN, DepositAdapterABI } from '../../contracts';
import { DepositDataJSON } from '../../components/JSONDropzone/validation';
import { useStorage } from '../../context/StorageContext';
import { useBasicFee } from '../../hooks/useBasicFee';

// mocks
const value = '{value}';
const currency = '{currency}';

export function Summary(): JSX.Element {
  const wallet = useEnsuredWallet();
  const storage = useStorage();
  const navigate = useNavigate();
  const [basicFee] = useBasicFee();

  const [selectedNetwork, setSelectedNetwork] = useState<Networks | null>(null);

  const [errorMsg, setErrorMsg] = useState<string>();

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
      // @ts-ignore
      ['bytes', 'bytes', 'bytes', 'bytes32'],
      [
        `0x${depositDataJSON.pubkey}`,
        `0x${depositDataJSON.withdrawal_credentials}`,
        `0x${depositDataJSON.signature}`,
        `0x${depositDataJSON.deposit_data_root}`,
      ],
    );

    //check for manually chainged network before calling contract method
    if (wallet.chainId !== selectedNetwork) {
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

      const value = depositFeeBigint + basicFee;

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

  const handleChooseNetwork = async (network: Networks): Promise<void> => {
    const isSwitched = await wallet.ensureNetwork(network);
    if (isSwitched) setSelectedNetwork(network);
    else setErrorMsg('To ensure selected network accept network switch prompt.');
  };

  return (
    <>
      <Header>
        <Heading>Step 3: Summary</Heading>
        <AccountInfo />
      </Header>
      <Wrapper>
        <h2>Chose network:</h2>
        {/* eslint-disable @typescript-eslint/no-misused-promises */}
        <ButtonWrapper>
          <Button
            onClick={(): Promise<void> => handleChooseNetwork(Networks.MOONBASE)}
            variant={'primary'}
          >
            MOONBASE {selectedNetwork === Networks.MOONBASE && 'is selected'}
          </Button>
          <Button
            variant={'primary'}
            onClick={(): Promise<void> => handleChooseNetwork(Networks.MUMBAI)}
          >
            MUMBAI {selectedNetwork === Networks.MUMBAI && 'is selected'}
          </Button>
        </ButtonWrapper>
        {errorMsg && <p>{errorMsg}</p>}
        {selectedNetwork && (
          <InfoBox>
            You’re about to launch a validator on Goerli with {value} {currency} from{' '}
            <b>{getNetwork(selectedNetwork).chainName}</b>. Is that correct?
          </InfoBox>
        )}
        <ButtonWrapper>
          {selectedNetwork && (
            <Button variant={'primary'} onClick={handleBridgeClick}>
              Bridge Funds
            </Button>
          )}
          <Button variant={'secondary'} onClick={handleBackClick}>
            Back
          </Button>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  margin: 36px auto;
  display: flex;
  flex-direction: column;
  max-width: 356px;
  text-align: center;

  button {
    align-self: center;
  }
`;

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ButtonWrapper = styled.div`
  margin-top: 21px;
  display: flex;
  justify-content: space-evenly;
`;
