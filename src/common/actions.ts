import {
  DappManifest,
  TransactionOrigin,
  TransactionState,
  Identification,
  TransactionOriginDapp,
  ParsedHtmlAndTags,
} from '../models';

export const DAPP_INITIAL_SETUP = '[Common] dapp initial setup';
export const EXECUTE_TRANSACTION = '[Common] Execute transaction';
export const NAVIGATE = '[Common] Navigate';

export const SEND_RCHAIN_TRANSACTION_FROM_SANDBOX = '[Common] Send RChain transaction from sandbox';
export const SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX = '[Common] Send RChain payment request from sandbox';

export const UPDATE_RCHAIN_TRANSACTION_STATUS = '[Common] Update RChain transaction status';
export const UPDATE_RCHAIN_TRANSACTION_VALUE = '[Common] Update RChain transaction value';

export const IDENTIFY_FROM_SANDBOX = '[Common] Identify from sandbox';

export const UPDATE_TRANSACTIONS = '[Common] Update transactions';
export const UPDATE_IDENTIFICATIONS = '[Common] Update identifications';

export interface DappInitialSetupPayload {
  html: string;
  title: string;
  appPath: string; // path to load the resources from, will be "file://...." in dev , and "/" in prod
  dappId: string;
  randomId: string;
}
export const dappInitialSetupAction = (values: DappInitialSetupPayload) => {
  return {
    type: DAPP_INITIAL_SETUP,
    payload: values,
  };
};

export interface ExecuteTransactionPayload {
  parameters: {
    chainId?: string;
    keyProvider?: string;
    actions: any;
  };
  callId: string;
  dappId: string;
}
export interface ExecuteTransactionAction {
  type: 'Execute transaction';
  payload: ExecuteTransactionPayload;
}
export const executeTransactionAction = (values: ExecuteTransactionPayload) => {
  return {
    type: EXECUTE_TRANSACTION,
    payload: values,
  };
};

export interface SendRChainTransactionFromMiddlewarePayload {
  parameters: {
    term?: string;
    signatures?: { [expr: string]: string };
  };
  dappId: string;
  chainId: string;
  id: string;
  origin: TransactionOriginDapp;
}
export interface SendRChainTransactionFromSandboxPayload {
  parameters: {
    term?: string;
    signatures?: { [expr: string]: string };
  };
  callId: string;
  dappId: string;
  randomId: string;
}
export interface SendRChainTransactionFromSandboxAction {
  type: '[SandBox] Send RChain transaction from sandbox';
  payload: SendRChainTransactionFromSandboxPayload;
}
export const sendRChainTransactionFromSandboxAction = (values: SendRChainTransactionFromSandboxPayload) => {
  return {
    type: SEND_RCHAIN_TRANSACTION_FROM_SANDBOX,
    payload: values,
  };
};

export interface RChainPaymentRequestParameters {
  from?: string;
  to: string | undefined;
  amount: number | undefined;
}
export interface SendRChainPaymentRequestFromMiddlewarePayload {
  parameters: RChainPaymentRequestParameters;
  dappId: string;
  chainId: string;
  id: string;
  origin: TransactionOriginDapp;
}

export interface SendRChainPaymentRequestFromSandboxPayload {
  parameters: {
    from?: string;
    to: string;
    amount: number;
  };
  callId: string;
  dappId: string;
  randomId: string;
}
export interface SendRChainPaymentRequestFromSandboxAction {
  type: '[Common] Send RChain payment request from sandbox';
  payload: SendRChainPaymentRequestFromSandboxPayload;
}
export const sendRChainPaymentRequestFromSandboxAction = (values: SendRChainPaymentRequestFromSandboxPayload) => {
  return {
    type: SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX,
    payload: values,
  };
};

export interface UpdateTransactionsPayload {
  transactions: {
    [transactionId: string]: TransactionState;
  };
}
export interface UpdateTransactionsAction {
  type: '[Common] Update transactions';
  payload: UpdateTransactionsPayload;
}
export const updateTransactionsAction = (values: UpdateTransactionsPayload) => {
  return {
    type: UPDATE_TRANSACTIONS,
    payload: values,
  };
};

export interface IdentifyFromSandboxPayload {
  parameters: {
    publicKey: undefined | string;
  };
  callId: string;
  dappId: string;
  randomId: string;
}
export interface IdentifyFromSandboxAction {
  type: '[SandBox] Identify from sandbox';
  payload: IdentifyFromSandboxPayload;
}
export const identifyFromSandboxAction = (values: IdentifyFromSandboxPayload) => {
  return {
    type: IDENTIFY_FROM_SANDBOX,
    payload: values,
  };
};

export interface UpdateIdentificationsPayload {
  identifications: {
    [callId: string]: Identification;
  };
}
export interface UpdateIdentificationsAction {
  type: '[Common] Update identifications';
  payload: UpdateIdentificationsPayload;
}
export const updateIdentificationsAction = (values: UpdateIdentificationsPayload) => {
  return {
    type: UPDATE_IDENTIFICATIONS,
    payload: values,
  };
};
