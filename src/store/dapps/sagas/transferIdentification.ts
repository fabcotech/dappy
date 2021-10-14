import { takeEvery } from 'redux-saga/effects';

import * as fromDapps from '..';
import { Action } from '../..';
import { dispatchInMain } from '/interProcess';

const transferIdentification = function* (action: Action) {
  const payload: fromDapps.SaveIdentificationPayload = action.payload;

  dispatchInMain({ type: '[MAIN] Transfer identification', payload: payload });

  return;
};

export const transferIdentificationSaga = function* () {
  yield takeEvery(fromDapps.SAVE_IDENTIFICATION, transferIdentification);
};
