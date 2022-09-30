import https from 'https';
import { Session, CookiesSetDetails, CookiesGetFilter, ProtocolRequest, Cookie, ProtocolResponse } from 'electron';
import { DappyNetworkMember } from '@fabcotech/dappy-lookup';

import * as fromCookies from '../src/store/cookies';
import { DappyBrowserView } from './models';
import { Cookie as DappyCookie } from '/models';
import { DispatchFromMainArg } from './main';
import { tryToLoad } from './tryToLoad';

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

export const parseUrl = (url: string): { host?: string; path?: string } => {
  const urlRegExp = /^.+\/\/([^\/]+)(\/.*)?/;
  if (!urlRegExp.test(url)) return {};

  const [_, host, path] = url.match(urlRegExp) as string[];
  return {
    host,
    path,
  };
};

interface InterceptHttpsRequestsParams {
  chainId: string;
  dappyNetworkMembers: DappyNetworkMember[];
  dappyBrowserView: DappyBrowserView | undefined;
  partitionIdHash: string;
  setCookie: (cookieDetails: CookiesSetDetails) => Promise<void>;
  getBlobData: (blobUUID: string) => Promise<Buffer>;
  setIsFirstRequest: (a: boolean) => void;
  getIsFirstRequest: () => boolean;
}

const makeInterceptHttpsRequests = ({ chainId, dappyNetworkMembers, dappyBrowserView, partitionIdHash, setCookie, getBlobData, setIsFirstRequest, getIsFirstRequest }: InterceptHttpsRequestsParams) => {
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

    /* Dappy name system */
    if (new URL(request.url).hostname.endsWith(`.${chainId}`)) {
      try {
        callback(await tryToLoad({ chainId, dappyNetworkMembers, partitionIdHash, dns: false, debug, dappyBrowserView, setIsFirstRequest, getIsFirstRequest, setCookie, request, getBlobData }));
      } catch (err) {
        console.log(err);
        callback({});
      }

    /* DNS */
    } else {
      console.log(`Unknown TLD ${new URL(request.url).hostname} only .${chainId} is supported with current configuration`)
      // forbidden for now
      callback({});
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
  chainId: string;
  dappyNetworkMembers: DappyNetworkMember[];
  dappyBrowserView: DappyBrowserView | undefined;
  session: Session;
  partitionIdHash: string;
  dispatchFromMain: (a: DispatchFromMainArg) => void;
  setIsFirstRequest: (a: boolean) => void;
  getIsFirstRequest: () => boolean;
}

export const overrideHttpsProtocol = ({ chainId, dappyNetworkMembers, dappyBrowserView, session, partitionIdHash, dispatchFromMain, setIsFirstRequest, getIsFirstRequest }: OverrideHttpProtocolsParams) => {
  
  const getBlobData = (blobUUID: string) => {
    return session.getBlobData(blobUUID);
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
      chainId,
      dappyNetworkMembers,
      dappyBrowserView,
      partitionIdHash,
      setCookie: (cookieDetails: CookiesSetDetails) => session.cookies.set(cookieDetails),
      getBlobData: getBlobData,
      setIsFirstRequest,
      getIsFirstRequest,
    })
  );
};
