import { put, takeEvery } from 'redux-saga/effects';

import * as fromBlockchain from '..';
import * as fromMain from '../../main';
import { browserUtils } from '../../browser-utils';
import { Action } from '../../';

const saveBenchmarkToStorage = function*(action: Action) {
  const payload: fromBlockchain.PerformBenchmarkCompletedPayload = action.payload;

  try {
    yield browserUtils.saveStorage('benchmarks', payload.benchmark, true);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2002,
        error: 'Unable to save benchmark to storage',
        trace: e,
      })
    );
  }
};

export const saveBenchmarkToStorageSaga = function*() {
  yield takeEvery(fromBlockchain.PERFORM_BENCHMARK_COMPLETED, saveBenchmarkToStorage);
};
