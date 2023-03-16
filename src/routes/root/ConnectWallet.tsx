import { Navigate } from 'react-router-dom';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useWallet } from '../../context/WalletContext';

export function ConnectWallet(): JSX.Element {
  const wallet = useWallet();

  const handleConnectClick = (): void => {
    console.log('click on connect');
    void wallet.connect();
  };

  if (!wallet.web3)
    return (
      <>
        <Heading>Step 2: Connect Wallet</Heading>
        <Button variant={'primary'} onClick={handleConnectClick}>
          Connect
        </Button>
      </>
    );

  return <Navigate to="/summary" />;
}
