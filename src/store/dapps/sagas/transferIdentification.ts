import { takeEvery } from 'redux-saga/effects';

import * as fromDapps from '..';
import { Action } from '../..';

const transferIdentification = function*(action: Action) {
  const payload: fromDapps.SaveIdentificationPayload = action.payload;

  window.dispatchInMain(window.uniqueEphemeralToken, { type: '[MAIN] Transfer identification', payload: payload });

  return;
};

export const transferIdentificationSaga = function*() {
  yield takeEvery(fromDapps.SAVE_IDENTIFICATION, transferIdentification);
};
