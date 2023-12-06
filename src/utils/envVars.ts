import { Buffer } from 'buffer';

export const MIN_DEPOSIT_CLI_VERSION = '1.0.0';

const forkVersion = Buffer.from('0x01017000'.replace(/0x/g, ''), 'hex');
export const GENESIS_FORK_VERSION = forkVersion;

// BLS signature verification variables
export const ETHER_TO_GWEI = 1e9;
export const MIN_DEPOSIT_AMOUNT = 1 * ETHER_TO_GWEI;
export const DOMAIN_DEPOSIT = Buffer.from('03000000', 'hex');
export const EMPTY_ROOT = Buffer.from(
  '0000000000000000000000000000000000000000000000000000000000000000',
  'hex',
);
