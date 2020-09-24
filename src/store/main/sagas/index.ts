import { all } from 'redux-saga/effects';

import { saveErrorSaga } from './saveErroraga';
import { browserViewToBeDisplayedSaga } from './browserViewToBeDisplayed';

export const sagas = function* rootSaga() {
  yield all([saveErrorSaga(), browserViewToBeDisplayedSaga()]);
};
