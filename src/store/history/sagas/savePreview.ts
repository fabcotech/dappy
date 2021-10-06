import { put, takeEvery, select } from 'redux-saga/effects';

import * as fromHistory from '..';
import * as fromMain from '/store/main';
import * as fromDapps from '/store/dapps';
import { Action } from '/store/';
import { browserUtils } from '/store/browser-utils';
import { splitSearch } from '/utils/splitSearch';
import { Preview, Dapp, IpApp, LoadedFile, Tab } from '/models';

const savePreview = function* (action: Action) {
  const activeResource: Dapp | IpApp | LoadedFile | undefined = yield select(fromDapps.getActiveResource);
  const tabs: Tab[] = yield select(fromDapps.getTabs);

  let previewTitle = '';
  let previewImg = undefined;
  let previewSearch = '';
  let id = '';
  let tabId: undefined | string = undefined;

  if (action.type === fromHistory.DID_CHANGE_FAVICON) {
    const payload: fromHistory.DidChangeFaviconPayload = action.payload;
    const tab: undefined | Tab = tabs.find((t) => t.id === payload.tabId);
    const previews: { [search: string]: Preview } = yield select(fromHistory.getPreviews);

    if (!tab || !activeResource) {
      console.error('Unable to save previews to storage, did not find tab');
      return;
    }
    if (!previews[payload.previewId]) {
      return undefined;
    }
    previewTitle = previews[payload.previewId].title; // do not change
    previewSearch = previews[payload.previewId].search; // do not change
    previewImg = payload.img;
    id = payload.previewId;
    tabId = payload.tabId;
  } else if (action.type === fromDapps.LAUNCH_FILE_COMPLETED) {
    const payload: fromDapps.LaunchFileCompletedPayload = action.payload;
    previewTitle = payload.file.name;
    previewSearch = payload.file.search;
    id = previewSearch;
    tabId = payload.tabId;
  } else if (action.type === fromHistory.DID_NAVIGATE_IN_PAGE) {
    const payload: fromHistory.DidNavigateInPagePayload = action.payload;
    const tab: undefined | Tab = tabs.find((t) => t.id === payload.tabId);
    if (!tab || !activeResource) {
      console.error('Unable to save previews to storage, did not find tab');
      return;
    }
    yield put(
      fromDapps.updateResourceAction({
        tabId: payload.tabId,
        searchSplitted: splitSearch(payload.address),
      })
    );
    previewTitle = payload.title;
    previewImg = tab.img; // most of the time favicon is not loaded yet
    previewSearch = payload.address;
    id = payload.previewId;
    tabId = payload.tabId;
  } else if (action.type === fromHistory.UPDATE_PREVIEW) {
    const previews: {
      [search: string]: Preview;
    } = yield select(fromHistory.getPreviews);
    const payload: fromHistory.UpdatePreviewPayload = action.payload;
    const tab: undefined | Tab = tabs.find((t) => t.id === payload.tabId);
    if (!tab || !activeResource) {
      console.error('Unable to save previews to storage, did not find tab');
      return;
    }

    if (!previews[payload.previewId]) {
      return undefined;
    }
    previewTitle = payload.title || '';
    previewSearch = previews[payload.previewId].search; // do not change
    previewImg = previews[payload.previewId].img; // do not change
    id = payload.previewId;
    tabId = payload.tabId;
  }

  // always remove strange characters
  id = id.replace(/\W/g, '');

  const previewsToSave: { [search: string]: Preview } = {
    [id]: {
      id: id,
      title: previewTitle,
      img: previewImg,
      search: previewSearch,
    },
  };

  try {
    yield browserUtils.saveStorageIndexed('previews', previewsToSave);
    yield put(
      fromHistory.savePreviewAction({
        preview: previewsToSave[id],
        tabId: tabId as string,
      })
    );
  } catch (e) {
    yield put(
      fromMain.saveErrorAction({
        errorCode: 2045,
        error: 'Unable to save previews to storage',
        trace: e,
      })
    );
  }
};

export const savePreviewSaga = function* () {
  yield takeEvery(fromDapps.LAUNCH_FILE_COMPLETED, savePreview);
  yield takeEvery(fromHistory.DID_CHANGE_FAVICON, savePreview);
  yield takeEvery(fromHistory.DID_NAVIGATE_IN_PAGE, savePreview);
  yield takeEvery(fromHistory.UPDATE_PREVIEW, savePreview);
};
