import url from 'url';
import { put, takeEvery, select } from 'redux-saga/effects';

import * as fromHistory from '..';
import * as fromMain from '../../main';
import * as fromDapps from '../../dapps';
import { Action } from '../../';
import { Session } from '../../../models';

const goBackward = function* (action: Action) {
  const payload: fromHistory.GoBackwardPayload = action.payload;
  const sessions: {
    [tabId: string]: Session;
  } = yield select(fromHistory.getSessions);
  const activeResource: boolean = yield select(fromDapps.getActiveResource);

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

  if (!activeResource && !session.items[session.cursor]) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2039,
        error: 'Session item not found tabId : ' + payload.tabId,
      })
    );
    return;
  }

  if (!!activeResource && !session.items[session.cursor - 1]) {
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
  if (!activeResource) {
    sessionItem = session.items[session.cursor];
  }

  yield put(
    fromDapps.loadResourceAction({
      address: sessionItem.address,
      tabId: payload.tabId,
    })
  );

  /*
    Do not change cursor position if it is a "fake"
    backward because no active resource
  */
  if (!!activeResource) {
    yield put(fromHistory.goBackwardCompletedAction({ tabId: payload.tabId }));
  }
};

export const goBackwardSaga = function* () {
  yield takeEvery(fromHistory.GO_BACKWARD, goBackward);
};
