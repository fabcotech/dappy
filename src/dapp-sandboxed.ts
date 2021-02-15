import { createStore } from 'redux';
import * as rchainToolkit from 'rchain-toolkit';

import * as fromCommon from './common';
import {
  sendRChainTransactionFromSandboxAction,
  identifyFromSandboxAction,
  sendRChainPaymentRequestFromSandboxAction,
} from './common';
import { TransactionState, Identification } from './models';
import { buildUnforgeableNameQuery } from './utils/buildUnforgeableNameQuery';
import { generateSignature } from './utils/generateSignature';
import { generateNonce } from './utils/generateNonce';

const blockchainUtils = {
  rhoValToJs: rchainToolkit.utils.rhoValToJs,
  revAddressFromPublicKey: rchainToolkit.utils.revAddressFromPublicKey,
  toByteArray: rchainToolkit.utils.toByteArray,
  buildUnforgeableNameQuery: buildUnforgeableNameQuery,
  generateNonce: generateNonce,
  generateSignature: generateSignature,
  uInt8ArrayToHex: (uint8array: Uint8Array): string => {
    return uint8array.join(',');
  },
};
window.blockchainUtils = blockchainUtils;

const sendMessageToHost = (m) => {
  const interProcess2 = new XMLHttpRequest();
  interProcess2.open('POST', 'interprocessdapp://message-from-dapp-sandboxed');
  interProcess2.setRequestHeader(
    'Data',
    JSON.stringify({
      randomId: randomId,
      action: m,
    })
  );
  interProcess2.send();
};

interface State {
  transactions: TransactionState[];
  identifications: {
    [callId: string]: Identification;
  };
}
const initialState: State = {
  transactions: [],
  identifications: {},
};

const store = createStore((state = initialState, action: any) => {
  switch (action.type) {
    case fromCommon.UPDATE_TRANSACTIONS: {
      const payload: fromCommon.UpdateTransactionsPayload = action.payload;

      return {
        ...state,
        transactions: payload.transactions,
      };
    }

    case fromCommon.UPDATE_IDENTIFICATIONS: {
      const payload: fromCommon.UpdateIdentificationsPayload = action.payload;
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
}, initialState);

window.dappyStore = store;

let dappId: undefined | string = undefined;
let randomId: undefined | string = undefined;

class DappyRChain {
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

  exploreDeploys(terms: string[]) {
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

      req.open('GET', 'dappy://explore-deploys', true);
      req.setRequestHeader('Explore-Deploys', JSON.stringify({ data: terms }));
      req.setRequestHeader('Accept', 'rholang/term');
      req.send(null);
    });
  }

  identify(parameters: { publicKey: undefined | string }) {
    const promise = new Promise((resolve, reject) => {
      if (!dappId) {
        const e = 'Cannot find dappId';
        console.error(e);
        reject(e);
        return;
      }
      if (!randomId) {
        const e = 'Cannot find randomId';
        console.error(e);
        reject(e);
        return;
      }

      let params = parameters;
      if (!params || !params.publicKey) {
        params = {
          publicKey: '',
        };
      }

      const callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();

      sendMessageToHost(
        identifyFromSandboxAction({
          parameters: params,
          callId: callId,
          dappId: dappId,
          randomId: randomId,
        })
      );

      this.identifications[callId] = {
        resolve: resolve,
        reject: reject,
      };
    });

    return promise;
  }

  transaction(parameters: { term: string; signatures?: { [expr: string]: string } }) {
    const promise = new Promise((resolve, reject) => {
      if (!dappId) {
        const e = 'Cannot find dappId';
        console.error(e);
        reject(e);
        return;
      }
      if (!randomId) {
        const e = 'Cannot find randomId';
        console.error(e);
        reject(e);
        return;
      }

      const callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();

      sendMessageToHost(
        sendRChainTransactionFromSandboxAction({
          parameters: parameters,
          callId: callId,
          dappId: dappId,
          randomId: randomId,
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
      if (!dappId) {
        const e = 'Cannot find dappId';
        console.error(e);
        reject(e);
        return;
      }
      if (!randomId) {
        const e = 'Cannot find randomId';
        console.error(e);
        reject(e);
        return;
      }

      const callId = new Date().valueOf().toString() + Math.round(Math.random() * 1000000).toString();

      sendMessageToHost(
        sendRChainPaymentRequestFromSandboxAction({
          parameters: parameters,
          callId: callId,
          dappId: dappId,
          randomId: randomId,
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
    const io = navigator.userAgent.indexOf('randomId=');
    randomId = navigator.userAgent.substring(io + 'randomId='.length);
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocessdapp://get-transactions');
    interProcess.setRequestHeader(
      'Data',
      JSON.stringify({
        randomId: randomId,
      })
    );
    interProcess.send();
    interProcess.onload = (a: any) => {
      try {
        const r = JSON.parse(a.target.responseText);
        const payload: fromCommon.UpdateTransactionsPayload = r;
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
        if (callTransaction.status === 'aired') {
          this.transactions[key].resolve(callTransaction);
        } else if (callTransaction.status === 'abandonned' || callTransaction.status === 'failed') {
          this.transactions[key].reject({
            error: `transaction ${callTransaction.status}`,
            transaction: callTransaction,
          });
        }
      }

      store.dispatch(fromCommon.updateTransactionsAction({ transactions: transactions }));
    });
  }

  requestIdentifications = () => {
    const io = navigator.userAgent.indexOf('randomId=');
    randomId = navigator.userAgent.substring(io + 'randomId='.length);
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocessdapp://get-identifications');
    interProcess.setRequestHeader(
      'Data',
      JSON.stringify({
        randomId: randomId,
      })
    );
    interProcess.send();
    interProcess.onload = (a: any) => {
      try {
        const r = JSON.parse(a.target.responseText);
        const payload: fromCommon.UpdateIdentificationsPayload = r;
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

      store.dispatch(fromCommon.updateIdentificationsAction({ identifications: identifications }));
    });
  }
}

const dappyRChain = new DappyRChain();
window.dappyRChain = dappyRChain;

window.messageFromMain = (action) => {
  if (action.type === fromCommon.DAPP_INITIAL_SETUP) {
    const payload: fromCommon.DappInitialSetupPayload = action.payload;
    console.log('[dappy] initial payload');
    console.log(payload);
    document.title = payload.title;
    dappId = payload.dappId;
    randomId = payload.randomId;
    window.dappy = {
      address: payload.address,
      path: payload.path,
      randomId: payload.randomId,
      dappId: payload.dappId,
    };

    document.write(payload.html.replace(new RegExp('dappyl://', 'g'), payload.appPath));
    document.close();

    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(() => {
        var link = document.querySelector("link[rel*='icon']");
        if (link !== null) {
          /*
            Multiply tries because the event 'page-favicon-updated' is not
            triggered if .appenChild is done too soon
          */
          setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(link.cloneNode());
          }, 100);
          setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(link.cloneNode());
          }, 500);
          setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(link.cloneNode());
          }, 2000);
          setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(link.cloneNode());
          }, 5000);
        }
      }, 0);
    });
  }
};

let DOMContentLoaded = false;
let initializePayload: any = undefined;

const io = navigator.userAgent.indexOf('randomId=');
randomId = navigator.userAgent.substring(io + 'randomId='.length);
const interProcess = new XMLHttpRequest();
interProcess.open('POST', 'interprocessdapp://hi-from-dapp-sandboxed');
interProcess.setRequestHeader(
  'Data',
  JSON.stringify({
    randomId: randomId,
  })
);
interProcess.send();
interProcess.onload = (a) => {
  try {
    const r = JSON.parse(a.target.responseText);
    initializePayload = r;
    if (DOMContentLoaded) {
      window.messageFromMain(r);
    }
  } catch (e) {
    reject({ message: 'could not parse response' });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  DOMContentLoaded = true;
  if (initializePayload) {
    window.messageFromMain(initializePayload);
  }
  dappyRChain.requestIdentifications();
  dappyRChain.requestTransactions();
});
