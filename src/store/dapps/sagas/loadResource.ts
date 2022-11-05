import { put, takeEvery, select } from 'redux-saga/effects';
import { NameAnswer, NamePacket } from '@fabcotech/dappy-lookup';

import { dappyLookup } from '/interProcess';
import * as fromDapps from '..';
import * as fromSettings from '../../settings';
import * as fromUi from '../../ui';
import { Blockchain, Tab } from '../../../models';
import { Action } from '../..';

import { checkIfValidIP } from '/utils/checkIfValidIp';

const loadResource = function* (action: Action) {
  const { payload } = action;
  const namesBlockchain: undefined | Blockchain = yield select(fromSettings.getNamesBlockchain);
  let tabs: Tab[] = yield select(fromDapps.getTabs);
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
          tabId,
          url: payload.url,
          error: {
            title: '💥 Critical error',
            message: 'Could not find the tab into which resource must be loaded.',
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
    resourceId = `${payload.url}_${tabId}`;
    yield put(
      fromDapps.createTabAction({
        tabId,
        resourceId,
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
  let url = new URL('https://nothing');
  try {
    url = new URL(validAddress);
    if (url.protocol !== 'https:') {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId,
          url: payload.url,
          error: {
            title: '🚫 Unsupported protocol',
            message: `The browser is trying to visit a non-https URL ${payload.url}, this protocol is not supported and has been blocked.`,
          },
        })
      );
      return;
    }
  } catch (err) {
    console.log(err);
    yield put(
      fromDapps.loadResourceFailedAction({
        tabId,
        url: payload.url,
        error: {
          title: '🤔 Address parsing error',
          message:
            'The URL could not be parsed, make sure you are loading a https:// website with valid domain name.',
        },
      })
    );
    return;
  }

  yield put(
    fromDapps.focusAndActivateTabAction({
      tabId,
      resourceId,
      url: payload.url,
    })
  );

  /*
    Dappy name system
  */
  if (namesBlockchain && url.hostname.endsWith(`.${namesBlockchain.chainId}`)) {
    console.log(`Dappy: host is ${url.hostname}`);

    yield put(
      fromDapps.initTransitoryStateAndResetLoadErrorAction({
        tabId,
        resourceId,
      })
    );

    if (!namesBlockchain) {
      yield put(
        fromDapps.loadResourceFailedAction({
          tabId,
          url: payload.url,
          error: {
            title: '🤨 Dappy network error',
            message:
              'The dappy network was not found, make sure the TLD corresponds to the current network configuration (ex: .d, .gamma etc.)',
          },
        })
      );
      return;
    }

    let txts: NamePacket | undefined;
    try {
      txts = yield dappyLookup({
        method: 'lookup',
        type: 'TXT',
        hostname: url.hostname,
        chainId: namesBlockchain.chainId,
      });
    } catch (err) {
      if (err instanceof Error) {
        yield put(
          fromDapps.loadResourceFailedAction({
            tabId,
            url: payload.url,
            error: {
              title: '🤨 Dappy name system error',
              message: 'Public key of the domain owner could not be retrieved.',
            },
          })
        );
      }
      return;
    }

    let publicKey = '';
    const publicKeyRecord = (txts as NamePacket).answers.find((a) =>
      a.data.startsWith('PUBLIC_KEY=')
    );
    if (publicKeyRecord) {
      publicKey = (publicKeyRecord as NameAnswer).data.replace('PUBLIC_KEY=', '');
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
            publicKey,
            isDappyNameSystem: true,
            chainId: namesBlockchain.chainId,
          },
        },
      })
    );

    return;
  }

  /*
    DNS / Domain Name System .com .net etc...
  */
  console.log(`DNS: host is ${url.hostname}`);
  yield put(
    fromDapps.initTransitoryStateAndResetLoadErrorAction({
      tabId,
      resourceId,
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
        },
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
