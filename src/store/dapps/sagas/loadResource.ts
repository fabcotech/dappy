import { put, takeEvery, select } from 'redux-saga/effects';
import { readPursesDataTerm } from 'rchain-token';
import { BeesLoadCompleted, BeesLoadErrors } from 'beesjs';
import { lookup } from 'dappy-lookup';

import { multiCall } from '/interProcess';
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

    console.log(lookup);
    console.log(url.hostname);
    let recordsA;
    try {
      recordsA = yield lookup(url.hostname, 'A', {
        dappyNetwork: [{
          scheme: 'http',
          hostname: '127.0.0.1',
          port: '3001',
          ip: '127.0.0.1',
          caCert: Buffer.from(`-----BEGIN CERTIFICATE-----
          MIIC2TCCAcGgAwIBAgIUNc14iQdhu/lkPg9N729pukjcpBEwDQYJKoZIhvcNAQEL
          BQAwFDESMBAGA1UEAwwJZGFwcHlub2RlMB4XDTIxMTEzMDEwMjkxOFoXDTMwMDIx
          NjEwMjkxOFowFDESMBAGA1UEAwwJZGFwcHlub2RlMIIBIjANBgkqhkiG9w0BAQEF
          AAOCAQ8AMIIBCgKCAQEAnQj7eSGs0jbu0wKf+gfHHw86PePlUXKRMVi77PH5kV/K
          XhGwx5uRY0WZQmfTta/cY6t8NzOp7NpAy3PmPUy4MKYD7CBYROQpLIT4v/0wLZPd
          JaWaSTwfFODhSv8vdUSzh9QxwBuRxMBY0A2f1rSb1BbNaIPmnXw272rqYFfRTuMw
          ZOrfOE4CbkPNNY18qfTXZwj9zkNswNRSrK/0kIQOot97oQMZc3lKwwxyERl0Foty
          y6iqeVfz+bXZl3thLKJYZpBjKC2jvXtrdBfzQr8Fa1E6j1LCr0J0KF/dbxCdC5hY
          XkDwn9dWfnCOpNI9vWMOIqxf4IXo8gk5KgGwWcRj/QIDAQABoyMwITAfBgNVHREE
          GDAWgglsb2NhbGhvc3SCCWRhcHB5bm9kZTANBgkqhkiG9w0BAQsFAAOCAQEATCvb
          GWnOtYlRNdYoRui3yyTiVWenSLuTbnm4CINjQF/NomKmodGIEhjs2TUGRiM8Rh/v
          vPA7TMFFF68bsGp7DFh1MBj8NfujD0KPH7oUIfDnv5GSwD3ZSp7eGF89SAlFTw46
          XbAcOrWymuSbcK4d5HBQf9BqOnxoszAUI/LZx8I691Xf0pRaqKTcRXwX0X+49Qjh
          KxqIRMg3q/vaQTDweUGMjQIsePQS1iVB+YWt/5u/XTBIgZMNU1O4lzeYv1UBdXuK
          QLrQ8zTgELzjhmBxMAbWNbIJgGt9SiJc1DbQqw/9PkV4AT7bnmW2/b3g1lXxhIQX
          OpyG0qbp3I7+8Hp8Ww==
          -----END CERTIFICATE-----`, 'utf8').toString('base64')
        }]
      });
    } catch (err) {
      console.log(err);
    }
    console.log(recordsA);
    console.log(recordsA);
    console.log(recordsA);  

    const txts = fakeDappyLookup.lookup(url.host, 'txt');

    let csp = '';
    const cspRecord = txts.find(a => a.hasOwnProperty('value') && a.value === 'publicKey');
    if (cspRecord) {
      csp  = (cspRecord as RRTXT).value;
    }

    let publicKey = '';
    const publicKeyRecord = txts.find(a => a.hasOwnProperty('value') && a.value === 'publicKey');
    if (publicKeyRecord) {
      publicKey  = (publicKeyRecord as RRTXT).value;
    }
  
    const dappAddress = txts.find(a => a.hasOwnProperty('value') && a.value === 'dapp');
      
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
