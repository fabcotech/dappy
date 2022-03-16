import { takeEvery, select, put } from 'redux-saga/effects';
import path from 'path';
import https from 'https';
import { BrowserView, app, session } from 'electron';

import * as fromBrowserViews from '../browserViews';
import { DappyBrowserView } from '../../models';
import { registerInterProcessDappProtocol } from '../../registerInterProcessDappProtocol';
import { registerDappyNetworkProtocol } from '../../registerDappyNetworkProtocol';
import { overrideHttpProtocols } from '../../overrideHttpProtocols';
import { registerDappyLocalProtocol } from '../../registerDappyLocalProtocol';
import { preventAllPermissionRequests } from '../../preventAllPermissionRequests';
import { store } from '../';

import * as fromDapps from '../../../src/store/dapps';
import * as fromHistory from '../../../src/store/history';
import { decomposeUrl } from '../../../src/utils/decomposeUrl';
import { validateSearch } from '../../../src/utils/validateSearch';
import { searchToAddress } from '../../../src/utils/searchToAddress';
import { DappyLoadError } from '/models';

const development = !!process.defaultApp;

const loadOrReloadBrowserView = function* (action: any) {
  const payload = action.payload;
  const browserViews: {
    [resourceId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);
  const position: { x: number; y: number; width: number; height: number } = yield select(
    fromBrowserViews.getBrowserViewsPositionMain
  );

  console.log('payload');
  console.log(JSON.stringify(payload, null, 2));
  const url = new URL(payload.url);
  const hostname = url.hostname;
  console.log('hostname :', url.hostname);
  console.log('host :', url.host);
  /* reload
    a browser view with same id (payload.reosurceId) is
    already running
  */
  if (browserViews[payload.resourceId]) {
    if (development) {
      console.log('reload or self navigation, closing browserView and unregister protocols');
    }
    const a = session.fromPartition(`persist:${url.host}`).protocol.unregisterProtocol('dappynetwork');
    const b = session.fromPartition(`persist:${url.host}`).protocol.unregisterProtocol('interprocessdapp');
    const c = session.fromPartition(`persist:${url.host}`).protocol.uninterceptProtocol('https');
    let d = true;
    if (!development) {
      d = session.fromPartition(`persist:${url.host}`).protocol.uninterceptProtocol('http');
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
    const a = session.fromPartition(`persist:${url.host}`).protocol.unregisterProtocol('dappynetwork');
    const b = session.fromPartition(`persist:${url.host}`).protocol.unregisterProtocol('interprocessdapp');
    const c = session.fromPartition(`persist:${url.host}`).protocol.uninterceptProtocol('https');
    const d = session.fromPartition(`persist:${url.host}`).protocol.uninterceptProtocol('dappyl');
    let e = true;
    if (!development) {
      e = session.fromPartition(`persist:${url.host}`).protocol.uninterceptProtocol('http');
    }
    if (development) {
      console.log(a, b, c, d, e);
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
      devTools: /^true$/i.test(process.env.DAPPY_DEVTOOLS) || !process.env.PRODUCTION,
      disableDialogs: true,
      partition: `persist:${url.host}`,
    },
  });

  // cookies to start with (from storage)
  payload.cookies.forEach((c) => {
    try {
      view.webContents.session.cookies.set({
        ...c,
        url: `https://${c.domain}`,
        secure: true,
        httpOnly: c.httpOnly,
      });
    } catch (err) {
      console.error(err);
      console.error("failed to set cookie " + c.domain)
    }
  });

  if (payload.muted) {
    view.webContents.setAudioMuted(payload.muted);
  }

  action.meta.browserWindow.addBrowserView(view);
  view.setBounds(position);

  let newBrowserViews: {
    [resourceId: string]: DappyBrowserView;
  } = {};
  newBrowserViews[payload.resourceId] = {
    ...payload,
    host: new URL(payload.url).host,
    browserView: view,
    visible: true,
  };

  // ==============================
  // Security, interception of protocols, new protocols
  // https://, http://, dappyl://, interprocessdapp://
  // ==============================

  const viewSession = session.fromPartition(`persist:${url.host}`);
  preventAllPermissionRequests(viewSession);
  // todo, avoid circular ref to "store" (see logs when "npm run build:main")
  registerInterProcessDappProtocol(
    newBrowserViews[payload.resourceId],
    viewSession,
    store,
    action.meta.dispatchFromMain
  );
  overrideHttpProtocols({
    dappyBrowserView: newBrowserViews[payload.resourceId],
    dispatchFromMain: action.meta.dispatchFromMain,
    session: viewSession,
  });
  registerDappyNetworkProtocol(newBrowserViews[payload.resourceId], viewSession, store);
  registerDappyLocalProtocol(viewSession)

  // ==============================
  // In tab javascript executions
  // ==============================

  /* browser to server
    If payload.html then it is a dapp
  */
  if (!!payload.html) {
    const htmlPath = path.join(app.getAppPath(), 'dist/dapp.html');
    const path = new URL(payload.url).pathname
    yield view.webContents.loadURL(`file://${htmlPath}${path}`);
  } else {
    console.log('will load');
    try {
      yield view.webContents.loadURL(payload.url);
      if (payload.devMode) {
        view.webContents.openDevTools();
      }
    } catch (err) {
      action.meta.dispatchFromMain({
        action: fromDapps.loadResourceFailedAction({
            tabId: payload.tabId,
            url: payload.url,
            error: {
              error: DappyLoadError.ServerError,
              args: {
                url: payload.url,
                message: err.message
              }
            }
          })
      });
    }
  }

  /*
    Send html page to the dapp that is currently
    an empty html file
  */
  if (!!payload.html) {
    yield view.webContents.executeJavaScript(`
    window.write("${encodeURIComponent(payload.html)}")
    `)
  }

  /*
    Context menu
    IP app will instantly execute window.initContextMenu();
    Dapp will wait for DAPP_INITIAL_SETUP and then execute window.initContextMenu();
  */
  yield view.webContents.executeJavaScript(`
  window.initContextMenu = () => { const paste=["Paste",(e,t,o)=>{navigator.clipboard.readText().then(function(e){const t=o.value,n=o.selectionStart;o.value=t.slice(0,n)+e+t.slice(n)}),e.remove()}],copy=["Copy",(e,t,o)=>{navigator.clipboard.writeText(t),e.remove()}];document.addEventListener("contextmenu",e=>{let t=[];const o=window.getSelection()&&window.getSelection().toString();if(o&&(t=[copy]),"TEXTAREA"!==e.target.tagName&&"INPUT"!==e.target.tagName||(t=t.concat([paste])),0===t.length)return;const n=document.createElement("div");n.className="context-menu",n.style.width="160px",n.style.color="#fff",n.style.backgroundColor="rgba(04, 04, 04, 0.8)",n.style.top=e.clientY-5+"px",n.style.left=e.clientX-5+"px",n.style.position="absolute",n.style.zIndex=10,n.style.fontSize="16px",n.style.borderRadius="2px",n.style.fontFamily="fira",n.addEventListener("mouseleave",()=>{n.remove()}),t.forEach(t=>{const l=document.createElement("div");l.style.padding="6px",l.style.cursor="pointer",l.style.borderBottom="1px solid #aaa",l.addEventListener("mouseenter",()=>{console.log("onmouseenter"),l.style.backgroundColor="rgba(255, 255, 255, 0.1)",l.style.color="#fff"}),l.addEventListener("mouseleave",()=>{console.log("onmouseleave"),l.style.backgroundColor="transparent",l.style.color="#fff"}),l.innerText=t[0],l.addEventListener("click",()=>t[1](n,o,e.target)),n.appendChild(l)}),document.body.appendChild(n)}); }; window.initContextMenu();
  `);

  /*
    Equivalent of window.location, dapps and IP apps can know
    from which host they've been loaded
  */
  yield view.webContents.executeJavaScript(`
  window.dappy = { host: "${url.host}", path: "${payload.path}" };
  `);

  // ==============================
  // Navigation and lifecycle of the browserView
  // ==============================

  let previewId = '';
  let currentPathAndParameters = '';

  view.webContents.addListener('did-navigate', (a, currentUrl, httpResponseCode, httpStatusText) => {
    action.meta.dispatchFromMain({
      action: fromHistory.didNavigateInPageAction({
        previewId: `${currentUrl}`.replace(/\W/g, ''),
        url: currentUrl,
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
          action: fromDapps.didChangeFaviconAction({
            tabId: payload.tabId,
            img: favicons[0],
          }),
        });
      } else if (favicons[0].startsWith('https://')) {

        console.log("favicons[0].startsWith('https://')")

        // todo
        // get CERT with dappylookup
        console.log('favicon path', new URL(favicons[0]).pathname)
        console.log('favicon port', url.port || "443")
        console.log('favicon hostname', url.hostname)
        try {
          let options: https.RequestOptions = {
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2',
            /* no dns */
            host: url.hostname,
            port: url.port || "443",
            path: new URL(favicons[0]).pathname,
            method: 'get',
            headers: {
              host: url.hostname,
              Origin: `https://${hostname}`,
            },
          };
          // todo
          /* if (CA) {
            options = {
              ...options,
              ca: decodeURI(decodeURI(serverAuthorized.cert)),
            }
          } */
          https.request(
            options,
            (res) => {
              if (res.statusCode !== 200) {
                console.error(`Could not get favicon (status !== 200) for ${hostname}`);
                console.log(favicons[0]);
                return;
              }
              let s = Buffer.from('');
              res.on('data', (a) => {
                s = Buffer.concat([s, a]);
              });
              res.on('end', () => {
                // todo limit size of favicon ???
                const faviconAsBase64 = 'data:' + res.headers['content-type'] + ';base64,' + s.toString('base64');
                action.meta.dispatchFromMain({
                  action: fromDapps.didChangeFaviconAction({
                    tabId: payload.tabId,
                    img: faviconAsBase64,
                  }),
                });
              });
            }
          ).on('error', err => {
            console.error('[dapp] Could not get favicon ' + favicons[0]);
            console.error(err);
          })
        } catch (err) {
          console.error('[dapp] Could not get favicon ' + favicons[0]);
          console.error(err);
        }
      }
    }
  });

  view.webContents.addListener('page-title-updated', (a, title) => {
    // todo update tab with title
  });

  const handleNavigation = (url: string, e: Electron.Event) => {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol === 'https:') {
      e.preventDefault();
      console.log('[nav] navigation/redirect will navigating to ' + parsedUrl.toString());
      action.meta.dispatchFromMain({
        action: fromDapps.loadResourceAction({
          url: parsedUrl.toString(),
          tabId: payload.tabId,
        }),
      });
    } else {
      e.preventDefault();
      action.meta.openExternal(url);
    }
  };

  view.webContents.addListener('will-redirect', (e, url) => {
    console.log('will-redirect', url);
    handleNavigation(url, e);
  });

  view.webContents.addListener('will-navigate', (e, url) => {
    console.log('will-navigate', url);
    handleNavigation(url, e);
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
