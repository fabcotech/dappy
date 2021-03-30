import * as fromReducer from './reducer';
import { NavigationUrl, Language } from '../../models';

export const UPDATE_UI_FROM_STORAGE = '[Ui] Update Ui from storage';
export const TOGGLE_MENU_COLLAPSED = '[Ui] Toggle menu colapsed';
export const TOGGLE_DAPPS_DISPLAY = '[Ui] Toggle dapps display';
export const NAVIGATE = '[Ui] Navigate';
export const SET_BODY_DIMENSIONS = '[Ui] Set body dimensions';
export const UPDATE_NAVIGATION_SUGGESTIONS_DISPLAY = '[Ui] Update navigation suggestions display';
export const UPDATE_LANGUAGE = '[Ui] Update language';
export const UPDATE_GCU = '[Ui] Update gcu';

export interface UpdateUiFromStoragePayload {
  uiState: fromReducer.State;
}
export const updateUiFromStorageAction = (values: UpdateUiFromStoragePayload) => ({
  type: UPDATE_UI_FROM_STORAGE,
  payload: values,
});

export const toggleMenuCollapsedAction = () => ({
  type: TOGGLE_MENU_COLLAPSED,
});

export interface NavigatePayload {
  navigationUrl: NavigationUrl;
}
export const navigateAction = (values: NavigatePayload) => ({
  type: NAVIGATE,
  payload: values,
});

export interface SetBodyDimensionsPayload {
  bodyDimensions: [number, number];
}
export const setBodyDimensionsAction = (values: SetBodyDimensionsPayload) => ({
  type: SET_BODY_DIMENSIONS,
  payload: values,
});

export interface UpdateNavigationSuggestinsDisplayPayload {
  navigationSUggestionsDisplayed: boolean;
}
export const updateNavigationSuggestinsDisplayAction = (values: UpdateNavigationSuggestinsDisplayPayload) => ({
  type: UPDATE_NAVIGATION_SUGGESTIONS_DISPLAY,
  payload: values,
});

export interface UpdateLanguagePayload {
  language: Language;
}
export const updateLanguageAction = (values: UpdateLanguagePayload) => ({
  type: UPDATE_LANGUAGE,
  payload: values,
});

export interface UpdateGcuPayload {
  gcu: string;
}
export const updateGcuAction = (values: UpdateGcuPayload) => ({
  type: UPDATE_GCU,
  payload: values,
});
