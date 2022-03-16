import url from 'url';
import { put, takeEvery, select } from 'redux-saga/effects';

import * as fromHistory from '..';
import * as fromMain from '/store/main';
import * as fromDapps from '/store/dapps';
import { Action } from '/store';
import { Session } from '/models';

const goForward = function* (action: Action) {
  const payload: fromHistory.GoForwardPayload = action.payload;
  const sessions: {
    [tabId: string]: Session;
  } = yield select(fromHistory.getSessions);

  const session = sessions[payload.tabId];
  if (!session) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2036,
        error: 'Session not found tabId : ' + payload.tabId,
      })
    );
    return;
  }

  if (!session.items[session.cursor + 1]) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2037,
        error: 'Session item not found tabId : ' + payload.tabId,
      })
    );
    return;
  }

  const sessionItem = session.items[session.cursor + 1];

  yield put(
    fromDapps.loadResourceAction({
      url: sessionItem.url,
      tabId: payload.tabId,
    })
  );

  yield put(fromHistory.goForwardCompletedAction({ tabId: payload.tabId }));
};

export const goForwardSaga = function* () {
  yield takeEvery(fromHistory.GO_FORWARD, goForward);
};
