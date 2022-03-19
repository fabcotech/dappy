import * as fromReducer from './reducer';

export const UPDATE_MAIN_FROM_STORAGE = '[Main] Upate main from storage';
export const SAVE_ERROR = '[Main] Save error';
export const OPEN_MODAL = '[Main] Open modal';
export const CLOSE_MODAL = '[Main] Close modal';
export const OPEN_DAPP_MODAL = '[Main] Open dapp modal';
export const CLOSE_DAPP_MODAL = '[Main] Close dapp modal';
export const CLOSE_ALL_DAPP_MODALS = '[Main] Close all dapp modals';
export const UPDATE_INITIALIZATION_OVER = '[Main] Update initialization over';
export const DISPATCH_WHEN_INITIALIZATION_OVER = '[Main] Dispatch when initialization over';
export const UPDATE_LOAD_RESOURCE_WHEN_READY = '[Main] Update load resource when ready';

export interface UpdateMainFromStoragePayload {
  mainState: Partial<fromReducer.State>;
}
export const updateMainFromStorageAction = (values: UpdateMainFromStoragePayload) => ({
  type: UPDATE_MAIN_FROM_STORAGE,
  payload: values,
});
export interface SaveErrorPayload {
  errorCode: number;
  error: string;
  trace?: any;
}
export const saveErrorAction = (values: SaveErrorPayload) => ({
  type: SAVE_ERROR,
  payload: values,
});

export interface OpenModalPayload {
  parameters?: any;
  title: string;
  text: string;
  buttons: fromReducer.ModalButton[];
}
export const openModalAction = (values: OpenModalPayload) => ({
  type: OPEN_MODAL,
  payload: values,
});
export const closeModalAction = () => ({
  type: CLOSE_MODAL,
});

export interface OpenDappModalPayload extends OpenModalPayload {
  tabId: string;
}
export const openDappModalAction = (values: OpenDappModalPayload) => ({
  type: OPEN_DAPP_MODAL,
  payload: values,
});
export interface CloseDappModalPayload {
  tabId: string;
}
export const closeDappModalAction = (values: CloseDappModalPayload) => ({
  type: CLOSE_DAPP_MODAL,
  payload: values,
});

export const closeAllDappModalsAction = (values: CloseDappModalPayload) => ({
  type: CLOSE_ALL_DAPP_MODALS,
  payload: values,
});

export const updateInitializationOverAction = () => ({
  type: UPDATE_INITIALIZATION_OVER,
});

export interface DispatchWhenInitializationOverPayload {
  payload: { type: string; payload: any };
}
export const dispatchWhenInitializationOverAction = (payload: DispatchWhenInitializationOverPayload) => ({
  type: DISPATCH_WHEN_INITIALIZATION_OVER,
  payload: payload,
});

export interface UpdateLoasResourceWhenReadyPayload {
  loadResource: undefined | string;
}
export const updateLoadResourceWhenReadyAction = (values: UpdateLoasResourceWhenReadyPayload) => ({
  type: UPDATE_LOAD_RESOURCE_WHEN_READY,
  payload: values,
});
