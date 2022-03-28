import { BeesLoadErrorWithArgs } from 'beesjs';
import {
  Record,
  RChainInfos,
  DeployOptions,
  TransactionStatus,
  TransactionOrigin,
  LoadRecordsError,
  LoadNodesError,
  NodeFromNetwork,
  RChainInfo,
  TransactionState,
  TransactionOriginDeploy,
  TransactionValue,
  EthereumSignedTransaction,
  EthereumTransaction,
} from '/models';

export const EXECUTE_CRON_JOBS = '[Blockchain] Execute cron jobs';

export const EXECUTE_RCHAIN_CRON_JOBS = '[Blockchain] Execute RChain cron jobs';
export const EXECUTE_NODES_CRON_JOBS = '[Blockchain] Execute Nodes cron jobs';
export const EXECUTE_RECORDS_BY_PUBLIC_KEY_CRON_JOBS = '[Blockchain] Execute records by public key cron jobs';
export const SAVE_RCHAIN_CRON_JOBS_STREAM = '[Blockchain] Save RChain cron jobs stream';

export const UPDATE_RCHAIN_BLOCKCHAIN_INFOS_FROM_STORAGE = '[Blockchain] Update RChain blockchain infos from storage';
export const UPDATE_RCHAIN_BLOCKCHAIN_INFO_COMPLETED = '[Blockchain] Update RChain blockchain info completed';
export const UPDATE_RCHAIN_BLOCKCHAIN_LAST_BLOCK_COMPLETED =
  '[Blockchain] Update RChain blockchain last block completed';
export const UPDATE_RCHAIN_BLOCKCHAIN_INFO_FAILED = '[Blockchain] Update RChain blockchain info failed';

export const GET_NODES_FAILED = '[Blockchain] Get nodes failed';
export const GET_NODES_COMPLETED = '[Blockchain] Get nodes completed';

export const UPDATE_RECORDS_FROM_STORAGE = '[Blockchain] Update records from storage';
export const GET_ALL_RECORDS_FAILED = '[Blockchain] Get all records failed';
export const GET_ONE_RECORD_COMPLETED = '[Blockchain] Get one record completed';
export const REMOVE_OLD_RECORDS = '[Blockchain] Remove old records';
export const REMOVE_OLD_RECORDS_COMPLETED = '[Blockchain] Remove old records completed';
export const ADD_RECORD = '[Blockchain] Add record';

export const UPDATE_TRANSACTIONS_FROM_STORAGE = '[Blockchain] Update transactions from storage';
export const ADD_RCHAIN_TRANSACTION = '[Blockchain] Add RChain transaction';
export const SEND_RCHAIN_TRANSACTION = '[Blockchain] Send RChain transaction';
export const SEND_RCHAIN_TRANSACTION_WITH_FILE = '[Blockchain] Send RChain transaction with file';
export const SAVE_FAILED_RCHAIN_TRANSACTION = '[Blockchain] Save failed RChain transaction';
export const RCHAIN_TRANSACTION_ERROR = '[Blockchain] RChain transaction error';
export const UPDATE_RCHAIN_TRANSACTION_STATUS = '[Blockchain] Update RChain transaction status';
export const UPDATE_RCHAIN_TRANSACTION_VALUE = '[Blockchain] Update RChain transaction value';

export const SAVE_ETHEREUM_TRANSACTION = '[Blockchain] Save ethereum signed transaction';

export const LISTEN_FOR_DATA_AT_NAME = '[Common] Listen for data at name';
export const GET_ONE_RECORD = '[Common] Get one record';
export const GET_X_RECORDS = '[Common] Get x records';
export const EXPLORE_DEPLOY_X = '[Common] Explore deploy x';

export const executeNodesCronJobsAction = () => ({
  type: EXECUTE_NODES_CRON_JOBS,
});

export const executeRecordsByPublicKeyCronJobsAction = () => ({
  type: EXECUTE_RECORDS_BY_PUBLIC_KEY_CRON_JOBS,
});

export const executeRChainCronJobsAction = () => ({
  type: EXECUTE_RCHAIN_CRON_JOBS,
});

export interface SaveRChainConJobsStreamPayload {
  stream: NodeJS.Timeout;
}
export const saveRChainCronJobsStreamAction = (values: SaveRChainConJobsStreamPayload) => ({
  type: SAVE_RCHAIN_CRON_JOBS_STREAM,
  payload: values,
});

export interface UpdateRChainBlockchainInfosFromStoragePayload {
  rchainInfos: RChainInfos[];
}
export const updateRChainBlockchainInfosFromStorageAction = (
  values: UpdateRChainBlockchainInfosFromStoragePayload
) => ({
  type: UPDATE_RCHAIN_BLOCKCHAIN_INFOS_FROM_STORAGE,
  payload: values,
});

export interface UpdateRChainBlockchainInfoCompletedPayload {
  info: RChainInfo;
  date: string;
  chainId: string;
}
export const updateRChainBlockchainInfoCompletedAction = (values: UpdateRChainBlockchainInfoCompletedPayload) => ({
  type: UPDATE_RCHAIN_BLOCKCHAIN_INFO_COMPLETED,
  payload: values,
});

export interface UpdateRChainBlockchainInfoFailedPayload {
  chainId: string;
  date: string;
  error: BeesLoadErrorWithArgs;
}
export const updateRChainBlockchainInfoFailedAction = (values: UpdateRChainBlockchainInfoFailedPayload) => ({
  type: UPDATE_RCHAIN_BLOCKCHAIN_INFO_FAILED,
  payload: values,
});

export const getNodesFailedAction = (values: LoadNodesError) => ({
  type: GET_NODES_FAILED,
  payload: values,
});

export interface GetNodesCompletedAction {
  nodes: NodeFromNetwork[];
}
export const getNodesCompletedAction = (values: GetNodesCompletedAction) => ({
  type: GET_NODES_COMPLETED,
  payload: values,
});

export const getAllRecordsFailedAction = (values: LoadRecordsError) => ({
  type: GET_ALL_RECORDS_FAILED,
  payload: values,
});

export interface UpdateRecordsFromStoragePayload {
  records: Record[];
}
export const updateRecordsFromStorageAction = (values: UpdateRecordsFromStoragePayload) => ({
  type: UPDATE_RECORDS_FROM_STORAGE,
  payload: values,
});

export interface GetOneRecordCompletedPayload {
  record: Record;
}
export const getOneRecordCompletedAction = (values: GetOneRecordCompletedPayload) => ({
  type: GET_ONE_RECORD_COMPLETED,
  payload: values,
});

export interface RemoveOldRecordsPayload {
  before: string;
}
export const removeOldRecordsAction = (values: RemoveOldRecordsPayload) => ({
  type: REMOVE_OLD_RECORDS,
  payload: values,
});

export interface RemoveOldRecordsCompletedPayload {
  names: string[];
}
export const removeOldRecordsCompletedAction = (values: RemoveOldRecordsCompletedPayload) => ({
  type: REMOVE_OLD_RECORDS_COMPLETED,
  payload: values,
});

export interface AddRecordPayload {
  record: Record;
}
export const addRecordAction = (values: AddRecordPayload) => ({
  type: ADD_RECORD,
  payload: values,
});

export interface SendRChainTransactionWithFilePayload {
  // one of the two following must be provided
  data?: {
    file: string;
    mimeType: string;
    name: string;
  };
  fileAsBase64?: string;
  encrypted: string;
  publicKey: string;
  phloLimit: number;
  id: string;
  platform: 'rchain';
  blockchainId: string;
  alert?: boolean;
  origin: TransactionOriginDeploy;
  sentAt: string;
}
export const sendRChainTransactionWithFileAction = (values: SendRChainTransactionWithFilePayload) => ({
  type: SEND_RCHAIN_TRANSACTION_WITH_FILE,
  payload: values,
});

export interface SendRChainTransactionPayload {
  transaction: DeployOptions;
  id: string;
  platform: 'rchain';
  blockchainId: string;
  alert?: boolean;
  origin: TransactionOrigin;
  sentAt: string;
}
export const sendRChainTransactionAction = (values: SendRChainTransactionPayload) => ({
  type: SEND_RCHAIN_TRANSACTION,
  payload: values,
});
export const addRChainTransactionAction = (values: SendRChainTransactionPayload) => ({
  type: ADD_RCHAIN_TRANSACTION,
  payload: values,
});

export const updateTransactionsFromStorageAction = (values: { transactions: TransactionState[] }) => ({
  type: UPDATE_TRANSACTIONS_FROM_STORAGE,
  payload: values,
});

export interface saveEthereumTransactionStatePayload {
  transaction: EthereumSignedTransaction | EthereumTransaction;
  id: string;
  platform: 'evm';
  blockchainId: string;
  origin: TransactionOrigin;
  sentAt: string;
  status: TransactionStatus;
}

export const saveEthereumTransactionStateAction = (values: saveEthereumTransactionStatePayload) => ({
  type: SAVE_ETHEREUM_TRANSACTION,
  payload: values,
});

export interface SaveFailedRChainTransactionPayload {
  id: string;
  platform: 'rchain';
  blockchainId: string;
  origin: TransactionOrigin;
  value: TransactionValue;
  sentAt: string;
}
export const saveFailedRChainTransactionAction = (values: SaveFailedRChainTransactionPayload) => ({
  type: SAVE_FAILED_RCHAIN_TRANSACTION,
  payload: values,
});

export interface RChainTransactionErrorPayload {
  tabId?: string;
  id: string;
  value?: any;
  alert?: boolean;
}
export const rChainTransactionErrorAction = (values: RChainTransactionErrorPayload) => ({
  type: RCHAIN_TRANSACTION_ERROR,
  payload: values,
});

export interface UpdateRChainTransactionStatusPayload {
  id: string;
  status: TransactionStatus;
  value?: any;
}
export const updateRChainTransactionStatusAction = (values: UpdateRChainTransactionStatusPayload) => ({
  type: UPDATE_RCHAIN_TRANSACTION_STATUS,
  payload: values,
});

export interface UpdateRChainTransactionValuePayload {
  id: string;
  value: TransactionValue;
}
export const updateRChainTransactionValueAction = (values: UpdateRChainTransactionValuePayload) => ({
  type: UPDATE_RCHAIN_TRANSACTION_VALUE,
  payload: values,
});
