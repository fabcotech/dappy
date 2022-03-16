import https from 'https';
import fs from 'fs';
import { Session, CookiesSetDetails, CookiesGetFilter, ProtocolRequest, Cookie, ProtocolResponse } from 'electron';
import cookieParser from 'set-cookie-parser';

import * as fromCookies from '../src/store/cookies';
import { DappyBrowserView } from './models';
import { Cookie as DappyCookie } from '/models';

const executeSentryRequest = (request: ProtocolRequest): Promise<ProtocolResponse> => {
  return new Promise((resolve, reject) => {
    const options = {
      method: request.method,
      host: 'sentry.io',
      port: 443,
      rejectUnauthorized: true,
      path: request.url.replace('https://sentry.io', '') || '/',
      headers: request.headers,
    };
    https
      .request(options, (data) => resolve({ data }))
      .on('error', (er) => {
        console.log(er);
        reject(er); // TODO: A valider
      });
  });
};

const isSentryRequestInDappyApp = (url: string, dappyBrowserView: DappyBrowserView | undefined) =>
  url.startsWith('https://sentry.io') && !dappyBrowserView;

const onlyLaxCookieOnFirstRequest = (isFirstRequest: boolean, cookie: Cookie) =>
  isFirstRequest ? cookie.sameSite === 'lax' : true;

export const parseUrl = (url: string): { host?: string; path?: string } => {
  const urlRegExp = /^.+\/\/([^\/]+)(\/.*)?/;
  if (!urlRegExp.test(url)) return {};

  const [_, host, path] = url.match(urlRegExp) as string[];
  return {
    host,
    path,
  };
};

const getCookiesHeader = async (dappyBrowserView: DappyBrowserView, url: string, isFirstRequest: boolean) => {
  const host = new URL(url).host;
  let cookies: Cookie[] = [];
  cookies = await dappyBrowserView.browserView.webContents.session.cookies.get({
    url: `https://${host}`,
  });
  const cookieHeader = cookies
    .filter((c) => !!c.domain && !c.domain.startsWith('.'))
    .filter((c) => onlyLaxCookieOnFirstRequest(isFirstRequest, c))
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  return cookieHeader;
};

interface makeTryToLoadParams {
  dns: boolean;
  debug: boolean;
  request: ProtocolRequest;
  dappyBrowserView: DappyBrowserView;
  isFirstRequest: boolean;
  setCookie: (cookieDetails: CookiesSetDetails) => Promise<void>;
}

const tryToLoad = async ({ dns, debug, request, dappyBrowserView, isFirstRequest, setCookie }: makeTryToLoadParams) => {
  const loadFails: { [key: string]: any } = {};
  let over = false;

  async function load(i: number = 0) {
    if (debug) console.log('[https load]', request.url, i);

    const url = new URL(request.url);
    console.log('url.hostname', url.hostname);
    console.log('url.port', url.port);
    console.log('url.host', url.host);
    console.log('url.path', url.pathname);
    let networkHosts = [url.hostname];
    let port = url.port ? url.port : "443";
    if (dns == false) {
      // todo dappy-lookup get A or AAAA records
      networkHosts = ["46.101.211.203"]
      if (url.port) port = url.port;
    }

    console.log('networkHosts', networkHosts);

    const options: https.RequestOptions = {
      host: networkHosts[i],
      method: request.method,
      path: url.pathname ? `${url.pathname}` : '/',
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
      headers: {
        ...request.headers,
        host: url.hostname,
        Cookie: await getCookiesHeader(dappyBrowserView, request.url, isFirstRequest),
        Origin: `https://${dappyBrowserView.host}`,
      },
    };

    // todo
    /* if (s.cert) {
      options.ca = decodeURI(decodeURI(s.cert));
    } */

    if (request.referrer) {
      options.headers!.referrer = request.referrer;
    }

    return new Promise<ProtocolResponse>((resolve) => {
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
                  url: `https://${url.host}`,
                  expirationDate: c.expires ? new Date(c.expires).getTime() / 1000 : undefined,
                  secure: true,
                  httpOnly: true,
                  // sameSite is by default 'lax'
                  sameSite: /^strict$/i.test(c.sameSite || '') ? 'strict' : 'lax',
                });
              });
              if (debug && cookies.length) console.log(`[https load] set ${cookies.length} cookie(s)`);
            }
            if (resp.statusCode === 301) {
              console.log('[https load] 301', resp.headers.location)
            }
            if (debug) console.log('[https load] OK', resp.statusCode, request.url, i);
            // todo csp
            /* resp.headers = {
              ...resp.headers,
              'Content-Security-Policy': dappyBrowserView.csp || "default-src 'self'",
            };
            */

            // be sure to what we should resolve, see
            // Electron.ProtocolResponse type
            if (!over) {
              resolve({
                data: resp,
                headers: resp.headers,
                statusCode: resp.statusCode,
              });
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
            loadFails[i.toString()] = error;

            if (networkHosts[i + 1]) {
              console.log('WILL TRY AGAIN');
              load(i + 1);
            } else {
              if (debug) {
                console.log(`[https load] Resource for app (${dappyBrowserView.resourceId}) failed to load (${url.pathname})`);
              }
              over = true;
              resolve({});
              return;
            }
          });

        if (request.uploadData && request.uploadData[0]) {
          request.uploadData.forEach((ud: any) => {
            // TODO: remove any if possible
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
      } catch (err: any) {
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

        if (networkHosts[i + 1]) {
          load(i + 1);
        } else {
          if (debug) console.log(`[https] Resource for app (${dappyBrowserView.resourceId}) failed to load (${url.pathname})`);
          resolve({});
          over = true;
          return;
        }
      }
    });
  }

  return load();
};

interface InterceptHttpsRequestsParams {
  dappyBrowserView: DappyBrowserView | undefined;
  setCookie: (cookieDetails: CookiesSetDetails) => Promise<void>;
}

const makeInterceptHttpsRequests = ({ dappyBrowserView, setCookie }: InterceptHttpsRequestsParams) => {
  let isFirstRequest = true;
  const debug = !process.env.PRODUCTION;
  return async (request: ProtocolRequest, callback: (response: Electron.ProtocolResponse) => void) => {
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
      callback({});
      return;
    }

    if (isFirstRequest) {
      if (debug) console.log('[https load] first top level navigation, only lax cookies');
      isFirstRequest = false;
    }

    console.log('url', request.url);
    console.log('.dappy', new URL(request.url).host.endsWith('.dappy'));

    /*
      Dappy name system, custom handler 
    */
    if (new URL(request.url).host.endsWith('.dappy')) {
      console.log('Will tryToLoad DNS false')
      try {
        callback(await tryToLoad({ dns: false, debug, dappyBrowserView, isFirstRequest, setCookie, request }));
      } catch (err) {
        console.log(err);
        callback({});
      }

    /*
      DNS
    */
    } else {
      console.log('Will tryToLoad DNS true')
      try {
        callback(await tryToLoad({ dns: true, debug, dappyBrowserView, isFirstRequest, setCookie, request }));
      } catch (err) {
        console.log(err);
        callback({});
      }
    }
  };
};

interface makeCookiesOnChangeParams {
  dappyBrowserView: DappyBrowserView | undefined;
  getCookies: (filter: CookiesGetFilter) => Promise<Electron.Cookie[]>;
  dispatchFromMain: (a: any) => void;
}

const makeCookiesOnChange =
  ({ dappyBrowserView, getCookies, dispatchFromMain }: makeCookiesOnChangeParams) =>
  async (_: unknown, c: Cookie) => {
    if (!dappyBrowserView) {
      console.log('no browserView, cannot save cookies');
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
          } as DappyCookie)
      );
    if (cookiesToBeStored.length) {
      dispatchFromMain({
        action: fromCookies.saveCookiesForDomainAction({
          host: dappyBrowserView.host,
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
    return session.protocol.interceptStreamProtocol('http', (request, callback) => {
      console.log(`[http] unauthorized`);
      callback({});
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

  return session.protocol.interceptStreamProtocol(
    'https',
    makeInterceptHttpsRequests({
      dappyBrowserView,
      setCookie: (cookieDetails: CookiesSetDetails) => session.cookies.set(cookieDetails),
    })
  );
};
