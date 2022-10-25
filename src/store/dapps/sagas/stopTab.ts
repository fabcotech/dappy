import { put, takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromMain from '../../main';
import { Tab } from '../../../models';
import { Action } from '../..';
import { dispatchInMain } from '/interProcess';

const stop = function* (action: Action) {
  const { payload } = action;

  const tabs: Tab[] = yield select(fromDapps.getTabs);
  const tab = tabs.find((t) => t.id === payload.tabId);

  if (!tab) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2042,
        error: 'tab does not exist',
      })
    );
    return;
  }

  dispatchInMain({
    type: '[MAIN] Destroy browser view',
    payload: { tabId: tab.id },
  });
};

export const stopSaga = function* () {
  yield takeEvery(fromDapps.STOP_TAB, stop);
};
