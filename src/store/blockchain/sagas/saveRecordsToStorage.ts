import { takeEvery } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import * as fromMain from '/store/main';
import { browserUtils } from '/store/browser-utils';
import { Record } from '/models';
import { Action, db, store } from '/store/';

const saveRecordsToStorage = function*(action: Action) {
  const payload: fromBlockchain.GetAllRecordsCompletedPayload = action.payload;

  const recordsTx = db.transaction('records', 'readwrite');
  var recordsStore = recordsTx.objectStore('records');

  const requestRecordsGetAll = recordsStore.getAll();
  requestRecordsGetAll.onsuccess = e => {
    const recordsOriginUser = requestRecordsGetAll.result.filter(r => r.origin === 'user');
    const requestRecordsClear = recordsStore.clear();
    requestRecordsClear.onsuccess = e => {
      const recordsIndexed: { [id: string]: Record } = {};
      payload.records.concat(recordsOriginUser).forEach(r => {
        recordsIndexed[r.name] = r;
      });
      browserUtils.saveStorageIndexed('records', recordsIndexed).catch(err => {
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2027,
            error: 'Unable to save records to storage',
            trace: err,
          })
        );
      });
    };
  };

  return true;
};

export const saveRecordsToStorageSaga = function*() {
  yield takeEvery(fromBlockchain.GET_ALL_RECORDS_COMPLETED, saveRecordsToStorage);
};
