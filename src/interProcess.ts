import { DappyNetworkMember, NamePacket } from '@fabcotech/dappy-lookup';
import { Store } from 'redux';

import {
  DappyLoadError,
  MultiRequestBody,
  MultiRequestError,
  MultiRequestParameters,
  MultiRequestResult,
  SingleRequestResult,
} from '/models';
import * as fromDapps from './store/dapps';
import * as fromMain from './store/main';
import { BeesLoadError } from '@fabcotech/bees';
import { Action } from '/store';

const actionsAwaitingEphemeralToken: any[] = [];

export const dappyLookup = (body: { method: "lookup", hostname: string, type: string, chainId: string }): Promise<NamePacket> => {
  return window.dappyLookup(body);
};

export const singleRequest = (body: { [key: string]: any }, node: DappyNetworkMember): Promise<SingleRequestResult> => {
  return window.dappySingleRequest(body, node);
};

export const multiRequest = (body: MultiRequestBody, parameters: MultiRequestParameters): Promise<MultiRequestResult> => {
  return window.dappyMultiRequest(body, parameters);
};

export const copyToClipboard = (a: string) => {
  return window.copyToClipboard(a);
};

export const dispatchInMain = (a: Action) => {
  return window.dispatchInMain(a);
};

export const triggerCommand = (command: string, payload?: { [key: string]: string }) => {
  return window.triggerCommand(command, payload);
};

export const openExternal = (url: string) => {
  window.openExternal(url);
};

export const getIpAddressAndCert = (a: { host: string }) => {
  return window.getIpAddressAndCert(a);
};

export const maximize = () => {
  return window.maximize();
};

export const minimize = () => {
  return window.minimize();
};

export const close = () => {
  return window.close();
};

export const interProcess = (store: Store) => {
  let uniqueEphemeralToken = '';
  setInterval(() => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://get-dispatches-from-main-awaiting');
    interProcess.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
        })
      )
    );
    interProcess.send();
    interProcess.onload = (a) => {
      try {
        const r: { actions: [] } = JSON.parse(interProcess.responseText);
        r.actions.forEach((action) => {
          store.dispatch(action);
        });
      } catch (e) {
        console.log(e);
      }
    };
  }, 1500);

  setTimeout(() => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://ask-unique-ephemeral-token');
    interProcess.send('');
    interProcess.onload = (a) => {
      const r = JSON.parse(interProcess.responseText);
      window.uniqueEphemeralToken = r.uniqueEphemeralToken;
      uniqueEphemeralToken = r.uniqueEphemeralToken;
      if (actionsAwaitingEphemeralToken.length) {
        actionsAwaitingEphemeralToken.forEach((a) => {
          window.dispatchInMain(a);
        });
      }
      if (r.loadResourceWhenReady) {
        const initializationOver = fromMain.getInitializationOver(store.getState());
        const action = fromDapps.loadResourceAction({ url: r.loadResourceWhenReady });
        if (initializationOver) {
          console.log('will load resource when ready', r.loadResourceWhenReady);
          store.dispatch(action);
        } else {
          store.dispatch(fromMain.dispatchWhenInitializationOverAction({ payload: action }));
        }
      }
    };
  }, 0);

  window.dappyLookup = (a) => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://dappy-lookup');
      interProcess.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken: uniqueEphemeralToken,
            value: a,
          })
        )
      );
      interProcess.send();
      interProcess.onload = (a) => {
        try {
          const r = JSON.parse(interProcess.responseText);
          if (r.success) {
            resolve(r.data);
          } else {
            reject({ message: r.error });
          }
        } catch (e) {
          console.log(interProcess.responseText);
          console.log(e);
          reject({ message: 'could not parse response' });
        }
      };
    });
  };

  window.copyToClipboard = (a) => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://copy-to-clipboard');
    interProcess.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          value: a,
        })
      )
    );
    interProcess.send();
  };

  window.dispatchInMain = (action) => {
    if (!uniqueEphemeralToken) {
      actionsAwaitingEphemeralToken.push(action);
      return;
    }
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://dispatch-in-main');
    interProcess.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          action: action,
        })
      )
    );
    interProcess.send();
  };

  window.triggerCommand = (command, payload = undefined) => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://trigger-command');
    interProcess.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          command: command,
          payload: payload,
        })
      )
    );
    interProcess.send();
  };

  window.openExternal = (url) => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://open-external');
    interProcess.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          value: url,
        })
      )
    );
    interProcess.send();
  };

  window.dappySingleRequest = (body, node) => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://dappy-single-request');
      interProcess.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken: uniqueEphemeralToken,
            body: body,
            node: node,
          })
        )
      );
      // this should never happen
      interProcess.onerror = (e) => {
        console.log(e);
        reject({ message: 'Unknown error' });
      };
      interProcess.send();
      interProcess.onload = (a) => {
        try {
          const r = JSON.parse(interProcess.responseText);
          if (r.success) {
            resolve(r);
          } else {
            reject(r.error || { message: 'Unknown error' });
          }
        } catch (e) {
          console.log(interProcess.responseText);
          console.log(e);
          reject({ message: 'could not parse response' });
        }
      };
    });
  };

  window.dappyMultiRequest = (body, parameters) => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://dappy-multi-request');
      interProcess.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken: uniqueEphemeralToken,
            parameters: parameters,
            body: body,
          })
        )
      );
      interProcess.send();
      // this should never happen
      interProcess.onerror = (e) => {
        console.log(e);
        reject({ message: 'Unknown error' });
      };
      interProcess.onload = (a) => {
        try {
          const r = JSON.parse(interProcess.responseText);
          if (r.success) {
            resolve(r.data as MultiRequestResult);
          } else {
            reject(r as MultiRequestError);
          }
        } catch (e) {
          console.log(interProcess.responseText);
          console.log(e);
          reject({ error: { error: DappyLoadError.FailedToParseResponse, args: {} }, loadState: {} } as MultiRequestError);
        }
      };
    });
  };

  window.generateCertificateAndKey = (altNames: string[]) => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://generate-certificate-and-key');
      interProcess.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken: uniqueEphemeralToken,
            parameters: {
              altNames: altNames,
            },
          })
        )
      );
      interProcess.send();
      interProcess.onload = (a) => {
        try {
          const r = JSON.parse(interProcess.responseText);
          resolve(r);
        } catch (e) {
          reject({ message: 'could not parse response' });
        }
      };
    });
  };

  window.getIpAddressAndCert = (parameters) => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://get-ip-address-and-cert');
      interProcess.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken: uniqueEphemeralToken,
            parameters: parameters,
          })
        )
      );
      interProcess.send();
      interProcess.onload = (a) => {
        try {
          const r = JSON.parse(interProcess.responseText);
          if (r.success) {
            resolve(r.data);
          } else {
            reject(r.error);
          }
        } catch (e) {
          reject({ message: 'could not parse response' });
        }
      };
    });
  };

  window.minimize = () => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://minimize');
    interProcess.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          action: null,
        })
      )
    );
    interProcess.send();
  };

  window.maximize = () => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://maximize');
    interProcess.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          action: null,
        })
      )
    );
    interProcess.send();
  };

  window.close = () => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://close');
    interProcess.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          action: null,
        })
      )
    );
    interProcess.send();
  };

  /* 
// todo shortcuts don't work on linux/ubuntu
const itemZoomIn = new remote.MenuItem({
  label: 'Zoom in',
  //accelerator: 'CommandOrControl+Up',
  role: 'zoomIn',
});
const itemZoomOut = new remote.MenuItem({
  label: 'Zoom out',
  // accelerator: 'CommandOrControl+Down',
  role: 'zoomOut',
});
const itemZoomReset = new remote.MenuItem({
  label: 'Reset zoom',
  //accelerator: 'CommandOrControl+=',
  role: 'resetZoom',
});
const itemToggleDevTools = new remote.MenuItem({
  label: 'Toggle dev tools',
  //accelerator: 'CommandOrControl+I',
  role: 'toggleDevTools',
});

const itemCopy = new remote.MenuItem({
  label: 'Copy',
  accelerator: 'CommandOrControl+C',
  role: 'copy',
});
const itemSelectAll = new remote.MenuItem({
  label: 'Select All',
  accelerator: 'CommandOrControl+A',
  role: 'selectAll',
});
const itemPaste = new remote.MenuItem({
  label: 'Paste',
  accelerator: 'CommandOrControl+V',
  role: 'paste',
});

const menu = new remote.Menu();
menu.append(itemCopy);
menu.append(itemSelectAll);
menu.append(itemZoomIn);
menu.append(itemZoomOut);
menu.append(itemZoomReset);
menu.append(itemToggleDevTools);

const menuWithPaste = new remote.Menu();
menuWithPaste.append(itemCopy);
menuWithPaste.append(itemSelectAll);
menuWithPaste.append(itemPaste);
menuWithPaste.append(itemZoomIn);
menuWithPaste.append(itemZoomOut);
menuWithPaste.append(itemZoomReset);
menuWithPaste.append(itemToggleDevTools);

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (e.target.tagName && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
    menuWithPaste.popup({ window: remote.getCurrentWindow() });
  } else {
    menu.popup({ window: remote.getCurrentWindow() });
  }
});
 */
};
