import { TransactionState, TransactionOriginDapp, EthereumTransaction } from '/models';

export const EXECUTE_TRANSACTION = '[Common] Execute transaction';
export const NAVIGATE = '[Common] Navigate';

export const SEND_RCHAIN_TRANSACTION_FROM_SANDBOX = '[Common] Send RChain transaction from sandbox';
export const SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX =
  '[Common] Send RChain payment request from sandbox';

export const UPDATE_RCHAIN_TRANSACTION_STATUS = '[Common] Update RChain transaction status';
export const UPDATE_RCHAIN_TRANSACTION_VALUE = '[Common] Update RChain transaction value';

export const UPDATE_TRANSACTIONS = '[Common] Update transactions';

export const SIGN_ETHEREUM_TRANSACTION_FROM_SANDBOX =
  '[Common] Sign Ethereum transaction from sandbox';
export const SEND_ETHEREUM_PAYMENT_REQUEST_FROM_SANDBOX =
  '[Common] Send Ethereum payment request from sandbox';

// ======
// RChain
// ======
export interface SendRChainTransactionFromMiddlewarePayload {
  parameters: {
    term?: string;
    signatures?: { [expr: string]: string };
  };
  tabId: string;
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
}
export interface SendRChainTransactionFromSandboxAction {
  type: '[SandBox] Send RChain transaction from sandbox';
  payload: SendRChainTransactionFromSandboxPayload;
}
export const sendRChainTransactionFromSandboxAction = (
  values: SendRChainTransactionFromSandboxPayload
) => {
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
  tabId: string;
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
}
export interface SendRChainPaymentRequestFromSandboxAction {
  type: '[Common] Send RChain payment request from sandbox';
  payload: SendRChainPaymentRequestFromSandboxPayload;
}
export const sendRChainPaymentRequestFromSandboxAction = (
  values: SendRChainPaymentRequestFromSandboxPayload
) => {
  return {
    type: SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX,
    payload: values,
  };
};

// ======
// Ethereum
// ======

export interface SignEthereumTransactionFromMiddlewarePayload {
  parameters: EthereumTransaction;
  tabId: string;
  chainId: string;
  id: string;
  origin: TransactionOriginDapp;
}
export interface SignEthereumTransactionFromSandboxPayload {
  parameters: EthereumTransaction;
  callId: string;
}
export interface SignEthereumTransactionFromSandboxAction {
  type: '[SandBox] Sign ethereum transaction';
  payload: SignEthereumTransactionFromSandboxPayload;
}
export const signEthereumTransactionFromSandboxAction = (
  values: SignEthereumTransactionFromSandboxPayload
) => {
  return {
    type: SIGN_ETHEREUM_TRANSACTION_FROM_SANDBOX,
    payload: values,
  };
};

export interface SendEthereumPaymentRequestFromSandboxAction {
  type: '[Common] Send Ethereum payment request from sandbox';
  payload: any;
}
export const sendEthereumPaymentRequestFromSandboxAction = (values: any) => {
  return {
    type: SEND_ETHEREUM_PAYMENT_REQUEST_FROM_SANDBOX,
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
