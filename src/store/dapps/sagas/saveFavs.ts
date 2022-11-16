import { takeEvery, select, put } from 'redux-saga/effects';

import * as fromDapps from '..';
import * as fromMain from '../../main';
import { Fav } from '../../../models';
import { browserUtils } from '../../browser-utils';

function* saveFavs() {
  const favs: Fav[] = yield select(fromDapps.getFavs);

  const favsToSave: { [id: string]: Fav } = {};
  favs.forEach((t) => {
    favsToSave[t.id] = {
      id: t.id,
      title: t.title,
      img: t.img,
      url: t.url,
    };
  });

  try {
    yield browserUtils.saveStorageIndexed('favs', favsToSave);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2030,
        error: 'Unable to save tabs to storage',
        trace: e,
      })
    );
  }
}

export function* saveFavsSaga() {
  yield takeEvery(fromDapps.CREATE_FAV, saveFavs);
}
