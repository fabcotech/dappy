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
import { fetchEthBlockNumber, fetchEthCall } from './jsonRPCRequest';

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

const dispatchEthereumUnauthorizedOperation = (
  dispatchFromMain: (a: any) => void,
  tabId: string,
  host: string,
  text: string,
  method: string
) => {
  dispatchFromMain({
    action: fromMain.openDappModalAction({
      tabId: tabId,
      title: 'ETHEREUM_UNAUTHORIZED_OPERATION_MODAL',
      text: '',
      parameters: {
        text: text,
        host: host,
        method: method,
      },
      buttons: [],
    }),
  });
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

type DappHandler = (
  dappyBrowserView: DappyBrowserView,
  store: Store,
  dispatchFromMain: (a: DispatchFromMainArg) => void,
  data: any,
  url: string
) => void;

export const triggerUnauthorizedOperation = (
  dappyBrowserView: DappyBrowserView,
  dispatchFromMain: (a: DispatchFromMainArg) => void,
  operation: string
) => {
  dispatchEthereumUnauthorizedOperation(
    dispatchFromMain,
    dappyBrowserView.tabId,
    dappyBrowserView.host,
    'A dapp is asking for a network ID and was blocked. You need to manually add this host to a wallet whitelist, and link your wallet to a network.',
    operation
  );
  return {
    success: false,
    data: {
      code: 4100,
      message: 'Unauthorized',
    },
  };
};

export const sendTransaction: DappHandler = async (
  dappyBrowserView,
  store,
  dispatchFromMain,
  data
) => {
  if (!data.params || !data.params[0] || !data.params[0].chainId || !data.params[0].from) {
    return {
      success: false,
      data: {
        code: 4100,
        message: 'Unauthorized',
      },
    };
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
    return triggerUnauthorizedOperation(dappyBrowserView, dispatchFromMain, 'eth_sendTransaction');
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
  return {};
};

export const getChainId = (store: Store, hostname: string) => {
  const evmAccounts = fromSettingsMain.getEVMAccounts(store.getState());
  const evmAccount = getEvmAccountForHost(evmAccounts, hostname);
  return evmAccount?.chainId ? toHex(evmAccount.chainId as string) : undefined;
};

export const chainId: DappHandler = async (dappyBrowserView, store, dispatchFromMain) => {
  const id = getChainId(store, dappyBrowserView.host);

  if (!id) {
    return triggerUnauthorizedOperation(dappyBrowserView, dispatchFromMain, 'eth_chainId');
  }

  return {
    success: true,
    data: id,
  };
};

export const accounts: DappHandler = (dappyBrowserView, store, dispatchFromMain, data, action) => {
  const evmAccounts = fromSettingsMain.getEVMAccounts(store.getState());
  const evmAccount = getEvmAccountForHost(evmAccounts, dappyBrowserView.host);

  if (!evmAccount) {
    return triggerUnauthorizedOperation(dappyBrowserView, dispatchFromMain, action);
  }

  dappyBrowserView.connections[evmAccount.name] = {
    chainId: evmAccount.chainId as string,
  };

  return {
    success: true,
    data: [evmAccount.address],
  };
};

export const blockNumber: DappHandler = async (dappyBrowserView, store, dispatchFromMain) => {
  const id = getChainId(store, dappyBrowserView.host);

  if (!id) {
    triggerUnauthorizedOperation(dappyBrowserView, dispatchFromMain, 'eth_blockNumber');
    return {
      success: false,
      data: {
        code: 4100,
        message: 'Unauthorized',
      },
    };
  }

  const ethBlockNumber = await fetchEthBlockNumber(id);

  return {
    success: true,
    data: ethBlockNumber,
  };
};

export const call: DappHandler = async (dappyBrowserView, store, dispatchFromMain, data) => {
  const id = getChainId(store, dappyBrowserView.host);

  if (!id) {
    triggerUnauthorizedOperation(dappyBrowserView, dispatchFromMain, 'eth_blockNumber');
    return {
      success: false,
      data: {
        code: 4100,
        message: 'Unauthorized',
      },
    };
  }

  const callResponse = await fetchEthCall(id, data.params);

  return {
    success: true,
    data: callResponse,
  };
};

export const messageFromDapp: DappHandler = async (
  dappyBrowserView,
  _store,
  dispatchFromMain,
  data
) => {
  const payloadBeforeValid = data.action.payload;

  if (!payloadBeforeValid) {
    console.error('[interprocessdapp://] dapp dispatched a transaction with an invalid payload');
    return 'invalid payload';
  }

  // ETHEREUM / EVM
  if (data.action.type === fromCommon.SIGN_ETHEREUM_TRANSACTION_FROM_SANDBOX) {
    return signEthereumTransactionFromSandboxSchema
      .validate(payloadBeforeValid)
      .then(() => {
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
        return '';
      })
      .catch((err: Error) => {
        console.error(
          '[interprocessdapp://] a dapp tried to request Sign Ethereum transaction with an invalid schema'
        );
        console.error(err.message);
        return err.message;
      });
  }
  return '';
};

/* browser process - main process */
export const registerInterProcessDappProtocol = (
  dappyBrowserView: DappyBrowserView,
  session: Session,
  store: Store,
  dispatchFromMain: (a: DispatchFromMainArg) => void
) => {
  return session.protocol.registerBufferProtocol('interprocessdapp', async (request, callback) => {
    let data: { [a: string]: any } = {};
    try {
      data = JSON.parse(request.headers.Data);
    } catch (e) {
      console.error(e);
      callback(Buffer.from('invalid payload'));
      return;
    }

    const action = request.url.replace('interprocessdapp://', '');
    const handleArgs = [dappyBrowserView, store, dispatchFromMain, data, request.url] as const;

    const handlers = {
      eth_sendTransaction: sendTransaction,
      eth_chainId: chainId,
      eth_requestAccounts: accounts,
      eth_accounts: accounts,
      eth_blockNumber: blockNumber,
      eth_call: call,
      'message-from-dapp-sandboxed': messageFromDapp,
    };

    if (Object.keys(handlers).includes(action)) {
      callback(
        Buffer.from(JSON.stringify(await handlers[action as keyof typeof handlers](...handleArgs)))
      );
    } else {
      console.log('unknown dapp action', request.url, data);
    }
  });
};
