import { all } from 'redux-saga/effects';

import { saveCookiesSaga } from './saveCookies';

export const sagas = function* rootSaga() {
  yield all([saveCookiesSaga()]);
};
