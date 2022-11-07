import { NamePacket } from '@fabcotech/dappy-lookup';
import { Store } from 'redux';

import * as fromDapps from './store/dapps';
import * as fromMain from './store/main';
import { Action } from '/store';

const actionsAwaitingEphemeralToken: any[] = [];

export const dappyLookup = (body: {
  method: 'lookup';
  hostname: string;
  type: string;
  chainId: string;
}): Promise<NamePacket> => {
  return window.dappyLookup(body);
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
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://get-dispatches-from-main-awaiting');
    req.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken,
        })
      )
    );
    req.send();
    req.onload = () => {
      try {
        const r: { actions: [] } = JSON.parse(req.responseText);
        r.actions.forEach((action) => {
          store.dispatch(action);
        });
      } catch (e) {
        console.log(e);
      }
    };
  }, 1500);

  setTimeout(() => {
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://ask-unique-ephemeral-token');
    req.send('');
    req.onload = () => {
      const r = JSON.parse(req.responseText);
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
      const req = new XMLHttpRequest();
      req.open('POST', 'interprocess://dappy-lookup');
      req.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken,
            value: a,
          })
        )
      );
      req.send();
      req.onload = () => {
        try {
          const r = JSON.parse(req.responseText);
          if (r.success) {
            resolve(r.data);
          } else {
            reject(new Error(r.error));
          }
        } catch (e) {
          console.log(req.responseText);
          console.log(e);
          reject(new Error('could not parse response'));
        }
      };
    });
  };

  window.copyToClipboard = (a) => {
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://copy-to-clipboard');
    req.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken,
          value: a,
        })
      )
    );
    req.send();
  };

  window.dispatchInMain = (action) => {
    if (!uniqueEphemeralToken) {
      actionsAwaitingEphemeralToken.push(action);
      return;
    }
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://dispatch-in-main');
    req.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken,
          action,
        })
      )
    );
    req.send();
  };

  window.triggerCommand = (command, payload = undefined) => {
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://trigger-command');
    req.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken,
          command,
          payload,
        })
      )
    );
    req.send();
  };

  window.openExternal = (url) => {
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://open-external');
    req.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken,
          value: url,
        })
      )
    );
    req.send();
  };

  window.generateCertificateAndKey = (altNames: string[]) => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('POST', 'interprocess://generate-certificate-and-key');
      req.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken,
            parameters: {
              altNames,
            },
          })
        )
      );
      req.send();
      req.onload = () => {
        try {
          const r = JSON.parse(req.responseText);
          resolve(r);
        } catch (e) {
          if (e instanceof Error) {
            reject(new Error(`Could not parse response: ${e.message}`));
          }
        }
      };
    });
  };

  window.getIpAddressAndCert = (parameters) => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('POST', 'interprocess://get-ip-address-and-cert');
      req.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken,
            parameters,
          })
        )
      );
      req.send();
      req.onload = () => {
        try {
          const r = JSON.parse(req.responseText);
          if (r.success) {
            resolve(r.data);
          } else {
            reject(r.error);
          }
        } catch (e) {
          reject(new Error('could not parse response'));
        }
      };
    });
  };

  window.minimize = () => {
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://minimize');
    req.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken,
          action: null,
        })
      )
    );
    req.send();
  };

  window.maximize = () => {
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://maximize');
    req.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken,
          action: null,
        })
      )
    );
    req.send();
  };

  window.close = () => {
    const req = new XMLHttpRequest();
    req.open('POST', 'interprocess://close');
    req.setRequestHeader(
      'Data',
      encodeURI(
        JSON.stringify({
          uniqueEphemeralToken,
          action: null,
        })
      )
    );
    req.send();
  };

  window.inputEls = {};
  window.browserViewEvent = (type, payload) => {
    console.log(type);
    console.log(payload);
    if (payload.tabId && window.inputEls[payload.tabId]) {
      if (payload.tabId && payload.url) {
        let url = payload.url;
        if (url.startsWith('https://')) {
          url = url.slice(8);
        }
        window.inputEls[payload.tabId].value = url;
      }
    } else {
      console.warn('[browserViewEvent] Could not find tab ID');
    }
  };
};
