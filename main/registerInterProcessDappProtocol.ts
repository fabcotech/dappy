import { Session } from 'electron';
import { Store } from 'redux';
import * as yup from 'yup';

import * as fromCommon from '../src/common';
import * as fromSettingsMain from './store/settings';
import * as fromMain from '../src/store/main';
import { toHex } from '../src/utils/toHex';
import { atLeastOneMatchInWhitelist } from '../src/utils/matchesWhitelist';
import { DappyBrowserView } from './models';
import { DispatchFromMainArg } from './main';
import { BlockchainAccount } from '/models';

const getEvmAccountForHost = (
  evmAccounts: Record<string, BlockchainAccount>,
  host: string
): BlockchainAccount | undefined => {
  const accountId = Object.keys(evmAccounts).find((id) => {
    if (atLeastOneMatchInWhitelist(evmAccounts[id].whitelist, host) && evmAccounts[id].chainId) {
      return true;
    }
    return false;
  });
  if (accountId) {
    return evmAccounts[accountId];
  }
  return undefined;
};

const hexString = yup
  .string()
  .matches(/^0x[0-9a-fA-F]+$/, 'string must be in hexadecimal and starts with 0x');

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

    console.log('interprocessdapp://', dappyBrowserView.tabId);

    // ETHEREUM
    if (request.url === 'interprocessdapp://eth_sendTransaction') {
      console.log('interprocessdapp://eth_sendTransaction');
      console.log(data.params[0]);
      if (!data.params || !data.params[0] || !data.params[0].chainId || !data.params[0].from) {
        console.log(
          `[eth] browser view ${dappyBrowserView.tabId} invalid payload eth_sendTransaction`
        );
        callback(
          Buffer.from(
            JSON.stringify({
              success: false,
              data: {
                code: 4100,
                message: 'Unauthorized',
              },
            })
          )
        );
        return;
      }

      let oneAccountAuthorized = false;
      const evmAccounts = fromSettingsMain.getEVMAccounts(store.getState());
      Object.keys(dappyBrowserView.connections).forEach((a) => {
        if (toHex(dappyBrowserView.connections[a].chainId as string) === data.params[0].chainId) {
          if (evmAccounts[a].address === data.params[0].from) {
            oneAccountAuthorized = true;
          }
        }
      });
      if (!oneAccountAuthorized) {
        console.log(
          `[eth] browser view ${dappyBrowserView.tabId} unauthorized eth_sendTransaction`
        );
        callback(
          Buffer.from(
            JSON.stringify({
              success: false,
              data: {
                code: 4100,
                message: 'Unauthorized',
              },
            })
          )
        );
        return;
      }

      dispatchFromMain({
        action: fromMain.openDappModalAction({
          tabId: dappyBrowserView.tabId,
          title: 'ETHEREUM_SIGN_TRANSACTION_MODAL',
          text: '',
          parameters: {
            parameters: data.params[0],
            origin: dappyBrowserView.host,
          },
          buttons: [],
        }),
      });
    }

    if (request.url === 'interprocessdapp://eth_chainId') {
      const evmAccounts = fromSettingsMain.getEVMAccounts(store.getState());
      const evmAccount = getEvmAccountForHost(evmAccounts, dappyBrowserView.host);
      let success = false;
      let returnData: any = null;
      if (evmAccount) {
        success = true;
        returnData = evmAccount.chainId ? toHex(evmAccount.chainId as string) : null;
        console.log(
          `[eth] browser view ${dappyBrowserView.tabId} connected with account ${evmAccount.name}`
        );
      } else {
        returnData = {
          code: 4100,
          message: 'Unauthorized',
        };
        console.log(
          `[eth] browser view ${dappyBrowserView.tabId} could not connect with any account`
        );
      }

      callback(
        Buffer.from(
          JSON.stringify({
            success: success,
            data: returnData,
          })
        )
      );
    }

    if (
      request.url === 'interprocessdapp://eth_requestAccounts' ||
      request.url === 'interprocessdapp://eth_accounts'
    ) {
      const evmAccounts = fromSettingsMain.getEVMAccounts(store.getState());
      const evmAccount = getEvmAccountForHost(evmAccounts, dappyBrowserView.host);
      let success = false;
      let returnData: any = null;
      if (evmAccount) {
        success = true;
        returnData = [evmAccount.address];
        dappyBrowserView.connections[evmAccount.name] = {
          chainId: evmAccount.chainId as string,
        };
        console.log(
          `[eth] browser view ${dappyBrowserView.tabId} connected with account ${evmAccount.name}`
        );
      } else {
        returnData = {
          code: 4100,
          message: 'Unauthorized',
        };
        console.log(
          `[eth] browser view ${dappyBrowserView.tabId} could not connect with any account`
        );
      }

      callback(
        Buffer.from(
          JSON.stringify({
            success: success,
            data: returnData,
          })
        )
      );
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
