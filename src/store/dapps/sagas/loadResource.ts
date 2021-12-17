import { put, takeEvery, select } from 'redux-saga/effects';
import { readPursesDataTerm } from 'rchain-token';
import { BeesLoadCompleted, BeesLoadError, BeesLoadErrors } from 'beesjs';

import { multiCall } from '/interProcess';
import { MultiCallResult } from '/models/MultiCall';
import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import * as fromBlockchain from '../../blockchain';
import * as fromMain from '../../main';
import * as fromUi from '../../ui';
import { blockchain as blockchainUtils } from '../../../utils/blockchain';
import { splitSearch } from '../../../utils/splitSearch';
import { validateSearch } from '../../../utils/validateSearch';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { searchToAddress } from '../../../utils/searchToAddress';
import { validateBlockchainResponse } from '../../../utils/validateBlockchainResponse';
import { validateAndReturnFile } from '../../../utils/validateAndReturnFile';
import {
  Record,
  Blockchain,
  DappFromNetwork,
  RChainInfos,
  DappyFile,
  Dapp,
  RChainInfo,
  LoadedFile,
  Tab,
  IpApp,
} from '../../../models';
import { Action } from '../../';
import { ipRecordSchema, dappRecordSchema, validateRecordFromNetwork } from '../../decoders';
import { MAIN_CHAIN_ID } from '../../../CONSTANTS';

const loadResource = function* (action: Action) {
  const payload: fromDapps.LoadResourcePayload = action.payload;
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const blockchains: { [chainId: string]: Blockchain } = yield select(fromSettings.getOkBlockchains);
  const namesBlockchain: undefined | Blockchain = yield select(fromSettings.getNamesBlockchain);
  const dapps: { [id: string]: Dapp } = yield select(fromDapps.getDapps);
  const tabs: Tab[] = yield select(fromDapps.getTabs);
  const ipApps: { [id: string]: IpApp } = yield select(fromDapps.getIpApps);
  const loadedFiles: { [id: string]: LoadedFile } = yield select(fromDapps.getLoadedFiles);
  const rchainInfos: { [chainId: string]: RChainInfos } = yield select(fromBlockchain.getRChainInfos);
  const records: { [name: string]: Record } = yield select(fromBlockchain.getRecords);
  const isNavigationInDapps: boolean = yield select(fromUi.getIsNavigationInDapps);

  if (!isNavigationInDapps) {
    yield put(fromUi.navigateAction({ navigationUrl: '/dapps' }));
  }

  let resourceId = '';
  let address = '';
  let url = payload.url;

  let tabId = payload.tabId as string;
  if (tabId) {
    const tab = tabs.find((t) => t.id === tabId) as Tab;
    if (!tab) {
      console.log('did not find tab from payload', tabId);
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          search: address,
          error: {
            error: BeesLoadError.IncompleteAddress,
            args: {
              search: '',
            },
          },
        })
      );
      return;
    }

    // if dappId is found, it is a reload and not a load
    // Close all modals if a dapp is opened in tab payload.tabId
    const dappId = Object.keys(dapps).find((k) => k === tab.resourceId);
    if (dappId && !payload.address) {
      console.log('reloading dapp', dappId);
      yield put(fromMain.closeAllDappModalsAction({ resourceId: dappId }));
      const a = searchToAddress(dapps[dappId].search, dapps[dappId].chainId, dapps[dappId].path);
      address = a;
      resourceId = a + '_' + tabId;
    }

    // if ipAppId is found, it is a reload and not a load
    const ipAppId = Object.keys(ipApps).find((k) => k === tab.resourceId);
    if (ipAppId && !payload.address) {
      console.log('reloading ipApp', ipAppId);
      const a = searchToAddress(ipApps[ipAppId].search, ipApps[ipAppId].chainId, ipApps[ipAppId].path);
      address = a;
      resourceId = a + '_' + tabId;
      url = ipApps[ipAppId].url;
      yield put(fromMain.closeAllDappModalsAction({ dappId: ipAppId as string }));
    }

    // if loadedFileId is found, it is a reload and not a load
    const loadedFileId = Object.keys(loadedFiles).find((k) => k === tab.resourceId);
    if (loadedFileId && !payload.address) {
      console.log('reloading loadedFile', loadedFileId);
      const a = searchToAddress(loadedFiles[loadedFileId].search, loadedFiles[loadedFileId].chainId, '');
      address = a;
      resourceId = a + '_' + tabId;
    }

    // loading/navigating and not reloading
    if (!!payload.address || (!dappId && !ipAppId && !loadedFileId)) {
      console.log('loading or navigating', payload.address);
      resourceId = payload.address + '_' + tabId;
      address = payload.address;
    }

    resourceId += '_' + tabId;
    yield put(
      fromDapps.focusAndActivateTabAction({
        tabId: tabId,
        resourceId: resourceId,
        address: address,
      })
    );
  } else {
    tabId = window.crypto.getRandomValues(new Uint32Array(4)).join('-');
    address = payload.address;
    resourceId = payload.address + '_' + tabId;
    yield put(
      fromDapps.createTabAction({
        tabId: tabId,
        resourceId: resourceId,
        search: address,
      })
    );
  }

  if (!namesBlockchain || !rchainInfos[namesBlockchain.chainId]) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: address,
        error: {
          error: BeesLoadError.MissingBlockchainData,
          args: { chainId: 'unknown' },
        },
      })
    );
    return;
  }
  const info: RChainInfo = rchainInfos[namesBlockchain.chainId].info;

  yield put(
    fromDapps.initTransitoryStateAndResetLoadErrorAction({
      tabId: tabId,
      resourceId: resourceId,
    })
  );

  if (!validateSearch(address)) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: address,
        error: {
          error: BeesLoadError.IncompleteAddress,
          args: {
            search: address,
          },
        },
      })
    );
    return;
  }

  const searchSplitted = splitSearch(address);
  if (!searchSplitted.chainId || !searchSplitted.search) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: address,
        error: {
          error: BeesLoadError.IncompleteAddress,
          args: {
            search: address,
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
        search: address,
        error: {
          error: BeesLoadError.ChainNotFound,
          args: { chainId: searchSplitted.chainId },
        },
      })
    );
    return;
  }

  let masterRegistryUri = '';
  let contractId = '';
  let purseId = '';
  if (namesBlockchain.chainId === MAIN_CHAIN_ID) {
    if (searchSplitted.search.includes('.')) {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          search: address,
          error: {
            error: BeesLoadError.IncompleteAddress,
            args: {
              search: address,
              plus: `on network "${MAIN_CHAIN_ID}" only the purse id must be referenced`,
            },
          },
        })
      );
      return;
    } else {
      masterRegistryUri = info.rchainNamesMasterRegistryUri;
      contractId = info.rchainNamesContractId;
      purseId = searchSplitted.search;
    }
  } else {
    const s = searchSplitted.search.split('.');
    if (s.length === 1) {
      masterRegistryUri = info.rchainNamesMasterRegistryUri;
      contractId = info.rchainNamesContractId;
      purseId = s[0];
    } else if (s.length === 2) {
      masterRegistryUri = info.rchainNamesMasterRegistryUri;
      contractId = s[0];
      purseId = s[1];
    } else if (s.length === 3) {
      masterRegistryUri = s[0];
      contractId = s[1];
      purseId = s[2];
    }
  }

  if (masterRegistryUri.length !== 54) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: address,
        error: {
          error: BeesLoadError.IncompleteAddress,
          args: {
            search: address,
            plus: `master registry uri must be of length 54`,
          },
        },
      })
    );
    return;
  }

  // look for record first, then do
  // explore-deploy to get file
  let checkSignature = false;

  // If it is a dapp, the html file will probably
  // be in another contract, same for purse id
  // example dappynamesystem.amazoon -> (resolves to) myrchaintoken.index
  let fileContractId = contractId;
  let filePurseId = purseId;
  let publicKey = undefined;
  let record = records[purseId];
  if (masterRegistryUri === info.rchainNamesMasterRegistryUri && contractId === info.rchainNamesContractId) {
    checkSignature = false;
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
            type: 'get-x-records',
            body: {
              names: [purseId],
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
            search: address,
            error: { error: BeesLoadError.RecordNotFound, args: { name: searchSplitted.search } },
          })
        );
        return;
      }
      const dataFromBlockchain = (multiCallResultRecordLookup as MultiCallResult).result.data;
      try {
        let recordFromBlockchain: any = JSON.parse(dataFromBlockchain).records[0];
        // .data is always stringified
        if (recordFromBlockchain && recordFromBlockchain.data) {
          recordFromBlockchain.data = JSON.parse(recordFromBlockchain.data);
        }
        if (
          recordFromBlockchain &&
          typeof recordFromBlockchain.price === 'string' &&
          recordFromBlockchain.price.length
        ) {
          recordFromBlockchain.price = parseInt(recordFromBlockchain.price, 10);
        }
        if (
          recordFromBlockchain &&
          typeof recordFromBlockchain.expires === 'string' &&
          recordFromBlockchain.expires.length
        ) {
          recordFromBlockchain.expires = parseInt(recordFromBlockchain.expires, 10);
        }
        yield validateRecordFromNetwork(recordFromBlockchain);
        record = {
          ...recordFromBlockchain,
          loadedAt: new Date().toISOString(),
          origin: 'blockchain',
        };
        yield put(fromBlockchain.getOneRecordCompletedAction({ record: record }));
      } catch (err) {
        console.log(err);
        yield put(
          fromDapps.loadResourceFailedAction({
            tabId: tabId,
            search: address,
            error: { error: BeesLoadError.RecordNotFound, args: { name: searchSplitted.search } },
          })
        );
        return;
      }
    }

    if (!record) {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          search: address,
          error: { error: BeesLoadError.RecordNotFound, args: { name: searchSplitted.search } },
        })
      );
      return;
    }

    publicKey = record.publicKey;

    // Check for IP app record
    try {
      yield ipRecordSchema.validate(record);
      let urlOk: string | undefined = undefined;
      /*
      Verify payload.url, to eventually have a different landing
      page than https://${ipApp.servers[0].host}
      See launchIpAppCompleted.ts
      */
      if (url && record.data.servers) {
        record.data.servers.forEach((s) => {
          if ((url as string).startsWith(`https://${s.host}`)) {
            urlOk = url;
          }
        });
      }

      const serverIndex = (record.data.servers || []).findIndex((s) => s.primary);
      if (serverIndex === -1) {
        // todo handled better: dispatch error
        yield put(
          fromDapps.loadResourceFailedAction({
            tabId: tabId,
            search: address,
            error: { error: BeesLoadError.InvalidServers, args: { search: searchSplitted.search } },
          })
        );
        return;
      }

      yield put(
        fromDapps.launchIpAppCompletedAction({
          ipApp: {
            tabId: tabId,
            id: resourceId,
            chainId: searchSplitted.chainId,
            search: searchSplitted.search,
            path: searchSplitted.path,
            url: urlOk,
            publicKey: record.publicKey,
            record: record as Record,
            launchedAt: new Date().toISOString(),
          },
        })
      );
      return;
    } catch (err) {
      try {
        yield dappRecordSchema.validate(record);
      } catch (err2) {
        console.error('record is neither a valid dapp record or a valid IP app record');
        console.log(err2);
        yield put(
          fromDapps.loadResourceFailedAction({
            tabId: tabId,
            search: address,
            error: { error: BeesLoadError.InvalidRecords, args: { name: purseId, message: err.message } },
          })
        );
        return;
      }
    }
    const s = (record.data.address || '').split('.');
    console.log('address resolved by name system ' + record.data.address);
    fileContractId = s[0];
    filePurseId = s[1] || 'index';
  }

  if (!rchainInfos[searchSplitted.chainId]) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        search: address,
        error: { error: BeesLoadError.MissingBlockchainData, args: { chainId: searchSplitted.chainId } },
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
        type: 'explore-deploy-x',
        body: {
          terms: [
            readPursesDataTerm({
              masterRegistryUri: masterRegistryUri,
              contractId: fileContractId,
              pursesIds: [filePurseId],
            }),
          ],
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
        search: address,
        error: err.error,
      })
    );
    return;
  }

  let dataFromBlockchain;
  let dataFromBlockchainParsed: undefined | { data: { results: { data: string }[] } };
  let verifiedDappyFile: DappyFile | undefined = undefined;
  try {
    dataFromBlockchain = (multiCallResult as MultiCallResult).result.data;
    dataFromBlockchainParsed = JSON.parse(dataFromBlockchain) as { data: { results: { data: string }[] } };
    verifiedDappyFile = yield validateAndReturnFile(
      dataFromBlockchainParsed.data.results[0].data,
      filePurseId,
      '',
      checkSignature
    );
  } catch (e) {
    let error;
    try {
      error = JSON.parse(e.message);
    } catch (e2) {
      error = {
        error: BeesLoadError.FailedToParseResponse,
        args: {
          message: 'Unknown parsing error',
        },
      };
    }

    yield put(fromDapps.loadResourceFailedAction({ tabId: tabId, search: address, error: error }));
    return;
  }

  const dappyFile = verifiedDappyFile as DappyFile;

  if (dappyFile.mimeType !== 'application/dappy') {
    const block = JSON.parse(dataFromBlockchainParsed.data.results[0].data).block;
    yield put(
      fromDapps.launchFileCompletedAction({
        file: {
          tabId: tabId,
          search: searchSplitted.search,
          id: resourceId,
          chainId: searchSplitted.chainId,
          resourceId: resourceId,
          publicKey: publicKey,
          size: encodeURI(dappyFile.data).split(/%..|./).length - 1,
          name: dappyFile.name,
          mimeType: dappyFile.mimeType,
          record: record,
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
        search: address,
        error: { error: BeesLoadError.FailedToParseResponse, args: { message: 'could not get html from response' } },
      })
    );
    return;
  }

  const dappFromNetwork: DappFromNetwork = {
    html: dappHtml,
    title: address,
    description: '',
    author: '',
    img: '',
    version: '',
  };

  const loadStates: {
    [dappId: string]: {
      completed: BeesLoadCompleted;
      errors: BeesLoadErrors;
      pending: string[];
    };
  } = yield select(fromDapps.getLoadStates);
  const dapp: Dapp = {
    ...dappFromNetwork,
    id: resourceId,
    tabId: tabId,
    origin: 'network',
    chainId: searchSplitted.chainId,
    search: searchSplitted.search,
    path: searchSplitted.path,
    record: record,
    resourceId: resourceId,
    publicKey: publicKey,
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
