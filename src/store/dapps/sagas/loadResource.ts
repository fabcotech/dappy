import { put, takeEvery, select } from 'redux-saga/effects';
import { readPursesDataTerm } from 'rchain-token';
import { BeesLoadCompleted, BeesLoadErrors } from 'beesjs';
import { lookup, NameAnswer } from 'dappy-lookup';

import { dappyLookup, multiCall } from '/interProcess';
import { MultiCallResult } from '/models/MultiCall';
import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import * as fromBlockchain from '../../blockchain';
import * as fromUi from '../../ui';
import { blockchain as blockchainUtils } from '/utils/blockchain';
import { getNodeIndex } from '/utils/getNodeIndex';
import { validateAndReturnFile } from '/utils/validateAndReturnFile';
import {
  Blockchain,
  RChainInfos,
  DappyFile,
  RChainInfo,
  Tab,
} from '../../../models';
import { Action } from '../../';

import fakeDappyLookup from '/utils/fakeDappyLookup'
import { NamePacket, NameQuestion, RRTXT } from '/models/FakeDappyLookup';
import { MAIN_CHAIN_ID } from '/CONSTANTS';
import { DappyLoadError } from '/models/DappyLoadError';
import { checkIfValidIP } from '/utils/checkIfValidIp';


const loadResource = function* (action: Action) {
  const payload: fromDapps.LoadResourcePayload = action.payload;
  const settings: fromSettings.Settings = yield select(fromSettings.getSettings);
  const namesBlockchain: undefined | Blockchain = yield select(fromSettings.getNamesBlockchain);
  let tabs: Tab[] = yield select(fromDapps.getTabs);
  const rchainInfos: { [chainId: string]: RChainInfos } = yield select(fromBlockchain.getRChainInfos);
  const isNavigationInDapps: boolean = yield select(fromUi.getIsNavigationInDapps);

  if (!isNavigationInDapps) {
    yield put(fromUi.navigateAction({ navigationUrl: '/dapps' }));
  }

  let resourceId = '';

  let tabId = payload.tabId as string;
  let tab = tabs.find((t) => t.id === tabId) as Tab;
  if (tabId) {
    if (!tab) {
      console.log('did not find tab from payload', tabId);
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          url: payload.url,
          error: {
            error: DappyLoadError.UnknownCriticalError,
            args: {
              url: payload.url,
            },
          },
        })
      );
      return;
    }
  }

  /*
    Eventually create a new tab
  */
  if (
    !tabId ||
    /*
      If tab is favorite, it must never navigate
      to another url
    */
    (tab.favorite && tab.url !== payload.url)
  ) {
    tabId = window.crypto.getRandomValues(new Uint32Array(4)).join('-');
    resourceId = payload.url + '_' + tabId;
    yield put(
      fromDapps.createTabAction({
        tabId: tabId,
        resourceId: resourceId,
        url: payload.url,
      })
    );
    tabs = yield select(fromDapps.getTabs);
    tab = tabs.find((t) => t.id === tabId) as Tab;
  }

  let validAddress = payload.url;
  if (!payload.url.startsWith('https://')) {
    validAddress = `https://${payload.url}`;
  }
  let url = new URL("https://nothing");
  try {
    url = new URL(validAddress);
    if (url.protocol !== "https:") {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          url: payload.url,
          error: {
            error: DappyLoadError.UnsupportedAddress,
            args: {
              plus: 'only https:// protocol is supported',
            },
          },
        })
      );
      return;
    }
  } catch (err) {
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId: tabId,
        url: payload.url,
        error: {
          error: DappyLoadError.UnsupportedAddress,
          args: {
            plus: 'unknown parsing error',
          },
        },
      })
    );
    return;
  }
 
  yield put(
    fromDapps.focusAndActivateTabAction({
      tabId: tabId,
      resourceId: resourceId,
      url: payload.url,
    })
  );

  /*
    Dappy name system
  */
  if (url.host.endsWith('.dappy')) {
    console.log(`Dappy: host is ${url.hostname}`)
    if (!namesBlockchain || !rchainInfos[namesBlockchain.chainId]) {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          url: payload.url,
          error: {
            error: DappyLoadError.MissingBlockchainData,
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
    
    if (!namesBlockchain) {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          url: payload.url,
          error: {
            error: DappyLoadError.ChainNotFound,
            args: { chainId: MAIN_CHAIN_ID },
          },
        })
      );
      return;
    }
  
    /*
      Does this address point to a dapp ?
      If yes then we'll have do download the 
      html and load it in a tab
    */

    /* let txts: NamePacket | undefined = undefined;
    try {
      txts = yield dappyLookup({
        method: "lookup",
        type: "TXT",
        hostname: url.host,
        chainId: namesBlockchain.chainId
      });
    } catch (err) {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId: tabId,
          url: payload.url,
          error: {
            error: DappyLoadError.DappyLookup,
            args: { message: err.message },
          },
        })
      );
      return;
    }

    let csp = '';
    const cspRecord = (txts as NamePacket).answers.find(a => a.name === "CSP");
    if (cspRecord) {
      csp  = (cspRecord as NameAnswer).data;
    }

    let publicKey = '';
    const publicKeyRecord = (txts as NamePacket).answers.find(a => a.name === "PUBLIC_KEY");
    if (publicKeyRecord) {
      publicKey  = (publicKeyRecord as NameAnswer).data;
    }

    let dappAddress = '';
    const dappAddressRecord = (txts as NamePacket).answers.find(a => a.name === "DAPP_ADDRESS");
    if (dappAddressRecord) {
      dappAddress  = (dappAddressRecord as NameAnswer).data;
    } */
    let dappAddress = undefined;
      
    /*
      If dappy-lookup finds a dapp record for address, then we must get
      the content of the file, it may be in another NFT contract and.or
      master
  
      For example pro.dappy can point to a HTML file (dapp) at
      contractxyz.purse123
    */
    if (dappAddress) {
    
      /*
        Maybe some day we'll want to check the signature of the file
      */
      const checkSignature = false;
  
      console.log('dapp address resolved by name system ' + dappAddress);
      const s = (dappAddress || '').split('.');
      let masterRegistryUri = info.rchainNamesMasterRegistryUri;
      let fileContractId = '';
      let filePurseId = '';
  
      /*
        A dapp address can be master.contract.purse or contract.purse
      */
      if (s.length === 2) {
        fileContractId = s[0];
        filePurseId = s[1] || 'index';
      } else if (s.lngth === 3) {
        masterRegistryUri = s[0];
        fileContractId = s[1];
        filePurseId = s[2] || 'index';
      } else {
        throw new Error('Unable to parse dapp address');
      }
  
      let multiCallResult: undefined | MultiCallResult;
      try {
        let indexes = namesBlockchain.nodes
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
            chainId: namesBlockchain.chainId,
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
            url: payload.url,
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
            error: DappyLoadError.FailedToParseResponse,
            args: {
              message: 'Unknown parsing error',
            },
          };
        }
    
        yield put(fromDapps.loadResourceFailedAction({ tabId: tabId, url: payload.url, error: error }));
        return;
      }
    
      const dappyFile = verifiedDappyFile as DappyFile;
    
      if (dappyFile.mimeType !== 'application/dappy') {
        // todo handle non-dappy files
      }
    
      let dappHtml: undefined | any;
      try {
        dappHtml = blockchainUtils.getHtmlFromFile(dappyFile);
      } catch (e) {
        yield put(
          fromDapps.loadResourceFailedAction({
            tabId: tabId,
            url: payload.url,
            error: { error: DappyLoadError.FailedToParseResponse, args: { message: 'could not get html from response' } },
          })
        );
        return;
      }
    
      const loadStates: {
        [dappId: string]: {
          completed: BeesLoadCompleted;
          errors: BeesLoadErrors;
          pending: string[];
        };
      } = yield select(fromDapps.getLoadStates);
    
      /*
        todo is this safe enough ? See main/store/sagas/loadOrReloadBrowserView.ts
    
        the dapp HTML will be stored as a file in APP_ROOT/dist/cache/dapp.html,
        we want to avoid strange behavior by allowing file path extensions
      */
      let safePath = '';
      if (url.pathname && url.pathname.startsWith('?') && !url.pathname.includes('/')) {
        safePath = url.pathname
      }
      /*
        Not tested
      */
      yield put(
        fromDapps.launchTabCompletedAction({
          tab: {
            ...tab,
            active: true,
            title: url.hostname + url.pathname,
            url: `${url.origin}${safePath}`,
            data: {
              isDappyNameSystem: true,
              chainId: namesBlockchain.chainId,
              publicKey: publicKey,
              html: dappHtml,
              loadState: {
                completed: (multiCallResult as MultiCallResult).loadState,
                errors: (multiCallResult as MultiCallResult).loadErrors,
                pending: [],
              },
            }
          },
        })
      );
      return;
    }
  
    /*
      IP application / regular website
      We are not yet sure that address points to some A/AAAA records
      but we are sure there is no dapp / file, we can launch it
    */
    yield put(
      fromDapps.launchTabCompletedAction({
        tab: {
          ...tab,
          active: true,
          title: url.hostname + url.pathname,
          url: url.toString(),
          data: {
            isDappyNameSystem: true,
            chainId: namesBlockchain.chainId,
            publicKey: undefined,
          }
        },
      })
    );

    return;
  }

  /*
    DNS / Domain Name System .com .net etc...
  */
  console.log(`DNS: host is ${url.hostname}`)
  yield put(
    fromDapps.initTransitoryStateAndResetLoadErrorAction({
      tabId: tabId,
      resourceId: resourceId,
    })
  );

  yield put(
    fromDapps.launchTabCompletedAction({
      tab: {
        ...tab,
        active: true,
        title: url.hostname + url.pathname,
        url: url.toString(),
        data: {
          isDappyNameSystem: false,
          isIp: checkIfValidIP(url.host),
          chainId: undefined,
          publicKey: undefined,
        }
      },
    })
  );
};

export const loadResourceSaga = function* () {
  try {
    yield takeEvery(fromDapps.LOAD_RESOURCE, loadResource);
  } catch (err) {
    console.log(err);
  }
};
