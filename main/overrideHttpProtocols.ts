import https from 'https';
import fs from 'fs';
import { Session, CookiesSetDetails, CookiesGetFilter, ProtocolRequest, Cookie, ProtocolResponse } from 'electron';
import cookieParser from 'set-cookie-parser';

import * as fromCookies from '../src/store/cookies';
import { DappyBrowserView } from './models';
import { Cookie as DappyCookie, IPServer } from '/models';

const agents: { [key: string]: https.Agent } = {};

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

const getServersWithSameHost = (dappyBrowserView: DappyBrowserView, url: string) => {
  const { host } = parseUrl(url);

  return dappyBrowserView.record.data.servers?.filter((s) => s.host === host);
};

const isHostIsInRecord = (dappyBrowserView: DappyBrowserView, url: string) => {
  if (!getServersWithSameHost(dappyBrowserView, url)) {
    const { host } = parseUrl(url);
    console.log(
      `[https] An app (${dappyBrowserView.resourceId}) tried to make an https request to an unknown host (${host})`
    );
    return false;
  }
  return true;
};

const getCookiesHeader = async (dappyBrowserView: DappyBrowserView, url: string, isFirstRequest: boolean) => {
  const { host } = parseUrl(url);
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
  debug: boolean;
  request: ProtocolRequest;
  dappyBrowserView: DappyBrowserView;
  isFirstRequest: boolean;
  setCookie: (cookieDetails: CookiesSetDetails) => Promise<void>;
}

const tryToLoad = async ({ debug, request, dappyBrowserView, isFirstRequest, setCookie }: makeTryToLoadParams) => {
  const loadFails: { [key: string]: any } = {};
  let over = false;

  async function load(i: number = 0) {
    if (debug) console.log('[https load]', request.url, i);
    const serversWithSameHost = getServersWithSameHost(dappyBrowserView, request.url) as IPServer[];

    const s = serversWithSameHost[i];
    if (!s.cert && debug) console.log('[https load] use CA', request.url, i);
    // See https://nodejs.org/docs/latest-v10.x/api/tls.html#tls_tls_createsecurecontext_options
    if (!agents[`${s.ip}-${s.cert}`]) {
      if (s.cert) {
        if (debug) console.log('[https load] creating no-CA agent for ip ', s.ip);
        agents[`${s.ip}-${s.cert}`] = new https.Agent({
          /* no dns */
          host: s.ip,
          rejectUnauthorized: true, // true by default
          minVersion: 'TLSv1.2',
          ca: decodeURI(decodeURI(s.cert)),
        });
      } else {
        if (debug) console.log('[https load] creating CA agent for ip ', s.ip);
        agents[`${s.ip}-${s.cert}`] = new https.Agent({
          /* no dns */
          host: s.ip,
          rejectUnauthorized: true, // true by default
        });
      }
    }

    const { path } = parseUrl(request.url);
    const options: https.RequestOptions = {
      agent: agents[`${s.ip}-${s.cert}`],
      method: request.method,
      path: path ? `/${path}` : '/',
      headers: {
        ...request.headers,
        /* no dns */
        host: s.host,
        Cookie: await getCookiesHeader(dappyBrowserView, request.url, isFirstRequest),
        Origin: `dappy://${dappyBrowserView.dappyDomain}`,
      },
    };

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
                  url: `https://${serversWithSameHost[0].host}`,
                  expirationDate: c.expires ? new Date(c.expires).getTime() / 1000 : undefined,
                  secure: true,
                  httpOnly: true,
                  // sameSite is by default 'lax'
                  sameSite: /^strict$/i.test(c.sameSite || '') ? 'strict' : 'lax',
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
              resolve({ data: resp });
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

            if (serversWithSameHost[i + 1]) {
              console.log('WILL TRY AGAIN');
              load(i + 1);
            } else {
              if (debug) {
                console.log(`[https load] Resource for app (${dappyBrowserView.resourceId}) failed to load (${path})`);
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

        if (serversWithSameHost[i + 1]) {
          load(i + 1);
        } else {
          if (debug) console.log(`[https] Resource for app (${dappyBrowserView.resourceId}) failed to load (${path})`);
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

    /* browser to server */
    if (!isHostIsInRecord(dappyBrowserView, request.url)) {
      callback({});
      return;
    }

    if (isFirstRequest) {
      if (debug) console.log('[https load] first top level navigation, only lax cookies');
      isFirstRequest = false;
    }

    callback(await tryToLoad({ debug, dappyBrowserView, isFirstRequest, setCookie, request }));
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
      const servers = dappyBrowserView.record.data.servers?.filter((s) => s.host === c.domain);
      if (!servers?.length) {
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
          } as DappyCookie)
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

  session.protocol.interceptStreamProtocol(
    'https',
    makeInterceptHttpsRequests({
      dappyBrowserView,
      setCookie: (cookieDetails: CookiesSetDetails) => session.cookies.set(cookieDetails),
    })
  );
};
