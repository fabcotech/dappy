import { put, takeEvery, select } from 'redux-saga/effects';

import { browserUtils } from '/store/browser-utils';
import * as fromUi from '..';
import * as fromMain from '/store/main';
import { Action } from '/store/';
import { dispatchInMain } from '/interProcess';

const saveUiToStorage = function* (action: Action) {
  const uiState: fromUi.State = yield select(fromUi.getUiState);
  const isTablet: boolean = yield select(fromUi.getIsTablet);
  const isMobile: boolean = yield select(fromUi.getIsMobile);

  const uiStateToSave = {
    menuCollapsed: uiState.menuCollapsed,
    devMode: uiState.devMode,
    tabsListDisplay: uiState.tabsListDisplay,
    navigationUrl: uiState.navigationUrl,
    language: uiState.language,
    gcu: uiState.gcu,
    showAccountCreationAtStartup: uiState.showAccountCreationAtStartup,
  };

  let dappsTabsWidth = 0;
  if (uiState.tabsListDisplay === 2) {
    if (isMobile) {
      dappsTabsWidth = 160;
    } else if (isTablet) {
      dappsTabsWidth = 220;
    } else {
      dappsTabsWidth = 320;
    }
  } else if (uiState.tabsListDisplay === 3) {
    dappsTabsWidth = 28;
  }

  let menuWidth = 0;
  if (!isMobile) {
    if (uiState.menuCollapsed) {
      menuWidth = 55;
    } else {
      menuWidth = 194;
    }
  }
  const x = menuWidth + dappsTabsWidth;
  const y = 50;
  if (uiState.windowDimensions) {
    const browserViewsPosition = {
      x,
      y,
      width: uiState.windowDimensions[0] - x,
      height: uiState.windowDimensions[1] - y,
    };

    dispatchInMain({
      type: '[MAIN] Update browser views position',
      payload: browserViewsPosition,
    });
  }

  try {
    yield browserUtils.saveStorage('ui', uiStateToSave);
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2012,
        error: 'Unable to save ui',
        trace: e,
      })
    );
  }
};

export const saveUiToStorageSaga = function* () {
  yield takeEvery(fromUi.TOGGLE_MENU_COLLAPSED, saveUiToStorage);
  yield takeEvery(fromUi.TOGGLE_DAPPS_DISPLAY, saveUiToStorage);
  yield takeEvery(fromUi.NAVIGATE, saveUiToStorage);
  yield takeEvery(fromUi.SET_BODY_DIMENSIONS, saveUiToStorage);
  yield takeEvery(fromUi.UPDATE_LANGUAGE, saveUiToStorage);
  yield takeEvery(fromUi.UPDATE_GCU, saveUiToStorage);
  yield takeEvery(fromUi.UPDATE_SHOW_ACCOUNT_CREATION_AT_STARTUP, saveUiToStorage);
};
