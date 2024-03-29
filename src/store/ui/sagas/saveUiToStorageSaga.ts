import { put, takeEvery, select } from 'redux-saga/effects';

import { browserUtils } from '/store/browser-utils';
import * as fromUi from '..';
import * as fromMain from '/store/main';
import { dispatchInMain } from '/interProcess';

function* saveUiToStorage() {
  const uiState: fromUi.State = yield select(fromUi.getUiState);

  const uiStateToSave = {
    menuCollapsed: uiState.menuCollapsed,
    devMode: uiState.devMode,
    tabsListDisplay: uiState.tabsListDisplay,
    navigationUrl: uiState.navigationUrl,
    language: uiState.language,
    gcu: uiState.gcu,
    whitelist: uiState.whitelist,
    platform: uiState.platform,
    showAccountCreationAtStartup: uiState.showAccountCreationAtStartup,
    isBalancesHidden: uiState.isBalancesHidden,
  };

  const dappsTabsWidth = 0;
  const menuWidth = 0;

  const x = menuWidth + dappsTabsWidth;
  const y = uiState.platform === 'darwin' ? 100 + 28 : 100;
  if (uiState.windowDimensions) {
    const browserViewsPosition = {
      x,
      y,
      width: uiState.windowDimensions[0] - x,
      height: uiState.windowDimensions[1] - 88,
    };

    dispatchInMain({
      type: '[MAIN] Update browser views position',
      payload: browserViewsPosition,
    });

    dispatchInMain({
      type: '[MAIN] Sync ui',
      payload: uiStateToSave,
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
}

export function* saveUiToStorageSaga() {
  yield takeEvery(fromUi.TOGGLE_MENU_COLLAPSED, saveUiToStorage);
  yield takeEvery(fromUi.TOGGLE_DAPPS_DISPLAY, saveUiToStorage);
  yield takeEvery(fromUi.NAVIGATE, saveUiToStorage);
  yield takeEvery(fromUi.SET_BODY_DIMENSIONS, saveUiToStorage);
  yield takeEvery(fromUi.UPDATE_LANGUAGE, saveUiToStorage);
  yield takeEvery(fromUi.UPDATE_GCU, saveUiToStorage);
  yield takeEvery(fromUi.UPDATE_PLATFORM, saveUiToStorage);
  yield takeEvery(fromUi.UPDATE_WHITELIST, saveUiToStorage);
  yield takeEvery(fromUi.UPDATE_SHOW_ACCOUNT_CREATION_AT_STARTUP, saveUiToStorage);
  yield takeEvery(fromUi.TOGGLE_BALANCES_VISIBILITY, saveUiToStorage);
}
