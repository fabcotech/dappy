import { select, take, all } from 'redux-saga/effects';

import * as fromMain from '..';
import { store } from '/store';

export const dispatchWhenInitializationOverSaga = function* gen() {
  yield all([take(fromMain.UPDATE_INITIALIZATION_OVER)]);

  const dispatchWhenInitializationOver: fromMain.DispatchWhenInitializationOverPayload['payload'][] =
    yield select(fromMain.getDispatchWhenInitializationOver);

  dispatchWhenInitializationOver.forEach((action) => {
    store.dispatch(action);
  });
  return undefined;
};
