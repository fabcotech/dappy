import { BeesLoadCompleted, BeesLoadErrorWithArgs } from 'beesjs';
import * as fromReducer from './reducer';

import { Blockchain, Account, BlockchainNode  } from '../../models';

export const UPDATE_RESOLVER_SETTINGS = '[Settings] Update resolvers settings';
export const UPDATE_DEV_MODE = '[Settings] Update dev mode';
export const UPDATE_SETTINGS_COMPLETED = '[Settings] Update settings completed';
export const UPDATE_SETTINGS_FAILED = '[Settings] Update settings failed';
export const UPDATE_BLOCKCHAINS_FROM_STORAGE = '[Settings] Update blockchains from storage';
export const CREATE_BLOCKCHAIN = '[Settings] Create blockchain';
export const CREATE_BLOCKCHAIN_COMPLETED = '[Settings] Create blockchain completed';
export const REMOVE_BLOCKCHAIN = '[Settings] Remove blockchain';
export const REMOVE_BLOCKCHAIN_COMPLETED = '[Settings] Remove blockchain completed';
export const ADD_NODES_IF_DO_NOT_EXIST = '[Settings] Add nodes if do not exist';
export const UPDATE_NODE_ACTIVE = '[Settings] Update node active';
export const UPDATE_NODE_ACTIVE_COMPLETED = '[Settings] Update node active completed';
export const UPDATE_NODE_READY_STATE = '[Settings] Update node ready state';
export const UPDATE_NODES = '[Settings] Update node urls';
export const UPDATE_NODES_COMPLETED = '[Settings] Update node urls completed';
export const SAVE_BLOCKCHAINS_TO_STORAGE_FAILED = '[Settings] Save blockchains to storage failed';

export const UPDATE_ACCOUNTS_FROM_STORAGE = '[Settings] Update accounts from storage';
export const CREATE_ACCOUNT = '[Settings] Create account';
export const CREATE_ACCOUNT_COMPLETED = '[Settings] Create account completed';
export const DELETE_ACCOUNT = '[Settings] Delete account';
export const DELETE_ACCOUNT_COMPLETED = '[Settings] Delete account completed';
export const UPDATE_ACCOUNT = '[Settings] Update account';
export const UPDATE_ACCOUNTS_COMPLETED = '[Settings] Update accounts completed';
export const UPDATE_ACCOUNTS_BALANCE = '[Settings] Update accounts balance';
export const UPDATE_ACCOUNTS_BALANCE_FAILED = '[Settings] Update accounts balance failed';
export const EXECUTE_ACCOUNTS_CRON_JOBS = '[Settings] Execute accounts cron jobs';

export const SAVE_ACCOUNT_TOKEN_BOX = '[Settings] Save account token box';
export const REMOVE_ACCOUNT_TOKEN_BOX = '[Settings] Remove account token box';

export interface Action {
  type: string;
  payload?: any;
}

export const updateBlockchainsFromStorageAction = (blockchains: Blockchain[]) => ({
  type: UPDATE_BLOCKCHAINS_FROM_STORAGE,
  payload: blockchains,
});

export const updateResolverSettingsAction = (settings: fromReducer.Settings) => ({
  type: UPDATE_RESOLVER_SETTINGS,
  payload: settings,
});

export const updateSettingsCompletedAction = (settings: fromReducer.Settings) => ({
  type: UPDATE_SETTINGS_COMPLETED,
  payload: settings,
});

export const updateSettingsFailedAction = (values: { errorCode: number; error: string; trace?: string }) => ({
  type: UPDATE_SETTINGS_FAILED,
  payload: values,
});

export interface CreateBlockchainPayload {
  platform: 'rchain';
  chainId: string;
  chainName: string;
  nodes: BlockchainNode[];
}
export const createBlockchainAction = (values: CreateBlockchainPayload) => ({
  type: CREATE_BLOCKCHAIN,
  payload: values,
});

export interface RemoveBlockchainPayload {
  chainId: string;
}
export const removeBlockchainAction = (values: RemoveBlockchainPayload) => ({
  type: REMOVE_BLOCKCHAIN,
  payload: values,
});

export interface RemoveBlockchainCompletedPayload {
  chainId: string;
}
export const removeBlockchainCompletedAction = (values: RemoveBlockchainPayload) => ({
  type: REMOVE_BLOCKCHAIN_COMPLETED,
  payload: values,
});

export const createBlockchainCompletedAction = (values: CreateBlockchainPayload) => ({
  type: CREATE_BLOCKCHAIN_COMPLETED,
  payload: values,
});

export interface AddNodesIfDoNotExistPayload {
  chainId: string;
  nodes: BlockchainNode[];
}
export const addNodesIfDoNotExistAction = (values: AddNodesIfDoNotExistPayload) => ({
  type: ADD_NODES_IF_DO_NOT_EXIST,
  payload: values,
});

export interface UpdateNodeActivePayload {
  chainId: string;
  nodeIp: string;
  active: boolean;
}
export const updateNodeActiveAction = (values: UpdateNodeActivePayload) => ({
  type: UPDATE_NODE_ACTIVE,
  payload: values,
});

export interface UpdateNodeReadyStatePayload {
  chainId: string;
  ip: string;
  host: string;
  readyState: 0 | 1 | 2 | 3;
  ssl: boolean;
}
export const updateNodeReadyStateAction = (values: UpdateNodeReadyStatePayload) => ({
  type: UPDATE_NODE_READY_STATE,
  payload: values,
});

export const updateNodeActiveCompletedAction = (values: UpdateNodeActivePayload) => ({
  type: UPDATE_NODE_ACTIVE_COMPLETED,
  payload: values,
});

export interface UpdateNodesPayload {
  chainId: string;
  nodes: BlockchainNode[];
}
export const updateNodesAction = (values: UpdateNodesPayload) => ({
  type: UPDATE_NODES,
  payload: values,
});

export const updateNodeUrlsCompletedAction = (values: UpdateNodesPayload) => ({
  type: UPDATE_NODES_COMPLETED,
  payload: values,
});

export const saveBlockchainsToStorageFailed = (values: { errorCode: number; error: string; trace?: string }) => ({
  type: SAVE_BLOCKCHAINS_TO_STORAGE_FAILED,
  payload: values,
});

export interface UpdateDevModePayload {
  flag: boolean;
}
export const updateDevModeAction = (values: UpdateDevModePayload) => ({
  type: UPDATE_DEV_MODE,
  payload: values,
});

export interface UpdateAccountsFromStoragePayload {
  accounts: Account[];
}
export const updateAccountsFromStorageAction = (values: UpdateAccountsFromStoragePayload) => ({
  type: UPDATE_ACCOUNTS_FROM_STORAGE,
  payload: values,
});

export interface CreateAccountPayload {
  account: Account;
}
export const createAccountAction = (values: CreateAccountPayload) => ({
  type: CREATE_ACCOUNT,
  payload: values,
});

export const createAccountCompletedAction = (values: CreateAccountPayload) => ({
  type: CREATE_ACCOUNT_COMPLETED,
  payload: values,
});

export const deleteAccountAction = (values: CreateAccountPayload) => ({
  type: DELETE_ACCOUNT,
  payload: values,
});

export const deleteAccountCompletedAction = (values: CreateAccountPayload) => ({
  type: DELETE_ACCOUNT_COMPLETED,
  payload: values,
});

export const updateAccountAction = (values: CreateAccountPayload) => ({
  type: UPDATE_ACCOUNT,
  payload: values,
});

export interface UpdateAccountsCompletedPayload {
  accounts: { [accountName: string]: Account };
}
export const updateAccountCompletedAction = (values: UpdateAccountsCompletedPayload) => ({
  type: UPDATE_ACCOUNTS_COMPLETED,
  payload: values,
});

export interface UpdateAccountsBalancePayload {
  balances: { accountName: string; balance: number }[];
}
export const updateAccountBalanceAction = (values: UpdateAccountsBalancePayload) => ({
  type: UPDATE_ACCOUNTS_BALANCE,
  payload: values,
});

export interface UpdateAccountBalanceFailedPayload {
  loadState: BeesLoadCompleted;
  date: string;
  error: BeesLoadErrorWithArgs;
}
export const updateAccountBalanceFailedAction = (values: UpdateAccountBalanceFailedPayload) => ({
  type: UPDATE_ACCOUNTS_BALANCE_FAILED,
  payload: values,
});

export const executeAccountsCronJobsAction = () => ({
  type: EXECUTE_ACCOUNTS_CRON_JOBS,
});

export interface SaveAccountTokenBoxPayload {
  accountName: string;
  boxId: string;
}
export const saveAccountTokenBoxAction = (values: SaveAccountTokenBoxPayload) => ({
  type: SAVE_ACCOUNT_TOKEN_BOX,
  payload: values,
});

export const removeAccountTokenBoxAction = (values: SaveAccountTokenBoxPayload) => ({
  type: REMOVE_ACCOUNT_TOKEN_BOX,
  payload: values,
});
