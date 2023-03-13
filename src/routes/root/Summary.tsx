import { useNavigate } from 'react-router-dom';
import Contract from 'web3-eth-contract';
import { useState } from 'react';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { useEnsuredWallet } from '../../context/WalletContext';
import { DemoAbi as Abi } from '../../abi';
import { Networks, getNetwork } from '../../utils/network';

export function Summary(): JSX.Element {
  const wallet = useEnsuredWallet();
  const [network, setNetwork] = useState<Networks | null>(null);
  const [errorMsg, seteErrorMsg] = useState<string>();

  // mocks
  const value = '{value}';
  const currency = '{currency}';

  const navigate = useNavigate();
  const handleBridgeClick = (): void => {
    console.log('do magic on click');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  const handleChooseNetwork = async (network: Networks): Promise<void> => {
    const isSwitched = await wallet.ensureNetwork(network);
    if (isSwitched) setNetwork(network);
    else seteErrorMsg('To ensure selected network accept network switch prompt.');
  };

  return (
    <>
      <Heading>Step 3: Summary</Heading>
      Chose network:
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button onClick={(): Promise<void> => handleChooseNetwork(Networks.MOONBASE)}>
        MOONBASE
      </Button>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button onClick={(): Promise<void> => handleChooseNetwork(Networks.MUMBAI)}>
        MUMBAI
      </Button>
      {errorMsg && <p>{errorMsg}</p>}
      <div>
        You’re about to launch a validator on Goerli with {value} {currency} from{' '}
        {network && getNetwork(network).chainName}. Is that correct?
      </div>
      {network && <Button onClick={handleBridgeClick}>Bridge Funds</Button>}
      <Button onClick={handleBackClick}>Back</Button>
    </>
  );
}
