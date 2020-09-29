import * as yup from 'yup';

import { store } from './index';
import * as fromDapps from './dapps/index';
import * as fromBlockchain from './blockchain/index';
import * as fromMain from './main/index';
import * as fromSettings from './settings';
import * as fromCommon from '../common/index';
import { splitSearch } from '../utils/splitSearch';
import { Dapp, SplitSearch } from '../models';

const identifyFromSandboxSchema = yup
  .object()
  .shape({
    parameters: yup
      .object()
      .shape({
        publicKey: yup.string(),
      })
      .noUnknown()
      .required(),
    callId: yup.string().required(),
    dappId: yup.string().required(),
    randomId: yup.string().required(),
  })
  .noUnknown()
  .required();

const sendRChainPaymentRequestFromSandboxSchema = yup
  .object()
  .shape({
    parameters: yup
      .object()
      .shape({
        from: yup.string(),
        to: yup.string().required(),
        amount: yup.number().required(),
      })
      .noUnknown()
      .required(),
    callId: yup.string().required(),
    dappId: yup.string().required(),
    randomId: yup.string().required(),
  })
  .noUnknown()
  .required();

const sendRChainTransactionFromSandboxSchema = yup
  .object()
  .shape({
    parameters: yup
      .object()
      .shape({
        term: yup.string().required(),
      })
      .noUnknown()
      .required(),
    callId: yup.string().required(),
    dappId: yup.string().required(),
    randomId: yup.string().required(),
  })
  .noUnknown()
  .required();

export const initDappsMiddleWare = () => {
  window.onmessage = (event: any) => {
    const state = store.getState();
    const dappManifests = fromDapps.getDappManifests(state);

    const payloadBeforeValid = event.data.payload;
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

    const okBlockchains = fromSettings.getOkBlockchains(state);
    const activeDapps = fromDapps.getDapps(state);
    const tabs = fromDapps.getTabs(state);

    const dappFoundByRandomId = Object.values(activeDapps).find(
      (d) => dappManifests[d.id] && dappManifests[d.id].randomId === payloadBeforeValid.randomId
    );

    const tab = tabs.find((t) => t.id === (dappFoundByRandomId as Dapp).tabId);
    if (!tab) {
      console.error('A dapp dispatched a transaction with an invalid randomId');
      return;
    }

    if (!dappFoundByRandomId) {
      console.error('A dapp dispatched a transaction with an invalid randomId');
      return;
    }

    let searchSplitted: undefined | SplitSearch = undefined;

    try {
      searchSplitted = splitSearch(payloadBeforeValid.dappId);

      if (!okBlockchains[searchSplitted.chainId]) {
        store.dispatch(
          fromBlockchain.saveFailedRChainTransactionAction({
            blockchainId: searchSplitted.chainId,
            platform: 'rchain',
            origin: {
              origin: 'dapp',
              dappId: dappFoundByRandomId.id,
              dappTitle: tab.title,
              callId: payloadBeforeValid.callId,
            },
            value: { message: `blockchain ${searchSplitted.chainId} not available` },
            sentAt: new Date().toISOString(),
            id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
          })
        );
        console.error(`blockchain ${searchSplitted.chainId} not available`);
        return;
      }

      if (dappFoundByRandomId.id !== payloadBeforeValid.dappId) {
        store.dispatch(
          fromBlockchain.saveFailedRChainTransactionAction({
            blockchainId: searchSplitted.chainId,
            platform: 'rchain',
            origin: {
              origin: 'dapp',
              dappId: dappFoundByRandomId.id,
              dappTitle: tab.title,
              callId: payloadBeforeValid.callId,
            },
            value: { message: `Wrong id, identity theft attempt` },
            sentAt: new Date().toISOString(),
            id: new Date().getTime() + Math.round(Math.random() * 10000).toString(),
          })
        );
        console.error(
          'A dapp dispatched a transaction with randomId and dappId that do not match ' +
            'dappId from payload: ' +
            payloadBeforeValid.dappId +
            ', dappId found from randomId: ' +
            dappFoundByRandomId.id
        );
        return;
      }
    } catch (err) {
      console.error('Unknown error');
      console.error(err);
      return;
    }

    if (event.data.type === fromCommon.NAVIGATE && typeof event.data.payload.search === 'string') {
      store.dispatch(
        fromMain.openDappModalAction({
          dappId: event.data.payload.dappId,
          title: 'Navigation requested',
          text: `Do you want to navigate to ${event.data.payload.search} ?`,
          buttons: [
            {
              classNames: 'button is-light',
              text: 'Cancel',
            },
            {
              classNames: 'button is-link',
              text: 'Yes, navigate',
              action: fromDapps.loadResourceAction({
                address: event.data.payload.search,
              }),
            },
          ],
        })
      );
    } else if (event.data && event.data.type === fromCommon.SEND_RCHAIN_TRANSACTION_FROM_SANDBOX) {
      sendRChainTransactionFromSandboxSchema
        .validate(event.data.payload)
        .then(() => {
          const payload: fromCommon.SendRChainTransactionFromSandboxPayload = event.data.payload;

          const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
          const payload2: fromCommon.SendRChainTransactionFromMiddlewarePayload = {
            parameters: payload.parameters,
            origin: {
              origin: 'dapp',
              dappId: payload.dappId,
              dappTitle: dappManifests[dappFoundByRandomId.id].title,
              callId: payload.callId,
            },
            chainId: (searchSplitted as SplitSearch).chainId,
            dappId: payload.dappId,
            id: id,
          };

          store.dispatch(
            fromMain.openDappModalAction({
              dappId: event.data.payload.dappId,
              title: 'TRANSACTION_MODAL',
              text: '',
              parameters: payload2,
              buttons: [],
            })
          );
        })
        .catch((err: Error) => {
          // todo : does the dapp need to have this error returned ?
          console.error('A dapp tried to send RChain transaction with an invalid schema');
          console.error(err);
          return;
        });
    } else if (event.data && event.data.type === fromCommon.SEND_RCHAIN_PAYMENT_REQUEST_FROM_SANDBOX) {
      sendRChainPaymentRequestFromSandboxSchema
        .validate(event.data.payload)
        .then(() => {
          const payload: fromCommon.SendRChainPaymentRequestFromSandboxPayload = event.data.payload;

          const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
          const payload2: fromCommon.SendRChainPaymentRequestFromMiddlewarePayload = {
            parameters: payload.parameters,
            origin: {
              origin: 'dapp',
              dappId: payload.dappId,
              dappTitle: dappManifests[dappFoundByRandomId.id].title,
              callId: payload.callId,
            },
            chainId: (searchSplitted as SplitSearch).chainId,
            dappId: payload.dappId,
            id: id,
          };

          store.dispatch(
            fromMain.openDappModalAction({
              dappId: event.data.payload.dappId,
              title: 'PAYMENT_REQUEST_MODAL',
              text: '',
              parameters: payload2,
              buttons: [],
            })
          );
        })
        .catch((err: Error) => {
          // todo : does the dapp need to have this error returned ?
          console.error('A dapp tried to send RChain transaction with an invalid schema');
          console.error(err);
          return;
        });
    } else if (event.data && event.data.type === fromCommon.IDENTIFY_FROM_SANDBOX) {
      identifyFromSandboxSchema
        .validate(event.data.payload)
        .then((valid) => {
          store.dispatch(
            fromMain.openDappModalAction({
              dappId: event.data.payload.dappId,
              title: 'IDENTIFICATION_MODAL',
              text: '',
              parameters: event.data.payload,
              buttons: [],
            })
          );
        })
        .catch((err: Error) => {
          console.error('A dapp tried to trigger an identification with an invalid schema');
          console.error(err);
        });
    }
  };
};
