import { Session } from 'electron';
import zlib from 'zlib';

import { performMultiRequest } from './performMultiRequest';
import * as fromConnections from './store/connections';
import * as fromSettings from './store/settings';
import * as fromBlockchains from './store/blockchains';
import * as fromMainBrowserViews from './store/browserViews';

import { LoadError, DappyFile } from '../src/models';
import { validateFile } from '../src/store/decoders/Dpy';
import { rholangFilesModuleResourceTerm } from '../src/utils/rholangFilesModuleResourceTerm';
import { getNodeIndex } from '../src/utils/getNodeIndex';
import { validateSearchWithProtocol, validateShortcutSearchWithProtocol } from '../src/utils/validateSearch';

export const registerDappyProtocol = (session: Session, getState: () => void) => {
  session.protocol.registerBufferProtocol(
    'dappy',
    (request, callback) => {
      let valid = false;
      let url = request.url;
      if (validateSearchWithProtocol(url)) {
        valid = true;
      }

      /*
        Shortcut notation
        change dappy://aaa?page=123 to dappy://betanetwork/aaa?page=123
      */
      if (!valid && validateShortcutSearchWithProtocol(url)) {
        try {
          let randomId = '';
          const userAgent = request.headers['User-Agent'];
          const io = userAgent.indexOf('randomId=');
          randomId = userAgent.substring(io + 'randomId='.length);
          const browserViews = fromMainBrowserViews.getBrowserViewsMain(getState());
          const browserViewId = Object.keys(browserViews).find(
            (browserViewId) => browserViews[browserViewId].randomId === randomId
          );
          const chainId = browserViews[browserViewId].address.split('/')[0];
          url = url.replace('dappy://', 'dappy://' + chainId + '/');
          if (validateSearchWithProtocol(url)) {
            valid = true;
          }
        } catch (e) {}
      }

      if (!valid) {
        console.error('Wrong dappy url, must be dappy://aaa/bbb or dappy://aaa/bbb.yy,ccc.aa,ddd');
        callback();
        return;
      }
      // todo if multi, limit to n unforgeable names

      let multipleResources = false;
      let exploreDeploys = false;
      if (url.includes('explore-deploys')) {
        exploreDeploys = true;
      } else if (url.includes('%2C')) {
        multipleResources = true;
      }

      const split = url.replace('dappy://', '').split('/');
      const chainId = split[0];

      // todo
      // how to return errors ?
      const blockchains = fromBlockchains.getBlockchains(getState());
      const blockchain = blockchains[chainId];

      if (!blockchain) {
        console.error('[dapp] blockchain not found');
        callback();
        return;
      }

      const indexes = blockchain.nodes.filter((n) => n.active && n.readyState === 1).map(getNodeIndex);

      let query;
      let type;
      if (exploreDeploys) {
        type = 'explore-deploy-x';
        query = JSON.parse(request.headers['Explore-Deploys']).data.map((d) => ({ term: d }));
      } else if (multipleResources) {
        type = 'explore-deploy-x';
        query = split[1]
          .split('%2C')
          // filter in the case of only one unf : dappy://aaa/bbb,
          .filter((a) => !!a)
          .map((u) => {
            return {
              term: rholangFilesModuleResourceTerm(u.split('.')[0], u.split('.')[1]),
            };
          });
      } else {
        type = 'explore-deploy';
        query = {
          term: rholangFilesModuleResourceTerm(split[1].split('.')[0], split[1].split('.')[1]),
        };
      }

      const settings = fromSettings.getSettings(getState());

      const connections = fromConnections.getConnections(getState());
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
            /*
              TODO maybe it is not very efficient, change it ?
              The problem is that the unique requestId is in each response
            */
            const json = JSON.parse(res as string);
            if (json.success) {
              return JSON.stringify(json.data);
            } else {
              return '';
            }
          },
        },
        connections
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
                      error: LoadError.InvalidManifest,
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
                      error: LoadError.InvalidManifest,
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
                console.log(err);
                callback();
              }
            } else {
              callback();
            }
          } catch (err) {
            console.log(err);
            callback();
          }
        })
        .catch((err) => {
          callback();
          return;
        });
    },
  )
};
