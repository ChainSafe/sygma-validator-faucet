import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useWallet } from '../../context/WalletContext';
import { InfoBox } from '../../components/lib';

export function ConnectWallet(): JSX.Element {
  const wallet = useWallet();
  const handleConnectClick = (): void => {
    void wallet.connect();
  };

  if (!wallet.web3)
    return (
      <Wrapper>
        <Heading>Step 2: Connect Wallet</Heading>
        <InfoBoxStyled>
          Connect to the testnet you’d like to launch your Holesky validator from.
        </InfoBoxStyled>
        <Button variant="primary" onClick={handleConnectClick}>
          Connect Wallet
        </Button>
      </Wrapper>
    );

  return <Navigate to="/summary" />;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  button {
    align-self: center;
  }
`;

const InfoBoxStyled = styled(InfoBox)`
  margin: 126px auto 16px auto;
`;
