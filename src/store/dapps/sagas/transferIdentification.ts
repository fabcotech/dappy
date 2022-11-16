import { takeEvery } from 'redux-saga/effects';

import * as fromDapps from '..';
import { Action } from '../..';
import { dispatchInMain } from '/interProcess';

function transferIdentification(action: Action) {
  const { payload } = action;

  dispatchInMain({ type: '[MAIN] Transfer identification', payload });
}

export function* transferIdentificationSaga() {
  yield takeEvery(fromDapps.SAVE_IDENTIFICATION, transferIdentification);
}
