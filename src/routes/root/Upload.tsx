import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
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
    <>
      <Heading>Step 1: Upload Deposit Data</Heading>
      <div>
        Have you generated your mnemonic and validator public keys? If not, you can do so
        here.
      </div>
      <JSONDropzone JSONReady={dispatchJSON} fileNameReady={dispatchFileName} />
      {storage.data.json && (
        <Button variant={'primary'} onClick={handleContinueClick}>
          Continue
        </Button>
      )}
    </>
  );
}
