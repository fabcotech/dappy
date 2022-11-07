import { takeEvery, select, put } from 'redux-saga/effects';
import { BrowserView, session } from 'electron';
import { blake2b } from 'blakejs';
import { DappyNetworkMember } from '@fabcotech/dappy-lookup';

import * as fromBrowserViews from '../browserViews';
import { DappyBrowserView } from '../../models';
import { registerInterProcessDappProtocol } from '../../registerInterProcessDappProtocol';
import { overrideHttpsProtocol } from '../../overrideHttpsProtocol';
import { overrideHttpProtocol } from '../../overrideHttpProtocol';
import { registerDappyLocalProtocol } from '../../registerDappyLocalProtocol';
import { preventAllPermissionRequests } from '../../preventAllPermissionRequests';
import { store } from '..';

import * as fromSettingsMain from '../settings';
import * as fromBlockchainsMain from '../blockchains';
import * as fromSettingsRenderer from '../../../src/store/settings';
import * as fromDappsRenderer from '../../../src/store/dapps';
import * as fromHistoryRenderer from '../../../src/store/history';
import { Blockchain, CertificateAccount, Tab } from '/models';

const development = !!process.defaultApp;

function* loadOrReloadBrowserView(action: any) {
  const { payload }: { payload: { tab: Tab; clientCertificate: CertificateAccount } } = action;
  const settings: fromSettingsRenderer.Settings = yield select(fromSettingsMain.getSettings);
  const blockchains: { [chainId: string]: Blockchain } = yield select(
    fromBlockchainsMain.getBlockchains
  );
  const browserViews: {
    [tabId: string]: DappyBrowserView;
  } = yield select(fromBrowserViews.getBrowserViewsMain);
  const position: { x: number; y: number; width: number; height: number } = yield select(
    fromBrowserViews.getBrowserViewsPositionMain
  );

  if (payload.tab.data.isDappyNameSystem && !blockchains[payload.tab.data.chainId!]) {
    action.meta.dispatchFromMain({
      action: fromDappsRenderer.loadResourceFailedAction({
        tabId: payload.tab.id,
        url: payload.tab.url,
        error: {
          title: '🤨 Dappy network error',
          message:
            'The dappy network was not found, make sure the TLD corresponds to the current network configuration (ex: .d, .gamma etc.)',
        },
      }),
    });
    return;
  }

  let dappyNetworkMembers: undefined | DappyNetworkMember[];
  let urlBeforeParse: undefined | URL;
  try {
    urlBeforeParse = new URL(payload.tab.url);
  } catch (err) {
    action.meta.dispatchFromMain({
      action: fromDappsRenderer.loadResourceFailedAction({
        tabId: payload.tab.id,
        url: payload.tab.url,
        error: {
          title: '🤔 Invalid URL',
          message: `We were unable to parse URL ${payload.tab.url}`,
        },
      }),
    });
    return;
  }
  const url = urlBeforeParse as URL;

  const viewSession = session.fromPartition(`persist:main:${url.host}`, { cache: true });

  /* reload
    a browser view with same id (payload.reosurceId) is
    already running
  */
  if (browserViews[payload.tab.id]) {
    if (development) {
      console.log('reload or self navigation, closing browserView and unregister protocols');
    }
    const b = viewSession.protocol.unregisterProtocol('interprocessdapp');
    const c = viewSession.protocol.uninterceptProtocol('https');
    let d = true;
    if (!development) {
      d = viewSession.protocol.uninterceptProtocol('http');
    }
    if (development) {
      console.log(b, c, d);
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
    return browserViews[id].tabId === payload.tab.id;
  });
  if (sameTabIdBrowserViewId) {
    if (development) {
      console.log('navigation in tab, closing browserView with same tabId');
    }
    const bv = browserViews[sameTabIdBrowserViewId];
    const b = viewSession.protocol.unregisterProtocol('interprocessdapp');
    const c = viewSession.protocol.uninterceptProtocol('https');
    const d = viewSession.protocol.uninterceptProtocol('dappyl');
    let e = true;
    if (!development) {
      e = viewSession.protocol.uninterceptProtocol('http');
    }
    if (development) {
      console.log(b, c, d, e);
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
    return;
  }

  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      devTools: /^true$/i.test(process.env.DAPPY_DEVTOOLS || '') || !process.env.PRODUCTION,
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
    data: {
      ...payload.tab.data,
      blockchain: blockchains[payload.tab.data.chainId as string] as Blockchain,
    },
    visible: true,
  };

  // ==============================
  // Security, interception of protocols, new protocols
  // https://, http://, dappyl://, interprocessdapp://
  // ==============================

  /*
    Use for dev purpose, to identify the storage path / partition into which cookies,
    blobs, localstorage are
  */
  let partitionIdHash = '';
  if (!process.env.PRODUCTION) {
    partitionIdHash = Buffer.from(
      blake2b(new Uint8Array(Buffer.from(viewSession.storagePath || '')), 0, 32)
    )
      .toString('base64')
      .slice(0, 5);
    console.log(
      '[part] :',
      partitionIdHash,
      viewSession.storagePath,
      'used for cookies, blobs, localstorage etc.'
    );
  }

  let isFirstRequest = true;
  const setIsFirstRequest = (a: boolean) => {
    isFirstRequest = a;
  };
  const getIsFirstRequest = () => {
    return isFirstRequest;
  };
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
    dappyNetworkMembers = blockchains[payload.tab.data.chainId as string].nodes;
    overrideHttpsProtocol({
      chainId: payload.tab.data.chainId || '',
      dappyNetworkMembers,
      dappyBrowserView: newBrowserViews[payload.tab.id],
      session: viewSession,
      partitionIdHash,
      clientCertificate: payload.clientCertificate,
      setIsFirstRequest,
      getIsFirstRequest,
    });
  }
  registerDappyLocalProtocol(viewSession);

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

  try {
    yield view.webContents.loadURL(payload.tab.url);
    if (settings.devMode) {
      view.webContents.openDevTools();
    }
  } catch (err) {
    if (err instanceof Error) {
      if ((err.message || '').includes('ERR_CERT_COMMON_NAME_INVALID')) {
        action.meta.dispatchFromMain({
          action: fromDappsRenderer.loadResourceFailedAction({
            tabId: payload.tab.id,
            url: payload.tab.url,
            error: {
              title: '🤔 Common name error',
              message: `We were unable to resolve host name for ${payload.tab.url}. Are you sure domain exists ? Note that only https:// websites are supported.`,
            },
          }),
        });
      } else {
        action.meta.dispatchFromMain({
          action: fromDappsRenderer.loadResourceFailedAction({
            tabId: payload.tab.id,
            url: payload.tab.url,
            error: {
              title: '🤔 Server connection error',
              message: err.message,
            },
          }),
        });
      }
    }
  }

  // ==============================
  // Navigation and lifecycle of the browserView
  // ==============================

  let title = '';

  view.webContents.on('did-finish-load', () => {
    action.meta.browserWindow.webContents.executeJavaScript(
      `console.log('did-finish-load ${payload.tab.id}')`
    );
    action.meta.dispatchFromMain({
      action: fromDappsRenderer.updateTransitoryStateAction({
        tabId: payload.tab.id,
        transitoryState: undefined,
      }),
    });
  });

  view.webContents.on('did-stop-loading', () => {
    action.meta.browserWindow.webContents.executeJavaScript(
      `console.log('did-stop-loading ${payload.tab.id}')`
    );
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
        url,
        tabId: payload.tab.id,
        title,
      }),
    });
    action.meta.dispatchFromMain({
      action: fromHistoryRenderer.didNavigateInPageAction({
        url,
        tabId: payload.tab.id,
        title,
      }),
    });
  });

  /*
    todo
    This does not trigger, why ?
    (Electron ^17.0.1)
  */
  view.webContents.on('did-navigate', (_, currentUrl) => {
    const currentTitle = view.webContents.getTitle();
    /*
      When the page just finished navigating, title
      is the https url, avoid updating the title at this
      moment
    */
    if (!currentTitle.startsWith('https://')) {
      title = currentTitle;
    }
    action.meta.browserWindow.webContents.executeJavaScript(
      `window.browserViewEvent('did-navigate', { tabId: '${payload.tab.id}', url: '${currentUrl}' })`
    );
    action.meta.dispatchFromMain({
      action: fromDappsRenderer.updateTabUrlAndTitleAction({
        url: currentUrl,
        tabId: payload.tab.id,
        title,
      }),
    });
  });

  view.webContents.on('new-window', (e) => {
    e.preventDefault();
  });

  view.webContents.on('page-favicon-updated', async (_, favicons) => {
    console.log('page-favicon-updated');
  });

  view.webContents.on('page-title-updated', (_, title) => {
    if (title !== view.webContents.getTitle()) {
      action.meta.dispatchFromMain({
        action: fromDappsRenderer.updateTabUrlAndTitleAction({
          url: view.webContents.getURL(),
          tabId: payload.tab.id,
          title,
        }),
      });
    }
  });

  const handleNavigation = (e: Electron.Event, futureUrl: string, tabFavorite: boolean) => {
    let parsedFutureUrl: URL | undefined;
    try {
      parsedFutureUrl = new URL(futureUrl);
    } catch (err) {
      e.preventDefault();
      return;
    }

    if (parsedFutureUrl.protocol === 'https:') {
      /* if (parsedFutureUrl.host !== url.host) {
        console.log('[nav] will navigate to another host', url.host, '->', parsedFutureUrl.host);
        e.preventDefault();
        action.meta.dispatchFromMain({
          action: fromDappsRenderer.loadResourceAction({
            url: futureUrl,
            tabId: payload.tab.id,
          }),
        });
      } else {
        const currentUrl = new URL(view.webContents.getURL());
        if (
          tabFavorite &&
          (parsedFutureUrl.hostname !== currentUrl.hostname ||
            parsedFutureUrl.pathname !== currentUrl.hostname)
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
      } */
    } else {
      e.preventDefault();
      // todo display error message instead of directly openning
      action.meta.dispatchFromMain({
        action: fromDappsRenderer.loadResourceFailedAction({
          tabId: payload.tab.id,
          url: payload.tab.url,
          error: {
            title: '🚫 Unsupported protocol',
            message: `The browser is trying to visit a non-https URL ${futureUrl}, this protocol is not supported and has been blocked.`,
          },
        }),
      });
    }
  };

  view.webContents.on('will-redirect', (e, futureUrl) => {
    console.log('will-redirect', futureUrl);
    if (new URL(futureUrl).host !== url.host) {
      console.log('will redirect, must change session', url.host, '->', new URL(futureUrl).host);
    }
  });

  view.webContents.on('did-redirect-navigation', (e, url) => {
    console.log('did-redirect-navigation', url);
  });

  view.webContents.on('will-navigate', (e, futureUrl) => {
    console.log('will-navigate', futureUrl);
    // todo select tab here to know if tab is favorite or not
    handleNavigation(e, futureUrl, payload.tab.favorite);
  });
  view.webContents.on('did-start-loading', (e: Electron.Event) => {
    action.meta.browserWindow.webContents.executeJavaScript(
      `window.browserViewEvent('did-start-loading', { tabId: '${
        payload.tab.id
      }', url: '${e.sender.getURL()}' })`
    );
  });
  view.webContents.on('dom-ready', (e) => {
    action.meta.browserWindow.webContents.executeJavaScript(
      `window.browserViewEvent('dom-ready', { tabId: '${
        payload.tab.id
      }', url: '${e.sender.getURL()}' })`
    );
  });

  // ==============================
  // In tab javascript executions
  // ==============================

  /*
    Send html page to the dapp that is currently
    an empty html file
  */
  if (payload.tab.data.html) {
    yield view.webContents.executeJavaScript(`
    window.write("${encodeURIComponent(payload.tab.data.html)}")
    `);
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
}

export function* loadOrReloadBrowserViewSaga() {
  yield takeEvery(fromBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW, loadOrReloadBrowserView);
}
