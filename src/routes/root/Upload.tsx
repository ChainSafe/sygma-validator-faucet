import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Heading } from '../../components/Heading';
import { JSONDropzone } from '../../components/JSONDropzone';
import { Button } from '../../components/Button';

import { DepositKeyInterface } from '../../components/JSONDropzone/validation';

export function Upload(): JSX.Element {
  const navigate = useNavigate();
  const [depositJSON, setDepositJSON] = useState<DepositKeyInterface>();

  const handleContinueClick = (): void => {
    console.log('do magic on click');

    navigate('/connect');
  };

  return (
    <>
      <Heading>Step 1: Upload Deposit Data</Heading>
      <div>
        Have you generated your mnemonic and validator public keys? If not, you can do so
        here.
      </div>
      <JSONDropzone JSONReady={(JSON) => setDepositJSON(JSON)} />
      {depositJSON && <Button onClick={handleContinueClick}>Continue</Button>}
    </>
  );
}
