/*
  eslint-disable camelcase
 */
import _every from 'lodash/every';
import bls from '@chainsafe/bls/herumi';
import compareVersions from 'compare-versions';
import {
  DepositData,
  DepositMessage,
  ForkData,
  SigningData,
  bufferHex,
} from '../../utils/SSZ';
import {
  GENESIS_FORK_VERSION,
  EMPTY_ROOT,
  DOMAIN_DEPOSIT,
  MIN_DEPOSIT_AMOUNT,
  ETHER_TO_GWEI,
  MIN_DEPOSIT_CLI_VERSION,
} from '../../utils/envVars';

interface BeaconchainDepositDataInterface {
  amount: number;
  block_number: number;
  block_ts: number;
  from_address: string;
  merkletree_index: string;
  publickey: string;
  removed: boolean;
  signature: string;
  tx_hash: string;
  tx_index: number;
  tx_input: string;
  valid_signature: boolean;
  withdrawal_credentials: string;
}

export interface BeaconchainDepositInterface {
  data: BeaconchainDepositDataInterface[];
  status: string;
}

export interface DepositDataJSON {
  amount: number;
  deposit_cli_version: string;
  deposit_data_root: string;
  deposit_message_root: string;
  fork_version: string;
  network_name: string;
  pubkey: string;
  signature: string;
  withdrawal_credentials: string;
}
export interface DepositKeyInterface extends DepositDataJSON {
  transactionStatus: TransactionStatus;
  depositStatus: DepositStatus;
  txHash?: string;
}

export enum TransactionStatus {
  'READY',
  'PENDING',
  'STARTED',
  'SUCCEEDED',
  'FAILED',
  'REJECTED',
}

export enum DepositStatus {
  VERIFYING,
  READY_FOR_DEPOSIT,
}

export enum BeaconChainStatus {
  HEALTHY,
  DOWN,
}

export const verifyDepositRoots = (depositDatum: DepositKeyInterface): boolean => {
  const depositMessage: DepositMessage = {
    pubkey: bufferHex(depositDatum.pubkey),
    withdrawalCredentials: bufferHex(depositDatum.withdrawal_credentials),
    amount: Number(depositDatum.amount),
  };
  const depositData: DepositData = {
    pubkey: bufferHex(depositDatum.pubkey),
    withdrawalCredentials: bufferHex(depositDatum.withdrawal_credentials),
    amount: Number(depositDatum.amount),
    signature: bufferHex(depositDatum.signature),
  };
  if (
    bufferHex(depositDatum.deposit_message_root).compare(
      DepositMessage.hashTreeRoot(depositMessage),
    ) === 0 &&
    bufferHex(depositDatum.deposit_data_root).compare(
      DepositData.hashTreeRoot(depositData),
    ) === 0
  ) {
    return true;
  }
  return false;
};

const computeForkDataRoot = (
  currentVersion: Uint8Array,
  genesisValidatorsRoot: Uint8Array,
): Uint8Array => {
  const forkData: ForkData = {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    currentVersion: currentVersion as Uint8Array,
    genesisValidatorsRoot,
  };
  return ForkData.hashTreeRoot(forkData);
};

const computeDomain = (
  domainType: Buffer,
  forkVersion: Buffer | string = GENESIS_FORK_VERSION,
  genesisValidatorsRoot: Buffer = EMPTY_ROOT,
): Uint8Array => {
  const forkDataRoot = computeForkDataRoot(
    forkVersion as Uint8Array,
    genesisValidatorsRoot,
  );
  const domain = new Uint8Array(32);
  domain.set(domainType);
  domain.set(forkDataRoot.subarray(0, 28), 4);
  return domain;
};

const computeSigningRoot = (
  sszObjectRoot: Uint8Array,
  domain: Uint8Array,
): Uint8Array => {
  const signingData: SigningData = {
    objectRoot: sszObjectRoot,
    domain,
  };
  return SigningData.hashTreeRoot(signingData);
};

// Note: usage of this method requires awaiting the initBLS() method from "@chainsafe/bls";
export const verifySignature = (depositDatum: DepositKeyInterface): boolean => {
  const pubkeyBuffer = bufferHex(depositDatum.pubkey);
  const signatureBuffer = bufferHex(depositDatum.signature);
  const depositMessageBuffer = bufferHex(depositDatum.deposit_message_root);
  const domain = computeDomain(DOMAIN_DEPOSIT);
  const signingRoot = computeSigningRoot(depositMessageBuffer, domain);

  return bls.verify(pubkeyBuffer, signingRoot, signatureBuffer);
};

const validateFieldFormatting = (depositDatum: DepositKeyInterface): boolean => {
  // check existence of required keys
  if (
    !depositDatum.pubkey ||
    !depositDatum.withdrawal_credentials ||
    !depositDatum.amount ||
    !depositDatum.signature ||
    !depositDatum.deposit_message_root ||
    !depositDatum.deposit_data_root ||
    !depositDatum.fork_version ||
    !depositDatum.deposit_cli_version
  ) {
    return false;
  }

  // check type of values
  if (
    typeof depositDatum.pubkey !== 'string' ||
    typeof depositDatum.withdrawal_credentials !== 'string' ||
    typeof depositDatum.amount !== 'number' ||
    typeof depositDatum.signature !== 'string' ||
    typeof depositDatum.deposit_message_root !== 'string' ||
    typeof depositDatum.deposit_data_root !== 'string' ||
    typeof depositDatum.fork_version !== 'string' ||
    typeof depositDatum.deposit_cli_version !== 'string'
  ) {
    return false;
  }

  // check length of strings (note: using string length, so 1 byte = 2 chars)
  if (
    depositDatum.pubkey.length !== 96 ||
    depositDatum.withdrawal_credentials.length !== 64 ||
    depositDatum.signature.length !== 192 ||
    depositDatum.deposit_message_root.length !== 64 ||
    depositDatum.deposit_data_root.length !== 64 ||
    depositDatum.fork_version.length !== 8
  ) {
    return false;
  }

  // check the deposit amount
  if (
    depositDatum.amount < MIN_DEPOSIT_AMOUNT ||
    depositDatum.amount > 32 * ETHER_TO_GWEI
  ) {
    return false;
  }

  // check the deposit-cli version
  if (
    compareVersions.compare(
      depositDatum.deposit_cli_version,
      MIN_DEPOSIT_CLI_VERSION,
      '<',
    )
  ) {
    return false;
  }

  return true;
};

export const validateDepositKey = (files: DepositKeyInterface[]): boolean => {
  if (!Array.isArray(files)) return false;
  if (files.length <= 0) return false;

  const depositKeysStatuses: boolean[] = files.map((depositDatum) => {
    if (!validateFieldFormatting(depositDatum)) {
      return false;
    }
    if (!verifyDepositRoots(depositDatum)) {
      return false;
    }
    return verifySignature(depositDatum);
  });
  return _every(depositKeysStatuses);
};
