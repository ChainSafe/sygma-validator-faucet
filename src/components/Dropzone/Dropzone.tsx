import { FC, SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { GENESIS_FORK_VERSION } from '../../utils/envVars';
import { DepositDataJson } from '../../types/deposit';

export const Dropzone: FC = () => {
  //component state
  const [isFileStaged, setIsFileStaged] = useState(false);
  const [isFileAccepted, setIsFileAccepted] = useState(false);
  const [fileError, setFileError] = useState<React.ReactElement | null>(null);

  //TODO app state - possibly store to context or redux
  const [depositFileName, setDepositFileName] = useState<string>();
  const [depositFileKey, setDepositFileKey] = useState<DepositDataJson[]>();
  const [depositStatus, setDepositStatus] = useState<{
    pubkey: string;
    depositStatus: DepositStatus;
  }>();
  const [beaconChainAPIStatus, setBeaconChainAPIStatus] = useState<BeaconChainStatus>();

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
      setDepositFileName(jsonFiles[0].name);
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (event.target) {
          try {
            const fileData: any[] = JSON.parse(event.target.result as string);
            // perform BLS check
            if (await validateDepositKey(fileData as DepositKeyInterface[])) {
              // add valid files to redux
              setDepositFileKey(
                fileData.map((file: DepositKeyInterface) => ({
                  ...file,
                  transactionStatus: TransactionStatus.READY, // initialize each file with ready state for transaction
                  depositStatus: DepositStatus.VERIFYING, // assign to verifying status until the pubkey is checked via beaconscan
                })),
              );

              // perform double deposit check
              try {
                const existingDeposits = await getExistingDepositsForPubkeys(fileData);
                const existingDepositPubkeys = existingDeposits.data.flatMap((x) =>
                  x.publickey.substring(2),
                );
                (fileData as DepositKeyInterface[]).forEach(async (file) => {
                  if (existingDepositPubkeys.includes(file.pubkey)) {
                    setDepositStatus({
                      pubkey: file.pubkey,
                      depositStatus: DepositStatus.ALREADY_DEPOSITED,
                    });
                  } else {
                    setDepositStatus({
                      pubkey: file.pubkey,
                      depositStatus: DepositStatus.READY_FOR_DEPOSIT,
                    });
                  }
                });
              } catch (error) {
                setBeaconChainAPIStatus(BeaconChainStatus.DOWN);
              }
            } else {
              // file is JSON but did not pass BLS, so leave it "staged" but not "accepted"
              setIsFileAccepted(false);
              setDepositFileKey([]);
              flushDropzoneCache();

              // there are a couple special cases that can occur
              const { fork_version: forkVersion } = fileData[0] || {};
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
            setDepositFileKey([]);
            flushDropzoneCache();
          }
        }
      };
      reader.readAsText(jsonFiles[0]);
    }
  };

  function handleSubmit(): void {
    // if (workflow === WorkflowStep.UPLOAD_VALIDATOR_FILE) {
    //   dispatchWorkflowUpdate(WorkflowStep.CONNECT_WALLET);
    // }
    // TODO - app state, when json is verified goto next step connect wallet
  }

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
      setDepositFileKey([]);
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
    <div
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

      <div>{renderMessage}</div>
    </div>
  );
};

// weapon main burger soup turtle husband oil cluster run minimum dove account expect together ten axis shallow rain concert inmate again liberty govern donor
