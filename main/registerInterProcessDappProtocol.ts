import { Session } from 'electron';
import { Store } from 'redux';
import * as yup from 'yup';
import * as fromCommon from '../src/common';
import * as fromIdentificationsMain from './store/identifications';
import * as fromTransactionsMain from './store/transactions';
import * as fromMain from '../src/store/main';
import { DappyBrowserView } from './models';
import { DispatchFromMainArg } from './main';

const hexString = yup
  .string()
  .matches(/^0x[0-9a-fA-F]+$/, 'string must be in hexadecimal and starts with 0x');

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

/* browser process - main process */
export const registerInterProcessDappProtocol = (
  dappyBrowserView: DappyBrowserView,
  session: Session,
  store: Store,
  dispatchFromMain: (a: DispatchFromMainArg) => void
) => {
  return session.protocol.registerBufferProtocol('interprocessdapp', (request, callback) => {
    let data: { [a: string]: any } = {};
    try {
      data = JSON.parse(request.headers.Data);
    } catch (e) {
      console.error(e);
      callback(Buffer.from('invalid payload'));
      return;
    }

    if (request.url === 'interprocessdapp://get-identifications') {
      const identifications = fromIdentificationsMain.getIdentificationsMain(store.getState());
      callback(
        Buffer.from(JSON.stringify({ identifications: identifications[dappyBrowserView.tabId] }))
      );
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
          console.error(
            '[interprocessdapp://] dapp dispatched a transaction with an invalid payload'
          );
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
            .then(() => {
              const payload: fromCommon.SignEthereumTransactionFromSandboxPayload =
                payloadBeforeValid;
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
                id,
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
            });
          return;
        }
      } catch (err) {
        console.error('[interprocessdapp://] An error occured');
        console.error(err);
        if (err instanceof Error) {
          callback(Buffer.from(err.message));
        }
      }
    }
  });
};
