import { takeEvery, select } from 'redux-saga/effects';

import * as fromDapps from '..';
import { Tab } from '../../../models';
import { Action } from '../..';
import { dispatchInMain } from '/interProcess';

const launchTabCompleted = function* (action: Action) {
  const { payload } = action;
  const tabs: Tab[] = yield select(fromDapps.getTabs);

  const tab: Tab = tabs.find((t) => t.id === payload.tab.id) as Tab;

  const url = new URL(payload.tab.url);
  dispatchInMain({
    type: '[MAIN] Load or reload browser view',
    payload: {
      tab,
    },
  });
};

export const launchTabCompletedSaga = function* () {
  try {
    yield takeEvery(fromDapps.LAUNCH_TAB_COMPLETED, launchTabCompleted);
  } catch (err) {
    console.log(err);
  }
};
