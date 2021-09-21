import { takeEvery, select, put } from 'redux-saga/effects';
import path from 'path';
import https from 'https';
import { BrowserView, app, session } from 'electron';

import * as fromBrowserViews from '../browserViews';
import { DappyBrowserView } from '../../models';
import { registerDappyProtocol } from '../../registerDappyProtocol';
import { registerInterProcessDappProtocol } from '../../registerInterProcessDappProtocol';
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

  /* reload
    a browser view with same id (payload.reosurceId) is
    already running
  */
  if (browserViews[payload.resourceId]) {
    if (development) {
      console.log('reload or self navigation, closing browserView and unregister protocols');
    }
    const a = session.fromPartition(`persist:${payload.dappyDomain}`).protocol.unregisterProtocol('dappy');
    const b = session.fromPartition(`persist:${payload.dappyDomain}`).protocol.unregisterProtocol('interprocessdapp');
    const c = session.fromPartition(`persist:${payload.dappyDomain}`).protocol.uninterceptProtocol('https');
    let d = true;
    if (!development) {
      d = session.fromPartition(`persist:${payload.dappyDomain}`).protocol.uninterceptProtocol('http');
    }
    if (development) {
      console.log(a, b, c, d);
    }
    const bv = browserViews[payload.resourceId];
    if (bv && bv.browserView) {
      if (bv.browserView.webContents.isDevToolsOpened()) {
        bv.browserView.webContents.closeDevTools();
      }
      bv.browserView.webContents.forcefullyCrashRenderer();
    }
    action.meta.browserWindow.removeBrowserView(bv.browserView);
  }

  /* navigation in a tab
    a running browser view has the same
    .tabId property

  */
  const sameTabIdBrowserViewId = Object.keys(browserViews).find((id) => {
    return (
      browserViews[id].resourceId !== payload.resourceId && // already removed line 35
      browserViews[id].tabId === payload.tabId
    );
  });
  if (sameTabIdBrowserViewId) {
    if (development) {
      console.log('navigation in tab, closing browserView with same tabId');
    }
    const bv = browserViews[sameTabIdBrowserViewId];
    const a = session.fromPartition(`persist:${payload.dappyDomain}`).protocol.unregisterProtocol('dappy');
    const b = session.fromPartition(`persist:${payload.dappyDomain}`).protocol.unregisterProtocol('interprocessdapp');
    const c = session.fromPartition(`persist:${payload.dappyDomain}`).protocol.uninterceptProtocol('https');
    let d = true;
    if (!development) {
      d = session.fromPartition(`persist:${payload.dappyDomain}`).protocol.uninterceptProtocol('http');
    }
    if (development) {
      console.log(a, b, c, d);
    }
    if (bv && bv.browserView) {
      if (bv.browserView.webContents.isDevToolsOpened()) {
        bv.browserView.webContents.closeDevTools();
      }
      bv.browserView.webContents.forcefullyCrashRenderer();
    }
    action.meta.browserWindow.removeBrowserView(browserViews[sameTabIdBrowserViewId].browserView);
  }

  if (!position) {
    console.error('No position, cannot create browserView');
    return undefined;
  }

  // todo partition ?
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: true,
      contextIsolation: true,
      devTools: true,
      disableDialogs: true,
      partition: `persist:${payload.dappyDomain}`,
    },
  });

  // cookies to start with (from storage)
  payload.cookies.forEach((c) => {
    view.webContents.session.cookies.set({
      ...c,
      url: `https://${c.domain}`,
      secure: true,
      httpOnly: true,
    });
  });

  // todo, avoid circular ref to "store" (see logs when "npm run build:main")
  registerDappyProtocol(session.fromPartition(`persist:${payload.dappyDomain}`), store.getState);
  registerInterProcessDappProtocol(
    session.fromPartition(`persist:${payload.dappyDomain}`),
    store,
    action.meta.dispatchFromMain
  );
  overrideHttpProtocols(
    session.fromPartition(`persist:${payload.dappyDomain}`),
    store.getState,
    development,
    action.meta.dispatchFromMain,
    false
  );

  if (payload.devMode) {
    view.webContents.openDevTools();
  }
  if (payload.muted) {
    view.webContents.setAudioMuted(payload.muted);
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
  let currentPathAndParameters = '';

  view.webContents.addListener('did-navigate', (a, currentUrl, httpResponseCode, httpStatusText) => {
    // todo handle httpResponseCode, httpStatusText

    // if dapp
    const url = new URL(currentUrl);
    currentPathAndParameters = url.search;

    // todo handle path for dapps, and not only IP apps
    // if IP apps
    if (!currentUrl.startsWith('file://')) {
      try {
        currentPathAndParameters = url.pathname + url.search;
      } catch (err) {
        console.error('Could not parse URL ' + currentUrl);
      }
    }

    previewId = `${payload.dappyDomain}${currentPathAndParameters}`.replace(/\W/g, '');
    action.meta.dispatchFromMain({
      action: fromHistory.didNavigateInPageAction({
        previewId: previewId,
        address: `${payload.dappyDomain}${currentPathAndParameters}`,
        tabId: payload.tabId,
        title: view.webContents.getTitle(),
      }),
    });
  });

  view.webContents.addListener('new-window', (e) => {
    e.preventDefault();
  });

  // contextMenu.ts
  /*
    IP app will instantly execute window.initContextMenu();
    Dapp will wait for DAPP_INITIAL_SETUP and then execute window.initContextMenu();
  */
  view.webContents.executeJavaScript(`
  window.initContextMenu = () => { const paste=["Paste",(e,t,o)=>{navigator.clipboard.readText().then(function(e){const t=o.value,n=o.selectionStart;o.value=t.slice(0,n)+e+t.slice(n)}),e.remove()}],copy=["Copy",(e,t,o)=>{navigator.clipboard.writeText(t),e.remove()}];document.addEventListener("contextmenu",e=>{let t=[];const o=window.getSelection()&&window.getSelection().toString();if(o&&(t=[copy]),"TEXTAREA"!==e.target.tagName&&"INPUT"!==e.target.tagName||(t=t.concat([paste])),0===t.length)return;const n=document.createElement("div");n.className="context-menu",n.style.width="160px",n.style.color="#fff",n.style.backgroundColor="rgba(04, 04, 04, 0.8)",n.style.top=e.clientY-5+"px",n.style.left=e.clientX-5+"px",n.style.position="absolute",n.style.zIndex=10,n.style.fontSize="16px",n.style.borderRadius="2px",n.style.fontFamily="fira",n.addEventListener("mouseleave",()=>{n.remove()}),t.forEach(t=>{const l=document.createElement("div");l.style.padding="6px",l.style.cursor="pointer",l.style.borderBottom="1px solid #aaa",l.addEventListener("mouseenter",()=>{console.log("onmouseenter"),l.style.backgroundColor="rgba(255, 255, 255, 0.1)",l.style.color="#fff"}),l.addEventListener("mouseleave",()=>{console.log("onmouseleave"),l.style.backgroundColor="transparent",l.style.color="#fff"}),l.innerText=t[0],l.addEventListener("click",()=>t[1](n,o,e.target)),n.appendChild(l)}),document.body.appendChild(n)}); }; window.initContextMenu();
  `);

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
          const serverAuthorized = payload.record.servers.find((s) => s.host === urlDecomposed.host);
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
            minVersion: 'TLSv1.2',
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
                console.error(`Could not get favicon (status !== 200) for ${payload.dappyDomain}`);
                console.log(favicons[0]);
                return;
              }
              let s = Buffer.from('');
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

  const handleNavigation = (urlDecomposed, url, e) => {
    if (urlDecomposed.protocol === 'dappy') {
      let s;
      if (validateSearch(`${urlDecomposed.host}${urlDecomposed.path}`)) {
        s = `${urlDecomposed.host}${urlDecomposed.path}`;
      } else {
        s = searchToAddress(urlDecomposed.path, payload.dappyDomain.split('/')[0]);
      }
      e.preventDefault();
      console.log('[dapp] navigation/redirect will navigating to ' + s);
      action.meta.dispatchFromMain({
        action: fromDapps.loadResourceAction({
          address: s,
          tabId: payload.tabId,
        }),
      });
    } else {
      const serverAuthorized = payload.record.servers.find((s) => s.primary && s.host === urlDecomposed.host);
      // If the navigation url is not bound to an authorized server
      if (!serverAuthorized) {
        console.error('[dapp] navigation/redirect did not find server ' + url);
        e.preventDefault();
        action.meta.openExternal(url);
      }
    }
  };

  view.webContents.addListener('will-redirect', (e, url) => {
    let urlDecomposed;
    try {
      urlDecomposed = decomposeUrl(url);
    } catch (err) {
      console.error('[dapp] navigation/redirect invalid URL ' + url);
      console.log(err);
      e.preventDefault();
      return;
    }
    handleNavigation(urlDecomposed, url, e);
  });

  view.webContents.addListener('will-navigate', (e, url) => {
    let urlDecomposed;
    try {
      urlDecomposed = decomposeUrl(url);
    } catch (err) {
      console.error('[dapp] will-navigate invalid URL ' + url);
      console.log(err);
      e.preventDefault();
      return;
    }
    handleNavigation(urlDecomposed, url, e);
  });

  view.webContents.addListener('did-finish-load', (a) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-finish-load ${payload.resourceId}')`);
    action.meta.dispatchFromMain({
      action: fromDapps.updateTransitoryStateAction({
        resourceId: payload.resourceId,
        transitoryState: undefined,
      }),
    });
  });
  view.webContents.addListener('did-stop-loading', (a) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-stop-loading ${payload.resourceId}')`);
    action.meta.dispatchFromMain({
      action: fromDapps.updateTransitoryStateAction({
        resourceId: payload.resourceId,
        transitoryState: undefined,
      }),
    });
  });
  view.webContents.addListener('did-start-loading', (a) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-start-loading ${payload.resourceId}')`);
  });
  view.webContents.addListener('dom-ready', (a) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('dom-ready ${payload.resourceId}')`);
  });

  let newBrowserViews = {};
  newBrowserViews[payload.resourceId] = {
    ...payload,
    browserView: view,
    visible: true,
  };

  /*
    Hide all other browser views
  */
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
