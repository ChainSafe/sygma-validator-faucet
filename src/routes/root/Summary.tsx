import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useEnsuredWallet } from '../../context/WalletContext';
import { NetworksChainID, getNetwork } from '../../utils/network';
import { DepositAdapterABI, DEPOSIT_ADAPTER_ORIGIN } from '../../contracts';
import AccountInfo from '../../components/AccountInfo/AccountInfo';
import { InfoBox } from '../../components/lib';
import { DepositDataJSON } from '../../components/JSONDropzone/validation';
import { useStorage } from '../../context/StorageContext';
import { ButtonStyled } from '../../components/Button/Button';
import { useBasicFee } from '../../hooks/useBasicFee';

export function Summary(): JSX.Element {
  const wallet = useEnsuredWallet();
  const storage = useStorage();
  const navigate = useNavigate();
  const [basicFee] = useBasicFee();

  const [selectedNetwork, setSelectedNetwork] = useState<NetworksChainID | null>(null);

  const [errorMsg, setErrorMsg] = useState<string>();

  //TODO - improve code
  const handleBridgeClick = async (): Promise<void> => {
    if (!selectedNetwork || !storage.data.json) return;

    const accounts = await wallet.web3.eth.getAccounts();
    const depositAdapterContract = new wallet.web3.eth.Contract(
      DepositAdapterABI,
      DEPOSIT_ADAPTER_ORIGIN,
      {
        from: accounts[0],
        provider: wallet.web3.provider,
      },
    );
    const {
      pubkey,
      withdrawal_credentials,
      signature,
      deposit_data_root,
    }: DepositDataJSON = storage.data.json;

    const depositContractCalldata = wallet.web3.eth.abi.encodeParameters(
      ['bytes', 'bytes', 'bytes', 'bytes32'],
      [
        `0x${pubkey}`,
        `0x${withdrawal_credentials}`,
        `0x${signature}`,
        `0x${deposit_data_root}`,
      ],
    );

    storage.update({
      depositContractCalldata: {
        pubkey,
        withdrawal_credentials,
        signature,
        deposit_data_root,
      },
    });

    //check for manually chainged network before calling contract method
    if (wallet.chainId !== selectedNetwork) {
      const isSwitched = await wallet.ensureNetwork(selectedNetwork);
      if (!isSwitched) {
        setSelectedNetwork(null);
        setErrorMsg(
          'Selected network does not match network in provider, select network again before contract call',
        );
        return;
      }
    }

    try {
      //read deposit fee from contract
      const depositFee = await depositAdapterContract.methods._depositFee().call();
      const depositFeeBigint = wallet.web3.utils.toBigInt(depositFee.toString());

      const value = depositFeeBigint + basicFee;

      const depositMethod = depositAdapterContract.methods.deposit(
        1,
        depositContractCalldata,
        '0x',
      );

      const gas = await depositMethod.estimateGas({ value: value.toString() });
      await depositMethod.send({
        from: accounts[0],
        gas: gas.toString(),
        value: value.toString(),
      });
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
      <Header>
        <Heading>Step 3: Summary</Heading>
        <AccountInfo />
      </Header>
      <Wrapper>
        <h2>Chose network:</h2>
        <ButtonWrapper>
          <ButtonSelectNetwork
            onClick={(): void => void handleChooseNetwork(NetworksChainID.MOONBASE)}
            variant={
              selectedNetwork === NetworksChainID.MOONBASE ? 'primary' : 'secondary'
            }
          >
            MOONBASE
          </ButtonSelectNetwork>
          <ButtonSelectNetwork
            variant={selectedNetwork === NetworksChainID.MUMBAI ? 'primary' : 'secondary'}
            onClick={(): void => void handleChooseNetwork(NetworksChainID.MUMBAI)}
          >
            MUMBAI
          </ButtonSelectNetwork>
        </ButtonWrapper>
        {errorMsg && <p>{errorMsg}</p>}
        {selectedNetwork && (
          <InfoBox>
            You’re about to launch a validator on Goerli{' '}
            <b>{getNetwork(selectedNetwork).chainName}</b>. Is that correct?
          </InfoBox>
        )}
        <ButtonWrapper>
          {selectedNetwork && (
            <Button variant="primary" onClick={(): void => void handleBridgeClick()}>
              Bridge Funds
            </Button>
          )}
          <Button variant="secondary" onClick={handleBackClick}>
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

const ButtonSelectNetwork = styled(ButtonStyled)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 5px 32px;

  img {
    position: absolute;
    right: 8px;
    top: 9px;
  }
`;
