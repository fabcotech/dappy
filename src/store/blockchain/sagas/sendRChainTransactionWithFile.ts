import { takeEvery, put, select } from 'redux-saga/effects';
import zlib from 'zlib';
import * as rchainToolkit from 'rchain-toolkit';
import { readPursesDataTerm, mainTerm, createPursesTerm } from 'rchain-token';

import { Blockchain, TransactionStatus, BlockchainNode, MultiCallResult, MultiCallError } from '../../../models';
import * as fromBlockchain from '..';
import { account as accountUtils } from '../../../utils/account';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { generateNonce } from '../../../utils/generateNonce';
import { generateSignature } from '../../../utils/generateSignature';
import { blockchain as blockchainUtils } from '../../../utils/blockchain';
import { multiCall } from '../../../utils/wsUtils';
import * as fromMain from '../../main';
import { Action, store } from '../..';
import * as fromSettings from '../../settings';
import { singleCall } from '../../../utils/wsUtils';
import { Settings } from '../../settings';
import { buildUnforgeableNameQuery } from '../../../utils/buildUnforgeableNameQuery';
import { validateBlockchainResponse } from '../../../utils/validateBlockchainResponse';

const sendRChainTransactionWithFile = function* (action: Action) {
  const payload: fromBlockchain.SendRChainTransactionWithFilePayload = action.payload;
  const rchainBlockchains: {
    [chainId: string]: Blockchain;
  } = yield select(fromSettings.getOkBlockchains);

  let interval: NodeJS.Timeout;
  let interval2: NodeJS.Timeout;

  if (!rchainBlockchains[payload.blockchainId]) {
    yield put(
      fromMain.openModalAction({
        title: 'Failed to send transaction',
        text: `The RChain chain "${payload.blockchainId}" has not been found or there is not enough nodes available, cannot execute transaction`,
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      })
    );
    return;
  }

  if (!rchainBlockchains[payload.blockchainId].nodes[0]) {
    yield put(
      fromMain.openModalAction({
        title: 'Failed to send transaction',
        text: `No nodes configured for RChain chain "${payload.blockchainId}" cannot send transaction`,
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      })
    );
    return;
  }

  const passwordBytes = accountUtils.passwordFromStringToBytes((window.uniqueEphemeralToken as string).substr(0, 32));
  const privateKey = accountUtils.decrypt(payload.encrypted, passwordBytes);

  const timestamp = new Date().valueOf();
  const node = rchainBlockchains[payload.blockchainId].nodes.find((n) => n.readyState === 1);

  let privateName;
  let lastFinalizedBlockNumberResponse = 0;
  try {
    const channelRequest = {
      deployer: payload.publicKey,
      timestamp: timestamp,
      nameQty: 1,
    };

    const prepareDeployResponse = yield singleCall(
      { type: 'api/prepare-deploy', body: channelRequest },
      node as BlockchainNode
    );

    lastFinalizedBlockNumberResponse = yield singleCall(
      { type: 'last-finalized-block-number' },
      node as BlockchainNode
    );

    if (typeof lastFinalizedBlockNumberResponse !== 'number') {
      yield put(
        fromBlockchain.rChainTransactionErrorAction({
          id: payload.id,
          error: 'Last finalized block number should be a number',
          alert: payload.alert,
        })
      );
      return;
    }

    // TODO random node / multiple nodes
    privateName = JSON.parse(prepareDeployResponse).names[0];
  } catch (err) {
    console.log(err);
    yield put(
      fromBlockchain.rChainTransactionErrorAction({
        id: payload.id,
        error: err.message,
        alert: payload.alert,
      })
    );
    return;
  }

  let term;

  const fileIsIncludedInFirstDeploy = !!payload.fileAsBase64;

  const bagId = 'index';
  if (payload.fileAsBase64) {
    /*
      If file is already provided, include it in the files module
      deployment, there is no need for 2 steps (2 deploys)
    */
    term = mainTerm(generateNonce(), payload.publicKey)
      .replace(
        '/*DEFAULT_BAGS*/',
        `{
        "${bagId}": {
          "n": "0",
          "publicKey": "${payload.publicKey}",
          "price": Nil,
          "quantity": 1,
        }
      }`
      )
      .replace(
        '/*DEFAULT_BAGS_DATA*/',
        `{
          "${bagId}": "${payload.fileAsBase64}"
        }`
      );
  } else {
    term = mainTerm(generateNonce(), payload.publicKey);
  }

  while (term.indexOf('NONCE') !== -1) {
    const nonce = generateNonce();
    term = term.replace('NONCE', nonce);
  }
  term = term.replace(new RegExp('PUBLIC_KEY', 'g'), payload.publicKey);

  const deployOptions = blockchainUtils.rchain.getDeployOptions(
    timestamp,
    term,
    privateKey,
    payload.publicKey,
    1,
    payload.phloLimit,
    lastFinalizedBlockNumberResponse
  );

  yield put(
    fromBlockchain.addRChainTransactionAction({
      transaction: deployOptions,
      origin: { origin: 'deploy' },
      platform: 'rchain',
      blockchainId: payload.blockchainId,
      id: payload.id,
      alert: true,
      sentAt: new Date().toISOString(),
    })
  );

  let deployResponse = '';
  try {
    deployResponse = yield singleCall({ type: 'api/deploy', body: deployOptions }, node as BlockchainNode);
  } catch (err) {
    yield put(
      fromBlockchain.rChainTransactionErrorAction({
        id: payload.id,
        error: err.message || err,
        alert: payload.alert,
      })
    );
    return;
  }

  if (!deployResponse.startsWith('"Success')) {
    yield put(
      fromBlockchain.rChainTransactionErrorAction({
        id: payload.id,
        error: deployResponse,
        alert: payload.alert,
      })
    );
    return;
  }
  yield put(
    fromBlockchain.updateRChainTransactionStatusAction({
      id: payload.id,
      status: TransactionStatus.Aired,
    })
  );

  const unforgeableNameQuery = buildUnforgeableNameQuery(privateName);

  let dataAtNameResponseExpr;
  try {
    dataAtNameResponseExpr = yield new Promise((resolve, reject) => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        if (i > 60) {
          reject('15 minutes timeout exceeded');
          return;
        }

        const state = store.getState();
        const settings: Settings = fromSettings.getSettings(state);

        try {
          multiCall(
            {
              type: 'api/listen-for-data-at-name',
              body: {
                name: unforgeableNameQuery,
                depth: 5,
              },
            },
            {
              chainId: payload.blockchainId,
              urls: rchainBlockchains[payload.blockchainId].nodes.filter((n) => n.readyState === 1).map(getNodeIndex),
              resolverMode: settings.resolverMode,
              resolverAccuracy: settings.resolverAccuracy,
              resolverAbsolute: settings.resolverAbsolute,
              multiCallId: fromBlockchain.LISTEN_FOR_DATA_AT_NAME,
            }
          )
            .then((resp) => {
              const parsedResp = JSON.parse(resp.result.data);
              if (parsedResp && parsedResp.data && parsedResp.data.expr) {
                resolve(parsedResp.data.expr);
              } else {
                console.log('Did not find transaction data (files module deployment), will try again in 15 seconds');
              }
            })
            .catch((err: MultiCallError) => {
              reject(err.error.error);
            });
        } catch (err) {
          clearInterval(interval);
          store.dispatch(
            fromBlockchain.rChainTransactionErrorAction({
              id: payload.id,
              error: 'First deploy data could not be retreived ' + (err.message || err),
              alert: payload.alert,
            })
          );
          console.log('Cannot retreive or parse transaction data, will try again in 15 seconds');
        }
      }, 15000);
    });
  } catch (err) {
    clearInterval(interval);
    store.dispatch(
      fromBlockchain.rChainTransactionErrorAction({
        id: payload.id,
        error: 'First deploy data could not be retreived ' + (err.message || err),
        alert: payload.alert,
      })
    );
    return;
  }
  clearInterval(interval);
  const jsValue = rchainToolkit.utils.rhoValToJs(dataAtNameResponseExpr);

  /*
    If file is already included, it has been uplaoded already
    no need to replace values
  */
  if (fileIsIncludedInFirstDeploy) {
    yield put(
      fromBlockchain.updateRChainTransactionStatusAction({
        id: payload.id,
        status: TransactionStatus.Completed,
        value: {
          address: `${jsValue.registryUri.replace('rho:id:', '')}.${bagId}`,
        },
      })
    );
    return;
  }
  if (!payload.data) {
    yield put(
      fromBlockchain.rChainTransactionErrorAction({
        id: payload.id,
        error: 'Could not find file data (payload.data)',
        alert: payload.alert,
      })
    );
    return;
  }

  yield put(
    fromBlockchain.updateRChainTransactionStatusAction({
      id: payload.id,
      status: TransactionStatus.Completed,
    })
  );

  let fileWithReplacedValues = payload.data.file
    .replace(new RegExp('REGISTRY_URI', 'g'), jsValue.registryUri.replace('rho:id:', ''))
    .replace(new RegExp('PUBLIC_KEY', 'g'), payload.publicKey)
    .replace(new RegExp('FULL_ADDRESS', 'g'), `${jsValue.registryUri.replace('rho:id:', '')}.${bagId}`)
    .replace(new RegExp('REV_ADDRESS', 'g'), rchainToolkit.utils.revAddressFromPublicKey(payload.publicKey));

  while (fileWithReplacedValues.indexOf('NONCE') !== -1) {
    const nonce = generateNonce();
    fileWithReplacedValues = fileWithReplacedValues.replace('NONCE', nonce);
  }

  const htmlAsBase64 = blockchainUtils.createBase64(fileWithReplacedValues);
  const fileSignature = blockchainUtils.createSignature(
    htmlAsBase64,
    payload.data.mimeType,
    payload.data.name,
    privateKey
  );
  const fileAsString = blockchainUtils.createDpy(htmlAsBase64, payload.data.mimeType, payload.data.name, fileSignature);
  const fileAsBase64 = zlib.gzipSync(fileAsString).toString('base64');

  let timestamp2 = timestamp + 1;

  const newNonce = generateNonce();
  const payloadForSignature = {
    bags: {
      [bagId]: {
        nonce: generateNonce(),
        price: null,
        quantity: 1,
        publicKey: payload.publicKey,
        n: '0',
      },
    },
    data: {
      [bagId]: encodeURI(fileAsBase64),
    },
    nonce: jsValue.nonce,
    newNonce: newNonce,
  };
  console.log('payloadForSignature');
  console.log(payloadForSignature);

  const ba = rchainToolkit.utils.toByteArray(payloadForSignature);
  const payloadSignature = generateSignature(ba, privateKey);
  const deployOptions2 = blockchainUtils.rchain.getDeployOptions(
    timestamp2,
    createTokensTerm(jsValue.registryUri.replace('rho:id:', ''), payloadForSignature, payloadSignature),
    privateKey,
    payload.publicKey,
    1,
    payload.phloLimit,
    lastFinalizedBlockNumberResponse
  );

  const id2 = new Date().getTime() + Math.round(Math.random() * 10000).toString();

  // Add transaction to store
  yield put(
    fromBlockchain.addRChainTransactionAction({
      transaction: deployOptions2,
      origin: { origin: 'deploy' },
      platform: 'rchain',
      blockchainId: payload.blockchainId,
      id: id2,
      alert: false,
      sentAt: new Date().toISOString(),
    })
  );

  let deployResponse2 = '';
  try {
    deployResponse2 = yield singleCall({ type: 'api/deploy', body: deployOptions2 }, node as BlockchainNode);
  } catch (err) {
    yield put(
      fromBlockchain.rChainTransactionErrorAction({
        id: id2,
        error: err.message || err,
        alert: payload.alert,
      })
    );
    return;
  }

  if (!deployResponse2.startsWith('"Success')) {
    yield put(
      fromBlockchain.rChainTransactionErrorAction({
        id: id2,
        error: deployResponse2,
        alert: payload.alert,
      })
    );
    return;
  }

  yield put(
    fromBlockchain.updateRChainTransactionStatusAction({
      id: id2,
      status: TransactionStatus.Aired,
    })
  );

  let exploreDeployResponseExpr;
  try {
    exploreDeployResponseExpr = yield new Promise((resolve, reject) => {
      let i = 0;
      interval2 = setInterval(() => {
        i += 1;
        if (i > 60) {
          reject('15 minutes timeout exceeded');
          return;
        }

        const state = store.getState();
        const settings: Settings = fromSettings.getSettings(state);

        try {
          multiCall(
            {
              type: 'api/explore-deploy',
              body: {
                term: readBagOrTokenDataTerm(jsValue.registryUri.replace('rho:id:', ''), 'bags', bagId),
              },
            },
            {
              chainId: payload.blockchainId,
              urls: rchainBlockchains[payload.blockchainId].nodes.filter((n) => n.readyState === 1).map(getNodeIndex),
              resolverMode: settings.resolverMode,
              resolverAccuracy: settings.resolverAccuracy,
              resolverAbsolute: settings.resolverAbsolute,
              multiCallId: fromBlockchain.LISTEN_FOR_DATA_AT_NAME,
            }
          ).then((multiCallResult) => {
            const dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;
            const errors = validateBlockchainResponse(dataFromBlockchain, 'useless');
            if (dataFromBlockchain && !errors) {
              const parsedResponse = JSON.parse(dataFromBlockchain);
              const parsedData = JSON.parse(parsedResponse.data);
              if (parsedData.expr[0]) {
                resolve(parsedData.expr[0]);
              } else {
                console.log('Did not find transaction data (file upload), will try again in 15 seconds');
              }
            } else if (dataFromBlockchain && errors) {
              console.log(errors);
              reject('failed to parse');
            } else {
              console.log('Did not find transaction data (file upload), will try again in 15 seconds');
            }
          });
        } catch (err) {
          clearInterval(interval2);
          store.dispatch(
            fromBlockchain.rChainTransactionErrorAction({
              id: id2,
              error: 'Second deploy data could not be retreived ' + (err.message || err),
              alert: payload.alert,
            })
          );
        }
      }, 15000);
    });
  } catch (err) {
    clearInterval(interval2);
    store.dispatch(
      fromBlockchain.rChainTransactionErrorAction({
        id: id2,
        error: 'Second deploy data could not be retreived ' + (err.message || err),
        alert: payload.alert,
      })
    );
    return;
  }

  clearInterval(interval2);
  const jsValue2 = rchainToolkit.utils.rhoValToJs(exploreDeployResponseExpr);

  yield put(
    fromBlockchain.updateRChainTransactionStatusAction({
      id: id2,
      status: TransactionStatus.Completed,
      value: { address: `${jsValue.registryUri.replace('rho:id:', '')}.${bagId}` },
    })
  );

  return true;
};

export const sendRChainTransactionWithFileSaga = function* () {
  yield takeEvery(fromBlockchain.SEND_RCHAIN_TRANSACTION_WITH_FILE, sendRChainTransactionWithFile);
};
