import https from 'https';
import fs from 'fs';
import { Session, CookiesSetDetails, CookiesGetFilter, ProtocolRequest, Cookie, ProtocolResponse } from 'electron';
import cookieParser from 'set-cookie-parser';

import * as fromCookies from '../src/store/cookies';
import { DappyBrowserView } from './models';
import { Cookie as DappyCookie } from '/models';
import { DispatchFromMainArg } from './main';

const rightPad = (str: string, num: number) => {
  let s = str.slice(0,num);
  for (let i = 0; i < num - str.length; i += 1) {
    s += ' '
  }
  return s;
}

// RFC 6265
export const isCookieDomainSentWithHost = (cookieDomain: string | undefined, host: string) => {
  if (!cookieDomain) return false;

  // Try an exact match
  if (cookieDomain === host) return true;
  if (cookieDomain === `.${host}`) return true;

  // TLD cookies not sent fo 2nd/3rd/etc levels
  // do not send cookie if domain = .com or com
  if (cookieDomain.startsWith('.') && (cookieDomain.match(/\./g) || []).length === 1) return false;
  if ((cookieDomain.match(/\./g) || []).length === 0) return false;

  // does host matches a sublevel of cookieDOmain ?
  // turns example.com into .example.com
  let secondLevel = cookieDomain.startsWith('.') ? cookieDomain : `.${cookieDomain}`; 
  if (host.endsWith(secondLevel)) return true;

  return false;
}

const executeSentryRequest = (request: ProtocolRequest): Promise<ProtocolResponse> => {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
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

const getCookiesHeader = async (dappyBrowserView: DappyBrowserView, url: string, isFirstRequest: boolean, s: string) => {
  const host = new URL(url).host;
  let cookies: Cookie[] = [];
  cookies = await dappyBrowserView.browserView.webContents.session.cookies.get({
    url: `https://${host}`,
  });

  const okCookies = cookies
    .filter((c) => isCookieDomainSentWithHost(c.domain, host))
    .filter((c) => onlyLaxCookieOnFirstRequest(isFirstRequest, c));

  return {
    cookieHeader: okCookies.map((c) => `${c.name}=${c.value}`).join('; '),
    numberOfCookies: {
      lax: okCookies.filter(c => c.sameSite === 'lax').length,
      strict: okCookies.filter(c => c.sameSite === 'strict').length,
    }
  };
};

interface makeTryToLoadParams {
  dns: boolean;
  debug: boolean;
  request: ProtocolRequest;
  dappyBrowserView: DappyBrowserView;
  partitionIdHash: string;
  setIsFirstRequest: (a: boolean) => void;
  getIsFirstRequest: () => boolean;
  setCookie: (cookieDetails: CookiesSetDetails) => Promise<void>;
  getBlobData: (blobUUID: string) => Promise<Buffer>;
}

const tryToLoad = async ({ dns, debug, request, partitionIdHash, dappyBrowserView, setIsFirstRequest, getIsFirstRequest, setCookie, getBlobData }: makeTryToLoadParams) => {
  let over = false;

  async function load(i: number = 0) {

    let s = "";

    const url = new URL(request.url);
    const isFirstRequest = getIsFirstRequest();

    if (debug) {
      if (isFirstRequest) {
        s += `[https load ${partitionIdHash}] first hand navigation ${rightPad(request.url, 32)} ${i}`;
      } else {
        s += `[https load ${partitionIdHash}] ${rightPad(request.url, 32)} ${i}`;
      }
    }

    let networkHosts = [url.hostname];
    let port = url.port ? url.port : "443";
    if (dns == false) {
      // todo dappy-lookup get A or AAAA records
      networkHosts = ["46.101.211.203"]
      if (url.port) port = url.port;
    }

    let path = `/`;
    if (url.pathname) {
      path = url.pathname;
    }
    if (url.search) {
      path += url.search
    }

    const getCookiesHeaderResp = await getCookiesHeader(dappyBrowserView, url.origin, isFirstRequest, s);

    /*
      The next requests (next time tryToLoad is called) for same session / BrowserView will be a secondary requests, after the following line
      get isFirstRequest still true
    */
    setIsFirstRequest(false);

    const options: https.RequestOptions = {
      host: networkHosts[i],
      method: request.method,
      path: path,
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
      headers: {
        ...request.headers,
        host: url.hostname,
        Cookie: getCookiesHeaderResp.cookieHeader,
        Origin: `https://${dappyBrowserView.host}`,
      },
    };

    s += rightPad(` | cook: ${getCookiesHeaderResp.numberOfCookies.lax}lax ${getCookiesHeaderResp.numberOfCookies.strict}strict`, 22)
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
            let respCookies: cookieParser.Cookie[] = [];
            if (resp.headers && resp.headers['set-cookie']) {
              respCookies = cookieParser.parse(resp, {
                decodeValues: true,
              });

              respCookies.forEach((c) => {
                setCookie({
                  name: c.name,
                  value: c.value,
                  url: `https://${url.host}`,
                  expirationDate: c.expires ? new Date(c.expires).getTime() / 1000 : undefined,
                  secure: typeof c.secure === 'boolean' ? c.secure : true,
                  httpOnly: typeof c.httpOnly === 'boolean' ? c.httpOnly : true,
                  // sameSite is by default 'lax'
                  sameSite: /^strict$/i.test(c.sameSite || '') ? 'strict' : 'lax',
                });
              });
            }

            /*
              Redirection is only ok if it is undergoing a first request
            */
            if (
              isFirstRequest &&
              [300, 301, 302, 303, 304, 307, 308, 309].find(a => a === resp.statusCode)
            ) {
              s += rightPad(` | ${resp.statusCode} redirect`, 10);
              if (respCookies.length) s += ` (${respCookies.length} cook)`

              /*
                todo, how to know a request is first hand navigation ?
                all .dappy first hand navigations must have the dappy CSP
                override
              */
              over = true;
               resolve({
                statusCode: resp.statusCode,
                headers: resp.headers as Record<string, string | string[]>,
              });
              return;
            }

            s += rightPad(` | ${resp.statusCode}`, 7);
            
            if (debug) console.log(s);
            // todo csp
            /* resp.headers = {
              ...resp.headers,
              'Content-Security-Policy': dappyBrowserView.csp || "default-src 'self'",
            };
            */
            if (!over) {
              resolve({
                data: resp,
                headers: resp.headers as Record<string, string | string[]>,
              });
              over = true;
            }
          })
          .on('error', (err) => {
            if (debug) console.log('[https load] ERR (1)', request.url, err.message, i);

            let statusCode = 502;
            if (err.message.includes('connect ECONNRESET')) {
              statusCode = 523;
            } else {
              statusCode = 520;
            }

            if (networkHosts[i + 1]) {
              load(i + 1);
            } else {
              if (debug) {
                console.log(`[https load] Resource for app (${dappyBrowserView.tabId}) failed to load (${url.pathname})`);
              }

              /*
                Will catch in main/store/sagas/loadOrReloadBrowserView.ts L193
              */
              resolve({
                data: err.message,
                headers: {},
                statusCode: statusCode
              });
              over = true;
              return;
            }
          });
        
        if (request.uploadData && request.uploadData[0]) {

          const handleUploadData = async () => {
            const uds = request.uploadData as Electron.UploadData[];

            for (let j = 0; j < uds.length; j += 1) {
              if (uds[j].bytes) {
                req.write(uds[j].bytes);
              } else if (uds[j].blobUUID) {
                const bd = await getBlobData(uds[j].blobUUID as string);
                req.write(bd);
              } else {
                // todo is this safe ?
                // can a IP app or dapp set filePath to /home/bob/anything ???
                const file = fs.readFileSync(uds[j].file as string);
                // todo, test file upload on other platforms than discord (works on discord)
                req.write(file);
              }
              if (j === uds.length - 1) {
                req.end();
              }
            }
            if ((request.uploadData || []).length === 0) {
              req.end();
            }
          }
          handleUploadData();
        } else {
          req.end();
        }
      } catch (err: any) {
        if (debug) console.log('[https load] ERR (2) ', request.url, err.message, i);

        let statusCode = 502;
        if (err.message.includes('connect ECONNRESET')) {
          statusCode = 523;
        } else {
          statusCode = 520;
        }

        if (networkHosts[i + 1]) {
          load(i + 1);
        } else {
          if (debug) console.log(`[https] Resource for app (${dappyBrowserView.tabId}) failed to load (${url.pathname})`);
              /*
                Will catch in main/store/sagas/loadOrReloadBrowserView.ts L193
              */
          resolve({
            data: err.message,
            headers: {},
            statusCode: statusCode
          });
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
  partitionIdHash: string;
  setCookie: (cookieDetails: CookiesSetDetails) => Promise<void>;
  getBlobData: (blobUUID: string) => Promise<Buffer>;
  setIsFirstRequest: (a: boolean) => void;
  getIsFirstRequest: () => boolean;
}

const makeInterceptHttpsRequests = ({ dappyBrowserView, partitionIdHash, setCookie, getBlobData, setIsFirstRequest, getIsFirstRequest }: InterceptHttpsRequestsParams) => {
  const debug = !process.env.PRODUCTION;
  console.log('makeInterceptHttpsRequests')
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

    /*
      Dappy name system
    */
    if (new URL(request.url).host.endsWith('.dappy')) {
      try {
        callback(await tryToLoad({ partitionIdHash, dns: false, debug, dappyBrowserView, setIsFirstRequest, getIsFirstRequest, setCookie, request, getBlobData }));
      } catch (err) {
        console.log(err);
        callback({});
      }

    /*
      DNS
    */
    } else {
      try {
        callback(await tryToLoad({ partitionIdHash, dns: true, debug, dappyBrowserView, setIsFirstRequest, getIsFirstRequest, setCookie, request, getBlobData }));
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
  partitionIdHash: string;
  dispatchFromMain: (a: DispatchFromMainArg) => void;
  setIsFirstRequest: (a: boolean) => void;
  getIsFirstRequest: () => boolean;
}

export const overrideHttpProtocols = ({ dappyBrowserView, session, partitionIdHash, dispatchFromMain, setIsFirstRequest, getIsFirstRequest }: OverrideHttpProtocolsParams) => {
  // Block all HTTP when not development
  if (process.env.PRODUCTION) {
    session.protocol.interceptHttpProtocol
    return session.protocol.interceptStreamProtocol('http', (request, callback) => {
      console.log(`[http] unauthorized`);
      callback({});
      return;
    });
  }

  const getBlobData = (blobUUID: string) => {
    return session.getBlobData(blobUUID)
  }
  session.cookies.on(
    'changed',
    makeCookiesOnChange({
      dappyBrowserView,
      getCookies: (filter: CookiesGetFilter) => session.cookies.get(filter),
      dispatchFromMain,
    })
  );

  console.log('interceptStreamProtocol https');
  return session.protocol.interceptStreamProtocol(
    'https',
    makeInterceptHttpsRequests({
      dappyBrowserView,
      partitionIdHash,
      setCookie: (cookieDetails: CookiesSetDetails) => session.cookies.set(cookieDetails),
      getBlobData: getBlobData,
      setIsFirstRequest,
      getIsFirstRequest,
    })
  );
};
