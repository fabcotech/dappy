import { takeEvery, select, put } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromMain from '../../main';
import { Tab } from '../../../models';
import { browserUtils } from '../../browser-utils';
import { Action } from '../..';
import { dispatchInMain } from '/interProcess';

function* saveTabs() {
  const tabs: Tab[] = yield select(fromDapps.getTabs);

  const tabsToSave: { [id: string]: Omit<Tab, 'lastError' | 'data'> } = {};
  tabs.forEach((t, i) => {
    tabsToSave[t.id] = {
      id: t.id,
      title: t.title,
      favorite: t.favorite,
      img: t.img,
      active: tabs[0].id === t.id,
      muted: t.muted,
      index: i,
      counter: 0,
      url: t.url,
    };
  });

  dispatchInMain({
    type: '[MAIN] Transfer tabs',
    payload: tabs,
  });

  try {
    yield browserUtils.saveStorageIndexed('tabs', tabsToSave);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2030,
        error: 'Unable to save tabs to storage',
        trace: e,
      })
    );
  }
}

export function* saveTabsSaga() {
  yield takeEvery(fromDapps.LAUNCH_TAB_COMPLETED, saveTabs);
  yield takeEvery(fromDapps.UPDATE_TABS_FROM_STORAGE, saveTabs);
  yield takeEvery(fromDapps.SET_TAB_MUTED, saveTabs);
  yield takeEvery(fromDapps.SET_TAB_FAVORITE, saveTabs);
  yield takeEvery(fromDapps.DID_CHANGE_FAVICON, saveTabs);
  yield takeEvery(fromDapps.UPDATE_TAB_URL_AND_TITLE, saveTabs);
}
