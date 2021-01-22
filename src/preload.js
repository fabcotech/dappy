const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;

ipcRenderer.on('ask-unique-ephemeral-token-reply', (event, uniqueEphemeralToken) => {
  window.uniqueEphemeralToken = uniqueEphemeralToken;
});

ipcRenderer.on('dispatch-from-main', (event, action) => {
  if (window.dispatchFromMainProcess) {
    window.dispatchFromMainProcess(action);
  } else {
    window.dispatchWhenReady = action;
  }
});

setTimeout(() => {
  ipcRenderer.send('ask-unique-ephemeral-token', 'please');
}, 0);

window.copyToClipboard = (a) => {
  ipcRenderer.send('copy-to-clipboard', a);
};

window.dispatchInMain = (uniqueEphemeralToken, action) => {
  ipcRenderer.send('dispatch-in-main', {
    uniqueEphemeralToken: uniqueEphemeralToken,
    action: action,
  });
};

window.triggerCommand = (uniqueEphemeralToken, command, payload = undefined) => {
  ipcRenderer.send('trigger-command', {
    uniqueEphemeralToken: uniqueEphemeralToken,
    command: command,
    payload: payload,
  });
};

window.openExternal = (url) => {
  ipcRenderer.send('open-external', {
    uniqueEphemeralToken: uniqueEphemeralToken,
    value: url,
  });
};

window.singleDappyCall = (body, node) => {
  return new Promise((resolve, reject) => {
    const requestId = Math.round(Math.random() * 1000000).toString();
    ipcRenderer.send('single-dappy-call', {
      uniqueEphemeralToken: uniqueEphemeralToken,
      requestId: requestId,
      body: body,
      node: node,
    });
    ipcRenderer.addListener('single-dappy-call-reply-' + requestId, (event, result) => {
      // Error thrown by main process
      if (result.error) {
        reject(result.error);
        return;
      }
      try {
        const json = JSON.parse(result);
        resolve(json.data);
      } catch (err) {
        reject({ message: 'Could not parse response' });
      }
    });
  });
};

window.multiDappyCall = (body, parameters) => {
  return new Promise((resolve, reject) => {
    const requestId = Math.round(Math.random() * 1000000).toString();
    ipcRenderer.send('multi-dappy-call', {
      uniqueEphemeralToken: uniqueEphemeralToken,
      requestId: requestId,
      body: body,
      parameters: parameters,
    });
    ipcRenderer.addListener('multi-dappy-call-reply-' + requestId, (event, actionOrErr) => {
      if (actionOrErr.success) {
        resolve(actionOrErr.data);
      } else {
        reject(actionOrErr);
      }
    });
  });
};

window.getDapps = () => {
  return new Promise((resolve, reject) => {
    const requestId = Math.round(Math.random() * 1000000).toString();
    ipcRenderer.send('get-dapps', {
      uniqueEphemeralToken: uniqueEphemeralToken,
      requestId: requestId,
      parameters: {},
    });
    ipcRenderer.addListener('get-dapps-reply-' + requestId, (event, result) => {
      if (result.success) {
        resolve(result.data);
      } else {
        reject(result.error);
      }
    });
  });
};

window.getIpAddressAndCert = (parameters) => {
  return new Promise((resolve, reject) => {
    const requestId = Math.round(Math.random() * 1000000).toString();
    ipcRenderer.send('get-ip-address-and-cert', {
      uniqueEphemeralToken: uniqueEphemeralToken,
      requestId: requestId,
      parameters: parameters,
    });
    ipcRenderer.addListener('get-ip-address-and-cert-reply-' + requestId, (event, result) => {
      if (result.success) {
        resolve(result.data);
      } else {
        reject(result.error);
      }
    });
  });
};

// todo shortcuts don't work on linux/ubuntu
const itemZoomIn = new remote.MenuItem({
  label: 'Zoom in',
  /* accelerator: 'CommandOrControl+Up', */
  role: 'zoomIn',
});
const itemZoomOut = new remote.MenuItem({
  label: 'Zoom out',
  /* accelerator: 'CommandOrControl+Down', */
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
