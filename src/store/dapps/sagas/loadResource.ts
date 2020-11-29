import { put, takeEvery, select } from 'redux-saga/effects';
import { readBagOrTokenDataTerm } from 'rchain-token-files';

import { multiCall } from '../../../utils/wsUtils';
import { MultiCallResult } from '../../../models/WebSocket';
import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import * as fromBlockchain from '../../blockchain';
import * as fromMain from '../../main';
import { blockchain as blockchainUtils } from '../../../utils/blockchain';
import { splitSearch } from '../../../utils/splitSearch';
import { validateSearch } from '../../../utils/validateSearch';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { validateBlockchainResponse } from '../../../utils/validateBlockchainResponse';
import { validateAndReturnFile } from '../../../utils/validateAndReturnFile';
import {
  Record,
  Blockchain,
  DappFromNetwork,
  RChainInfos,
  LoadError,
  LoadErrorWithArgs,
  DappyFile,
  Dapp,
  IPServer,
} from '../../../models';
import { Action } from '../../';
import { ipRecordSchema, dappRecordSchema, validateRecordFromNetwork } from '../../decoders';

const loadResource = function* (action: Action) {
  const payload: fromDapps.LoadResourcePayload = action.payload;
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const blockchains: { [chainId: string]: Blockchain } = yield select(fromSettings.getOkBlockchains);
  const dapps: { [id: string]: Dapp } = yield select(fromDapps.getDapps);
  const rchainInfos: { [chainId: string]: RChainInfos } = yield select(fromBlockchain.getRChainInfos);
  const records: { [name: string]: Record } = yield select(fromBlockchain.getRecords);

  let resourceId = payload.address;

  let tabId = payload.tabId as string;
  if (tabId) {
    // Close all modals if a dapp is openned in tab payload.tabId
    const dappId = Object.keys(dapps).find((k) => dapps[k].tabId === payload.tabId);
    if (dappId) {
      yield put(fromMain.closeAllDappModalsAction({ dappId: dappId as string }));
    }

    resourceId += '_' + tabId;
    yield put(
      fromDapps.focusAndActivateTabAction({
        tabId: tabId,
        resourceId: resourceId,
        address: payload.address,
      })
    );
  } else {
    tabId = window.crypto.getRandomValues(new Uint32Array(4)).join('-');
    resourceId += '_' + tabId;
    yield put(
      fromDapps.createTabAction({
        tabId: tabId,
        resourceId: resourceId,
        search: payload.address,
      })
    );
  }

  yield put(
    fromDapps.initTransitoryStateAndResetLoadErrorAction({
      tabId: tabId,
      resourceId: resourceId,
    })
  );

  if (!validateSearch(payload.address)) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: payload.address,
        error: {
          error: LoadError.IncompleteAddress,
          args: {
            search: payload.address,
          },
        },
      })
    );
    return;
  }

  // Should never happen
  // - wether a dapp is reloaded
  // - wether another dapp (event if it points to the same resource) is loaded in another tab (!= dappId)
  if (dapps[resourceId]) {
    yield put(
      fromDapps.launchDappCompletedAction({
        dapp: dapps[resourceId],
      })
    );
    return;
  }

  const searchSplitted = splitSearch(payload.address);
  if (!searchSplitted.chainId || !searchSplitted.search) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: payload.address,
        error: {
          error: LoadError.IncompleteAddress,
          args: {
            search: payload.address,
          },
        },
      })
    );
    return;
  }

  if (!blockchains[searchSplitted.chainId]) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: payload.address,
        error: {
          error: LoadError.ChainNotFound,
          args: { chainId: searchSplitted.chainId },
        },
      })
    );
    return;
  }

  /*
    If the search (before .) is a 54 characters long string,
    it is probably a direct reference to an registryUri
  */
  let registryUri = searchSplitted.search.split('.')[0];
  let publicKey = '';
  let checkSignature = false;
  /*
    If the search is not a 54 characters long string (before .),
    we must look for the corresponding record, registryUri is in fact a record name
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
          fromDapps.loadResourceFailedAction({
            tabId: tabId,
            search: payload.address,
            error: { error: LoadError.RecordNotFound, args: { name: searchSplitted.search } },
          })
        );
        return;
      }
      const dataFromBlockchain = (multiCallResultRecordLookup as MultiCallResult).result.data;
      try {
        const dataFromBlockchainParsed = JSON.parse(dataFromBlockchain);
        let recordFromBlockchain: any = JSON.parse(dataFromBlockchainParsed.data);
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
          fromDapps.loadResourceFailedAction({
            tabId: tabId,
            search: payload.address,
            error: { error: LoadError.RecordNotFound, args: { name: searchSplitted.search } },
          })
        );
        return;
      }
    }

    if (!record) {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          search: payload.address,
          error: { error: LoadError.RecordNotFound, args: { name: searchSplitted.search } },
        })
      );
      return;
    }

    // Check for IP app record
    try {
      yield ipRecordSchema.validate(record);
      const randomId = window.crypto.getRandomValues(new Uint32Array(12)).join('-');
      let url: string | undefined = undefined;
      /*
      Verify payload.url, to eventually have a different landing
      page than https://${ipApp.servers[0].host}
      See IpAppSandboxed.ts
      */
      if (payload.url && record.servers) {
        record.servers.forEach((s) => {
          if ((payload.url as string).startsWith(`https://${s.host}`)) {
            url = payload.url;
          }
        });
      }
      yield put(
        fromDapps.launchIpAppCompletedAction({
          tabId: tabId,
          ipApp: {
            tabId: tabId,
            id: resourceId,
            chainId: searchSplitted.chainId,
            search: searchSplitted.search,
            path: searchSplitted.path,
            url: url,
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
        console.log(err2);
        yield put(
          fromDapps.loadResourceFailedAction({
            tabId: tabId,
            search: payload.address,
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
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: payload.address,
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
        type: 'explore-deploy',
        body: {
          term: readBagOrTokenDataTerm(
            registryUri.split('.')[0],
            "bags",
            searchSplitted.search.split('.')[1] || 'index'
          )
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
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: payload.address,
        error: err.error,
      })
    );
    return;
  }

  const dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;
  let verifyError: LoadErrorWithArgs | null = null;
  try {
    verifyError = validateBlockchainResponse(dataFromBlockchain, `Address "${searchSplitted.search}"`);
  } catch (e) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: payload.address,
        error: { error: LoadError.FailedToParseResponse, args: { message: 'Invalid response' } },
      })
    );
    return;
  }

  const dataFromBlockchainParsed: { data: string } = JSON.parse(dataFromBlockchain);
  if (verifyError) {
    yield put(fromDapps.loadResourceFailedAction({ tabId: tabId, search: payload.address, error: verifyError }));
    return;
  }

  let verifiedDappyFile: DappyFile | undefined = undefined;
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

    yield put(fromDapps.loadResourceFailedAction({ tabId: tabId, search: payload.address, error: error }));
    return;
  }

  const dappyFile = verifiedDappyFile as DappyFile;

  if (dappyFile.mimeType !== 'application/dappy') {
    const block = JSON.parse(dataFromBlockchainParsed.data).block;
    yield put(
      fromDapps.launchFileCompletedAction({
        file: {
          tabId: tabId,
          search: searchSplitted.search,
          id: resourceId,
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
        tabId: tabId,
      })
    );
    return;
  }

  let dappHtml: undefined | any;
  try {
    dappHtml = blockchainUtils.getHtmlFromFile(dappyFile);
  } catch (e) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: payload.address,
        error: { error: LoadError.FailedToParseResponse, args: { message: 'could not get html from response' } },
      })
    );
    return;
  }

  const randomId = window.crypto.getRandomValues(new Uint32Array(12)).join('-');
  const dappFromNetwork: DappFromNetwork = {
    html: dappHtml,
    title: payload.address,
    description: '',
    author: '',
    img: '',
    version: '',
  };

  const loadStates = yield select(fromDapps.getLoadStates);
  const dapp: Dapp = {
    ...dappFromNetwork,
    id: resourceId,
    tabId: tabId,
    randomId: randomId,
    origin: 'network',
    chainId: searchSplitted.chainId,
    search: searchSplitted.search,
    path: searchSplitted.path,
    resourceId: registryUri,
    publicKey: checkSignature ? publicKey : undefined,
    loadState: {
      completed: (multiCallResult as MultiCallResult).loadState,
      errors: (multiCallResult as MultiCallResult).loadErrors,
      pending: [],
    },
    launchedAt: new Date().toISOString(),
  };

  yield put(fromDapps.launchDappCompletedAction({ dapp: dapp }));
};

export const loadResourceSaga = function* () {
  try {
    yield takeEvery(fromDapps.LOAD_RESOURCE, loadResource);
  } catch (err) {
    console.log(err);
  }
};
