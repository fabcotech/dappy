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
import { DappyLoadError } from '/models';

const development = !!process.defaultApp;

const loadOrReloadBrowserView = function* (action: any) {
  const payload = action.payload;
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);
  const position: { x: number; y: number; width: number; height: number } = yield select(
    fromBrowserViews.getBrowserViewsPositionMain
  );

  const url = new URL(payload.url);
  const viewSession = session.fromPartition(`persist:main:${url.host}`);

  /* reload
    a browser view with same id (payload.reosurceId) is
    already running
  */
  if (browserViews[payload.tabId]) {
    if (development) {
      console.log('reload or self navigation, closing browserView and unregister protocols');
    }
    const a = viewSession.protocol.unregisterProtocol('dappynetwork');
    const b = viewSession.protocol.unregisterProtocol('interprocessdapp');
    const c = viewSession.protocol.uninterceptProtocol('https');
    let d = true;
    if (!development) {
      d = viewSession.protocol.uninterceptProtocol('http');
    }
    if (development) {
      console.log(a, b, c, d);
    }
    const bv = browserViews[payload.tabId];
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
      browserViews[id].tabId === payload.tabId
    );
  });
  if (sameTabIdBrowserViewId) {
    if (development) {
      console.log('navigation in tab, closing browserView with same tabId');
    }
    const bv = browserViews[sameTabIdBrowserViewId];
    const a = viewSession.protocol.unregisterProtocol('dappynetwork');
    const b = viewSession.protocol.unregisterProtocol('interprocessdapp');
    const c = viewSession.protocol.uninterceptProtocol('https');
    const d = viewSession.protocol.uninterceptProtocol('dappyl');
    let e = true;
    if (!development) {
      e = viewSession.protocol.uninterceptProtocol('http');
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

  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: true,
      contextIsolation: true,
      devTools: /^true$/i.test(process.env.DAPPY_DEVTOOLS) || !process.env.PRODUCTION,
      disableDialogs: true,
      partition: `persist:main:${url.host}`,
    },
  });

  // cookies to start with (from storage)
  // todo is this necessary ?
  // aren't they already in partition ?
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
    [tabId: string]: DappyBrowserView;
  } = {};
  newBrowserViews[payload.tabId] = {
    ...payload,
    host: new URL(payload.url).host,
    browserView: view,
    visible: true,
  };

  // ==============================
  // Security, interception of protocols, new protocols
  // https://, http://, dappyl://, interprocessdapp://
  // ==============================

  preventAllPermissionRequests(viewSession);
  // todo, avoid circular ref to "store" (see logs when "npm run build:main")
  registerInterProcessDappProtocol(
    newBrowserViews[payload.tabId],
    viewSession,
    store,
    action.meta.dispatchFromMain
  );
  overrideHttpProtocols({
    dappyBrowserView: newBrowserViews[payload.tabId],
    dispatchFromMain: action.meta.dispatchFromMain,
    session: viewSession,
  });
  registerDappyNetworkProtocol(newBrowserViews[payload.tabId], viewSession, store);
  registerDappyLocalProtocol(viewSession)

  /*
    Hide all other browser views
  */
  Object.keys(browserViews).forEach((id) => {
    if (id !== payload.tabId && browserViews[id].visible) {
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

  /*
    Save new browser views
  */
  yield put({
    type: fromBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED,
    payload: newBrowserViews,
  });

  /* browser to server
    If payload.html then it is a dapp
  */
  if (!!payload.html) {
    const htmlPath = path.join(app.getAppPath(), 'dist/dapp.html');
    yield view.webContents.loadURL(`file://${htmlPath}${new URL(payload.url).pathname}`);
  } else {
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
      return;
    }
  }

  // ==============================
  // Navigation and lifecycle of the browserView
  // ==============================

  let title = '';

  view.webContents.on('did-finish-load', (a) => {
    console.log('FINISHSHHSSLLAOSOLLASL ---------------------------------')
    console.log(view.webContents.getTitle());
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-finish-load ${payload.tabId}')`);
    action.meta.dispatchFromMain({
      action: fromDapps.updateTransitoryStateAction({
        tabId: payload.tabId,
        transitoryState: undefined,
      }),
    });
  });

  view.webContents.on('did-stop-loading', (a) => {
    console.log('----------------- STOPLAODIGINGINIGNIGN');
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-stop-loading ${payload.tabId}')`);
    action.meta.dispatchFromMain({
      action: fromDapps.updateTransitoryStateAction({
        tabId: payload.tabId,
        transitoryState: undefined,
      }),
    });
    action.meta.dispatchFromMain({
      action: fromHistory.didNavigateInPageAction({
        url: view.webContents.getURL(),
        tabId: payload.tabId,
        title: title,
      }),
    });
  });

  /*
    todo
    This does not trigger, why ?
    (Electron ^17.0.1)
  */
  view.webContents.on('did-navigate', (a, currentUrl, httpResponseCode, httpStatusText) => {
    action.meta.dispatchFromMain({
      action: fromHistory.didNavigateInPageAction({
        url: currentUrl,
        tabId: payload.tabId,
        title: title,
      }),
    });
  });

  view.webContents.on('new-window', (e) => {
    e.preventDefault();
  });

  view.webContents.on('page-favicon-updated', (a, favicons) => {
    if (favicons && favicons[0] && typeof favicons[0] === 'string') {
      if (favicons[0].startsWith('data:image')) {
        action.meta.dispatchFromMain({
          action: fromDapps.didChangeFaviconAction({
            tabId: payload.tabId,
            img: favicons[0],
          }),
        });
      } else if (favicons[0].startsWith('https://')) {

        const urlFav = new URL(favicons[0]);
        try {
          let options: https.RequestOptions = {
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2',
            /* no dns */
            host: urlFav.hostname,
            port: urlFav.port || "443",
            path: urlFav.pathname + urlFav.search,
            method: 'GET',
            headers: {},
          };
          // todo
          // get CERT with dappylookup
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
                console.error(`Could not get favicon (status !== 200) for ${urlFav.host}`);
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
            console.error('[dapp] Could not get favicon (1) ' + favicons[0]);
            console.error(err);
          }).end();
        } catch (err) {
          console.error('[dapp] Could not get favicon (2) ' + favicons[0]);
          console.error(err);
        }
      }
    }
  });

  view.webContents.on('page-title-updated', (a, title) => {
    if (title !== view.webContents.getTitle()) {
      title = title
      action.meta.dispatchFromMain({
        action: fromDapps.didChangeTitleAction({
          tabId: payload.tabId,
          title,
        }),
      });
    }
  });

  const handleNavigation = (url: string, e: Electron.Event) => {
    console.log("payload.url, url", payload.url, url)
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol === 'https:') {
      console.log('[nav] navigation/redirect will navigating to ' + parsedUrl.toString());
      console.log('loadURL', url);
      view.webContents.loadURL(url);
      /* e.preventDefault();
      action.meta.dispatchFromMain({
        action: fromDapps.loadResourceAction({
          url: parsedUrl.toString(),
          tabId: payload.tabId,
        }),
      }); */
    } else {
      e.preventDefault();
      // todo display error message instead of directly openning
      action.meta.dispatchFromMain({
        action: fromDapps.loadResourceFailedAction({
            tabId: payload.tabId,
            url: payload.url,
            error: {
              error: DappyLoadError.DangerousLink,
              args: {
                url: url,
              }
            }
          })
      });
    }
  };

  view.webContents.on('will-redirect', (e, futureUrl) => {
    console.log('-------------------------------------- will-redirect', url);
    if (new URL(futureUrl).host !== url.host) {
      console.log('WILL REDIRECT MUST CHANGE SESSION', url.host, '->', new URL(futureUrl).host)
    }
  });

  view.webContents.on('did-redirect-navigation', (e, url) => {
    console.log('did-redirect-navigation', url);
    
  });

  view.webContents.on('will-navigate', (e, futureUrl) => {
    console.log('will-navigate', futureUrl);
    if (new URL(futureUrl).host !== url.host) {
      console.log('WILL NAVIGATE MUST CHANGE SESSION', url.host, '->', new URL(futureUrl).host)
    }
    handleNavigation(futureUrl, e);
  });
  view.webContents.on('did-start-loading', (a) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-start-loading ${payload.tabId}')`);
  });
  view.webContents.on('dom-ready', (a) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('dom-ready ${payload.tabId}')`);
  });

  /*
    We have to do this dirty hack because "page-title-updated"
    event does not work properly (Electron ^17.0.1)
  */
  const updateTitle = (newTitle: string) => {
    if (view && view.webContents && newTitle !== title) {
      title = newTitle;
      action.meta.dispatchFromMain({
        action: fromDapps.didChangeTitleAction({
          tabId: payload.tabId,
          title,
        }),
      });
    }
  }
  setTimeout(() => {
    updateTitle(view.webContents.getTitle())
  }, 1000);
  setTimeout(() => {
    updateTitle(view.webContents.getTitle())
  }, 2000);
  setTimeout(() => {
    updateTitle(view.webContents.getTitle())
  }, 5000);

  // ==============================
  // In tab javascript executions
  // ==============================

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
};

export const loadOrReloadBrowserViewSaga = function* () {
  yield takeEvery(fromBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW, loadOrReloadBrowserView);
};
