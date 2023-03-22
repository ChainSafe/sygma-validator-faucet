import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import _merge from 'lodash/merge';
import { DepositKeyInterface } from '../components/JSONDropzone/validation';

interface Data {
  json?: DepositKeyInterface;
  depositContractCalldata?: {
    pubkey: string;
    withdrawal_credentials: string;
    signature: string;
    deposit_data_root: string;
  };
  depositContractCalldataEncoded?: string;
}

interface StorageContextContextInterface {
  data: Data;
  isReady: boolean;
  load: () => void;
  update: (newData: Data) => void;
}

const defaultState: StorageContextContextInterface = {
  data: {},
  isReady: false,
  load: () => {},
  update: () => {},
};

const StorageContext = createContext<StorageContextContextInterface>(defaultState);

const STORAGE_KEY = 'storage_key_v1';

export function StorageContextProvider({ children }: PropsWithChildren): JSX.Element {
  const [data, setData] = useState<Data>({});
  const [isReady, setIsReady] = useState(false);

  const load = (): void => {
    const storage = sessionStorage.getItem(STORAGE_KEY);
    if (storage === null) return;
    setData(JSON.parse(storage) as Data);
  };
  const update = (newData: Data): void => {
    setData((current) => {
      const newState = _merge(current, newData);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    load();
    setIsReady(true);
  }, []);

  return (
    <StorageContext.Provider value={{ data, isReady, load, update }}>
      {children}
    </StorageContext.Provider>
  );
}

export const useStorage = (): StorageContextContextInterface =>
  useContext(StorageContext);
