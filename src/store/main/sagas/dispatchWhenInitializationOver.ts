import { takeEvery, select, take, all } from 'redux-saga/effects';

import * as fromMain from '../';
import * as fromBlockchain from '/store/blockchain';
import { store } from '/store';

export const dispatchWhenInitializationOverSaga = function* () {
  yield all([take(fromMain.UPDATE_INITIALIZATION_OVER), take(fromBlockchain.PERFORM_MANY_BENCHMARKS_COMPLETED)]);

  const dispatchWhenInitializationOver: fromMain.DispatchWhenInitializationOverPayload['payload'][] = yield select(
    fromMain.getDispatchWhenInitializationOver
  );

  dispatchWhenInitializationOver.forEach((action) => {
    store.dispatch(action);
  });
  return undefined;
};
