import { FC, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { DEPOSIT_ADAPTER_TARGET } from '../../contracts';
import { GENESIS_FORK_VERSION } from '../../utils/envVars';
import {
  DepositKeyInterface,
  DepositStatus,
  TransactionStatus,
  validateDepositKey,
} from './validation';

interface JSONDropzone {
  JSONReady: (deposit: DepositKeyInterface) => void;
  fileNameReady: (fileName: string) => void;
}

export const JSONDropzone: FC<JSONDropzone> = ({ JSONReady, fileNameReady }) => {
  //component state
  const [isFileStaged, setIsFileStaged] = useState(false);
  const [isFileAccepted, setIsFileAccepted] = useState(false);
  const [fileError, setFileError] = useState<React.ReactElement | null>(null);

  //TODO app state - possibly store to context or redux
  const [depositFileName, setDepositFileName] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [depositFileKey, setDepositFileKey] = useState<DepositKeyInterface | undefined>();

  useEffect(() => {
    if (depositFileKey?.depositStatus === DepositStatus.READY_FOR_DEPOSIT) {
      JSONReady(depositFileKey);
      fileNameReady(depositFileName);
    }
  }, [depositFileKey, depositFileName]);

  const onFileDrop = (jsonFiles: Array<any>, rejectedFiles: FileRejection[]): void => {
    if (rejectedFiles?.length) {
      setFileError(
        <>
          <div>"That is not a valid deposit_data JSON file."</div>
        </>,
      );
      return;
    }

    // check if the file is JSON
    if (jsonFiles.length === 1) {
      setIsFileStaged(true); // unstaged via handleFileDelete
      setIsFileAccepted(true); // rejected if BLS check fails
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setDepositFileName(jsonFiles[0].name as string);

      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const fileData: DepositKeyInterface[] = JSON.parse(
              event.target.result as string,
            );
            // perform BLS check
            if (validateDepositKey(fileData)) {
              setDepositFileKey({
                ...fileData[0],
                transactionStatus: TransactionStatus.READY,
                depositStatus: DepositStatus.VERIFYING,
              });
              //Check of withdrawal credentials match goerli contract address
              if (
                `0x${fileData[0].withdrawal_credentials.substring(24)}`.toLowerCase() ===
                DEPOSIT_ADAPTER_TARGET.toLowerCase()
              ) {
                setDepositFileKey({
                  ...fileData[0],
                  transactionStatus: TransactionStatus.READY,
                  depositStatus: DepositStatus.READY_FOR_DEPOSIT,
                });
              } else {
                handleWithdrawalAddressNotMatching();
              }
            } else {
              // file is JSON but did not pass BLS, so leave it "staged" but not "accepted"
              setIsFileAccepted(false);
              setDepositFileKey(undefined);
              flushDropzoneCache();

              // there are a couple special cases that can occur
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const { fork_version: forkVersion } = fileData[0] || {};
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              const hasCorrectStructure = checkJsonStructure(fileData[0] || {});
              if (
                hasCorrectStructure &&
                forkVersion !== GENESIS_FORK_VERSION.toString()
              ) {
                // file doesn't match the correct network
                handleWrongNetwork();
              }
            }
          } catch (e) {
            // possible error example: json is invalid or empty so it cannot be parsed
            // TODO think about other possible errors here, and consider if we might want to set "isFileStaged"
            console.log(e);
            setIsFileAccepted(false);
            handleSevereError();
            setDepositFileKey(undefined);
            flushDropzoneCache();
          }
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      reader.readAsText(jsonFiles[0]);
    }
  };

  const {
    acceptedFiles, // all JSON files will pass this check (including BLS failures
    inputRef,
    // isDragActive,
    // isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: { 'application/json': ['.json'] },
    noClick: isFileStaged || isFileAccepted,
    onDrop: onFileDrop,
  });

  const flushDropzoneCache = useCallback(() => {
    acceptedFiles.length = 0;
    acceptedFiles.splice(0, acceptedFiles.length);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [acceptedFiles, inputRef]);

  const handleFileDelete = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setDepositFileName('');
      setDepositFileKey(undefined);
      setFileError(null);
      setIsFileStaged(false);
      setIsFileAccepted(false);
      flushDropzoneCache();
    },
    [setDepositFileKey, setDepositFileName, flushDropzoneCache],
  );

  const checkJsonStructure = (depositDataJson: { [field: string]: any }): boolean => {
    return !!(
      depositDataJson.pubkey ||
      depositDataJson.withdrawal_credentials ||
      depositDataJson.amount ||
      depositDataJson.signature ||
      depositDataJson.deposit_message_root ||
      depositDataJson.deposit_data_root ||
      depositDataJson.fork_version
    );
  };

  const handleWrongNetwork = (): void => {
    setFileError(
      <div>
        This JSON file isn't for the right network. Upload a file generated for your
        current network
      </div>,
    );
  };

  const handleSevereError = (): void => {
    setFileError(<div>Couldn't upload {depositFileName} due to an error.</div>);
  };

  const handleWithdrawalAddressNotMatching = (): void => {
    setFileError(<div>Withdrawal address doesn't match goerli contract address</div>);
  };

  const renderMessage = useMemo((): JSX.Element => {
    if (isDragReject && !isFileStaged) {
      return <div>Upload a valid json file.</div>;
    }

    if (isFileStaged || fileError) {
      return (
        <div>
          <button onClick={handleFileDelete}>Delete</button>
          {fileError || (
            <>
              {isFileAccepted && <h2>{depositFileName}</h2>}
              {!isFileAccepted && (
                <p>{depositFileName} isn't a valid deposit_data JSON file. Try again.</p>
              )}
            </>
          )}
        </div>
      );
    }

    return <div>Drag file to upload or browse</div>;
  }, [
    isDragReject,
    isFileStaged,
    isFileAccepted,
    fileError,
    depositFileName,
    handleFileDelete,
  ]);

  return (
    <DropzoneWrapper
      //TODO - style
      // isFileStaged={isFileStaged}
      // isFileAccepted={isFileAccepted && !fileError}
      // {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      {...getRootProps({ className: 'dropzone' })}
    >
      <input {...getInputProps()} />
      {/* //TODO - style */}
      {/* <FileUploadAnimation
            isDragAccept={isDragAccept}
            isDragReject={isDragReject}
            isDragActive={isDragActive}
            isFileStaged={!!(isFileStaged || fileError)}
            isFileAccepted={isFileAccepted && !fileError}
          /> */}

      <DropzoneMessage>{renderMessage}</DropzoneMessage>
    </DropzoneWrapper>
  );
};

const DropzoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background: var(--blue-500);
  height: 147px;
  border-radius: 12px;
  border-style: dashed;
  border-color: var(--grey-500);
  margin: 10px 0 30px 0;
  cursor: grab;
`;

const DropzoneMessage = styled.div`
  color: var(--grey-400);
`;
