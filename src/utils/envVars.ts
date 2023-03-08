import { Buffer } from 'buffer';

export const BEACONCHAIN_URL = 'https://goerli.beaconcha.in/';
// export const MIN_DEPOSIT_CLI_VERSION = process.env.REACT_APP_MIN_DEPOSIT_CLI_VERSION || '1.0.0';
export const MIN_DEPOSIT_CLI_VERSION = '1.0.0';

// let forkVersion = Buffer.from('00000000', 'hex')
// if (typeof process.env.REACT_APP_GENESIS_FORK_VERSION === 'string') {
//   forkVersion = Buffer.from(process.env.REACT_APP_GENESIS_FORK_VERSION.replace(/0x/g, ''), 'hex');
// }
// export const GENESIS_FORK_VERSION = forkVersion;
export const GENESIS_FORK_VERSION = '0x00001020';

// BLS signature verification variables
export const ETHER_TO_GWEI = 1e9;
export const MIN_DEPOSIT_AMOUNT = 1 * ETHER_TO_GWEI;
export const DOMAIN_DEPOSIT = Buffer.from('03000000', 'hex');
export const EMPTY_ROOT = Buffer.from(
  '0000000000000000000000000000000000000000000000000000000000000000',
  'hex',
);
