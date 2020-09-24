import { fork, all } from 'redux-saga/effects';

import { saveUiToStorageSaga } from './saveUiToStorageSaga';

export const sagas = function* rootSaga() {
  yield all([saveUiToStorageSaga()]);
};
