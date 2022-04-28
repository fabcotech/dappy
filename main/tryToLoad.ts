import https from 'https';
import fs from 'fs';
import { CookiesSetDetails, ProtocolRequest, Cookie, ProtocolResponse } from 'electron';
import cookieParser from 'set-cookie-parser';

import { DappyBrowserView } from './models';
import { DappyNetworkMember, lookup, NameAnswer, NamePacket, nodeLookup } from '@fabcotech/dappy-lookup';

let sameSites: { [a: string]: 'lax' | 'strict' | 'no_restriction' } = {
  lax: 'lax',
  Lax: 'lax',
  strict: 'strict',
  Strict: 'strict',
};

const rightPad = (str: string, num: number) => {
  let s = str.slice(0,num);
  for (let i = 0; i < num - str.length; i += 1) {
    s += ' '
  }
  return s;
}

const onlyLaxCookieOnFirstRequest = (isFirstRequest: boolean, cookie: Cookie) =>
  isFirstRequest ? cookie.sameSite === 'lax' : true;

// RFC 6265
export const isCookieDomainSentWithHost = (cookieDomain: string | undefined, host: string) => {
  if (!cookieDomain) return false;

  // Try an exact match
  if (cookieDomain === host) return true;
  if (cookieDomain === `.${host}`) return true;

  // TLD cookies not sent fo 2nd/3rd/etc levels
  // do not send cookie if domain = .com or com or .dappy or dappy
  if (cookieDomain.startsWith('.') && (cookieDomain.match(/\./g) || []).length === 1) return false;
  if ((cookieDomain.match(/\./g) || []).length === 0) return false;

  // does host matches a sublevel of cookieDomain ?
  // turns example.com into .example.com
  const cookieDomainWithPrefix = cookieDomain.startsWith('.') ? cookieDomain : `.${cookieDomain}`;

  // do sent cookies if cookieDomain = example.com and host = api.example.com
  if (host.endsWith(cookieDomainWithPrefix)) return true;

  // do not sent cookies if:
  // cookieDomain = api.example.com and host = example.com
  // cookieDomain = api.example.com and host = pro.example.com
  // cookieDomain = eeexample.com and host = example.com
  return false;
}

const getCookiesHeader = async (dappyBrowserView: DappyBrowserView, url: string, isFirstRequest: boolean, s: string) => {
  const host = new URL(url).host;
  let cookies: Cookie[] = [];
  cookies = await dappyBrowserView.browserView.webContents.session.cookies.get({
    url: `https://${host}`,
  });

  const okCookies = cookies
    .filter((c) => {
      console.log('sent with host ?', host, c.domain, isCookieDomainSentWithHost(c.domain, host));
      return isCookieDomainSentWithHost(c.domain, host);
    })
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
  dappyNetworkMembers: DappyNetworkMember[];
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

export const tryToLoad = async ({ dappyNetworkMembers, dns, debug, request, partitionIdHash, dappyBrowserView, setIsFirstRequest, getIsFirstRequest, setCookie, getBlobData }: makeTryToLoadParams) => {
  let over = false;
  const url = new URL(request.url);

  let ca: string[] | undefined = undefined;
  let networkHosts: string[] | undefined = undefined;
  if (dns) {
    networkHosts = [url.hostname];
  } else {
    try {
      networkHosts = (await lookup(url.hostname, 'A', { dappyNetwork: dappyNetworkMembers })).answers.map(a => a.data)
      ca = (await lookup(url.hostname, 'CERT', { dappyNetwork: dappyNetworkMembers })).answers.map(a => a.data);
    } catch (err) {
      return Promise.resolve({
        data: "NS LOOKUP ERROR",
        headers: {},
        statusCode: 523
      });
    }
  }

  // Content-Security-Policy through TXT records
  let txts: string[] | undefined = undefined;
  try {
    txts = (await lookup(url.hostname, 'TXT', { dappyNetwork: dappyNetworkMembers })).answers.map(a => a.data)
  } catch (err) {
    return Promise.resolve({
      data: "NS LOOKUP ERROR",
      headers: {},
      statusCode: 523
    });
  }
  let csp = '';
  const cspRecord = (txts || []).find(a => a.startsWith("CSP="));
  if (cspRecord) {
    csp = (cspRecord as string).replace('CSP=', '');
  }

  async function load(i: number = 0) {

    if (!networkHosts || !(networkHosts as string[])[i]) {
      if (debug) console.log(`[https] Resource for app (${dappyBrowserView.tabId}) failed to load (${url.hostname})`);
      return Promise.resolve({
        data: "Failed to load",
        headers: {},
        statusCode: 503
      });
    }

    let s = "";

    const isFirstRequest = getIsFirstRequest();
  
    if (debug) {
      if (isFirstRequest) {
        s += `[https load ${partitionIdHash}] first hand navigation ${rightPad(request.url, 32)} ${i}`;
      } else {
        s += `[https load ${partitionIdHash}] ${rightPad(request.url, 32)} ${i}`;
      }
    }

    let port = url.port ? url.port : "443";

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

    
    return new Promise<ProtocolResponse>((resolve) => {
      try {
        const options: https.RequestOptions = {
          host: (networkHosts as string[])[i] as string,
          port: port,
          method: request.method,
          path: path,
          ...(ca ? { ca: ca[0] } : {}),
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
          options.ca = Buffer.from(s.cert, 'base64').toString('utf8')
        } */
    
        if (request.referrer) {
          options.headers!.referrer = request.referrer;
        }
        const req = https
          .request(options, (resp) => {

            let respCookies: cookieParser.Cookie[] = [];
            if (resp.headers && resp.headers['set-cookie'] && resp.headers['set-cookie'].length) {
              respCookies = cookieParser.parse(resp, {
                decodeValues: true,
              });

              respCookies
                .filter(c => {
                  if (c.domain) {
                    if (c.domain === url.host) return true;
                    if (c.domain === `.${url.host}`) return true;

                    // Set-Cookie from request on example.com wants to set a cookie on api.example.com
                    if (c.domain.endsWith(`.${url.host}`)) return true;
                    return false
                  } else {
                    return true;
                  }
                })
                .forEach((vc) => {
                  setCookie({
                    url: `https://${url.host}`,
                    domain: vc.domain,
                    name: vc.name,
                    value: vc.value,
                    expirationDate: vc.expires ? new Date(vc.expires).getTime() / 1000 : undefined,
                    secure: true,
                    httpOnly: vc.httpOnly,
                    sameSite: sameSites[vc.sameSite || ''] || 'lax',
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
                headers: {
                  ...resp.headers as Record<string, string | string[]>,
                  'set-cookie': '',
                }
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
              const headers = resp.headers as Record<string, string | string[]>;
              if (isFirstRequest) {
                // todo what if there is a CSP in the html document with <meta> ?
                console.log('[csp top-level rq] ' + url.hostname + path + ' ' + csp);
                headers['Content-Security-Policy'] = csp
              }
              resolve({
                data: resp,
                headers: headers,
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

            if ((networkHosts as string[])[i + 1]) {
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

        if ((networkHosts as string[])[i + 1]) {
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
