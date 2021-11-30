import https from 'https';
import fs from 'fs';
import { Session, CookiesSetDetails, CookiesGetFilter, ProtocolRequest } from 'electron';
import cookieParser from 'set-cookie-parser';

import * as fromCookies from '../src/store/cookies';
import { DappyBrowserView } from './models';
import { Cookie } from '../src/models';

const agents: { [key: string]: https.Agent } = {};

const executeSentryRequest = (request: ProtocolRequest) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: request.method,
      host: 'sentry.io',
      port: 443,
      rejectUnauthorized: true,
      path: request.url.replace('https://sentry.io', '') || '/',
      headers: request.headers,
    };
    https.request(options, resolve).on('error', (er) => {
      console.log(er);
      reject(er); // TODO: A valider
    });
  });
};

const isSentryRequestInDappyApp = (url, dappyBrowserView: DappyBrowserView) =>
  url.startsWith('https://sentry.io') && !dappyBrowserView;

interface InterceptHttpsRequestsParams {
  dappyBrowserView: DappyBrowserView;
  setCookie: (cookieDetails: CookiesSetDetails) => Promise<void>;
}

const makeInterceptHttpsRequests = ({ dappyBrowserView, setCookie }: InterceptHttpsRequestsParams) => {
  let topLevelNavigation = true;
  const debug = !process.env.PRODUCTION;
  return async (
    request: ProtocolRequest,
    callback: (response: NodeJS.ReadableStream | Electron.ProtocolResponse) => void
  ) => {
    // todo : cleaner sentry.io handling
    /*
    todo, forbid third party apps from talking to sentry.io without authorization
    check the User-Agent to see if it is legit (it should be the User-Agent of main process)
    TODO: An attack can use sentry.io to export data from DappyApp to a sentry API 
    */
    if (isSentryRequestInDappyApp(request.url, dappyBrowserView)) {
      callback(await executeSentryRequest(request));
      return;
    }

    if (!dappyBrowserView) {
      console.log('[https] An unauthorized process, maybe BrowserWindow, tried to make an https request');
      callback(null);
      return;
    }

    /* browser to server */
    const withoutProtocol = request.url.split('//').slice(1);
    const pathArray = withoutProtocol.join('').split('/');
    const host = pathArray.slice(0, 1)[0];
    const path = pathArray.slice(1).join('/');

    const serversWithSameHost = dappyBrowserView.record.data.servers.filter((s) => s.host === host);
    if (!serversWithSameHost.length) {
      console.log(
        `[https] An app (${dappyBrowserView.resourceId}) tried to make an https request to an unknown host (${host})`
      );
      callback(null);
      return;
    }

    let cookies: Electron.Cookie[] = [];
    cookies = await dappyBrowserView.browserView.webContents.session.cookies.get({
      url: `https://${serversWithSameHost[0].host}`,
    });

    let cookieHeader = '';
    if (topLevelNavigation) {
      if (debug) console.log('[https load] first top level navigation, only lax cookies');
      cookieHeader = cookies
        .filter((c) => !!c.domain && !c.domain.startsWith('.'))
        .filter((c) => c.sameSite === 'lax')
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');
      topLevelNavigation = false;
    } else {
      cookieHeader = cookies
        .filter((c) => !!c.domain && !c.domain.startsWith('.'))
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');
    }

    const loadFails = {};

    let over = false;
    let i = 0;
    const tryToLoad = (i: number) => {
      if (debug) console.log('[https load]', request.url, i);
      const s = serversWithSameHost[i];
      // See https://nodejs.org/docs/latest-v10.x/api/tls.html#tls_tls_createsecurecontext_options
      if (!agents[`${s.ip}-${s.cert}`]) {
        agents[`${s.ip}-${s.cert}`] = new https.Agent({
          /* no dns */
          host: s.ip,
          rejectUnauthorized: true, // true by default
          minVersion: 'TLSv1.2',
          ca: decodeURI(decodeURI(s.cert)),
        });
      }

      const options: https.RequestOptions = {
        agent: agents[`${s.ip}-${s.cert}`],
        method: request.method,
        path: path ? `/${path}` : '/',
        headers: {
          ...request.headers,
          /* no dns */
          host: s.host,
          Cookie: cookieHeader,
          Origin: `dappy://${dappyBrowserView.dappyDomain}`,
        },
      };

      try {
        const req = https
          .request(options, (resp) => {
            if (resp.headers && resp.headers['set-cookie']) {
              const cookies = cookieParser.parse(resp, {
                decodeValues: true,
              });

              cookies.forEach((c) => {
                setCookie({
                  name: c.name,
                  value: c.value,
                  url: `https://${serversWithSameHost[0].host}`,
                  expirationDate: c.expires ? new Date(c.expires).getTime() / 1000 : undefined,
                  secure: true,
                  httpOnly: true,
                  // sameSite is by default 'lax'
                  sameSite: ['Strict', 'strict'].includes(c.sameSite) ? 'strict' : 'lax',
                });
              });
              if (debug && cookies.length) console.log(`[https load] set ${cookies.length} cookie(s)`);
            }

            if (debug) console.log('[https load] OK', resp.statusCode, request.url, i);
            resp.headers = {
              ...resp.headers,
              'Content-Security-Policy': dappyBrowserView.record.data.csp || "default-src 'self'",
            };
            if (!over) {
              callback(resp);
              over = true;
            }
          })
          .on('error', (err) => {
            if (debug) console.log('[https load] ERR', request.url, err.message, i);
            let error;
            if (err.message.includes('connect ECONNRESET')) {
              error = {
                errorCode: 523,
                errorMessage: 'Origin Is Unreachable',
              };
            } else {
              error = {
                errorCode: 520,
                errorMessage: 'Unknown Error',
              };
            }
            loadFails[i] = error;

            if (serversWithSameHost[i + 1]) {
              console.log('WILL TRY AGAIN');
              i += 1;
              tryToLoad(i);
            } else {
              if (debug) {
                console.log(`[https load] Resource for app (${dappyBrowserView.resourceId}) failed to load (${path})`);
              }
              over = true;
              callback(null);
              return;
            }
          });

        if (request.uploadData && request.uploadData[0]) {
          request.uploadData.forEach((ud) => {
            if (ud.type === 'rawData') {
              req.write(ud.bytes);
            } else {
              // todo is this safe ?
              // can a IP app or dapp set filePath to /home/bob/anything ???
              const file = fs.readFileSync(ud.filePath);
              // todo, test file upload on other platforms than discord (works on discord)
              req.write(file);
            }
          });

          req.end();
        } else {
          req.end();
        }
      } catch (err) {
        if (debug) console.log('[https load] ERR', request.url, err.message, i);
        let error;
        if (err.message.includes('SSL')) {
          error = {
            errorCode: 526,
            errorMessage: 'Invalid SSL Certificate',
          };
        } else {
          error = {
            errorCode: 520,
            errorMessage: 'Unknown Error',
          };
        }
        loadFails[i] = error;

        if (serversWithSameHost[i + 1]) {
          i += 1;
          tryToLoad(i);
        } else {
          if (debug) console.log(`[https] Resource for app (${dappyBrowserView.resourceId}) failed to load (${path})`);
          callback(null);
          over = true;
          return;
        }
      }
    };
    tryToLoad(i);
  };
};

interface makeCookiesOnChangeParams {
  dappyBrowserView: DappyBrowserView;
  getCookies: (filter: CookiesGetFilter) => Promise<Electron.Cookie[]>;
  dispatchFromMain: (a: any) => void;
}

const makeCookiesOnChange =
  ({ dappyBrowserView, getCookies, dispatchFromMain }) =>
  async (e, c, ca, re) => {
    if (!dappyBrowserView) {
      console.log('no browserView, cannot save cookies');
      return;
    }
    const servers = dappyBrowserView.record.data.servers.filter((s) => s.host === c.domain);
    if (!servers.length) {
      console.log('no browserView.record.data.servers matching cookies domain ' + c.domain);
      return;
    }
    const cookies = await getCookies({ url: `https://${c.domain}` });
    const cookiesToBeStored = cookies
      .filter((c) => typeof c.expirationDate === 'number')
      .map(
        (cook) =>
          ({
            sameSite: cook.sameSite === 'strict' ? 'strict' : 'lax',
            domain: cook.domain,
            name: cook.name,
            value: cook.value,
            expirationDate: cook.expirationDate,
          } as Cookie)
      );
    if (cookiesToBeStored.length) {
      dispatchFromMain({
        action: fromCookies.saveCookiesForDomainAction({
          dappyDomain: dappyBrowserView.dappyDomain,
          cookies: cookiesToBeStored,
        }),
      });
    }
  };

interface OverrideHttpProtocolsParams {
  dappyBrowserView: DappyBrowserView | undefined;
  session: Session;
  dispatchFromMain: (a: any) => void;
}

export const overrideHttpProtocols = ({ dappyBrowserView, session, dispatchFromMain }: OverrideHttpProtocolsParams) => {
  // Block all HTTP when not development
  if (process.env.PRODUCTION) {
    session.protocol.interceptStreamProtocol('http', (request, callback) => {
      console.log(`[http] unauthorized`);
      callback(null);
      return;
    });
  }

  session.cookies.on(
    'changed',
    makeCookiesOnChange({
      dappyBrowserView,
      getCookies: (filter: CookiesGetFilter) => session.cookies.get(filter),
      dispatchFromMain,
    })
  );

  session.protocol.interceptStreamProtocol(
    'https',
    makeInterceptHttpsRequests({
      dappyBrowserView,
      setCookie: (cookieDetails: CookiesSetDetails) => session.cookies.set(cookieDetails),
    })
  );
};
