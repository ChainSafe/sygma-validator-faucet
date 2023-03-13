import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Heading } from '../../components/Heading';
import { JSONDropzone } from '../../components/JSONDropzone';
import { Button } from '../../components/Button';

import { DepositKeyInterface } from '../../components/JSONDropzone/validation';
import { FlowActionTypes, FlowContext } from '../../context/FlowContext';

export function Upload(): JSX.Element {
  const navigate = useNavigate();
  const [{ depositJSON }, dispatch] = useContext(FlowContext);

  const handleContinueClick = (): void => {
    navigate('/connect');
  };

  const dispatchJSON = (JSON: DepositKeyInterface): void =>
    dispatch({ type: FlowActionTypes.SET_DEPOSIT_JSON, payload: JSON });

  const dispatchFileName = (fileName: string): void =>
    dispatch({ type: FlowActionTypes.SET_FILE_NAME, payload: fileName });

  return (
    <>
      <Heading>Step 1: Upload Deposit Data</Heading>
      <div>
        Have you generated your mnemonic and validator public keys? If not, you can do so
        here.
      </div>
      <JSONDropzone JSONReady={dispatchJSON} fileNameReady={dispatchFileName} />
      {depositJSON && <Button onClick={handleContinueClick}>Continue</Button>}
    </>
  );
}
