import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import styled from 'styled-components';
import { Heading } from '../../components/Heading';
import { JSONDropzone } from '../../components/JSONDropzone';
import { Button } from '../../components/Button';
import { DepositKeyInterface } from '../../components/JSONDropzone/validation';
import { FlowActionTypes, FlowContext } from '../../context/FlowContext';
import { useStorage } from '../../context/StorageContext';

export function Upload(): JSX.Element {
  const navigate = useNavigate();
  const [, dispatch] = useContext(FlowContext);
  const storage = useStorage();

  const handleContinueClick = (): void => {
    navigate('/connect');
  };

  const dispatchJSON = (json: DepositKeyInterface): void => {
    dispatch({ type: FlowActionTypes.SET_DEPOSIT_JSON, payload: json });
    storage.update({ json });
  };

  const dispatchFileName = (fileName: string): void =>
    dispatch({ type: FlowActionTypes.SET_FILE_NAME, payload: fileName });

  return (
    <Wrapper>
      <Heading>Step 1: Upload Deposit Data</Heading>
      <InfoBox>
        Have you generated your deposit data json file? If not,{' '}
        <a href="https://goerli.launchpad.ethereum.org/en/overview" target="_blank">
          you can do so here.
        </a>
        <br />
        Make sure to set "Withdrawal address" to
        <b>
          {' '}
          {import.meta.env.REACT_APP_DESTINATION_CONTRACT ??
            '0xbdeebc18cbe64a09e4da0bc82cffb6ac5261f9a8'}
        </b>
        . We are only funding validators that will return funds to our contract in case of
        voluntary exit!
      </InfoBox>
      <DropboxSection>
        <p>
          Upload deposit_data.json, find it in your /staking-deposit-cli/validator_keys
          directory.
        </p>
        <JSONDropzone JSONReady={dispatchJSON} fileNameReady={dispatchFileName} />
      </DropboxSection>
      <Button
        variant="secondary"
        disabled={!storage.data.json}
        onClick={handleContinueClick}
      >
        Continue
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    margin-bottom: 22px;
  }

  button {
    align-self: center;
  }
`;

const InfoBox = styled.div`
  padding: 20px;
  margin-bottom: 47px;
  background: var(--blue-500);
  line-height: 26px;
  font-weight: 400;
  text-align: center;
  color: var(--grey-400);

  @media (min-width: 1366px) {
    padding: 20px 20%;
  }

  a {
    text-decoration: underline;
    color: var(--grey-400);
  }
`;

const DropboxSection = styled.section`
  color: var(--text-white);
  font-weight: 400;
  font-size: 1rem;
`;
