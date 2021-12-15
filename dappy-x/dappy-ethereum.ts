import {
  sendEthereumPaymentRequestFromSandboxAction,
  signEthereumTransactionFromSandboxAction,
  identifyFromSandboxAction,
  UpdateTransactionsPayload,
  UpdateIdentificationsPayload,
} from '../src/common';
import { TransactionState, Identification } from '../src/models';

export default class {
  identifications: {
    [key: string]: {
      resolve: (a: Identification) => void;
      reject: (a: { error: string; identification?: Identification }) => void;
    };
  } = {};
  transactions: {
    [key: string]: {
      resolve: (a: TransactionState) => void;
      reject: (a: { error: string; transaction?: TransactionState }) => void;
    };
  } = {};

  sendMessageToHost = (m) => {
    const interProcess2 = new XMLHttpRequest();
    interProcess2.open('POST', 'interprocessdapp://message-from-dapp-sandboxed');
    interProcess2.setRequestHeader(
      'Data',
      JSON.stringify({
        action: m,
      })
    );
    interProcess2.send();
  };

  identify(parameters: { publicKey: undefined | string, platform: string }) {
    const promise = new Promise((resolve, reject) => {

      let params = parameters;
      if (!params || !params.publicKey) {
        params = {
          publicKey: '',
        };
      }

      const callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();

      this.sendMessageToHost(
        identifyFromSandboxAction({
          parameters: params,
          callId: callId,
          resourceId: '',
        })
      );

      this.identifications[callId] = {
        resolve: resolve,
        reject: reject,
      };
    });

    return promise;
  }

  signTransaction(parameters: { term: string; signatures?: { [expr: string]: string } }) {
    const promise = new Promise((resolve, reject) => {
      const callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();

      this.sendMessageToHost(
        signEthereumTransactionFromSandboxAction({
          parameters: parameters,
          callId: callId,
        })
      );

      this.transactions[callId] = {
        resolve: resolve,
        reject: reject,
      };
    });

    return promise;
  }

  requestPayment(parameters: { from?: string; to: string; amount: number }) {
    const promise = new Promise((resolve, reject) => {

      const callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();

      this.sendMessageToHost(
        sendEthereumPaymentRequestFromSandboxAction({
          parameters: parameters,
          callId: callId,
        })
      );

      this.transactions[callId] = {
        resolve: resolve,
        reject: reject,
      };
    });

    return promise;
  }

  requestTransactions = () => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocessdapp://get-transactions');
    interProcess.send();
    interProcess.onload = (a: any) => {
      try {
        const r = JSON.parse(a.target.responseText);
        const payload: UpdateTransactionsPayload = r;
        if (payload.transactions) {
          this.updateTransactions(payload.transactions);
        }
      } catch (e) {
        console.log(e);
      }
    };
  };

  updateTransactions(transactions: { [transactionId: string]: TransactionState }) {
    Object.keys(this.transactions).forEach((key) => {
      const callTransaction = Object.values(transactions).find(
        (t) => t.origin.origin === 'dapp' && t.origin.callId === key
      );
      if (callTransaction) {
        if (callTransaction.status === 'abandonned' || callTransaction.status === 'failed') {
          this.transactions[key].reject({
            error: `transaction ${callTransaction.status}`,
            transaction: callTransaction,
          });
        } else {
          this.transactions[key].resolve(callTransaction);
        }
      }
    });
  }

  requestIdentifications = () => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocessdapp://get-identifications');
    interProcess.send();
    interProcess.onload = (a: any) => {
      try {
        const r = JSON.parse(a.target.responseText);
        const payload: UpdateIdentificationsPayload = r;
        if (payload.identifications) {
          this.updateIdentifications(payload.identifications);
        }
      } catch (e) {
        console.log(e);
      }
    };
  };

  updateIdentifications(identifications: { [callId: string]: Identification }) {
    Object.keys(this.identifications).forEach((key) => {
      const callIdentification = identifications[key];
      if (callIdentification) {
        if (callIdentification.identified) {
          this.identifications[key].resolve(callIdentification);
        } else {
          this.identifications[key].reject(callIdentification);
        }
      }
    });
  }
}
