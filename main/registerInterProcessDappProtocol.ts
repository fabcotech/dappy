import { app, Session } from 'electron';
import { Store } from 'redux';
import * as yup from 'yup';
import path from 'path';

// todo, cannot do import, why ?
const rchainToolkit = require('@fabcotech/rchain-toolkit');

import * as fromCommon from '../src/common';
import * as fromIdentificationsMain from './store/identifications';
import * as fromTransactionsMain from './store/transactions';
import * as fromBlockchainsMain from './store/blockchains';
import * as fromMain from '../src/store/main';
import * as fromBlockchain from '../src/store/blockchain';
import { looksLikePublicKey } from '../src/utils/looksLikePublicKey';
import { DappyBrowserView } from './models';
import { DispatchFromMainArg } from './main';

const hexString = yup.string().matches(/^0x[0-9a-fA-F]+$/, 'string must be in hexadecimal and starts with 0x');

const identifyFromSandboxSchema = yup
  .object()
  .shape({
    parameters: yup
      .object()
      .shape({
        publicKey: yup.string(),
      })
      .noUnknown()
      .strict(true)
      .required(),
    callId: yup.string().required(),
    tabId: yup.string(),
  })
  .noUnknown()
  .strict(true)
  .required();

const sendRChainPaymentRequestFromSandboxSchema = yup
  .object()
  .shape({
    parameters: yup
      .object()
      .shape({
        from: yup.string(),
        // .to is required when it comes from dapp
        to: yup.string().required(),
        // .amount is required when it comes from dapp
        amount: yup.number().required(),
      })
      .noUnknown()
      .strict(true)
      .required(),
    callId: yup.string().required(),
  })
  .strict(true)
  .noUnknown()
  .required();

const signEthereumTransactionFromSandboxSchema = yup
  .object()
  .shape({
    parameters: yup
      .object()
      .shape({
        nonce: hexString.required(),
        gasPrice: hexString.required(),
        gasLimit: hexString.required(),
        value: hexString.optional(),
        data: hexString.optional(),
        from: hexString.optional(),
        to: hexString.required(),
        chainId: yup.number().required(),
      })
      .noUnknown()
      .required()
      .strict(true),
    callId: yup.string().required(),
  })
  .strict(true)
  .noUnknown()
  .required();

const sendRChainTransactionFromSandboxSchema = yup
  .object()
  .shape({
    parameters: yup
      .object()
      .shape({
        term: yup.string().required(),
        signatures: yup.object(),
      })
      .noUnknown()
      .required()
      .strict(true),
    callId: yup.string().required(),
  })
  .strict(true)
  .noUnknown()
  .required();

/* browser process - main process */
export const registerInterProcessDappProtocol = (
  dappyBrowserView: DappyBrowserView,
  session: Session,
  store: Store,
  dispatchFromMain: (a: DispatchFromMainArg) => void,
) => {
  return session.protocol.registerBufferProtocol('interprocessdapp', (request, callback) => {
    let data: { [a: string]: any } = {};
    try {
      data = JSON.parse(request.headers['Data']);
    } catch (e) {}

    if (request.url === 'interprocessdapp://get-identifications') {
      const identifications = fromIdentificationsMain.getIdentificationsMain(store.getState());
      callback(Buffer.from(JSON.stringify({ identifications: identifications[dappyBrowserView.tabId] })));
    }

    if (request.url === 'interprocessdapp://get-transactions') {
      const transactions = fromTransactionsMain.getTransactionsMain(store.getState());
      callback(Buffer.from(JSON.stringify({ transactions: transactions[dappyBrowserView.tabId] })));
    }

    if (request.url === 'interprocessdapp://message-from-dapp-sandboxed') {
      try {
        const state = store.getState();
        const payloadBeforeValid = data.action.payload;

        if (!payloadBeforeValid) {
          console.error('[interprocessdapp://] dapp dispatched a transaction with an invalid payload');
          callback(Buffer.from('invalid payload'));
          return;
        }

        if (data.action.type === fromCommon.IDENTIFY_FROM_SANDBOX) {
          identifyFromSandboxSchema
            .validate(payloadBeforeValid)
            .then(() => {
              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  tabId: dappyBrowserView.tabId,
                  title: 'IDENTIFICATION_MODAL',
                  text: '',
                  parameters: {
                    ...payloadBeforeValid,
                    tabId: dappyBrowserView.tabId,
                  },
                  buttons: [],
                }),
              });
              callback(Buffer.from(''));
            })
            .catch((err: Error) => {
              console.error('A dapp tried to trigger an identification with an invalid schema');
              console.error(err);
              callback(Buffer.from(err.message));
            });
          return;
        }

        // ETHEREUM / EVM
        if (data.action.type === fromCommon.SIGN_ETHEREUM_TRANSACTION_FROM_SANDBOX) {
          signEthereumTransactionFromSandboxSchema
            .validate(payloadBeforeValid)
            .then((valid) => {
              const payload: fromCommon.SignEthereumTransactionFromSandboxPayload = payloadBeforeValid;
              const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
              const payload2: fromCommon.SignEthereumTransactionFromMiddlewarePayload = {
                parameters: payload.parameters,
                origin: {
                  origin: 'dapp',
                  accountName: undefined,
                  tabId: dappyBrowserView.tabId,
                  dappTitle: dappyBrowserView.title,
                  callId: payload.callId,
                },
                tabId: dappyBrowserView.tabId,
                chainId: '',
                id: id,
              };

              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  tabId: dappyBrowserView.tabId,
                  title: 'ETHEREUM_SIGN_TRANSACTION_MODAL',
                  text: '',
                  parameters: payload2,
                  buttons: [],
                }),
              });
              callback(Buffer.from(''));
            })
            .catch((err: Error) => {
              console.error(
                '[interprocessdapp://] a dapp tried to request Sign Ethereum transaction with an invalid schema'
              );
              console.error(err.message);
              callback(Buffer.from(err.message));
              return;
            });
          return;
        }

        // RCHAIN
        const okBlockchains = fromBlockchainsMain.getOkBlockchainsMain(state);

        const chainId = Object.keys(okBlockchains)[0];
        try {
          if (!chainId) {
            dispatchFromMain({
              action: fromBlockchain.saveFailedRChainTransactionAction({
                blockchainId: chainId,
                platform: 'rchain',
                origin: {
                  origin: 'dapp',
                  accountName: undefined,
                  tabId: dappyBrowserView.tabId,
                  dappTitle: dappyBrowserView.title,
                  callId: payloadBeforeValid.callId,
                },
                value: { message: `blockchain ${chainId} not available` },
                sentAt: new Date().toISOString(),
                id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
              }),
            });
            console.error(`[interprocessdapp://] blockchain ${chainId} not available`);
            callback(Buffer.from('blockchain not found'));
            return;
          }
        } catch (err) {
          console.error('[interprocessdapp://] unknown error');
          console.error(err);
          callback(Buffer.from(err.message));
          return;
        }

        if (data.action.type === fromCommon.SEND_RCHAIN_TRANSACTION_FROM_SANDBOX) {
          sendRChainTransactionFromSandboxSchema
            .validate(payloadBeforeValid)
            .then((valid) => {
              if (payloadBeforeValid.parameters.signatures) {
                Object.keys(payloadBeforeValid.parameters.signatures).forEach((k) => {
                  if (typeof k !== 'string' || typeof payloadBeforeValid.parameters.signatures[k] !== 'string') {
                    throw new Error('[interprocessdapp://] payloadBeforeValid.parameters.signatures is not valid');
                  }
                });
              }

              const payload: fromCommon.SendRChainTransactionFromSandboxPayload = payloadBeforeValid;

              const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
              const payload2: fromCommon.SendRChainTransactionFromMiddlewarePayload = {
                parameters: payload.parameters,
                origin: {
                  origin: 'dapp',
                  accountName: undefined,
                  tabId: dappyBrowserView.tabId,
                  dappTitle: dappyBrowserView.title,
                  callId: payload.callId,
                },
                tabId: dappyBrowserView.tabId,
                chainId: chainId,
                id: id,
              };

              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  tabId: dappyBrowserView.tabId,
                  title: 'RCHAIN_TRANSACTION_MODAL',
                  text: '',
                  parameters: payload2,
                  buttons: [],
                }),
              });
              callback(Buffer.from(''));
            })
            .catch((err: Error) => {
              console.error('[interprocessdapp://] a dapp tried to send RChain transaction with an invalid schema');
              console.error(err);
              callback(Buffer.from(err.message));
              return;
            });
        } else if (data.action.type === fromCommon.SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX) {
          sendRChainPaymentRequestFromSandboxSchema
            .validate(payloadBeforeValid)
            .then(() => {
              const payload: fromCommon.SendRChainPaymentRequestFromSandboxPayload = payloadBeforeValid;

              if (looksLikePublicKey(payload.parameters.to)) {
                try {
                  payload.parameters.to = rchainToolkit.utils.revAddressFromPublicKey(payload.parameters.to);
                } catch (err) {
                  console.error('[interprocessdapp://] failed to generate REV address based on public key');
                  console.error(err);
                  callback(Buffer.from('failed to generate REV address based on public key'));
                  return;
                }
              }

              const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
              const payload2: fromCommon.SendRChainPaymentRequestFromMiddlewarePayload = {
                parameters: payload.parameters,
                origin: {
                  origin: 'dapp',
                  tabId: dappyBrowserView.tabId,
                  dappTitle: dappyBrowserView.title,
                  callId: payload.callId,
                },
                chainId: chainId,
                tabId: dappyBrowserView.tabId,
                id: id,
              };

              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  tabId: dappyBrowserView.tabId,
                  title: 'PAYMENT_REQUEST_MODAL',
                  text: '',
                  parameters: payload2,
                  buttons: [],
                }),
              });
              callback(Buffer.from(''));
            })
            .catch((err: Error) => {
              // todo : does the dapp need to have this error returned ?
              console.error('[interprocessdapp://] A dapp tried to send RChain transaction with an invalid schema');
              console.error(err);
              callback(Buffer.from(err.message));
              return;
            });
        }
      } catch (err) {
        console.error('[interprocessdapp://] An error occured');
        console.error(err);
        callback(Buffer.from(err.message));
      }
    }
  });
};
