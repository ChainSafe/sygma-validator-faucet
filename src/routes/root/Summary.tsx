import { useNavigate } from 'react-router-dom';
import Contract from 'web3-eth-contract';
import { useEffect } from 'react';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useEnsuredWallet } from '../../context/WalletContext';
import { DemoAbi as Abi } from '../../abi';

export function Summary(): JSX.Element {
  const wallet = useEnsuredWallet();

  // mocks
  const value = '{value}';
  const currency = '{currency}';
  const network = '{network.name}';

  const navigate = useNavigate();
  const handleBridgeClick = (): void => {
    console.log('do magic on click');
    const contract: Contract<typeof Abi> = new wallet.web3.eth.Contract(
      Abi,
      '0x9d15e18Aed0568FB829b857BA1acd1ac8fd68474',
    );
    console.log(contract);

    navigate('/transactions');
  };
  const handleBackClick = (): void => {
    console.log('do magic on click');
    wallet.disconnect();
  };

  useEffect(() => {
    void wallet.ensureNetwork('0x507');
  }, [wallet]);

  return (
    <>
      <Heading>Step 3: Summary</Heading>
      <div>
        You’re about to launch a validator on Goerli with {value} {currency} from{' '}
        {network}. Is that correct?
      </div>
      <Button onClick={handleBridgeClick}>Bridge Funds</Button>
      <Button onClick={handleBackClick}>Back</Button>
    </>
  );
}
