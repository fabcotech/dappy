import { Preview } from '../../models';

export const UPDATE_PREVIEWS_FROM_STORAGE = '[History] Upate previews from storage';
export const GO_FORWARD = '[History] Go forward';
export const GO_FORWARD_COMPLETED = '[History] Go forward completed';
export const GO_BACKWARD = '[History] Go backward';
export const GO_BACKWARD_COMPLETED = '[History] Go backward completed';
export const SAVE_PREVIEW = '[History] Save preview';
export const UPDATE_PREVIEW = '[History] Update preview';

export const DID_CHANGE_FAVICON = '[History] Page favicon did update';
export const DID_NAVIGATE_IN_PAGE = '[History] Did navigate in page';
export const UPDATE_OR_CREATE_PREVIEW = '[History] Update or create preview';

export interface UpdatPreviewsFromStoragePayload {
  previews: Preview[];
}
export const updatPreviewsFromStorageAction = (values: UpdatPreviewsFromStoragePayload) => ({
  type: UPDATE_PREVIEWS_FROM_STORAGE,
  payload: values,
});

export interface GoForwardPayload {
  tabId: string;
}
export const goForwardAction = (values: GoForwardPayload) => ({
  type: GO_FORWARD,
  payload: values,
});
export const goForwardCompletedAction = (values: GoForwardPayload) => ({
  type: GO_FORWARD_COMPLETED,
  payload: values,
});

export interface GoBackwardPayload {
  tabId: string;
}
export const goBackwardAction = (values: GoBackwardPayload) => ({
  type: GO_BACKWARD,
  payload: values,
});
export const goBackwardCompletedAction = (values: GoBackwardPayload) => ({
  type: GO_BACKWARD_COMPLETED,
  payload: values,
});

export interface SavePreviewPayload {
  preview: Preview;
  tabId: string;
}
export const savePreviewAction = (values: SavePreviewPayload) => ({
  type: SAVE_PREVIEW,
  payload: values,
});

export interface UpdatePreviewPayload {
  previewId: string;
  tabId: string;
  title?: string;
  img?: string;
}
export const updatePreviewAction = (values: UpdatePreviewPayload) => ({
  type: UPDATE_PREVIEW,
  payload: values,
});

export interface DidNavigateInPagePayload {
  previewId: string;
  address: string;
  tabId: string;
  title: string;
}
export const didNavigateInPageAction = (values: DidNavigateInPagePayload) => ({
  type: DID_NAVIGATE_IN_PAGE,
  payload: values,
});

export interface DidChangeFaviconPayload {
  img: string;
  tabId: string;
  previewId: string;
}
export const didChangeFaviconAction = (values: DidChangeFaviconPayload) => ({
  type: DID_CHANGE_FAVICON,
  payload: values,
});

export interface UpdateOrCreatePreviewPayload {
  search: string;
  title: string;
  url?: string;
}
export const updateOrCreatePreviewAction = (values: UpdateOrCreatePreviewPayload) => ({
  type: UPDATE_OR_CREATE_PREVIEW,
  payload: values,
});
