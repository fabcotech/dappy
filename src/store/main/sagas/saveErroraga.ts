import { takeEvery } from 'redux-saga/effects';

import * as fromMain from '..';
import { Action, store } from '../../';
import { DEVELOPMENT } from '../../../CONSTANTS';

const saveError = function*(action: Action) {
  const payload: fromMain.SaveErrorPayload = action.payload;

  if (DEVELOPMENT) {
    throw payload.error;
  } else {
    Sentry.captureEvent({
      message: `Caught error ${payload.errorCode} ${payload.error} \n${payload.trace ? payload.trace.stack : ''}`,
    });
  }

  return yield undefined;
};

export const saveErrorSaga = function*() {
  yield takeEvery(fromMain.SAVE_ERROR, saveError);
};
