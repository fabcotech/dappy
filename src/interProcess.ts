import { Store } from 'redux';

export const interProcess = (store: Store) => {
  let uniqueEphemeralToken = '';
  setInterval(() => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://get-dispatches-from-main-awaiting');
    interProcess.setRequestHeader(
      'Data',
      JSON.stringify({
        uniqueEphemeralToken: uniqueEphemeralToken,
      })
    );
    interProcess.send();
    interProcess.onload = (a) => {
      console.log('RESPONSE get-dispatches-from-main-awaiting');
      console.log(a.target.responseText);
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

      if (r.loadResourceWhenReady) {
        console.log('will load resource when ready', r.loadResourceWhenReady);
        const action = {
          type: '[Dapps] Load resource',
          payload: {
            address: r.loadResourceWhenReady.replace('dappy://', ''),
          },
        };
        store.dispatch(action);
      }
    };
  }, 0);

  window.copyToClipboard = (a) => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://copy-to-clipboard');
    interProcess.setRequestHeader(
      'Data',
      JSON.stringify({
        uniqueEphemeralToken: uniqueEphemeralToken,
        value: a,
      })
    );
    interProcess.send();
  };

  window.dispatchInMain = (action) => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://dispatch-in-main');
    interProcess.setRequestHeader(
      'Data',
      JSON.stringify({
        uniqueEphemeralToken: uniqueEphemeralToken,
        action: action,
      })
    );
    interProcess.send();
  };

  window.triggerCommand = (command, payload = undefined) => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://trigger-command');
    interProcess.setRequestHeader(
      'Data',
      JSON.stringify({
        uniqueEphemeralToken: uniqueEphemeralToken,
        command: command,
        payload: payload,
      })
    );
    interProcess.send();
  };

  window.openExternal = (url) => {
    const interProcess = new XMLHttpRequest();
    interProcess.open('POST', 'interprocess://open-external');
    interProcess.setRequestHeader(
      'Data',
      JSON.stringify({
        uniqueEphemeralToken: uniqueEphemeralToken,
        value: url,
      })
    );
    interProcess.send();
  };

  window.singleDappyCall = (body, node) => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://single-dappy-call');
      interProcess.setRequestHeader(
        'Data',
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          body: body,
          node: node,
        })
      );
      interProcess.send();
      interProcess.onload = (a) => {
        console.log('RESPONSE single-dappy-call');
        console.log(a.target.responseText);
        try {
          const r = JSON.parse(a.target.responseText);
          resolve(r.data);
        } catch (e) {
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
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          parameters: parameters,
          body: body,
        })
      );
      interProcess.send();
      interProcess.onload = (a) => {
        console.log('RESPONSE multi-dappy-call');
        console.log(a.target.responseText);
        try {
          const r = JSON.parse(a.target.responseText);
          if (r.success) {
            resolve(r.data);
          } else {
            reject(r);
          }
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
        JSON.stringify({
          uniqueEphemeralToken: uniqueEphemeralToken,
          parameters: parameters,
        })
      );
      interProcess.send();
      interProcess.onload = (a) => {
        console.log('RESPONSE get-ip-address-and-cert');
        console.log(a.target.responseText);
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

  window.getDapps = () => {
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', 'interprocess://get-dapps');
      interProcess.send();
      interProcess.onload = (a) => {
        console.log('RESPONSE get-dapps');
        console.log(a.target.responseText);
        try {
          const r = JSON.parse(a.target.responseText);
          if (r.success) {
            resolve(r.data);
          } else {
            reject(r);
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
