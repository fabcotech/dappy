import { takeEvery, put } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import * as fromMain from '../../main';
import { browserUtils } from '../../browser-utils';
import { Action } from '../../';

const addRecordToStorage = function* (action: Action) {
  const payload: fromBlockchain.AddRecordPayload = action.payload;

  try {
    yield browserUtils.saveStorageIndexed('records', { [payload.record.name]: payload.record });
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
