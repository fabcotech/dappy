import { put, takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromMain from '../../main';
import { Tab } from '../../../models';
import { Action } from '../..';

const loadOrReloadResourceFailed = function* (action: Action) {
  const payload: fromDapps.LoadResourceFailedPayload = action.payload;

  const tabs: Tab[] = yield select(fromDapps.getTabs);
  const tab = tabs.find((t) => t.id === payload.tabId);

  if (!tab) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2043,
        error: 'tab does not exist',
      })
    );
    return;
  }

  window.dispatchInMain({
    type: '[MAIN] Destroy browser view',
    payload: { resourceId: tab.resourceId },
  });
};

export const loadOrReloadResourceFailedSaga = function* () {
  yield takeEvery(fromDapps.LOAD_RESOURCE_FAILED, loadOrReloadResourceFailed);
};
