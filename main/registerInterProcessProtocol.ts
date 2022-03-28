import { Session, clipboard, dialog } from 'electron';
import crypto from 'crypto';
import { DappyNetworkMember } from 'dappy-lookup';
import { Store } from 'redux';
import fs from 'fs';
import path from 'path';
import pem from 'pem';

import { getIpAddressAndCert } from './getIpAddressAndCert';
import { MultiCallBody, MultiCallParameters } from '../src/models';
import { EXECUTE_RCHAIN_CRON_JOBS } from '../src/store/blockchain';
import * as fromBlockchains from './store/blockchains';
import { performMultiRequest } from './performMultiRequest';
import { performSingleRequest } from './performSingleRequest';
import * as fromMainBrowserViews from './store/browserViews';
import { DispatchFromMainArg } from './main';

let benchmarkCronRanOnce = false;
let uniqueEphemeralTokenAskedOnce = false;
let uniqueEphemeralToken = '';

/* browser process - main process */
export const registerInterProcessProtocol = (
  session: Session,
  store: Store,
  getLoadResourceWhenReady: () => string | undefined,
  openExternal: (url: string) => void,
  browserWindow: any,
  dispatchFromMain: (a: DispatchFromMainArg) => void,
  getDispatchesFromMainAwaiting: () => void
) => {
  return session.protocol.registerBufferProtocol('interprocess', (request, callback) => {
    if (request.url === 'interprocess://ask-unique-ephemeral-token') {
      if (uniqueEphemeralTokenAskedOnce === false) {
        uniqueEphemeralTokenAskedOnce = true;
        return crypto.randomBytes(64, (err, buf) => {
          uniqueEphemeralToken = buf.toString('hex');
          callback(
            Buffer.from(
              JSON.stringify({
                uniqueEphemeralToken: uniqueEphemeralToken,
                loadResourceWhenReady: getLoadResourceWhenReady(),
              })
            )
          );
        });
      } else {
        callback(
          Buffer.from(
            JSON.stringify({
              uniqueEphemeralToken: uniqueEphemeralToken,
            })
          )
        );
        return;
      }
    }

    let uniqueEphemeralTokenFromrequest = '';
    try {
      uniqueEphemeralTokenFromrequest = JSON.parse(decodeURI(request.headers['Data'])).uniqueEphemeralToken;
      if (uniqueEphemeralToken !== uniqueEphemeralTokenFromrequest) {
        throw new Error();
      }
    } catch (err) {
      console.log(request.url);
      console.log('[https] An unauthorized app tried to make an interprocess request');
      callback(Buffer.from(''));
      return;
    }

    if (request.url === 'interprocess://get-ip-address-and-cert') {
      let host = '';
      try {
        host = JSON.parse(decodeURI(request.headers['Data'])).parameters.host;
      } catch (e) {}

      getIpAddressAndCert(host)
        .then((response) => {
          callback(
            Buffer.from(
              JSON.stringify({
                success: true,
                data: response,
              })
            )
          );
          return;
        })
        .catch((err) => {
          callback(
            Buffer.from(
              JSON.stringify({
                success: false,
                error: { message: err.message },
              })
            )
          );
        });
    }

    /* browser to node */
    if (request.url === 'interprocess://multi-dappy-call') {
      try {
        const data = JSON.parse(decodeURI(request.headers['Data']));
        const parameters: MultiCallParameters = data.parameters;
        const body: MultiCallBody = data.body;

        if (parameters.multiCallId === EXECUTE_RCHAIN_CRON_JOBS) {
          parameters.comparer = (res: any) => {
            const json = JSON.parse(res as string);
            // do not include json.rnodeVersion that might differ
            return `${json.data.rchainNetwork}-${json.data.lastFinalizedBlockNumber}-${json.data.rchainNamesRegistryUri}`;
          };
        } else {
          parameters.comparer = (res) => res;
        }

        const blockchains = fromBlockchains.getBlockchains(store.getState());
        performMultiRequest(body, parameters, blockchains)
          .then((result) => {
            callback(
              Buffer.from(
                JSON.stringify({
                  success: true,
                  data: result,
                })
              )
            );
          })
          .catch((err) => {
            callback(Buffer.from(JSON.stringify(err)));
          });
      } catch (err) {
        console.log(err);
        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when multi-dappy-call'));
      }
    }

    /* browser to node */
    if (request.url === 'interprocess://single-dappy-call') {
      try {
        const data = JSON.parse(decodeURI(request.headers['Data']));
        const node: DappyNetworkMember = data.node;
        const body: MultiCallBody = data.body;
        performSingleRequest(body, node)
          .then((a) => {
            callback(Buffer.from(a));
          })
          .catch((err) => {
            callback(Buffer.from(JSON.stringify(err)));
          });
      } catch (err) {
        console.log(err);
        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when single-dappy-call'));
      }
    }

    if (request.url === 'interprocess://dappy-lookup') {
      try {
        const data = JSON.parse(decodeURI(request.headers['Data']));
        const action: any = data.action;
        console.log(action);
      } catch (err) {
        console.log(err);
        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when dappy-lookup'));
      }
    }

    if (request.url === 'interprocess://dispatch-in-main') {
      try {
        const data = JSON.parse(decodeURI(request.headers['Data']));
        const action: any = data.action;
        if (action.type === fromMainBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW) {
          store.dispatch({
            ...action,
            meta: { openExternal: openExternal, browserWindow: browserWindow, dispatchFromMain: dispatchFromMain },
          });
        } else if (action.type === fromMainBrowserViews.DESTROY_BROWSER_VIEW) {
          store.dispatch({ ...action, meta: { browserWindow: browserWindow } });
        } else if (action.type === fromBlockchains.SYNC_BLOCKCHAINS) {
          store.dispatch(action);
        } else {
          store.dispatch(action);
        }
      } catch (err) {
        console.log(err);
        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when dispatch-in-main'));
      }
    }

    if (request.url === 'interprocess://open-external') {
      try {
        const data = JSON.parse(decodeURI(request.headers['Data']));
        const value: any = data.value;
        openExternal(value);
      } catch (err) {
        console.log(err);
        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when open-external'));
      }
    }

    if (request.url === 'interprocess://copy-to-clipboard') {
      try {
        const data = JSON.parse(decodeURI(request.headers['Data']));
        const value: any = data.value;
        clipboard.writeText(value);
      } catch (err) {
        console.log(err);
        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when copy-to-clipboard'));
      }
    }

    if (request.url === 'interprocess://trigger-command') {
      try {
        const data = JSON.parse(decodeURI(request.headers['Data']));
        const command: any = data.command;
        const payload: any = data.payload;

        if (command === 'download-file') {
          dialog
            .showOpenDialog({
              title: 'Save file',
              properties: ['openDirectory', 'createDirectory'],
            })
            .then((a) => {
              if (!a.canceled) {
                if (a.filePaths[0]) {
                  fs.writeFile(
                    path.join(a.filePaths[0], payload.name || 'file'),
                    payload.data,
                    { encoding: 'base64' },
                    (b) => {}
                  );
                } else {
                  console.error('a.filePaths[0] is not defined ' + a.filePaths[0]);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } catch (err) {
        console.log(err);
        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when trigger-command'));
      }
    }

    if (request.url === 'interprocess://get-dispatches-from-main-awaiting') {
      callback(
        Buffer.from(
          JSON.stringify({
            actions: getDispatchesFromMainAwaiting(),
          })
        )
      );
    }
    if (request.url === 'interprocess://generate-certificate-and-key') {
      try {
        const data = JSON.parse(decodeURI(request.headers['Data']));
        pem.createCertificate(
          { days: 1000000, selfSigned: true, altNames: data.parameters.altNames },
          function (err, keys) {
            if (err) {
              console.log(err);
              callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when generate-certificate-and-key'));
              return;
            }
            callback(
              Buffer.from(
                JSON.stringify({
                  key: keys.clientKey,
                  certificate: keys.certificate,
                })
              )
            );
          }
        );
      } catch (err) {
        console.log(err);
        callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when generate-certificate-and-key'));
      }
    }
  });
};
