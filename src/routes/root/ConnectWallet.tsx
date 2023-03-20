import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useWallet } from '../../context/WalletContext';
import styled from 'styled-components';

export function ConnectWallet(): JSX.Element {
  const wallet = useWallet();
  const handleConnectClick = (): void => {
    void wallet.connect();
  };

  if (!wallet.web3)
    return (
      <Wrapper>
        <Heading>Step 2: Connect Wallet</Heading>
        <InfoText>
          Connect to the testnet you’d like to launch your Goerli validator from.
        </InfoText>
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

const InfoText = styled.section`
  text-align: center;
  font-size: 1.125rem;
  margin: 126px auto 16px auto;
  max-width: 392px;
  color: #c2cceb;
`;
