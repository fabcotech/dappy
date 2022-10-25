import { takeEvery, put } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import * as fromMain from '/store/main';
import { browserUtils } from '/store/browser-utils';
import { Action } from '/store';

const addRecordToStorage = function* (action: Action) {
  const { payload } = action;

  try {
    yield browserUtils.saveStorageIndexed('records', { [payload.record.id]: payload.record });
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2028,
        error: 'Unable to save record to storage',
        trace: e,
      })
    );
  }

  return true;
};

export const addRecordToStorageSaga = function* () {
  yield takeEvery(fromBlockchain.ADD_RECORD, addRecordToStorage);
  yield takeEvery(fromBlockchain.GET_ONE_RECORD_COMPLETED, addRecordToStorage);
};
