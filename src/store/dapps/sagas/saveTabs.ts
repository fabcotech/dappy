import { takeEvery, select, put } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromMain from '../../main';
import { Tab } from '../../../models';
import { browserUtils } from '../../browser-utils';
import { Action } from '../..';

const saveTabs = function* (action: Action) {
  const tabs: Tab[] = yield select(fromDapps.getTabs);

  const tabsToSave: { [id: string]: Tab } = {};
  tabs.forEach((t, i) => {
    tabsToSave[t.id] = {
      id: t.id,
      resourceId: t.resourceId,
      title: t.title,
      img: t.img,
      active: tabs[0].id === t.id,
      muted: t.muted,
      index: i,
      counter: 0,
      address: t.address,
    };
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
};

export const saveTabsSaga = function* () {
  yield takeEvery(fromDapps.LAUNCH_DAPP_COMPLETED, saveTabs);
  yield takeEvery(fromDapps.UPDATE_TABS_FROM_STORAGE, saveTabs);
  yield takeEvery(fromDapps.SET_TAB_MUTED, saveTabs);
  yield takeEvery(fromDapps.UPDATE_TAB_SEARCH, saveTabs);
  yield takeEvery('[History] Save preview', saveTabs);
};
