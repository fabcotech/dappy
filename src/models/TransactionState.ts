import { EthereumTransaction, EthereumSignedTransaction } from './Ethereum';
import { DeployOptions, TransactionOriginTransfer } from './RChain';

export interface TransactionAddressValue {
  status: string;
  address: string;
}

export type TransactionData =
  | undefined
  | DeployOptions
  | EthereumSignedTransaction
  | EthereumTransaction;

export enum TransactionStatus {
  Pending = 'pending',
  Aired = 'aired',
  Failed = 'failed',
  Abandonned = 'abandonned',
  Completed = 'completed',
  Signed = 'signed',
}

export type TransactionValue = string | undefined | TransactionAddressValue | { message: string };

export interface TransactionOriginDapp {
  origin: 'dapp';
  accountName: undefined | string;
  tabId: string;
  dappTitle: string;
  callId: string;
}

export type TransactionOrigin = TransactionOriginDapp | TransactionOriginTransfer;

export interface TransactionState {
  platform: 'rchain' | 'evm';
  id: string;
  transaction: TransactionData;
  status: TransactionStatus;
  value: TransactionValue /* TODO: Rename to result */;
  blockchainId: string;
  blockchainInfo?: string /* RCHAIN */;
  origin: TransactionOrigin;
  sentAt: string;
}
