import {
  TransactionStatus,
  TransactionOrigin,
  TransactionState,
  EthereumSignedTransaction,
  EthereumTransaction,
} from '/models';

export const EXECUTE_CRON_JOBS = '[Blockchain] Execute cron jobs';
export const UPDATE_TRANSACTIONS_FROM_STORAGE = '[Blockchain] Update transactions from storage';
export const SAVE_ETHEREUM_TRANSACTION = '[Blockchain] Save ethereum signed transaction';

export const updateTransactionsFromStorageAction = (values: {
  transactions: TransactionState[];
}) => ({
  type: UPDATE_TRANSACTIONS_FROM_STORAGE,
  payload: values,
});

export interface SaveEthereumTransactionStatePayload {
  transaction: EthereumSignedTransaction | EthereumTransaction;
  id: string;
  platform: 'evm';
  blockchainId: string;
  origin: TransactionOrigin;
  sentAt: string;
  status: TransactionStatus;
}

export const saveEthereumTransactionStateAction = (
  values: SaveEthereumTransactionStatePayload
) => ({
  type: SAVE_ETHEREUM_TRANSACTION,
  payload: values,
});
