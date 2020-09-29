const { ipcRenderer, remote } = require('electron');

let initializePayload;
let DOMContentLoaded = false;

ipcRenderer.on('hi-from-dapp-sandboxed-reply', (event, payload) => {
  initializePayload = payload;
  if (DOMContentLoaded) {
    window.messageFromMain(payload);
  }
});

ipcRenderer.on('message-from-main', (event, payload) => {
  window.messageFromMain(payload);
});

global.sendMessageToHost = (m) => {
  ipcRenderer.send('message-from-dapp-sandboxed', m);
};

document.addEventListener('DOMContentLoaded', function () {
  DOMContentLoaded = true;
  if (initializePayload) {
    window.messageFromMain(initializePayload);
  }
});

setTimeout(() => {
  ipcRenderer.send('hi-from-dapp-sandboxed', navigator.userAgent);
}, 50);

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
