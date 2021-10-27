import { Session } from 'electron';
import zlib from 'zlib';
import { readPursesDataTerm, readConfigTerm } from 'rchain-token';
import { BeesLoadError } from 'beesjs';

import { performMultiRequest } from './performMultiRequest';
import * as fromSettings from './store/settings';
import * as fromBlockchains from './store/blockchains';
import * as fromMainBrowserViews from './store/browserViews';

import { DappyFile } from '../src/models';
import { validateFile } from '../src/store/decoders/Dpy';
import { getNodeIndex } from '../src/utils/getNodeIndex';
import { validateSearchWithProtocol, validateShortcutSearchWithProtocol } from '../src/utils/validateSearch';
import { DappyBrowserView } from './models';

const readPursesDataOrContractConfig = (masterRegistryUri: string, contractId: string, purseId) => {
  // read purse data if purseId
  if (contractId && purseId) {
    return readPursesDataTerm({ masterRegistryUri, contractId, pursesIds: [purseId] });
  }

  // read config values { fungible: ..., fee: ...} if no contract id AND purse id
  return readConfigTerm({ masterRegistryUri, contractId });
};

export const registerDappyProtocol = (session: Session, getState: () => void) => {
  session.protocol.registerBufferProtocol('dappy', (request, callback) => {
    let valid = false;
    let url = request.url;
    if (validateSearchWithProtocol(url)) {
      valid = true;
      // dappy://aaa.bbb.ccc -> dappy://aaa.bbb.ccc,
      if (!url.includes('%2C')) {
        url += '%2C';
      }
    }

    let randomId = '';
    let browserView: DappyBrowserView | undefined = undefined;
    try {
      const userAgent = request.headers['User-Agent'];
      const io = userAgent.indexOf('randomId=');
      randomId = userAgent.substring(io + 'randomId='.length);
      const browserViews = fromMainBrowserViews.getBrowserViewsMain(getState());
      const browserViewId = Object.keys(browserViews).find(
        (browserViewId) => browserViews[browserViewId].randomId === randomId
      );
      if (!browserViewId || !browserViews[browserViewId]) {
        console.error('[dappy://] browserView not found, unauthorized request');
        callback();
        return;
      }
      browserView = browserViews[browserViewId];
    } catch (err) {
      console.error('[dappy://] could not get browserView, unauthorized request');
      console.log(err);
      callback();
      return;
    }
    /*
        Shortcut notation
        change dappy://aaa.bbb?page=123 to dappy://betanetwork/aaa.bbb?page=123
      */
    if (!valid && validateShortcutSearchWithProtocol(url)) {
      try {
        const chainId = browserView.dappyDomain.split('/')[0];
        url = url.replace('dappy://', 'dappy://' + chainId + '/');
        if (!validateSearchWithProtocol(url)) {
          valid = true;
        }
      } catch (e) {
        console.log('[dappy://] could not replace shortcut notation');
        console.log(e);
        callback();
        return;
      }
    }
    // todo if multi, limit to n
    let multipleResources = false;
    let exploreDeploys = false;
    if (url.includes('explore-deploys')) {
      valid = true;
      exploreDeploys = true;
    } else {
      console.error('dappy://aaa.b,aaa.c notation is not supported, please use dappy://explore-deploys');
      callback();
      return;
    }

    if (!valid) {
      console.error('Wrong dappy url, must be dappy://aaa/bbb or dappy://aaa/bbb.yy,ccc.aa,ddd');
      callback();
      return;
    }

    const split = url.replace('dappy://', '').split(':');
    const chainId = split[0];
    // todo
    // how to return errors ?
    const blockchains = fromBlockchains.getBlockchains(getState());
    const blockchain = blockchains[chainId];

    if (!blockchain) {
      console.error(`[dappy://] blockchain not found ${url}`);
      callback();
      return;
    }

    const indexes = blockchain.nodes.filter((n) => n.active && n.readyState === 1).map(getNodeIndex);

    let query;
    let type;
    if (exploreDeploys) {
      type = 'explore-deploy-x';
      try {
        query = { terms: JSON.parse(request.headers['Explore-Deploys']).data };
      } catch (err) {
        console.log('[dappy://] could not parse explore-deploys haders');
        console.log(err);
        callback();
        return;
      }
    } else if (multipleResources) {
      // if address is dappy://d/aaa.bbb.ccc,ddd.eee.fff
      // the two
      type = 'explore-deploy-x';
      query = {
        terms: split[1]
          .split('/')[0]
          .split('%2C')
          // filter in the case of only one unf : dappy://aaa/bbb,
          .filter((a) => !!a)
          .map((u) => {
            return readPursesDataOrContractConfig(u.split('.')[0], u.split('.')[1], u.split('.')[2]);
          }),
      };
    } else {
      type = 'api/explore-deploy';
      query = {
        term: readPursesDataOrContractConfig(split[1].split('.')[0], split[1].split('.')[1], split[1].split('.')[2]),
      };
    }

    const settings = fromSettings.getSettings(getState());
    performMultiRequest(
      {
        type: type,
        body: query,
      },
      {
        chainId: blockchain.chainId,
        urls: indexes,
        resolverMode: settings.resolverMode,
        resolverAccuracy: settings.resolverAccuracy,
        resolverAbsolute: settings.resolverAbsolute,
        multiCallId: 'useless',
        comparer: (res: any) => {
          return res;
        },
      },
      blockchains
    )
      .then(async (multiCallResult) => {
        try {
          const json = JSON.parse(multiCallResult.result.data);
          if (!json.success) {
            callback(json.error);
            return;
          }

          let dataFromBlockchainParsed;
          if (!multipleResources && !exploreDeploys) {
            dataFromBlockchainParsed = JSON.parse(json.data);
          }
          if ((multipleResources || exploreDeploys) && request.headers.Accept === 'rholang/term') {
            callback({
              mimeType: 'application/json',
              data: Buffer.from(JSON.stringify(json.data)),
            });
          } else if (multipleResources || exploreDeploys) {
            // todo
            callback();
          } else if (request.headers.Accept === 'rholang/term') {
            callback({
              mimeType: 'application/json',
              data: Buffer.from(json.data),
            });
          } else if (
            dataFromBlockchainParsed.expr &&
            dataFromBlockchainParsed.expr[0] &&
            dataFromBlockchainParsed.expr[0].ExprString
          ) {
            try {
              // copy of blockchainUtils.rchain.verifyAndReturnManifest
              let file;
              try {
                // todo move this function verifyAndReturnManifest in main process ?
                const dataAtNameBuffer = Buffer.from(dataFromBlockchainParsed.expr[0].ExprString.data, 'base64');
                const unzippedBuffer = zlib.gunzipSync(dataAtNameBuffer);
                file = unzippedBuffer.toString('utf-8');
              } catch (err) {
                throw new Error(
                  JSON.stringify({
                    error: BeesLoadError.InvalidManifest,
                    args: {
                      message: 'Failed to validate file, string is not valid base64 + gzipped',
                    },
                  })
                );
              }

              let parsedFile: DappyFile | undefined;
              try {
                parsedFile = JSON.parse(file);
                await validateFile(parsedFile);
              } catch (err) {
                throw new Error(
                  JSON.stringify({
                    error: BeesLoadError.InvalidManifest,
                    args: {
                      message: 'Failed to parse file ' + err,
                    },
                  })
                );
              }
              callback({
                mimeType: parsedFile.mimeType,
                data: Buffer.from(parsedFile.data, 'base64'),
              });
            } catch (err) {
              console.log('[dappy://] error when parsing file as base64(gzip)');
              console.log(err);
              callback();
            }
          } else {
            callback();
          }
        } catch (err) {
          console.log('[dappy://] error when handling multiCall result');
          console.log(err);
          callback();
        }
      })
      .catch((err) => {
        callback();
        return;
      });
  });
};
