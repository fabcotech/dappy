import url from 'url';
import { put, takeEvery, select } from 'redux-saga/effects';

import { Session, Tab } from '/models';

import * as fromHistory from '..';
import * as fromMain from '/store/main';
import * as fromDapps from '/store/dapps';
import { Action } from '/store';

const goBackward = function* (action: Action) {
  const payload: fromHistory.GoBackwardPayload = action.payload;
  const sessions: {
    [tabId: string]: Session;
  } = yield select(fromHistory.getSessions);
  const activeTab: Tab | undefined = yield select(fromDapps.getActiveTab);

  const session = sessions[payload.tabId];
  if (!session) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2038,
        error: 'Session not found tabId : ' + payload.tabId,
      })
    );
    return;
  }

  if (!activeTab && !session.items[session.cursor]) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2039,
        error: 'Session item not found tabId : ' + payload.tabId,
      })
    );
    return;
  }

  if (!!activeTab && !session.items[session.cursor - 1]) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2039,
        error: 'Session item not found tabId : ' + payload.tabId,
      })
    );
    return;
  }

  let sessionItem = session.items[session.cursor - 1];
  /*
    If no active resource, it means that user is on the "retry"
    or has a fromDapps.lastLoadErrors displayed, in this case,
    do not go back but reload
  */
  if (!activeTab) {
    sessionItem = session.items[session.cursor];
  }

  yield put(
    fromDapps.loadResourceAction({
      url: sessionItem.url,
      tabId: payload.tabId,
    })
  );

  /*
    Do not change cursor position if it is a "fake"
    backward because no active resource
  */
  if (!!activeTab) {
    yield put(fromHistory.goBackwardCompletedAction({ tabId: payload.tabId }));
  }
};

export const goBackwardSaga = function* () {
  yield takeEvery(fromHistory.GO_BACKWARD, goBackward);
};
