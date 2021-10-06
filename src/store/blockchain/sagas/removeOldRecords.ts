import { takeEvery, put } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import * as fromMain from '/store/main';
import { browserUtils } from '/store/browser-utils';
import { Action, db, store } from '/store/';

const removeOldRecords = function*(action: Action) {
  const payload: fromBlockchain.RemoveOldRecordsPayload = action.payload;
  const state = store.getState();

  const records = yield fromBlockchain.getRecords(state);
  const oldRecordsNames: string[] = [];
  Object.keys(records).forEach(k => {
    const record = records[k];
    if (record.origin === 'blockchain' && new Date(record.loadedAt).getTime() < new Date(payload.before).getTime()) {
      oldRecordsNames.push(k);
    }
  });

  browserUtils.deleteStorageIndexed('records', oldRecordsNames).catch(err => {
    store.dispatch(
      fromMain.saveErrorAction({
        errorCode: 2046,
        error: 'Unable to delete records in storage',
        trace: err,
      })
    );
  });

  yield put(fromBlockchain.removeOldRecordsCompletedAction({ names: oldRecordsNames }));

  return true;
};

export const removeOldRecordsSaga = function*() {
  yield takeEvery(fromBlockchain.REMOVE_OLD_RECORDS, removeOldRecords);
};
