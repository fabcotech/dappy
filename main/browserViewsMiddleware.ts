import { ipcMain } from 'electron';
import * as yup from 'yup';
import { Store } from 'redux';

import { State } from './store';
import * as fromBlockchainsMain from './store/blockchains';
import * as fromBrowserViewsMain from './store/browserViews';

import * as fromCommon from '../src/common';
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

/* tab process - main process */
export const browserViewsMiddleware = (store: Store<State>, dispatchFromMain: (a: any) => void) => {
  ipcMain.on('message-from-dapp-sandboxed', (commEvent, action) => {
    try {
      const state = store.getState();
      const payloadBeforeValid = action.payload;
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
        return;
      }

      const okBlockchains = fromBlockchainsMain.getOkBlockchainsMain(state);
      const browserViews = fromBrowserViewsMain.getBrowserViewsMain(state);

      const browserViewFoundByRandomId = Object.values(browserViews).find(
        (d) => browserViews[d.resourceId] && browserViews[d.resourceId].randomId === payloadBeforeValid.randomId
      );

      if (!browserViewFoundByRandomId) {
        console.error('A dapp dispatched a transaction with an invalid randomId');
        return;
      }

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
                dappId: browserViewFoundByRandomId.resourceId,
                dappTitle: browserViewFoundByRandomId.title,
                callId: payloadBeforeValid.callId,
              },
              value: { message: `blockchain ${searchSplitted.chainId} not available` },
              sentAt: new Date().toISOString(),
              id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
            }),
          });
          console.error(`blockchain ${searchSplitted.chainId} not available`);
          return;
        }

        if (browserViewFoundByRandomId.resourceId !== payloadBeforeValid.dappId) {
          dispatchFromMain({
            action: fromBlockchain.saveFailedRChainTransactionAction({
              blockchainId: searchSplitted.chainId,
              platform: 'rchain',
              origin: {
                origin: 'dapp',
                dappId: browserViewFoundByRandomId.resourceId,
                dappTitle: browserViewFoundByRandomId.title,
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
              browserViewFoundByRandomId.resourceId
          );
          return;
        }
      } catch (err) {
        console.error('Unknown error');
        console.error(err);
        return;
      }

      if (action.type === fromCommon.SEND_RCHAIN_TRANSACTION_FROM_SANDBOX) {
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
                dappTitle: browserViewFoundByRandomId.title,
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
          })
          .catch((err: Error) => {
            // todo : does the dapp need to have this error returned ?
            console.error('A dapp tried to send RChain transaction with an invalid schema');
            console.error(err);
            return;
          });
      } else if (action.type === fromCommon.SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX) {
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
                dappTitle: browserViewFoundByRandomId.title,
                callId: payload.callId,
              },
              chainId: (searchSplitted as SplitSearch).chainId,
              dappId: payload.dappId,
              id: id,
            };

            dispatchFromMain({
              action: fromMain.openDappModalAction({
                dappId: browserViewFoundByRandomId.resourceId,
                title: 'PAYMENT_REQUEST_MODAL',
                text: '',
                parameters: payload2,
                buttons: [],
              }),
            });
          })
          .catch((err: Error) => {
            // todo : does the dapp need to have this error returned ?
            console.error('A dapp tried to send RChain transaction with an invalid schema');
            console.error(err);
            return;
          });
      } else if (action.type === fromCommon.IDENTIFY_FROM_SANDBOX) {
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
          })
          .catch((err: Error) => {
            console.error('A dapp tried to trigger an identification with an invalid schema');
            console.error(err);
          });
      }
    } catch (err) {
      console.error('An error occured in browserViewsMiddleware');
      console.error(err);
    }
  });
};
