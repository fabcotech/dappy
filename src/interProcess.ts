import { Store } from 'redux';
import * as fromDapps from './store/dapps';
import * as fromMain from './store/main';

const actionsAwaitingEphemeralToken: any[] = [];

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
        const r = JSON.parse(a.target.responseText);
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
      const r = JSON.parse(a.target.responseText);
      window.uniqueEphemeralToken = r.uniqueEphemeralToken;
      uniqueEphemeralToken = r.uniqueEphemeralToken;
      if (actionsAwaitingEphemeralToken.length) {
        actionsAwaitingEphemeralToken.forEach((a) => {
          window.dispatchInMain(a);
        });
      }
      if (r.loadResourceWhenReady) {
        const initializationOver = fromMain.getInitializationOver(store.getState());
        const action = fromDapps.loadResourceAction({ address: r.loadResourceWhenReady });
        if (initializationOver) {
          console.log('will load resource when ready', r.loadResourceWhenReady);
          store.dispatch(action);
        } else {
          store.dispatch(fromMain.dispatchWhenInitializationOverAction({ payload: action }));
        }
      }
    };
  }, 0);

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

  window.singleDappyCall = (body, node) => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://single-dappy-call');
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
          const r = JSON.parse(a.target.responseText);
          if (r.success) {
            resolve(r.data);
          } else {
            reject(r.error || { message: 'Unknown error' });
          }
        } catch (e) {
          console.log(a.target.responseText);
          console.log(e);
          reject({ message: 'could not parse response' });
        }
      };
    });
  };

  window.multiDappyCall = (body, parameters) => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://multi-dappy-call');
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
          const r = JSON.parse(a.target.responseText);
          if (r.success) {
            resolve(r.data);
          } else {
            reject(r);
          }
        } catch (e) {
          console.log(a.target.responseText);
          console.log(e);
          reject({ message: 'could not parse response' });
        }
      };
    });
  };

  window.generateCertificateAndKey = () => {
    console.log('generateCertificateAndKey');
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://generate-certificate-and-key');
      interProcess.setRequestHeader(
        'Data',
        encodeURI(
          JSON.stringify({
            uniqueEphemeralToken: uniqueEphemeralToken,
            parameters: {},
          })
        )
      );
      interProcess.send();
      interProcess.onload = (a) => {
        try {
          const r = JSON.parse(a.target.responseText);
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
          const r = JSON.parse(a.target.responseText);
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
