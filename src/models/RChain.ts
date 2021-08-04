export interface RChainInfos {
  chainId: string;
  date: string;
  info: RChainInfo;
}
export interface RChainInfo {
  dappyNodeVersion: string;
  lastFinalizedBlockNumber: number;
  rnodeVersion: string;
  rchainNamesMasterRegistryUri: string;
  rchainNamesContractId: string;
  rchainNetwork: string;
  namePrice: number;
  special?: {
    name: string;
    max: number;
    current: number;
  };
}

export interface Payment {
  phloPrice: number;
  phloLimit: number;
  timestamp: number;
  term: string;
  validAfterBlockNumber: number;
}

export interface DeployData {
  timestamp: number;
  term: string;
  phloPrice: number;
  phloLimit: number;
  validAfterBlockNumber: number;
}

export interface Transaction extends Payment {
  deployer: Buffer;
  sig: Buffer; // Buffer for transport, should be Uint8Array
  sigAlgorithm: 'secp256k1';
}

export interface DeployOptions {
  data: DeployData;
  deployer: string;
  signature: string;
  sigAlgorithm: 'secp256k1';
}

export enum TransactionStatus {
  Pending = 'pending',
  Aired = 'aired',
  Failed = 'failed',
  Abandonned = 'abandonned',
  Completed = 'completed',
}

export enum CallStatus {
  Pending = 'pending',
  Failed = 'failed',
  Completed = 'completed',
}

export interface TransactionOriginTransfer {
  origin: 'transfer';
}
export interface TransactionOriginRChainToken {
  origin: 'rchain-token';
  accountName: undefined | string;
  operation: 'withdraw' | 'update-purse-price' | 'deploy-box' | 'deploy' | 'purchase' | 'update-purse-data';
}
export interface TransactionOriginDapp {
  origin: 'dapp';
  dappId: string;
  dappTitle: string;
  callId: string;
}
export interface TransactionOriginRecord {
  origin: 'record';
  recordName: string;
}
export interface TransactionOriginDeploy {
  origin: 'deploy';
}
export interface TransactionOriginRholang {
  origin: 'rholang';
}
export type TransactionOrigin =
  | TransactionOriginDapp
  | TransactionOriginTransfer
  | TransactionOriginRecord
  | TransactionOriginDeploy
  | TransactionOriginRholang
  | TransactionOriginRChainToken;

export type TransactionValue = string | undefined | { address: string } | { message: string };
export interface TransactionState {
  transaction: undefined | DeployOptions;
  status: TransactionStatus;
  value: TransactionValue;
  blockchainId: string;
  blockchainInfo?: string;
  platform: 'rchain';
  origin: TransactionOrigin;
  sentAt: string;
  id: string;
}

export interface Identification {
  publicKey: undefined | string;
  box: undefined | string;
  identified: boolean;
}
