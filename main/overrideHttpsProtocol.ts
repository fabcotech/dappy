import https from 'https';
import { Session, CookiesSetDetails, ProtocolRequest, ProtocolResponse } from 'electron';
import { DappyNetworkMember } from '@fabcotech/dappy-lookup';

import { DappyBrowserView } from './models';
import { CertificateAccount } from '/models';
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
  clientCertificate: CertificateAccount | undefined;
  setCookie: (cookieDetails: CookiesSetDetails) => Promise<void>;
  getBlobData: (blobUUID: string) => Promise<Buffer>;
  setIsFirstRequest: (a: boolean) => void;
  getIsFirstRequest: () => boolean;
}

const makeInterceptHttpsRequests = ({
  chainId,
  dappyNetworkMembers,
  dappyBrowserView,
  partitionIdHash,
  clientCertificate,
  setCookie,
  getBlobData,
  setIsFirstRequest,
  getIsFirstRequest,
}: InterceptHttpsRequestsParams) => {
  const debug = !process.env.PRODUCTION;

  return async (
    request: ProtocolRequest,
    callback: (response: Electron.ProtocolResponse) => void
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
      console.log(
        '[https] An unauthorized process, maybe BrowserWindow, tried to make an https request'
      );
      callback({});
      return;
    }

    /* Dappy name system */
    if (new URL(request.url).hostname.endsWith(`.${chainId}`)) {
      try {
        callback(
          await tryToLoad({
            chainId,
            dappyNetworkMembers,
            partitionIdHash,
            dns: false,
            debug,
            dappyBrowserView,
            clientCertificate,
            setIsFirstRequest,
            getIsFirstRequest,
            setCookie,
            request,
            getBlobData,
          })
        );
      } catch (err) {
        console.log(err);
        callback({});
      }

      /* DNS */
    } else {
      console.log(
        `Unknown TLD ${
          new URL(request.url).hostname
        } only .${chainId} is supported with current configuration`
      );
      // forbidden for now
      callback({});
    }
  };
};

interface OverrideHttpProtocolsParams {
  chainId: string;
  dappyNetworkMembers: DappyNetworkMember[];
  dappyBrowserView: DappyBrowserView | undefined;
  session: Session;
  partitionIdHash: string;
  setIsFirstRequest: (a: boolean) => void;
  getIsFirstRequest: () => boolean;
  clientCertificate: CertificateAccount | undefined;
}

export const overrideHttpsProtocol = ({
  chainId,
  dappyNetworkMembers,
  dappyBrowserView,
  session,
  partitionIdHash,
  clientCertificate,
  setIsFirstRequest,
  getIsFirstRequest,
}: OverrideHttpProtocolsParams) => {
  const getBlobData = (blobUUID: string) => {
    return session.getBlobData(blobUUID);
  };

  return session.protocol.interceptStreamProtocol(
    'https',
    makeInterceptHttpsRequests({
      chainId,
      dappyNetworkMembers,
      dappyBrowserView,
      partitionIdHash,
      clientCertificate,
      setCookie: (cookieDetails: CookiesSetDetails) => session.cookies.set(cookieDetails),
      getBlobData,
      setIsFirstRequest,
      getIsFirstRequest,
    })
  );
};
