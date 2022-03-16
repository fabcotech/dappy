import { Preview } from '../../models';

export const GO_FORWARD = '[History] Go forward';
export const GO_FORWARD_COMPLETED = '[History] Go forward completed';
export const GO_BACKWARD = '[History] Go backward';
export const GO_BACKWARD_COMPLETED = '[History] Go backward completed';

export const DID_NAVIGATE_IN_PAGE = '[History] Did navigate in page';
export const UPDATE_OR_CREATE_PREVIEW = '[History] Update or create preview';

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

export interface DidNavigateInPagePayload {
  previewId: string;
  url: string;
  tabId: string;
  title: string;
}
export const didNavigateInPageAction = (values: DidNavigateInPagePayload) => ({
  type: DID_NAVIGATE_IN_PAGE,
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
