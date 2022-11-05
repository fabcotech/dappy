import { all } from 'redux-saga/effects';

import { transferTransactionStateSaga } from './transferTransactionState';

export const sagas = function* rootSaga() {
  yield all([transferTransactionStateSaga()]);
};
