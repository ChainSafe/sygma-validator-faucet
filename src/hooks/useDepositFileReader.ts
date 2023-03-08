import { useCallback, useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { GENESIS_FORK_VERSION } from '../utils/envVars';
import { validateDepositKey } from '../utils/validateDepositKey';

export function useDepositFileReader() {
  const [isFileStaged, setIsFileStaged] = useState(false);
  const [isFileAccepted, setIsFileAccepted] = useState(false);

  const [fileName, setFileName] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const onFileDrop = useCallback(
    (jsonFiles: Array<any>, rejectedFiles: FileRejection[]) => {
      if (rejectedFiles?.length) {
        setError('That is not a valid deposit_data JSON file.');
        return;
      }

      if (jsonFiles.length === 1) {
        setIsFileStaged(true);
        setIsFileAccepted(true);
        setFileName(jsonFiles[0].name);

        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target) {
            try {
              const fileData: any[] = JSON.parse(event.target.result as string);
              // perform BLS check
              if (await validateDepositKey(fileData)) {
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
    },
    [],
  );

  return {
    isFileStaged,
    setIsFileStaged,
    fileName,
    error,
    onFileDrop,
  };
}
