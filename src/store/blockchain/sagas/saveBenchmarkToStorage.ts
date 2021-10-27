import { put, takeEvery } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import * as fromMain from '/store/main';
import { browserUtils } from '/store/browser-utils';
import { Action, store } from '/store/';

const saveBenchmarkToStorage = function* (action: Action) {
  const payload: fromBlockchain.PerformManyBenchmarksCompletedPayload = action.payload;

  payload.benchmarks.forEach((b) => {
    browserUtils
      .saveStorage('benchmarks', b, true)
      .then((a) => {})
      .catch((e) => {
        store.dispatch(
          fromMain.saveErrorAction({
            errorCode: 2002,
            error: 'Unable to save benchmark to storage',
            trace: e,
          })
        );
      });
  });
};

export const saveBenchmarkToStorageSaga = function* () {
  yield takeEvery(fromBlockchain.PERFORM_MANY_BENCHMARKS_COMPLETED, saveBenchmarkToStorage);
};
