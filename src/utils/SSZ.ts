import { Buffer } from 'buffer';
import {
  NumberUintType,
  ByteVector,
  ByteVectorType,
  ContainerType,
} from '@chainsafe/ssz';

export const bufferHex = (x: string): Buffer => Buffer.from(x, 'hex');

export const DepositMessage = new ContainerType({
  fields: {
    pubkey: new ByteVectorType({
      length: 48,
    }),
    withdrawalCredentials: new ByteVectorType({
      length: 32,
    }),
    amount: new NumberUintType({
      byteLength: 8,
    }),
  },
});

export interface DepositMessage {
  pubkey: ByteVector;
  withdrawalCredentials: ByteVector;
  amount: Number;
}

export const DepositData = new ContainerType({
  fields: {
    pubkey: new ByteVectorType({
      length: 48,
    }),
    withdrawalCredentials: new ByteVectorType({
      length: 32,
    }),
    amount: new NumberUintType({
      byteLength: 8,
    }),
    signature: new ByteVectorType({
      length: 96,
    }),
  },
});

export interface DepositData {
  pubkey: ByteVector;
  withdrawalCredentials: ByteVector;
  amount: Number;
  signature: ByteVector;
}

export const SigningData = new ContainerType({
  fields: {
    objectRoot: new ByteVectorType({
      length: 32,
    }), // Ideally this would be a RootType, but AFIK, there is no generic expanded type for roots in @chainsafe/ssz
    domain: new ByteVectorType({
      length: 32,
    }),
  },
});

export interface SigningData {
  objectRoot: ByteVector;
  domain: ByteVector;
}

export const ForkData = new ContainerType({
  fields: {
    currentVersion: new ByteVectorType({
      length: 4,
    }),
    genesisValidatorsRoot: new ByteVectorType({
      length: 32,
    }),
  },
});

export interface ForkData {
  currentVersion: ByteVector;
  genesisValidatorsRoot: ByteVector;
}
