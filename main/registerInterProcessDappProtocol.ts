import { app, Session } from 'electron';
import { Store } from 'redux';
import * as yup from 'yup';
import path from 'path';

import * as fromCommon from '../src/common';
import * as fromBrowserViewsMain from './store/browserViews';
import * as fromIdentificationsMain from './store/identifications';
import * as fromTransactionsMain from './store/transactions';
import * as fromBlockchainsMain from './store/blockchains';
import * as fromMain from '../src/store/main';
import * as fromBlockchain from '../src/store/blockchain';
import { splitSearch } from '../src/utils/splitSearch';
import { SplitSearch } from '../src/models';

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
    dappId: yup.string().required(),
    randomId: yup.string().required(),
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
    dappId: yup.string().required(),
    randomId: yup.string().required(),
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
    dappId: yup.string().required(),
    randomId: yup.string().required(),
  })
  .strict(true)
  .noUnknown()
  .required();

/* browser process - main process */
export const registerInterProcessDappProtocol = (session: Session, store: Store, dispatchFromMain) => {
  session.protocol.registerBufferProtocol('interprocessdapp', (request, callback) => {
    let id;
    let data: any;
    const browserViews = fromBrowserViewsMain.getBrowserViewsMain(store.getState());
    try {
      data = JSON.parse(request.headers['Data']);
      id = Object.keys(browserViews).find((k) => browserViews[k].randomId === data.randomId);
      if (!id) {
        console.error('Could not find browser view from hi-from-dapp-sandboxed message');
        console.log('data.randomId', data.randomId);
        console.log(Object.keys(browserViews).map((k) => browserViews[k].randomId));
        callback(Buffer.from(''));
        return;
      }
    } catch (e) {
      console.error('Error in hi-from-dapp-sandboxed message');
      console.log(e);
      callback(Buffer.from(''));
      return;
    }

    const browserView = browserViews[id];

    if (request.url === 'interprocessdapp://hi-from-dapp-sandboxed') {
      try {
        callback(
          Buffer.from(
            JSON.stringify({
              type: fromCommon.DAPP_INITIAL_SETUP,
              payload: {
                html: browserView.html,
                dappyDomain: browserView.dappyDomain,
                path: browserView.path,
                title: browserView.title,
                dappId: browserView.resourceId,
                randomId: browserView.randomId,
                appPath: path.join(app.getAppPath(), 'dist/'),
              },
            })
          )
        );
      } catch (err) {
        console.error('Could not get randomId from hi-from-dapp-sandboxed message');
        callback(Buffer.from(''));
        return;
      }
    }

    if (request.url === 'interprocessdapp://get-identifications') {
      const identifications = fromIdentificationsMain.getIdentificationsMain(store.getState());
      callback(Buffer.from(JSON.stringify({ identifications: identifications[browserView.resourceId] })));
    }

    if (request.url === 'interprocessdapp://get-transactions') {
      const transactions = fromTransactionsMain.getTransactionsMain(store.getState());
      callback(Buffer.from(JSON.stringify({ transactions: transactions[browserView.resourceId] })));
    }

    if (request.url === 'interprocessdapp://message-from-dapp-sandboxed') {
      try {
        const state = store.getState();
        const payloadBeforeValid = data.action.payload;

        if (!payloadBeforeValid || !payloadBeforeValid.randomId || !payloadBeforeValid.dappId) {
          if (payloadBeforeValid) {
            console.error('A dapp dispatched a transaction with an invalid payload');
          } else {
            console.error(
              'A dapp dispatched a transaction with an invalid payload, randomId : ' +
                payloadBeforeValid.randomId +
                ', dappId : ' +
                payloadBeforeValid.dappId
            );
          }
          callback(Buffer.from(''));
          return;
        }

        const okBlockchains = fromBlockchainsMain.getOkBlockchainsMain(state);
        let searchSplitted: undefined | SplitSearch = undefined;

        try {
          searchSplitted = splitSearch(payloadBeforeValid.dappId);

          if (!okBlockchains[searchSplitted.chainId]) {
            dispatchFromMain({
              action: fromBlockchain.saveFailedRChainTransactionAction({
                blockchainId: searchSplitted.chainId,
                platform: 'rchain',
                origin: {
                  origin: 'dapp',
                  dappId: browserView.resourceId,
                  dappTitle: browserView.title,
                  callId: payloadBeforeValid.callId,
                },
                value: { message: `blockchain ${searchSplitted.chainId} not available` },
                sentAt: new Date().toISOString(),
                id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
              }),
            });
            console.error(`blockchain ${searchSplitted.chainId} not available`);
            callback(Buffer.from(''));
            return;
          }

          if (browserView.resourceId !== payloadBeforeValid.dappId) {
            dispatchFromMain({
              action: fromBlockchain.saveFailedRChainTransactionAction({
                blockchainId: searchSplitted.chainId,
                platform: 'rchain',
                origin: {
                  origin: 'dapp',
                  dappId: browserView.resourceId,
                  dappTitle: browserView.title,
                  callId: payloadBeforeValid.callId,
                },
                value: { message: `Wrong id, identity theft attempt` },
                sentAt: new Date().toISOString(),
                id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
              }),
            });
            console.error(
              'A dapp dispatched a transaction with randomId and dappId that do not match ' +
                'dappId from payload: ' +
                payloadBeforeValid.dappId +
                ', dappId found from randomId: ' +
                browserView.resourceId
            );
            callback(Buffer.from(''));
            return;
          }
        } catch (err) {
          console.error('Unknown error');
          console.error(err);
          callback(Buffer.from(''));
          return;
        }

        if (data.action.type === fromCommon.SEND_RCHAIN_TRANSACTION_FROM_SANDBOX) {
          sendRChainTransactionFromSandboxSchema
            .validate(payloadBeforeValid)
            .then((valid) => {
              if (payloadBeforeValid.parameters.signatures) {
                Object.keys(payloadBeforeValid.parameters.signatures).forEach((k) => {
                  if (typeof k !== 'string' || typeof payloadBeforeValid.parameters.signatures[k] !== 'string') {
                    throw new Error('payloadBeforeValid.parameters.signatures is not valid');
                  }
                });
              }

              const payload: fromCommon.SendRChainTransactionFromSandboxPayload = payloadBeforeValid;

              const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
              const payload2: fromCommon.SendRChainTransactionFromMiddlewarePayload = {
                parameters: payload.parameters,
                origin: {
                  origin: 'dapp',
                  dappId: payload.dappId,
                  dappTitle: browserView.title,
                  callId: payload.callId,
                },
                chainId: (searchSplitted as SplitSearch).chainId,
                dappId: payload.dappId,
                id: id,
              };

              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  dappId: payload.dappId,
                  title: 'TRANSACTION_MODAL',
                  text: '',
                  parameters: payload2,
                  buttons: [],
                }),
              });
              callback(Buffer.from(''));
            })
            .catch((err: Error) => {
              // todo : does the dapp need to have this error returned ?
              console.error('A dapp tried to send RChain transaction with an invalid schema');
              console.error(err);
              return;
            });
        } else if (data.action.type === fromCommon.SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX) {
          sendRChainPaymentRequestFromSandboxSchema
            .validate(payloadBeforeValid)
            .then(() => {
              const payload: fromCommon.SendRChainPaymentRequestFromSandboxPayload = payloadBeforeValid;

              const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
              const payload2: fromCommon.SendRChainPaymentRequestFromMiddlewarePayload = {
                parameters: payload.parameters,
                origin: {
                  origin: 'dapp',
                  dappId: payload.dappId,
                  dappTitle: browserView.title,
                  callId: payload.callId,
                },
                chainId: (searchSplitted as SplitSearch).chainId,
                dappId: payload.dappId,
                id: id,
              };

              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  dappId: browserView.resourceId,
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
              console.error('A dapp tried to send RChain transaction with an invalid schema');
              console.error(err);
              return;
            });
        } else if (data.action.type === fromCommon.IDENTIFY_FROM_SANDBOX) {
          identifyFromSandboxSchema
            .validate(payloadBeforeValid)
            .then((valid) => {
              dispatchFromMain({
                action: fromMain.openDappModalAction({
                  dappId: payloadBeforeValid.dappId,
                  title: 'IDENTIFICATION_MODAL',
                  text: '',
                  parameters: payloadBeforeValid,
                  buttons: [],
                }),
              });
              callback(Buffer.from(''));
            })
            .catch((err: Error) => {
              console.error('A dapp tried to trigger an identification with an invalid schema');
              console.error(err);
            });
        }
      } catch (err) {
        console.error('An error occured when checking message-from-dapp-sandboxed');
        console.error(err);
      }
    }
  });
};
