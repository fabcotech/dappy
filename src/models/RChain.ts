import {
  RChainTokenDeployPayload,
  RChainTokenDeployBoxPayload,
  RChainTokenUpdatePursePriceReturn,
  RChainTokenCreatePursesReturn,
} from './RChainToken';

export interface RChainInfos {
  chainId: string;
  date: string;
  info: RChainInfo;
}
export interface RChainInfo {
  dappyNodeVersion: string;
  dappyBrowserMinVersion: string;
  dappyBrowserDownloadLink: string;
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
  Signed = 'signed',
}

export enum CallStatus {
  Pending = 'pending',
  Failed = 'failed',
  Completed = 'completed',
}

export interface TransactionOriginTransfer {
  origin: 'transfer';
  accountName: undefined | string;
}
export type RChainTokenOperation =
  | 'withdraw'
  | 'update-purse-price'
  | 'deploy-box'
  | 'tips'
  | 'deploy'
  | 'create-purses'
  | 'purchase'
  | 'update-purse-data';
export interface TransactionOriginRChainToken {
  origin: 'rchain-token';
  accountName: undefined | string;
  operation: RChainTokenOperation;
}
export interface TransactionOriginDapp {
  origin: 'dapp';
  accountName: undefined | string;
  resourceId: string;
  dappTitle: string;
  callId: string;
}
export interface TransactionOriginRecord {
  origin: 'record';
  recordName: string;
  accountName: string;
}
export interface TransactionOriginDeploy {
  origin: 'deploy';
  accountName: string;
}
export interface TransactionOriginRholang {
  origin: 'rholang';
  accountName: string;
}
export type TransactionOrigin =
  | TransactionOriginDapp
  | TransactionOriginTransfer
  | TransactionOriginRecord
  | TransactionOriginDeploy
  | TransactionOriginRholang
  | TransactionOriginRChainToken;

export type TransactionValue =
  | string
  | undefined
  | { status: string; address: string }
  | { message: string }
  | RChainTokenDeployPayload
  | RChainTokenDeployBoxPayload
  | RChainTokenUpdatePursePriceReturn
  | RChainTokenCreatePursesReturn;

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
