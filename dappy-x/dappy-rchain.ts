import { createStore } from 'redux';

import {
  sendRChainTransactionFromSandboxAction,
  identifyFromSandboxAction,
  sendRChainPaymentRequestFromSandboxAction,
  updateTransactionsAction,
  updateIdentificationsAction,
  UPDATE_TRANSACTIONS,
  UPDATE_IDENTIFICATIONS,
  UpdateTransactionsPayload,
  UpdateIdentificationsPayload,
} from '../src/common';
import { TransactionState, Identification } from '../src/models';

interface State {
  transactions: TransactionState[];
  identifications: {
    [callId: string]: Identification;
  };
}

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
  jobs: {
    [id: string]: boolean
  } = {};
  rchainWeb: any;

  constructor() {
    console.log('RChainWeb', RChainWeb);
    if (typeof RChainWeb !== 'undefined') {
      this.rchainWeb = new RChainWeb.http({
        readOnlyHost: "dappynetwork://",
        validatorHost: "dappynetwork://",
      })
      console.log(this.rchainWeb)
    }
  }

  getTransactionValueJob = (id, transaction) => {
    console.log('getTransactionValueJob', id);
    try {
      if (this.jobs[id]) {
        return
      }
      if (typeof transaction.value !== 'string') {
        return;
      }
      this.jobs[id] = true;
      if (!this.rchainWeb) {
        console.warn('Cannot get transaction value, RChainWeb is not in scope');
        return;
      }
      let i = 0;
      let ongoing = false;
      let s = setInterval(() => {
        console.log('setInterval', i);
        if (ongoing) {
          return;
        }
        ongoing = true;
        if (i > 12) {
          clearInterval(s);
          return;
        }
        i += 1;
        const unforgeableId = transaction.value.slice(transaction.value.indexOf(': ') + 2).replace('"', '')
        console.log(transaction.value)
        console.log(unforgeableId);
        this.rchainWeb.dataAtName({
          name: {
            UnforgDeploy: { data: unforgeableId },
          },
          depth: 3,
        }).then(dan => {
          ongoing = false;
          console.log('ok');
          console.log(dan);
          if (JSON.parse(dan) && JSON.parse(dan).exprs && JSON.parse(dan).exprs.length) {
            console.log(RChainWeb.utils.rhoValToJs(dan.exprs[0]))
            clearInterval(s);
          }
        })
        .catch(err => {
          ongoing = false;
          console.log(err);
        })
  
      }, 10000)

    } catch (err) {
      console.warn('failed to get transaction value')
      console.log(err);
    }
  }

  sendMessageToHost = (m) => {
    return new Promise((resolve, reject) => {
      const interProcess2 = new XMLHttpRequest();
      interProcess2.open('POST', 'interprocessdapp://message-from-dapp-sandboxed');
      interProcess2.setRequestHeader(
        'Data',
        JSON.stringify({
          action: m,
        })
      );
      interProcess2.send();
      interProcess2.onloadend = () => {
        if (interProcess2.responseText && interProcess2.responseText.length) {
          reject(interProcess2.responseText)
        } else {
          resolve(undefined)
        }
      }
    });
  };

  initialState: State = {
    transactions: [],
    identifications: {},
  };

  store = createStore((state: any, action: any) => {
    switch (action.type) {
      case UPDATE_TRANSACTIONS: {
        const payload: UpdateTransactionsPayload = action.payload;

        return {
          ...state,
          transactions: payload.transactions,
        };
      }

      case UPDATE_IDENTIFICATIONS: {
        const payload: UpdateIdentificationsPayload = action.payload;
        return {
          ...state,
          identifications: {
            ...state.identifications,
            ...payload.identifications,
          },
        };
      }

      default: {
        return state;
      }
    }
  }, this.initialState);

  fetch(url: string) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.onreadystatechange = function (event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            resolve(this.responseText);
          } else {
            reject(this.status);
          }
        }
      };

      req.open('GET', url, true);
      req.setRequestHeader('Accept', 'rholang/term');
      req.send(null);
    });
  }

  identify(parameters: { publicKey: undefined | string }) {
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
      ).then(() => {
        this.identifications[callId] = {
          resolve: resolve,
          reject: reject,
        };
      })
      .catch(err => {
        reject(err)
      })
    });

    return promise;
  }

  sendTransaction(parameters: { term: string; signatures?: { [expr: string]: string } }) {
    const promise = new Promise((resolve, reject) => {
      const callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();

      this.sendMessageToHost(
        sendRChainTransactionFromSandboxAction({
          parameters: parameters,
          callId: callId,
        })
      ).then(() => {
        this.transactions[callId] = {
          resolve: resolve,
          reject: reject,
        };
      })
      .catch(err => {
        reject(err)
      })
    });

    return promise;
  }

  requestPayment(parameters: { from?: string; to: string; amount: number }) {
    const promise = new Promise((resolve, reject) => {

      const callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();

      this.sendMessageToHost(
        sendRChainPaymentRequestFromSandboxAction({
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
    Object.keys(transactions).forEach((key) => {
      this.getTransactionValueJob(key, transactions[key])
    });

    Object.keys(this.transactions).forEach((key) => {
      const callTransaction = Object.values(transactions).find(
        (t) => t.origin.origin === 'dapp' && t.origin.callId === key
      );
      if (callTransaction) {
        if (callTransaction.status === 'aired') {
          this.transactions[key].resolve(callTransaction);
        } else if (callTransaction.status === 'abandonned' || callTransaction.status === 'failed') {
          this.transactions[key].reject({
            error: `transaction ${callTransaction.status}`,
            transaction: callTransaction,
          });
        }
      }

      this.store.dispatch(updateTransactionsAction({ transactions: transactions }));
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

      this.store.dispatch(updateIdentificationsAction({ identifications: identifications }));
    });
  }
}
