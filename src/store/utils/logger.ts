import { takeEvery, select } from 'redux-saga/effects';
import { Action } from 'redux';

import { State } from '/store/';
import * as fromDapps from '/store/dapps';

const logCSSStyle = 'font-weight: bold; color: #FFF;padding:2px;';
const logCSSStyleState = `${logCSSStyle}`;
const logCSSStyleAction = `${logCSSStyle}`;
const mainColors = ['background:#111;', 'background:#333;'];
const uiColors = ['background:#AD540C;', 'background:#CD640C;'];
const dappsColors = ['background:#0d5896;', 'background:#1978c6;'];
const settingsColors = ['background:#0d961f;', 'background:#11c429;'];
const blockchainColors = ['background:rgb(2, 77, 67);', 'background:rgb(2, 107, 87);'];
const commonColors = ['background:#ee0055;', 'background:#ff0066;'];
const historyColors = ['background:#ff9966;', 'background:#ffaa77;'];
const cookiesColors = ['background:#6a1f73;', 'background:#9f24ad;'];

const logger = function* (action: Action) {
  const state: State = yield select((s) => s);

  if (action.type.includes('[Main]')) {
    console.log('%caction', logCSSStyleAction + mainColors[1], action);
  } else if (action.type.includes('[Ui]')) {
    console.log('%caction', logCSSStyleAction + uiColors[1], action);
  } else if (action.type.includes('[Dapps]')) {
    console.log('%caction', logCSSStyleAction + dappsColors[1], action);
  } else if (action.type.includes('[Settings]')) {
    console.log('%caction', logCSSStyleAction + settingsColors[1], action);
  } else if (action.type.includes('[Blockchain]')) {
    console.log('%caction', logCSSStyleAction + blockchainColors[1], action);
  } else if (action.type.includes('[History]')) {
    console.log('%caction', logCSSStyleAction + historyColors[1], action);
  } else if (action.type.includes('[Cookies]')) {
    console.log('%caction', logCSSStyleAction + cookiesColors[1], action);
  } else if (action.type.includes('[Common]')) {
    console.log('%caction', logCSSStyleAction + commonColors[1], action);
  } else {
    console.log('%caction', logCSSStyleAction, action);
  }

  if (action.type.includes('[Main]')) {
    console.log('%cmain', logCSSStyleState + mainColors[0], state.main);
  } else if (action.type.includes('[Ui]')) {
    console.log('%cui', logCSSStyleState + uiColors[0], state.ui);
  } else if (action.type.includes('[Dapps]')) {
    console.log('%cdapps', logCSSStyleState + dappsColors[0], state.dapps);
    if (
      [
        fromDapps.STOP_TAB,
        fromDapps.LAUNCH_TAB_COMPLETED,
        fromDapps.STOP_TAB,
      ].includes(action.type)
    ) {
      console.log('%chistory', logCSSStyleState + historyColors[0], state.history);
    }
    console.log('%cdapps', logCSSStyleState + dappsColors[0], state.dapps);
  } else if (action.type.includes('[Settings]')) {
    console.log('%csettings', logCSSStyleState + settingsColors[0], state.settings);
  } else if (action.type.includes('[Blockchain]')) {
    console.log('%cblockchain', logCSSStyleState + blockchainColors[0], state.blockchain);
  } else if (action.type.includes('[History]')) {
    console.log('%chistory', logCSSStyleState + historyColors[0], state.history);
  } else if (action.type.includes('[Cookies]')) {
    console.log('%ccookies', logCSSStyleState + cookiesColors[0], state.cookies);
  } else if (!action.type.includes('[Common]')) {
    console.log('%cstate ', logCSSStyleState, state);
  }

  return state;
};

export const loggerSaga = function* () {
  yield takeEvery('*', logger);
};
