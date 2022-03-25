import { takeEvery, select, put } from 'redux-saga/effects';
import path from 'path';
import https from 'https';
import { BrowserView, app, session } from 'electron';
import { blake2b } from 'blakejs';

import * as fromBrowserViews from '../browserViews';
import { DappyBrowserView } from '../../models';
import { registerInterProcessDappProtocol } from '../../registerInterProcessDappProtocol';
import { registerDappyNetworkProtocol } from '../../registerDappyNetworkProtocol';
import { overrideHttpsProtocol } from '../../overrideHttpsProtocol';
import { overrideHttpProtocol } from '../../overrideHttpProtocol';
import { registerDappyLocalProtocol } from '../../registerDappyLocalProtocol';
import { preventAllPermissionRequests } from '../../preventAllPermissionRequests';
import { store } from '../';

import * as fromSettingsMain from '../settings';
import * as fromDappsRenderer from '../../../src/store/dapps';
import * as fromHistoryRenderer from '../../../src/store/history';
import { DappyLoadError, Tab } from '/models';

const development = !!process.defaultApp;

const loadOrReloadBrowserView = function* (action: any) {
  const payload: { tab: Tab } = action.payload;
  const settings: fromSettingsMain.State = yield select(fromSettingsMain.getSettings)
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);
  const position: { x: number; y: number; width: number; height: number } = yield select(
    fromBrowserViews.getBrowserViewsPositionMain
  );

  const url = new URL(payload.tab.url);
  const viewSession = session.fromPartition(`persist:main:${url.host}`, { cache: true });

  /* reload
    a browser view with same id (payload.reosurceId) is
    already running
  */
  if (browserViews[payload.tab.id]) {
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
    const bv = browserViews[payload.tab.id];
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
      browserViews[id].tabId === payload.tab.id
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
      sandbox: true,
      contextIsolation: true,
      devTools: /^true$/i.test(process.env.DAPPY_DEVTOOLS) || !process.env.PRODUCTION,
      disableDialogs: true,
      partition: `persist:main:${url.host}`,
    },
  });

  if (payload.tab.muted) {
    view.webContents.setAudioMuted(payload.tab.muted);
  }

  action.meta.browserWindow.addBrowserView(view);
  view.setBounds(position);

  let newBrowserViews: {
    [tabId: string]: DappyBrowserView;
  } = {};
  newBrowserViews[payload.tab.id] = {
    tabId: payload.tab.id,
    title: payload.tab.title,
    host: new URL(payload.tab.url).host,
    browserView: view,
    visible: true,
  };

  // ==============================
  // Security, interception of protocols, new protocols
  // https://, http://, dappyl://, interprocessdapp://
  // ==============================

  /*
    Use for dev purpose, to identify the storage path / partition into which cookies, blobs, localstorage are
  */
  let partitionIdHash = '';
  if (!process.env.PRODUCTION) {
    partitionIdHash = Buffer.from(blake2b(new Uint8Array(Buffer.from(viewSession.storagePath || '')), 0, 32)).toString('base64').slice(0,5);
    console.log('[part] :', partitionIdHash, viewSession.storagePath, 'used for cookies, blobs, localstorage etc.')
  }

  let isFirstRequest = true;
  const setIsFirstRequest = (a: boolean) => {
    isFirstRequest = a;
  }
  const getIsFirstRequest = () => {
    return isFirstRequest;
  }
  preventAllPermissionRequests(viewSession);
  // todo, avoid circular ref to "store" (see logs when "npm run build:main")
  registerInterProcessDappProtocol(
    newBrowserViews[payload.tab.id],
    viewSession,
    store,
    action.meta.dispatchFromMain
  );
  overrideHttpProtocol({
    session: viewSession,
  });
  if (payload.tab.data.isDappyNameSystem) {
    overrideHttpsProtocol({
      dappyBrowserView: newBrowserViews[payload.tab.id],
      dispatchFromMain: action.meta.dispatchFromMain,
      session: viewSession,
      partitionIdHash: partitionIdHash,
      setIsFirstRequest,
      getIsFirstRequest
    });
  }
  registerDappyNetworkProtocol(newBrowserViews[payload.tab.id], viewSession, store);
  registerDappyLocalProtocol(viewSession)

  /*
    Hide all other browser views
  */
  Object.keys(browserViews).forEach((id) => {
    if (id !== payload.tab.id && browserViews[id].visible) {
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
    If payload.tab.data.html then it is a dapp
  */
  if (!!payload.tab.data.html) {
    const htmlPath = path.join(app.getAppPath(), 'dist/dapp.html');
    yield view.webContents.loadURL(`file://${htmlPath}${new URL(payload.tab.url).pathname}`);
  } else {
    try {
      yield view.webContents.loadURL(payload.tab.url);
      if (settings.devMode) {
        view.webContents.openDevTools();
      }
    } catch (err) {
      action.meta.dispatchFromMain({
        action: fromDappsRenderer.loadResourceFailedAction({
            tabId: payload.tab.id,
            url: payload.tab.url,
            error: {
              error: DappyLoadError.ServerError,
              args: {
                url: payload.tab.url,
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

  view.webContents.on('did-finish-load', (e: Electron.Event) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-finish-load ${payload.tab.id}')`);
    action.meta.dispatchFromMain({
      action: fromDappsRenderer.updateTransitoryStateAction({
        tabId: payload.tab.id,
        transitoryState: undefined,
      }),
    });
  });

  view.webContents.on('did-stop-loading', (e: Electron.Event) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-stop-loading ${payload.tab.id}')`);
    action.meta.dispatchFromMain({
      action: fromDappsRenderer.updateTransitoryStateAction({
        tabId: payload.tab.id,
        transitoryState: undefined,
      }),
    });
    const url = view.webContents.getURL();
    title = view.webContents.getTitle();
    action.meta.dispatchFromMain({
      action: fromDappsRenderer.updateTabUrlAndTitleAction({
        url: url,
        tabId: payload.tab.id,
        title: title,
      }),
    });
    action.meta.dispatchFromMain({
      action: fromHistoryRenderer.didNavigateInPageAction({
        url: url,
        tabId: payload.tab.id,
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
    const currentTitle = view.webContents.getTitle();
    /*
      When the page just finished navigating, title
      is the https url, avoid updating the title at this
      moment
    */
    if (!currentTitle.startsWith('https://')) {
      title = currentTitle;
    }
    action.meta.dispatchFromMain({
      action: fromHistoryRenderer.didNavigateInPageAction({
        url: currentUrl,
        tabId: payload.tab.id,
        title: title,
      }),
    });
    action.meta.dispatchFromMain({
      action: fromDappsRenderer.updateTabUrlAndTitleAction({
        url: currentUrl,
        tabId: payload.tab.id,
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
          action: fromDappsRenderer.didChangeFaviconAction({
            tabId: payload.tab.id,
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
                  action: fromDappsRenderer.didChangeFaviconAction({
                    tabId: payload.tab.id,
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
        action: fromDappsRenderer.updateTabUrlAndTitleAction({
          url: view.webContents.getURL(),
          tabId: payload.tab.id,
          title: title,
        }),
      });
    }
  });

  const handleNavigation = (e: Electron.Event, futureUrl: string, tabFavorite: boolean) => {
    let parsedFutureUrl: URL | undefined = undefined;
    try {
      parsedFutureUrl = new URL(futureUrl);
    } catch (err) {
      e.preventDefault();
      return;
    }
  
    if (parsedFutureUrl.protocol === 'https:') {
      if (parsedFutureUrl.host !== url.host) {
        console.log('[nav] will navigate to another host', url.host, '->', parsedFutureUrl.host);
        e.preventDefault();
        action.meta.dispatchFromMain({
          action: fromDappsRenderer.loadResourceAction({
            url: futureUrl,
            tabId: payload.tab.id,
          }),
        });
      } else {

        let currentUrl = new URL(view.webContents.getURL());
        if (
          tabFavorite &&
          (
            parsedFutureUrl.hostname !== currentUrl.hostname ||
            parsedFutureUrl.pathname !== currentUrl.hostname
          )
        ) {
          e.preventDefault();
          action.meta.dispatchFromMain({
            action: fromDappsRenderer.loadResourceAction({
              url: futureUrl,
              tabId: payload.tab.id,
            }),
          });
        } else {
          // to not e.preventDefault(); and honor navigation
          setIsFirstRequest(true);
          console.log('[nav] will navigate to same host');
        }
      }
    } else {
      e.preventDefault();
      // todo display error message instead of directly openning
      action.meta.dispatchFromMain({
        action: fromDappsRenderer.loadResourceFailedAction({
            tabId: payload.tab.id,
            url: payload.tab.url,
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
    if (new URL(futureUrl).host !== url.host) {
      console.log('will redirect, must change session', url.host, '->', new URL(futureUrl).host)
    }
  });

  view.webContents.on('did-redirect-navigation', (e, url) => {
    console.log('did-redirect-navigation', url);
    
  });

  view.webContents.addListener('will-redirect', (e, futureUrl) => {
    console.log('will-redirect', futureUrl)
  });

  view.webContents.on('will-navigate', (e, futureUrl) => {
    console.log('will-navigate', futureUrl);
    // todo select tab here to know if tab is favorite or not
    handleNavigation(e, futureUrl, payload.tab.favorite);
  });
  view.webContents.on('did-start-loading', (e: Electron.Event) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('did-start-loading ${payload.tab.id}')`);
  });
  view.webContents.on('dom-ready', (a) => {
    action.meta.browserWindow.webContents.executeJavaScript(`console.log('dom-ready ${payload.tab.id}')`);
  });

  /*
    We have to do this dirty hack because "page-title-updated"
    event does not work properly (Electron ^17.0.1)
  */
  const updateTitle = (newTitle: string) => {
    console.log('updateTitle', newTitle);
    if (view && view.webContents && newTitle && newTitle !== title) {
      title = newTitle;
      action.meta.dispatchFromMain({
        action: fromDappsRenderer.updateTabUrlAndTitleAction({
          url: view.webContents.getURL(),
          tabId: payload.tab.id,
          title: title,
        }),
      });
    }
  }

  // ==============================
  // In tab javascript executions
  // ==============================

  /*
    Send html page to the dapp that is currently
    an empty html file
  */
  if (!!payload.tab.data.html) {
    yield view.webContents.executeJavaScript(`
    window.write("${encodeURIComponent(payload.tab.data.html)}")
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
  window.dappy = { host: "${url.host}", path: "${url.pathname}" };
  `);
};

export const loadOrReloadBrowserViewSaga = function* () {
  yield takeEvery(fromBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW, loadOrReloadBrowserView);
};
