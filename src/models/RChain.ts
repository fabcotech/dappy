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
  wrappedRevContractId: string;
  rchainNetwork: string;
  rchainShardId: string;
  namePrice: null | [String, Number] | [String, String];
}

export interface DeployData {
  timestamp: number;
  term: string;
  shardId: string;
  phloPrice: number;
  phloLimit: number;
  validAfterBlockNumber: number;
}

export interface DeployOptions {
  data: DeployData;
  deployer: string;
  signature: string;
  sigAlgorithm: 'secp256k1';
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

export interface Identification {
  publicKey: undefined | string;
  box: undefined | string;
  identified: boolean;
}
