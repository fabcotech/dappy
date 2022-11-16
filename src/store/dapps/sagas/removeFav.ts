import { put, takeEvery, select } from 'redux-saga/effects';

import { store, Action } from '../..';
import * as fromDapps from '..';
import * as fromMain from '../../main';
import { browserUtils } from '../../browser-utils';
import { Fav } from '../../../models';

function* removeFab(action: Action) {
  const { payload } = action;
  const { favId } = payload;
  const favs: Fav[] = yield select(fromDapps.getFavs);

  try {
    const fav = favs.find((t) => t.id === favId);

    if (!fav) {
      yield put(
        fromMain.saveErrorAction({
          errorCode: 2050,
          error: 'fav does not exist',
        })
      );
      return;
    }

    yield browserUtils.removeInStorage('favs', favId);

    store.dispatch(fromDapps.removeFavCompletedAction({ favId }));
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2049,
        error: 'Unable to remove fav',
        trace: e,
      })
    );
  }
}

export function* removeFabSaga() {
  yield takeEvery(fromDapps.REMOVE_FAV, removeFab);
}
