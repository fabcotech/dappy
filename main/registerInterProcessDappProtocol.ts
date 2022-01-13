import { app, Session } from 'electron';
import { Store } from 'redux';
import * as yup from 'yup';
import path from 'path';

// todo, cannot do import, why ?
const rchainToolkit = require('rchain-toolkit');

import * as fromCommon from '../src/common';
import * as fromIdentificationsMain from './store/identifications';
import * as fromTransactionsMain from './store/transactions';
import * as fromBlockchainsMain from './store/blockchains';
import * as fromMain from '../src/store/main';
import * as fromBlockchain from '../src/store/blockchain';
import { splitSearch } from '../src/utils/splitSearch';
import { looksLikePublicKey } from '../src/utils/looksLikePublicKey';
import { SplitSearch } from '../src/models';
import { DappyBrowserView } from './models';

const stringOrNumber = yup.mixed().test({
  name: 'string or number',
  exclusive: true,
  message: 'must be a string or a number',
  test: (v) => v === null || v === undefined || typeof v === 'string' || typeof v === 'number',
});

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
    resourceId: yup.string(),
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
        nonce: stringOrNumber.required(),
        gasPrice: yup.string().required(),
        gasLimit: yup.string().required(),
        value: yup.string().optional(),
        data: yup.string().optional(),
        from: yup.string().optional(),
        to: yup.string().required(),
        chainId: yup.string().optional(),
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
  dispatchFromMain
) => {
  session.protocol.registerBufferProtocol('interprocessdapp', (request, callback) => {
    let data: { [a: string]: any } = {};
    try {
      data = JSON.parse(request.headers['Data']);
    } catch (e) {}

    if (request.url === 'interprocessdapp://hi-from-dapp-sandboxed') {
      try {
        callback(
          Buffer.from(
            JSON.stringify({
              type: fromCommon.DAPP_INITIAL_SETUP,
              payload: {
                html: dappyBrowserView.html,
                dappyDomain: dappyBrowserView.dappyDomain,
                path: dappyBrowserView.path,
                title: dappyBrowserView.title,
                resourceId: dappyBrowserView.resourceId,
                appPath: path.join(app.getAppPath(), 'dist/'),
              },
            })
          )
        );
      } catch (err) {
        console.log(err);
        callback(null);
        return;
      }
    }

    if (request.url === 'interprocessdapp://get-identifications') {
      const identifications = fromIdentificationsMain.getIdentificationsMain(store.getState());
      callback(Buffer.from(JSON.stringify({ identifications: identifications[dappyBrowserView.resourceId] })));
    }

    if (request.url === 'interprocessdapp://get-transactions') {
      const transactions = fromTransactionsMain.getTransactionsMain(store.getState());
      callback(Buffer.from(JSON.stringify({ transactions: transactions[dappyBrowserView.resourceId] })));
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

        let searchSplitted: undefined | SplitSearch = undefined;
        try {
          searchSplitted = splitSearch(dappyBrowserView.dappyDomain);
        } catch (err) {
          console.error('[interprocessdapp://] could not parse dappyDomain');
          callback(Buffer.from('Error parsing domain'));
          return;
        }

        if (data.action.type === fromCommon.IDENTIFY_FROM_SANDBOX) {
          identifyFromSandboxSchema
            .validate(payloadBeforeValid)
            .then(() => {
              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  resourceId: dappyBrowserView.resourceId,
                  title: 'IDENTIFICATION_MODAL',
                  text: '',
                  parameters: {
                    ...payloadBeforeValid,
                    resourceId: dappyBrowserView.resourceId,
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

              if (payload.parameters.value && payload.parameters.value.startsWith('0x')) {
                throw new Error('.value must be provided as raw string and not hexadecimal value')
              }
              if (payload.parameters.gasLimit && payload.parameters.gasLimit.startsWith('0x')) {
                throw new Error('.gasLimit must be provided as raw string and not hexadecimal value')
              }
              if (payload.parameters.gasPrice && payload.parameters.gasPrice.startsWith('0x')) {
                throw new Error('.gasPrice must be provided as raw string and not hexadecimal value')
              }
              const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
              const payload2: fromCommon.SignEthereumTransactionFromMiddlewarePayload = {
                parameters: payload.parameters,
                origin: {
                  origin: 'dapp',
                  accountName: undefined,
                  resourceId: dappyBrowserView.resourceId,
                  dappTitle: dappyBrowserView.title,
                  callId: payload.callId,
                },
                resourceId: dappyBrowserView.resourceId,
                chainId: (searchSplitted as SplitSearch).chainId,
                id: id,
              };

              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  resourceId: dappyBrowserView.resourceId,
                  title: 'ETHEREUM_SIGN_TRANSACTION_MODAL',
                  text: '',
                  parameters: payload2,
                  buttons: [],
                }),
              });
              callback(Buffer.from(''));
            })
            .catch((err: Error) => {
              console.error('[interprocessdapp://] a dapp tried to request Sign Ethereum transaction with an invalid schema');
              console.error(err.message);
              callback(Buffer.from(err.message));
              return;
            });
          return;
        }

        // RCHAIN
        const okBlockchains = fromBlockchainsMain.getOkBlockchainsMain(state);
        try {
          if (!okBlockchains[searchSplitted.chainId]) {
            dispatchFromMain({
              action: fromBlockchain.saveFailedRChainTransactionAction({
                blockchainId: searchSplitted.chainId,
                platform: 'rchain',
                origin: {
                  origin: 'dapp',
                  accountName: undefined,
                  resourceId: dappyBrowserView.resourceId,
                  dappTitle: dappyBrowserView.title,
                  callId: payloadBeforeValid.callId,
                },
                value: { message: `blockchain ${searchSplitted.chainId} not available` },
                sentAt: new Date().toISOString(),
                id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
              }),
            });
            console.error(`[interprocessdapp://] blockchain ${searchSplitted.chainId} not available`);
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
                  resourceId: dappyBrowserView.resourceId,
                  dappTitle: dappyBrowserView.title,
                  callId: payload.callId,
                },
                resourceId: dappyBrowserView.resourceId,
                chainId: (searchSplitted as SplitSearch).chainId,
                id: id,
              };

              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  resourceId: dappyBrowserView.resourceId,
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
                  resourceId: dappyBrowserView.resourceId,
                  dappTitle: dappyBrowserView.title,
                  callId: payload.callId,
                },
                chainId: (searchSplitted as SplitSearch).chainId,
                resourceId: dappyBrowserView.resourceId,
                id: id,
              };

              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  resourceId: dappyBrowserView.resourceId,
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
