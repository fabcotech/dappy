import { takeEvery, select, put } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromMain from '../../main';
import { Tab } from '../../../models';
import { Action } from '../..';
import { dispatchInMain } from '/interProcess';

const setTabMuted = function* (action: Action) {
  const { payload } = action;
  const tabs: Tab[] = yield select(fromDapps.getTabs);
  const tab = tabs.find((t) => t.id === payload.tabId);

  if (!tab) {
    fromMain.saveErrorAction({
      errorCode: 2044,
      error: 'Did not find tab, cannot mute / unmute',
    });
    return;
  }

  dispatchInMain({
    type: '[MAIN] Set browser view muted',
    payload: {
      muted: payload.muted,
      id: tab.id,
    },
  });
};

export const setTabMutedSaga = function* () {
  yield takeEvery(fromDapps.SET_TAB_MUTED, setTabMuted);
};
