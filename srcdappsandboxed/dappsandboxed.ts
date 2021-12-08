import * as fromCommon from '../src/common';

window.messageFromMain = (action) => {
  if (action.type === fromCommon.DAPP_INITIAL_SETUP) {
    const payload: fromCommon.DappInitialSetupPayload = action.payload;
    console.log('[dappy] initial payload');
    console.log(payload);
    document.title = payload.title;
    window.dappy = {
      dappyDomain: payload.dappyDomain,
      path: payload.path,
      resourceId: payload.resourceId,
    };
    document.write(payload.html.replace(new RegExp('dappyl://', 'g'), payload.appPath));
    document.close();

    document.addEventListener('DOMContentLoaded', function () {
      if (typeof window.initContextMenu !== 'undefined') {
        window.initContextMenu();
      }
      setTimeout(() => {
        var link = document.querySelector("link[rel*='icon']");
        if (link !== null) {
          /*
            Multiply tries because the event 'page-favicon-updated' is not
            triggered if .appenChild is done too soon
          */
          setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(link.cloneNode());
          }, 100);
          setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(link.cloneNode());
          }, 500);
          setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(link.cloneNode());
          }, 2000);
          setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(link.cloneNode());
          }, 5000);
        }
      }, 0);
    });
  } else {
    console.error('Unknown action');
    console.log(action);
  }
};

let DOMContentLoaded = false;
let initializePayload: any = undefined;

const interProcess = new XMLHttpRequest();
interProcess.open('POST', 'interprocessdapp://hi-from-dapp-sandboxed');
interProcess.send();
interProcess.onload = (a) => {
  try {
    const r = JSON.parse(a.target.responseText);
    initializePayload = r;
    if (DOMContentLoaded) {
      window.messageFromMain(r);
    }
  } catch (e) {
    console.log(e);
    window.messageFromMain({ message: 'could not parse response' });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  DOMContentLoaded = true;
  if (initializePayload) {
    window.messageFromMain(initializePayload);
  }
});
