import { put, takeEvery } from 'redux-saga/effects';

import * as fromCookies from '..';
import * as fromMain from '../../main';
import { Action } from '../..';
import { browserUtils } from '../../browser-utils';

const saveCookies = function* (action: Action) {
  const { payload } = action;

  if (!payload.cookies || payload.cookies.length === 0) {
    return;
  }

  const cookiesToSave = {
    [payload.host]: {
      host: payload.host,
      cookies: payload.cookies,
    }
  };

  try {
    yield browserUtils.saveStorageIndexed('cookies', cookiesToSave);
    yield put(
      fromCookies.saveCookiesForDomainCompletedAction(payload)
    );
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2051,
        error: 'Unable to save cookies to storage',
        trace: e,
      })
    );
  }
};

export const saveCookiesSaga = function* () {
  yield takeEvery(fromCookies.SAVE_COOKIES_FOR_DOMAIN, saveCookies);
};
