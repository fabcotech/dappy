import https from 'https';
import stream from 'stream';
import fs from 'fs';
import { DappyNetworkMember, RRA, RRCNAME, RRTXT, RRCERT } from '@fabcotech/dappy-lookup';
import { CookiesSetDetails, ProtocolRequest, ProtocolResponse } from 'electron';
import cookieParser from 'set-cookie-parser';

import { getCookiesHeader, isCookieDomainSentWithHost } from './utils/cookie';
import { getHtmlError } from './utils/getHtmlError';
import { DappyBrowserView } from './models';

const { lookup } = require('@fabcotech/dappy-lookup');

let sameSites: { [a: string]: 'lax' | 'strict' | 'no_restriction' } = {
  lax: 'lax',
  Lax: 'lax',
  strict: 'strict',
  Strict: 'strict',
};

const rightPad = (str: string, num: number) => {
  let s = str.slice(0, num);
  for (let i = 0; i < num - str.length; i += 1) {
    s += ' ';
  }
  return s;
};

interface makeTryToLoadParams {
  dappyNetworkMembers: DappyNetworkMember[];
  chainId: string;
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

export const tryToLoad = async ({
  chainId,
  dappyNetworkMembers,
  dns,
  debug,
  request,
  partitionIdHash,
  dappyBrowserView,
  setIsFirstRequest,
  getIsFirstRequest,
  setCookie,
  getBlobData,
}: makeTryToLoadParams) => {
  let over = false;
  const url = new URL(request.url);
  let hostname = url.hostname;

  /* CNAME
    check if the record has a CNAME / alias, if so
    hostname must be replaceed
    todo : this should be recursive
  */
  let cname: undefined | string = undefined;
  try {
    cname = (await lookup(hostname, 'CNAME', { dappyNetwork: dappyNetworkMembers })).answers.map(
      (a: RRCNAME) => a.data
    )[0];
    if (cname) {
      console.log(`[name system    ] found CNAME ${url.hostname} -> ${cname}`);
      hostname = cname;
    }
  } catch (err) {
    console.log(err);
    return Promise.resolve({
      data: 'NS LOOKUP ERROR',
      headers: {},
      statusCode: 523,
    });
  }

  let ca: string[] | undefined = undefined;
  let networkHosts: string[] | undefined = undefined;
  if (dns) {
    networkHosts = [url.hostname];
  } else {
    try {
      // todo support ipv6 / AAAA ?
      networkHosts = (await lookup(hostname, 'A', { dappyNetwork: dappyNetworkMembers })).answers.map(
        (a: RRA) => a.data
      );

      if ((networkHosts as string[]).length) {
        console.log(`[name system     ] found A ${(networkHosts as string[]).join(',')}`);
      } else {
        console.log(`[name system err ] no A records`);
      }

      ca = (await lookup(hostname, 'CERT', { dappyNetwork: dappyNetworkMembers })).answers.map((a: RRCERT) => a.data);
      if ((ca as string[])[0]) {
        console.log(`[name system     ] found CERT ${(ca as string[])[0].slice(0, 10)}...`);
      } else {
        console.log(`[name system err ] no CERT record`);
      }
    } catch (err) {
      console.log(err);
      return Promise.resolve({
        data: 'NS LOOKUP ERROR',
        headers: {},
        statusCode: 523,
      });
    }
  }

  // Content-Security-Policy through TXT records
  let txts: string[] | undefined = undefined;
  try {
    txts = (await lookup(hostname, 'TXT', { dappyNetwork: dappyNetworkMembers })).answers.map((a: RRTXT) => a.data);
  } catch (err) {
    console.log(err);
    return Promise.resolve({
      data: 'NS LOOKUP ERROR',
      headers: {},
      statusCode: 523,
    });
  }

  let dappAddress = '';
  const dappAddressRecord = (txts || []).find((a) => a.startsWith('DAPP_ADDRESS='));
  if (dappAddressRecord) {
    console.log(`[name system     ] found TXT/DAPP_ADDRESS ${dappAddressRecord.slice(0, 10)}...`);
    dappAddress = dappAddressRecord.replace('DAPP_ADDRESS=', '');
  }

  let csp = "default-src 'self'";
  const cspRecord = (txts || []).find((a) => a.startsWith('CSP='));
  if (cspRecord) {
    console.log(`[name system     ] found TXT/CSP ${(cspRecord as string).slice(0, 10)}...`);
    csp = (cspRecord as string).replace('CSP=', '');
  }

  // ============
  // DAPP
  // ============
  if (dappAddress) {
    console.log('dapp address resolved by name system ' + dappAddress);

    const st = new stream.PassThrough();
    st.push(getHtmlError('Dapp error', 'Failed to retreive HTML from the blockchain'));
    st.end();
    return {
      data: st,
      headers: {},
      statusCode: 404,
    };
  }

  /*
    If there was a CNAME, .gamma or .d may be
    missing at the end
  */
  if (!hostname.endsWith(`.${chainId}`)) {
    hostname = `${hostname}.${chainId}`;
  }

  // ============
  // IP APP
  // ============
  async function load(i: number = 0) {
    if (!networkHosts || !(networkHosts as string[])[i]) {
      if (debug) console.log(`[https] Resource for app (${dappyBrowserView.tabId}) failed to load (${hostname})`);
      const st = new stream.PassThrough();
      if (!networkHosts || networkHosts.length === 0) {
        st.push(getHtmlError('Lookup error', 'Name system zone has no A or AAAA record'));
      } else {
        st.push(
          getHtmlError(
            'IP app error',
            'Failed to load IP application, check that the servers are reachable and properly configured',
            {
              type: 'ip app',
              log: (networkHosts || []).join('\n'),
            }
          )
        );
      }
      st.end();
      return {
        data: st,
        headers: {},
        statusCode: 503,
      };
    }

    let s = '';

    const isFirstRequest = getIsFirstRequest();

    if (debug) {
      if (isFirstRequest) {
        s += `[https load ${partitionIdHash}] CODE top-level ${rightPad(request.url, 32)} ${i}`;
      } else {
        s += `[https load ${partitionIdHash}] CODE ${rightPad(request.url, 32)} ${i}`;
      }
    }

    let port = url.port ? url.port : '443';

    let path = `/`;
    if (url.pathname) {
      path = url.pathname;
    }
    if (url.search) {
      path += url.search;
    }

    const host = new URL(url).host;
    const cookies = await dappyBrowserView.browserView.webContents.session.cookies.get({ url: `https://${host}` });
    const getCookiesHeaderResp = getCookiesHeader(cookies, isFirstRequest, host);

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
            host: hostname,
            Cookie: getCookiesHeaderResp.cookieHeader,
            Origin: `https://${dappyBrowserView.host}`,
          },
        };

        s += rightPad(
          ` | cook: ${getCookiesHeaderResp.numberOfCookies.lax}lax ${getCookiesHeaderResp.numberOfCookies.strict}strict`,
          22
        );

        if (request.referrer) {
          options.headers!.referrer = request.referrer;
        }
        const req = https
          .request(options, async (resp) => {
            // BLITZ
            /* if (resp.headers['blitz-authentication']) {
              console.log('[blitz-authentication] challenge proposed by server !');
              const payload = JSON.parse(resp.headers['blitz-authentication'] as string);
              if (payload.host === url.host) {
                console.log('[blitz-authentication] ok ! server host matches with host in payload');

                const PRIVATE_KEY = "28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36";

                const signatureHex = generateSignature(resp.headers['blitz-authentication'] as string, PRIVATE_KEY);
                console.log("[blitz-authentication] signature is :", signatureHex.slice(0,40) + '...');
                try {
                  const respCookies = await respondToChallenge(options, {
                    publicKey: "04be064356846e36e485408df50b877dd99ba406d87208add4c92b3c7d4e4c663c2fbc6a1e6534c7e5c0aec00b26486fad1daf20079423b7c8ebffbbdff3682b58",
                    signature: signatureHex,
                    nonce: payload.nonce
                  }, 2000);

                  try {
                    respCookies.cookies
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
                      if (respCookies.location) {
                        over = true;
                        resolve({
                         statusCode: 302,
                         headers: {
                           location: respCookies.location
                         }
                       });
                       return;
                      }
                  } catch (err) {
                    console.log('[blitz-authentication] failed could not set cookies');
                  }
                } catch (err) {
                  console.log(err)
                  console.log('[blitz-authentication] failed when responding to challenge');
                }
              } else {
                console.log('[blitz-authentication] abandon, hosts do not match')
              }
            } */

            let respCookies: cookieParser.Cookie[] = [];
            if (resp.headers && resp.headers['set-cookie'] && resp.headers['set-cookie'].length) {
              respCookies = cookieParser.parse(resp, {
                decodeValues: true,
              });

              respCookies
                .filter((c) => {
                  if (!c.domain) return true;
                  return isCookieDomainSentWithHost(c.domain, url.host);
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
              Redirection is only ok if it is undergoing a first hand navigation / top-level
            */
            if (isFirstRequest && [300, 301, 302, 303, 304, 307, 308, 309].find((a) => a === resp.statusCode)) {
              s = s.replace(/CODE/g, `\x1b[34m${resp.statusCode}\x1b[0m`);
              if (respCookies.length) s += ` (${respCookies.length} cook)`;
              if (debug) console.log(s);
              /*
                todo, how to know a request is first hand navigation / top-level ?
                all .d first hand navigations must have the dappy CSP
                override
              */
              over = true;
              resolve({
                statusCode: resp.statusCode,
                headers: {
                  ...(resp.headers as Record<string, string | string[]>),
                  'set-cookie': '',
                },
              });
              return;
            }

            s = s.replace(/CODE/g, `\x1b[32m${resp.statusCode}\x1b[0m`);

            if (debug) console.log(s);
            if (isFirstRequest) {
              console.log(`[CSP top-level   ] ${url.host} ${path} ${csp}`);
            }
            resp.headers = {
              ...resp.headers,
              'Content-Security-Policy': csp || '',
            };

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

            if ((networkHosts as string[])[i + 1]) {
              load(i + 1);
            } else {
              if (debug) {
                console.log(
                  `[https load] Resource for app (${dappyBrowserView.tabId}) failed to load (${url.pathname})`
                );
              }

              const st = new stream.PassThrough();
              st.push(
                getHtmlError(
                  'IP app error',
                  err.message ||
                    'Failed to load IP application, check that the servers are reachable and properly configured',
                  {
                    type: 'ip app',
                    log: (networkHosts || []).join('\n'),
                  }
                )
              );
              st.end();
              resolve({
                data: st,
                headers: {},
                statusCode: statusCode,
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
          };
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
          if (debug)
            console.log(`[https] Resource for app (${dappyBrowserView.tabId}) failed to load (${url.pathname})`);
          /*
            Will catch in main/store/sagas/loadOrReloadBrowserView.ts L193
          */
          const st = new stream.PassThrough();
          st.push(
            getHtmlError(
              'IP app error',
              err.message ||
                'Failed to load IP application, check that the servers are reachable and properly configured',
              {
                type: 'ip app',
                log: (networkHosts || []).join('\n'),
              }
            )
          );
          st.end();
          resolve({
            data: st,
            headers: {},
            statusCode: statusCode,
          });
          over = true;
          return;
        }
      }
    });
  }

  return load();
};
