import https from 'https';
import { Session, clipboard, dialog } from 'electron';
import crypto from 'crypto';
import { lookup } from '@fabcotech/dappy-lookup';
import { Store } from 'redux';
import fs from 'fs';
import path from 'path';

import { getIpAddressAndCert } from './getIpAddressAndCert';
import { Blockchain } from '../src/models';
import * as fromBlockchainsMain from './store/blockchains';
import * as fromMainBrowserViews from './store/browserViews';
import { DispatchFromMainArg } from './main';
import { generateCertificateAndKey } from './generateCertificateAndKey';

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
                uniqueEphemeralToken,
                loadResourceWhenReady: getLoadResourceWhenReady(),
              })
            )
          );
        });
      }
      callback(
        Buffer.from(
          JSON.stringify({
            uniqueEphemeralToken,
          })
        )
      );
      return undefined;
    }

    let uniqueEphemeralTokenFromrequest = '';
    try {
      uniqueEphemeralTokenFromrequest = JSON.parse(
        decodeURI(request.headers.Data)
      ).uniqueEphemeralToken;
      if (uniqueEphemeralToken !== uniqueEphemeralTokenFromrequest) {
        throw new Error();
      }
    } catch (err) {
      console.log(request.url);
      console.log('[https] An unauthorized app tried to make an interprocess request');
      callback(Buffer.from(''));
      return undefined;
    }

    if (request.url === 'interprocess://evm-rpc') {
      let host = '';
      let pathh = '';
      let payload = {};
      try {
        host = JSON.parse(decodeURI(request.headers.Data)).host;
        pathh = JSON.parse(decodeURI(request.headers.Data)).path;
        payload = JSON.parse(decodeURI(request.headers.Data)).payload;
      } catch (e) {
        callback(
          Buffer.from(
            JSON.stringify({
              success: false,
              error: { message: 'Unable to get balance' },
            })
          )
        );
        return undefined;
      }
      const options = {
        host: host,
        method: 'POST',
        path: pathh,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          callback(
            Buffer.from(
              JSON.stringify({
                success: false,
                error: { message: 'Unable to get balance' },
              })
            )
          );
          return;
        }
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          callback(
            Buffer.from(
              JSON.stringify({
                success: true,
                data: data,
              })
            )
          );
        });
      });
      req.end(JSON.stringify(payload));

      return undefined;
    }

    if (request.url === 'interprocess://get-ip-address-and-cert') {
      let host = '';
      try {
        host = JSON.parse(decodeURI(request.headers.Data)).parameters.host;
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

    if (request.url === 'interprocess://maximize') {
      if (browserWindow.isMaximized()) {
        browserWindow.unmaximize();
      } else {
        browserWindow.maximize();
      }
    }

    if (request.url === 'interprocess://minimize') {
      browserWindow.minimize();
    }

    if (request.url === 'interprocess://close') {
      browserWindow.close();
    }

    if (request.url === 'interprocess://dappy-lookup') {
      const blockchains: { [chainId: string]: Blockchain } = fromBlockchainsMain.getBlockchains(
        store.getState()
      );

      const first = Object.keys(blockchains)[0];
      if (!first) {
        callback(
          Buffer.from(
            JSON.stringify({
              success: false,
              error: 'no dappy network',
            })
          )
        );
        return undefined;
      }

      try {
        const data = JSON.parse(decodeURI(request.headers.Data));
        if (data.value.method === 'lookup') {
          if (data.value.type === 'TXT') {
            lookup(data.value.hostname, data.value.type, { dappyNetwork: blockchains[first].nodes })
              .then((a) => {
                callback(
                  Buffer.from(
                    JSON.stringify({
                      success: true,
                      data: a,
                    })
                  )
                );
              })
              .catch((err) => {
                console.log(err);
                callback(
                  Buffer.from(
                    JSON.stringify({
                      success: false,
                      error: err.message,
                    })
                  )
                );
              });
          } else {
            callback(
              Buffer.from(
                JSON.stringify({
                  success: false,
                  error: 'unknown type',
                })
              )
            );
          }
        } else {
          callback(
            Buffer.from(
              JSON.stringify({
                success: false,
                error: 'unknown method',
              })
            )
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          callback(
            Buffer.from(
              JSON.stringify({
                success: false,
                error: err.message,
              })
            )
          );
        }
      }
    }

    if (request.url === 'interprocess://dispatch-in-main') {
      try {
        const data = JSON.parse(decodeURI(request.headers.Data));
        const action: any = data.action;
        if (action.type === fromMainBrowserViews.LOAD_OR_RELOAD_BROWSER_VIEW) {
          store.dispatch({
            ...action,
            meta: {
              openExternal,
              browserWindow,
              dispatchFromMain,
            },
          });
        } else if (action.type === fromMainBrowserViews.DESTROY_BROWSER_VIEW) {
          store.dispatch({ ...action, meta: { browserWindow } });
        } else if (action.type === fromBlockchainsMain.SYNC_BLOCKCHAINS) {
          store.dispatch(action);
        } else if (action.type === fromBlockchainsMain.TRANSFER_TRANSACTION) {
          store.dispatch(action);
        } else {
          store.dispatch(action);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
          callback(
            Buffer.from(err.message || '[interprocess] Error CRITICAL when dispatch-in-main')
          );
        }
      }
    }

    if (request.url === 'interprocess://open-external') {
      try {
        const data = JSON.parse(decodeURI(request.headers.Data));
        const { value } = data;
        openExternal(value);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
          callback(Buffer.from(err.message || '[interprocess] Error CRITICAL when open-external'));
        }
      }
    }

    if (request.url === 'interprocess://copy-to-clipboard') {
      try {
        const data = JSON.parse(decodeURI(request.headers.Data));
        const { value } = data;
        clipboard.writeText(value);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
          callback(
            Buffer.from(err.message || '[interprocess] Error CRITICAL when copy-to-clipboard')
          );
        }
      }
    }

    if (request.url === 'interprocess://trigger-command') {
      try {
        const data = JSON.parse(decodeURI(request.headers.Data));
        const { command } = data;
        const { payload } = data;

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
                    () => {}
                  );
                } else {
                  console.error(`a.filePaths[0] is not defined ${a.filePaths[0]}`);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
          callback(
            Buffer.from(err.message || '[interprocess] Error CRITICAL when trigger-command')
          );
        }
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
      const data = JSON.parse(decodeURI(request.headers.Data));
      const [key, certificate] = generateCertificateAndKey({
        days: 365 * 10,
        selfSigned: true,
        altNames: data.parameters.altNames,
        now: new Date(),
      });
      callback(
        Buffer.from(
          JSON.stringify({
            key,
            certificate,
          })
        )
      );
      //   try {
      //     const data = JSON.parse(decodeURI(request.headers.Data));
      //     pem.createCertificate(
      //       { days: 1000000, selfSigned: true, altNames: data.parameters.altNames },
      //       (err, keys) => {
      //         if (err) {
      //           console.log(err);
      //           callback(
      //             Buffer.from(
      //               err.message || '[interprocess] Error CRITICAL when generate-certificate-and-key'
      //             )
      //           );
      //           return;
      //         }
      //         callback(
      //           Buffer.from(
      //             JSON.stringify({
      //               key: keys.clientKey,
      //               certificate: keys.certificate,
      //             })
      //           )
      //         );
      //       }
      //     );
      //   } catch (err) {
      //     if (err instanceof Error) {
      //       console.log(err);
      //       callback(
      //         Buffer.from(
      //           err.message || '[interprocess] Error CRITICAL when generate-certificate-and-key'
      //         )
      //       );
      //     }
      //   }
    }
  });
};
