import { put, takeEvery, select } from 'redux-saga/effects';

import { store } from '../..';
import * as fromDapps from '..';
import * as fromMain from '../../main';
import { browserUtils } from '../../browser-utils';
import { Tab, DappManifest, IpApp, LoadedFile } from '../../../models';
import { Action } from '../..';

const removeTab = function* (action: Action) {
  const payload: fromDapps.RemoveTabPayload = action.payload;
  const tabId = payload.tabId;

  const activeResource: DappManifest | IpApp | LoadedFile | undefined = yield select(fromDapps.getActiveResource);
  const tabs: Tab[] = yield select(fromDapps.getTabs);

  try {
    const tab = tabs.find((t) => t.id === tabId);

    if (!tab) {
      yield put(
        fromMain.saveErrorAction({
          errorCode: 2018,
          error: 'tab does not exist',
        })
      );
      return;
    }

    if (tab.active && !!activeResource) {
      yield put(fromDapps.stopTabAction({ tabId: tab.id }));
    }

    yield browserUtils.removeInStorage('tabs', tabId);

    store.dispatch(
      fromDapps.removeTabCompletedAction({ tabId: tabId, resourceId: activeResource ? activeResource.id : undefined })
    );
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2019,
        error: 'Unable to remove dapp',
        trace: e,
      })
    );
  }
};

export const removeTabSaga = function* () {
  yield takeEvery(fromDapps.REMOVE_TAB, removeTab);
};
