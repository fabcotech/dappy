import { takeEvery, select, put } from 'redux-saga/effects';
import path from 'path';
import url from 'url';
import https from 'https';
import { BrowserView, app, session } from 'electron';

import * as fromBrowserViews from '../browserViews';
import { DappyBrowserView } from '../../models';
import { registerDappyProtocol } from '../../registerDappyProtocol';
import { overrideHttpProtocols } from '../../overrideHttpProtocols';
import { store } from '../';

import * as fromDapps from '../../../src/store/dapps';
import * as fromHistory from '../../../src/store/history';
import { decomposeUrl } from '../../../src/utils/decomposeUrl';
import { validateSearch } from '../../../src/utils/validateSearch';
import { searchToAddress } from '../../../src/utils/searchToAddress';

const development = !!process.defaultApp;

const loadOrReloadBrowserView = function* (action: any) {
  const payload = action.payload;

  const browserViews: {
    [resourceId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);
  const position: { x: number; y: number; width: number; height: number } = yield select(
    fromBrowserViews.getBrowserViewsPositionMain
  );

  // reload
  if (browserViews[payload.resourceId]) {
    session.fromPartition(`persist:${payload.address}`).protocol.unregisterProtocol('dappy');
    action.meta.browserWindow.removeBrowserView(browserViews[payload.resourceId].browserView);
    browserViews[payload.resourceId].browserView.destroy();
  }

  if (!position) {
    console.error('No position, cannot create browserView');
    return undefined;
  }
  let preload = !!payload.html ? path.join(app.getAppPath(), 'dist/dapp-sandboxed-preload.js') : undefined;
  if (development) {
    preload = !!payload.html ? path.join(app.getAppPath(), 'src/dapp-sandboxed-preload.js') : undefined;
  }

  // todo partition ?
  const view = new BrowserView({
    webPreferences: {
      // preload only for dapps
      preload: preload,
      devTools: true,
      disableDialogs: true,
      partition: `persist:${payload.address}`,
      // sandbox forbids the navigation
      //sandbox: true,
      nodeIntegration: false,
    },
  });

  // cookies to start with (from storage)
  payload.cookies.map(c => {
    view.webContents.session.cookies.set({
      ...c,
      url: `https://${c.domain}`,
      secure: true,
      httpOnly: true,
    });
  });

  // todo, avoid circular ref to "store" (see logs when "npm run build:main")
  registerDappyProtocol(session.fromPartition(`persist:${payload.address}`), store.getState);
  overrideHttpProtocols(session.fromPartition(`persist:${payload.address}`), store.getState, development, action.meta.dispatchFromMain);

  if (payload.devMode) {
    view.webContents.openDevTools();
  }
  if (payload.muted) {
    browserViews[payload.resourceId].browserView.webContents.setAudioMuted(payload.muted);
  }

  const ua = view.webContents.getUserAgent();
  const newUserAgent = `${ua} randomId=${payload.randomId}`;
  view.webContents.setUserAgent(newUserAgent);
  action.meta.browserWindow.addBrowserView(view);
  view.setBounds(position);

  /* browser to server */
  // In the case of IP apps, payload.currentUrl is a https://xx address
  view.webContents.loadURL(
    payload.currentUrl === 'dist/dapp-sandboxed.html'
      ? path.join('file://', app.getAppPath(), 'dist/dapp-sandboxed.html') + payload.path
      : payload.currentUrl
  );

  let previewId;
  let currentPath = '';

  view.webContents.addListener('did-navigate', (a, currentUrl, httpResponseCode, httpStatusText) => {
    // todo handle httpResponseCode, httpStatusText

    currentPath = '';
    // todo handle path for dapps, and not only IP apps
    if (!currentUrl.startsWith('file://')) {
      try {
        currentPath = url.parse(currentUrl).path;
      } catch (err) {
        console.error('Could not parse URL ' + currentUrl);
      }
    }

    previewId = `${payload.address}${currentPath}`.replace(/\W/g, '');
    action.meta.dispatchFromMain({
      action: fromHistory.didNavigateInPageAction({
        previewId: previewId,
        address: `${payload.address}${currentPath}`,
        tabId: payload.tabId,
        title: view.webContents.getTitle(),
      }),
    });
  });

  view.webContents.addListener('new-window', (e) => {
    e.preventDefault();
  });

  view.webContents.addListener('page-favicon-updated', (a, favicons) => {
    if (favicons && favicons[0] && typeof favicons[0] === 'string') {
      if (favicons[0].startsWith('data:image')) {
        action.meta.dispatchFromMain({
          action: fromHistory.didChangeFaviconAction({
            tabId: payload.tabId,
            img: favicons[0],
            previewId: previewId,
          }),
        });
      } else if (favicons[0].startsWith('https://')) {
        try {
          const urlDecomposed = decomposeUrl(favicons[0]);
          const serverAuthorized = payload.servers.find((s) => s.host === urlDecomposed.host);
          if (!serverAuthorized) {
            console.error(`Could not get favicon, no servers authorized to reach https address ${favicons[0]}`);
            return;
          }
          /* browser to server */
          const a = new https.Agent({
            /* no dns */
            host: serverAuthorized.ip,
            rejectUnauthorized: false, // cert does not have to be signed by CA (self-signed)
            cert: decodeURI(serverAuthorized.cert),
            ca: [], // we don't want to rely on CA
          });
          https.get(
            {
              agent: a,
              host: urlDecomposed.host,
              path: urlDecomposed.path,
              method: 'get',
            },
            (res) => {
              if (res.statusCode !== 200) {
                console.error(`Could not get favicon (status !== 200) for ${payload.address}${currentPath}`);
                console.log(favicons[0])
                return;
              }
              let s = new Buffer('');
              res.on('data', (a) => {
                s = Buffer.concat([s, a]);
              });
              res.on('end', () => {
                const faviconAsBase64 = 'data:' + res.headers['content-type'] + ';base64,' + s.toString('base64');
                action.meta.dispatchFromMain({
                  action: fromHistory.didChangeFaviconAction({
                    tabId: payload.tabId,
                    previewId: previewId,
                    img: faviconAsBase64,
                  }),
                });
              });
            }
          );
        } catch (err) {
          console.error('[dapp] Could not get favicon ' + favicons[0]);
          console.log(err);
        }
      }
    }
  });

  view.webContents.addListener('page-title-updated', (a, title) => {
    action.meta.dispatchFromMain({
      action: fromHistory.updatePreviewAction({
        tabId: payload.tabId,
        previewId: previewId,
        title: title,
      }),
    });
  });
  view.webContents.addListener('will-navigate', (a, url) => {
    let urlDecomposed;
    try {
      urlDecomposed = decomposeUrl(url);
    } catch (err) {
      console.error('[dapp] will-navigate invalid URL ' + url);
      console.log(err);
      a.preventDefault();
      return;
    }

    if (urlDecomposed.protocol === 'dappy') {
      let s;
      if (validateSearch(`${urlDecomposed.host}${urlDecomposed.path}`)) {
        s = `${urlDecomposed.host}${urlDecomposed.path}`;
      } else {
        s = searchToAddress(urlDecomposed.path, payload.address.split('/')[0]);
      }
      a.preventDefault();
      action.meta.dispatchFromMain({
        action: fromDapps.loadResourceAction({
          address: s,
          tabId: payload.tabId,
        }),
      });
    } else {
      const serverAuthorized = payload.servers.find((s) => s.primary && s.host === urlDecomposed.host);
      // If the navigation url is not bound to an authorized server
      if (!serverAuthorized) {
        a.preventDefault();
        action.meta.openExternal(url);
      }
    }
  });
  view.webContents.addListener('did-finish-load', (a) => {
    action.meta.dispatchFromMain({
      action: fromDapps.updateTransitoryStateAction({
        resourceId: payload.resourceId,
        transitoryState: undefined,
      }),
    });
  });
  view.webContents.addListener('did-stop-loading', (a) => {
    action.meta.dispatchFromMain({
      action: fromDapps.updateTransitoryStateAction({
        resourceId: payload.resourceId,
        transitoryState: undefined,
      }),
    });
  });

  let newBrowserViews = {};
  newBrowserViews[payload.resourceId] = {
    ...payload,
    browserView: view,
    commEvent: undefined,
    visible: true,
  };

  Object.keys(browserViews).forEach((id) => {
    if (id !== payload.resourceId && browserViews[id].visible) {
      browserViews[id].browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      newBrowserViews = {
        ...newBrowserViews,
        [id]: {
          ...browserViews[id],
          visible: false,
        },
      };
    }
  });

  return yield put({
    type: fromBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED,
    payload: newBrowserViews,
  });
};

export const loadOrReloadBrowserViewSaga = function* () {
  yield takeEvery(fromBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW, loadOrReloadBrowserView);
};
