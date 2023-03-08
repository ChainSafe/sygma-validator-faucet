import { bufferHex } from './bufferHex';
import { DepositDataJson } from './validateDepositKey';
import { verify } from '@chainsafe/bls';
import { DOMAIN_DEPOSIT, EMPTY_ROOT, GENESIS_FORK_VERSION } from './envVars';
import { ForkData, SigningData } from './SSZ';

export const verifySignature = (depositDatum: DepositDataJson): boolean => {
  const pubkeyBuffer = bufferHex(depositDatum.pubkey);
  const signatureBuffer = bufferHex(depositDatum.signature);
  const depositMessageBuffer = bufferHex(depositDatum.deposit_message_root);
  const domain = computeDomain(DOMAIN_DEPOSIT);
  const signingRoot = computeSigningRoot(depositMessageBuffer, domain);
  return verify(pubkeyBuffer, signingRoot, signatureBuffer);
};

function computeDomain(
  domainType: Buffer,
  forkVersion: Buffer | string = GENESIS_FORK_VERSION,
  genesisValidatorsRoot: Buffer = EMPTY_ROOT,
): Uint8Array {
  const forkDataRoot = computeForkDataRoot(
    forkVersion as Uint8Array,
    genesisValidatorsRoot,
  );
  const domain = new Uint8Array(32);
  domain.set(domainType);
  domain.set(forkDataRoot.subarray(0, 28), 4);
  return domain;
}

function computeSigningRoot(sszObjectRoot: Uint8Array, domain: Uint8Array): Uint8Array {
  const signingData: SigningData = {
    objectRoot: sszObjectRoot,
    domain,
  };
  return SigningData.hashTreeRoot(signingData);
}

function computeForkDataRoot(
  currentVersion: Uint8Array,
  genesisValidatorsRoot: Uint8Array,
): Uint8Array {
  const forkData: ForkData = {
    currentVersion: currentVersion as Uint8Array,
    genesisValidatorsRoot,
  };
  return ForkData.hashTreeRoot(forkData);
}
