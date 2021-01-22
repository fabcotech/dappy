import { put, takeEvery, select } from 'redux-saga/effects';
import { readBagOrTokenDataTerm } from 'rchain-token-files';

import { multiCall } from '../../../utils/wsUtils';
import * as fromMain from '../../main';
import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import * as fromBlockchain from '../../blockchain';
import { blockchain as blockchainUtils } from '../../../utils/blockchain';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { splitSearch } from '../../../utils/splitSearch';
import { validateAndReturnFile } from '../../../utils/validateAndReturnFile';
import { validateBlockchainResponse } from '../../../utils/validateBlockchainResponse';
import {
  Dapp,
  Blockchain,
  DappFromNetwork,
  RChainInfos,
  LoadError,
  Record,
  LoadErrorWithArgs,
  Tab,
  MultiCallResult,
  DappyFile,
  LoadedFile,
  IPServer,
  IpApp,
} from '../../../models';
import { Action } from '../../';
import { ipRecordSchema, dappRecordSchema, validateRecordFromNetwork } from '../../decoders';

const reloadResource = function* (action: Action) {
  const payload: fromDapps.ReloadResourcePayload = action.payload;

  const tabs: Tab[] = yield select(fromDapps.getTabs);
  const dapps: { [dappId: string]: Dapp } = yield select(fromDapps.getDapps);
  const ipApps: { [appId: string]: IpApp } = yield select(fromDapps.getIpApps);
  const loadedFiles: { [fileId: string]: LoadedFile } = yield select(fromDapps.getLoadedFiles);
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const blockchains: { [chainId: string]: Blockchain } = yield select(fromSettings.getOkBlockchains);
  const rchainInfos: { [chainId: string]: RChainInfos } = yield select(fromBlockchain.getRChainInfos);
  const records: { [name: string]: Record } = yield select(fromBlockchain.getRecords);

  const tab = tabs.find((t) => t.id === payload.tabId);

  if (!tab) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2038,
        error: 'Did not find tab when reloading smart-contract tabId : ' + payload.tabId,
      })
    );
    return;
  }

  // Close all modals if a dapp is openned in tab payload.tabId
  const dappId = Object.keys(dapps).find((k) => dapps[k].tabId === payload.tabId);
  if (dappId) {
    yield put(fromMain.closeAllDappModalsAction({ dappId: dappId as string }));
  }

  const resourceId = tab.resourceId;
  const search = blockchainUtils.resourceIdToAddress(resourceId);
  const dapp = dapps[resourceId];

  const searchSplitted = splitSearch(search);
  // Should not happen
  if (!searchSplitted.chainId || !searchSplitted.search) {
    yield put(
      fromDapps.reloadResourceFailedAction({
        search: search,
        tabId: payload.tabId,
        error: {
          error: LoadError.IncompleteAddress,
          args: {
            search: search,
          },
        },
      })
    );
    return;
  }

  if (!blockchains[searchSplitted.chainId]) {
    yield put(
      fromDapps.reloadResourceFailedAction({
        tabId: payload.tabId,
        search: search,
        error: {
          error: LoadError.ChainNotFound,
          args: { chainId: searchSplitted.chainId },
        },
      })
    );
    return;
  }

  /*
    If the search is a 54 characters long string,
    it is probably a direct reference to an unforgeable name
  */
  let registryUri = searchSplitted.search.split('.')[0];
  let publicKey = '';
  let checkSignature = false;
  /*
   If the search is not a 54 characters long string,
   we must look for the corresponding record
 */
  if (registryUri.length !== 54) {
    let record = records[registryUri];
    checkSignature = true;

    // ===================
    // NAME/RECORD LOOKUP
    // ===================
    let multiCallResultRecordLookup: undefined | MultiCallResult;
    if (!record) {
      try {
        let indexes = blockchains[searchSplitted.chainId].nodes
          .filter((n) => n.active && n.readyState === 1)
          .map(getNodeIndex);
        indexes = blockchainUtils.shuffle(indexes);

        multiCallResultRecordLookup = yield multiCall(
          {
            type: 'get-one-record',
            body: {
              name: registryUri,
            },
          },
          {
            chainId: searchSplitted.chainId,
            urls: indexes,
            resolverMode: 'absolute',
            resolverAccuracy: 100,
            resolverAbsolute: blockchains[searchSplitted.chainId].nodes.length,
            multiCallId: fromBlockchain.GET_ONE_RECORD,
          }
        );
      } catch (err) {
        yield put(
          fromDapps.reloadResourceFailedAction({
            tabId: payload.tabId,
            search: search,
            error: { error: LoadError.RecordNotFound, args: { name: searchSplitted.search } },
          })
        );
        return;
      }
      const dataFromBlockchain = (multiCallResultRecordLookup as MultiCallResult).result.data;
      try {
        let recordFromBlockchain = JSON.parse(dataFromBlockchain);
        // .servers is always stringified
        if (recordFromBlockchain && recordFromBlockchain.servers) {
          const servers = JSON.parse(`{ "value": ${recordFromBlockchain.servers}}`).value;
          recordFromBlockchain.servers = servers;
        }
        if (recordFromBlockchain.badges) {
          recordFromBlockchain.badges = JSON.parse(recordFromBlockchain.badges);
        }
        yield validateRecordFromNetwork(recordFromBlockchain);
        record = {
          ...recordFromBlockchain,
          loadedAt: new Date().toString(),
          origin: 'blockchain',
        };
        yield put(fromBlockchain.getOneRecordCompletedAction({ record: record }));
      } catch (err) {
        console.log(err);
        yield put(
          fromDapps.reloadResourceFailedAction({
            tabId: payload.tabId,
            search: search,
            error: { error: LoadError.RecordNotFound, args: { name: searchSplitted.search } },
          })
        );
        return;
      }
    }

    if (!record) {
      yield put(
        fromDapps.reloadResourceFailedAction({
          tabId: payload.tabId,
          search: search,
          error: { error: LoadError.RecordNotFound, args: { name: searchSplitted.search } },
        })
      );
      return;
    }

    // Check for IP app record
    try {
      yield ipRecordSchema.validate(record);
      const randomId = window.crypto.getRandomValues(new Uint32Array(12)).join('-');
      yield put(
        fromDapps.launchIpAppCompletedAction({
          tabId: tab.id,
          ipApp: {
            tabId: tab.id,
            id: resourceId,
            chainId: searchSplitted.chainId,
            search: searchSplitted.search,
            path: searchSplitted.path,
            url: ipApps[resourceId] ? ipApps[resourceId].url : undefined,
            publicKey: record.publicKey,
            name: record.name,
            servers: record.servers as IPServer[],
            randomId: randomId,
            launchedAt: new Date().toISOString(),
          },
        })
      );
      return;
    } catch (err) {
      try {
        yield dappRecordSchema.validate(record);
      } catch (err2) {
        yield put(
          fromDapps.reloadResourceFailedAction({
            tabId: payload.tabId,
            search: search,
            error: { error: LoadError.InvalidRecords, args: { name: registryUri, message: err.message } },
          })
        );
        return;
      }
    }

    registryUri = record.address as string;
    publicKey = record.publicKey;
  }

  if (!rchainInfos[searchSplitted.chainId]) {
    yield put(
      fromDapps.reloadResourceFailedAction({
        tabId: payload.tabId,
        search: search,
        error: { error: LoadError.MissingBlockchainData, args: { chainId: searchSplitted.chainId } },
      })
    );
    return;
  }

  let multiCallResult: undefined | MultiCallResult;
  try {
    let indexes = blockchains[searchSplitted.chainId].nodes
      .filter((n) => n.active && n.readyState === 1)
      .map(getNodeIndex);
    indexes = blockchainUtils.shuffle(indexes);
    multiCallResult = yield multiCall(
      {
        type: 'api/explore-deploy',
        body: {
          term: readBagOrTokenDataTerm(
            registryUri.split('.')[0],
            'bags',
            searchSplitted.search.split('.')[1] || 'index'
          ),
        },
      },
      {
        chainId: searchSplitted.chainId,
        urls: indexes,
        resolverMode: settings.resolverMode,
        resolverAccuracy: settings.resolverAccuracy,
        resolverAbsolute: settings.resolverAbsolute,
        multiCallId: fromBlockchain.LISTEN_FOR_DATA_AT_NAME,
      }
    );
  } catch (err) {
    yield put(
      fromDapps.reloadResourceFailedAction({
        tabId: payload.tabId,
        search: search,
        error: err.error,
      })
    );
    return;
  }

  const dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;

  let verifyError: LoadErrorWithArgs | null = null;
  try {
    verifyError = validateBlockchainResponse(dataFromBlockchain, `Address "${searchSplitted.search}`);
  } catch (e) {
    yield put(
      fromDapps.reloadResourceFailedAction({
        tabId: payload.tabId,
        search: search,
        error: { error: LoadError.FailedToParseResponse, args: { message: 'Invalid response' } },
      })
    );
    return;
  }

  const dataFromBlockchainParsed: { data: string } = JSON.parse(dataFromBlockchain);

  if (verifyError) {
    yield put(fromDapps.reloadResourceFailedAction({ tabId: payload.tabId, search: search, error: verifyError }));
    return;
  }

  let verifiedDappyFile: DappyFile | null = null;
  try {
    verifiedDappyFile = yield validateAndReturnFile(dataFromBlockchainParsed, publicKey, checkSignature);
  } catch (e) {
    let error;
    try {
      error = JSON.parse(e.message);
    } catch (e2) {
      error = {
        error: LoadError.FailedToParseResponse,
        args: {
          message: 'Unknown parsing error',
        },
      };
    }

    yield put(
      fromDapps.reloadResourceFailedAction({
        tabId: payload.tabId,
        search: search,
        error: error,
      })
    );
    return;
  }

  const dappyFile: DappyFile = verifiedDappyFile as DappyFile;

  if (dappyFile.mimeType !== 'application/dappy') {
    const block = JSON.parse(dataFromBlockchainParsed.data).block;
    yield put(
      fromDapps.reloadFileCompletedAction({
        loadedFile: {
          tabId: tab.id,
          id: resourceId,
          // One of the two must exist
          search: loadedFiles[resourceId] ? loadedFiles[resourceId].search : searchSplitted.search,
          chainId: searchSplitted.chainId,
          resourceId: registryUri,
          publicKey: checkSignature ? publicKey : undefined,
          size: encodeURI(dappyFile.data).split(/%..|./).length - 1,
          name: dappyFile.name,
          mimeType: dappyFile.mimeType,
          data: dappyFile.data,
          launchedAt: new Date().toISOString(),
          // todo, get blockNumber and blockTime from data
          blockNumber: block.seqNum,
          blockTime: new Date(block.timestamp).toISOString(),
          loadState: {
            completed: (multiCallResult as MultiCallResult).loadState,
            errors: (multiCallResult as MultiCallResult).loadErrors,
            pending: [],
          },
        },
        tabId: tab.id,
      })
    );
    return;
  }

  let dappHtml: undefined | any;
  try {
    dappHtml = blockchainUtils.getHtmlFromFile(dappyFile);
  } catch (e) {
    yield put(
      fromDapps.reloadResourceFailedAction({
        tabId: payload.tabId,
        search: search,
        error: { error: LoadError.FailedToParseResponse, args: { message: 'could not get html from response' } },
      })
    );
    return;
  }

  const dappFromNetwork: DappFromNetwork = {
    html: dappHtml,
    title: search,
    description: '',
    author: '',
    img: '',
    version: '',
  };

  const randomId = window.crypto.getRandomValues(new Uint32Array(12)).join('-');
  yield put(
    fromDapps.reloadDappCompletedAction({
      dapp: {
        ...dappFromNetwork,
        id: resourceId,
        tabId: tab.id,
        origin: 'network',
        chainId: dapp.chainId,
        search: dapp.search,
        path: searchSplitted.path,
        resourceId: dapp.resourceId,
        publicKey: checkSignature ? publicKey : undefined,
        randomId: randomId,
        loadState: {
          completed: (multiCallResult as MultiCallResult).loadState,
          errors: (multiCallResult as MultiCallResult).loadErrors,
          pending: [],
        },
        launchedAt: new Date().toISOString(),
      },
    })
  );
};

export const reloadResourceSaga = function* () {
  yield takeEvery(fromDapps.RELOAD_RESOURCE, reloadResource);
};
