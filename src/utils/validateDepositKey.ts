import { initBLS } from '@chainsafe/bls';
import { ETHER_TO_GWEI, MIN_DEPOSIT_AMOUNT, MIN_DEPOSIT_CLI_VERSION } from './envVars';
import compareVersions from 'compare-versions';
import { DepositData, DepositMessage } from './SSZ';
import { bufferHex } from './bufferHex';
import { verifySignature } from './verifySignature';
import { DepositDataJson } from '../types/deposit';

export async function validateDepositKey(json: DepositDataJson[]): Promise<boolean> {
  await initBLS();

  if (!Array.isArray(json)) return false;
  if (json.length <= 0) return false;
  // TODO: @ivan what to do when is multiple validators in deposit file?

  const depositKeysStatuses: boolean[] = json.map((depositDatum) => {
    if (!validateFieldFormatting(depositDatum)) {
      return false;
    }
    if (!verifyDepositRoots(depositDatum)) {
      return false;
    }
    return verifySignature(depositDatum);
  });

  return !depositKeysStatuses.some((status) => !status);
}

/**
 * Helper methods below
 */
function validateFieldFormatting(depositDatum: DepositDataJson): boolean {
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
}

function verifyDepositRoots(depositDatum: DepositDataJson): boolean {
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
}
