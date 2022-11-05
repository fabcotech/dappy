import * as fromReducer from './reducer';
import { NavigationUrl, Language } from '/models';

export const UPDATE_UI_FROM_STORAGE = '[Ui] Update Ui from storage';
export const TOGGLE_MENU_COLLAPSED = '[Ui] Toggle menu colapsed';
export const TOGGLE_DAPPS_DISPLAY = '[Ui] Toggle dapps display';
export const NAVIGATE = '[Ui] Navigate';
export const SET_BODY_DIMENSIONS = '[Ui] Set body dimensions';
export const UPDATE_NAVIGATION_SUGGESTIONS_DISPLAY = '[Ui] Update navigation suggestions display';
export const UPDATE_LANGUAGE = '[Ui] Update language';
export const UPDATE_GCU = '[Ui] Update gcu';
export const UPDATE_SHOW_ACCOUNT_CREATION_AT_STARTUP =
  '[Ui] Update show account creation at startup';
export const TOGGLE_BALANCES_VISIBILITY = '[Ui] Toggle balance visibility';
export const UPDATE_PLATFORM = '[Ui] Update Platform';
export const UPDATE_WHITELIST = '[Ui] Update whitelist';

export interface UpdateUiFromStoragePayload {
  uiState: fromReducer.State;
}
export const updateUiFromStorageAction = (values: UpdateUiFromStoragePayload) => ({
  type: UPDATE_UI_FROM_STORAGE,
  payload: values,
});

export interface UpdatePlatform {
  platform: fromReducer.State['platform'];
}
export const updatePlatformAction = (values: UpdatePlatform) => ({
  type: UPDATE_PLATFORM,
  payload: values,
});

export interface UpdateWhitelist {
  whitelist: fromReducer.State['whitelist'];
}
export const updateWhitelistAction = (values: UpdateWhitelist) => ({
  type: UPDATE_WHITELIST,
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
export const updateNavigationSuggestinsDisplayAction = (
  values: UpdateNavigationSuggestinsDisplayPayload
) => ({
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

export interface UpdateContractLogsPayload {
  contract: string;
  logs: string[];
}

export interface UpdateShowAccountCreationAtStartupPayload {
  show: boolean;
}

export const updateShowAccountCreationAtStartup = (
  values: UpdateShowAccountCreationAtStartupPayload
) => ({
  type: UPDATE_SHOW_ACCOUNT_CREATION_AT_STARTUP,
  payload: values,
});

export const toggleBalanceVisibility = () => ({
  type: TOGGLE_BALANCES_VISIBILITY,
  payload: undefined,
});
