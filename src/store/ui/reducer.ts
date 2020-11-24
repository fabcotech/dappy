import { createSelector } from 'reselect';

import * as fromActions from './actions';
import { Action } from '../';
import { NavigationUrl, Language } from '../../models';

export interface State {
  language: Language;
  menuCollapsed: boolean;
  devMode: boolean;
  dappsListDisplay: number;
  navigationUrl: NavigationUrl;
  windowDimensions: undefined | [number, number];
  navigationSuggestionsDisplayed: boolean;
}

export const initialState: State = {
  language: 'en',
  menuCollapsed: false,
  devMode: false,
  dappsListDisplay: 1,
  navigationUrl: '/',
  windowDimensions: undefined,
  navigationSuggestionsDisplayed: false,
};

export const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case fromActions.SET_BODY_DIMENSIONS: {
      const payload = action.payload as fromActions.SetBodyDimensionsPayload;

      return {
        ...state,
        windowDimensions: payload.bodyDimensions,
        devMode: payload.bodyDimensions[0] <= 769 ? true : state.devMode,
      };
    }
    case fromActions.UPDATE_UI_FROM_STORAGE: {
      const payload = action.payload as fromActions.UpdateUiFromStoragePayload;
      return {
        ...state,
        ...payload.uiState,
      };
    }

    case fromActions.TOGGLE_MENU_COLLAPSED: {
      return {
        ...state,
        menuCollapsed: !state.menuCollapsed,
      };
    }

    case fromActions.NAVIGATE: {
      const payload = action.payload as fromActions.NavigatePayload;

      let newDappsListDisplay = state.dappsListDisplay;
      if (payload.navigationUrl === '/dapps' && state.navigationUrl === '/dapps') {
        newDappsListDisplay += 1;
        if (newDappsListDisplay > 3) {
          newDappsListDisplay = 1;
        }
      }
      return {
        ...state,
        windowDimensions: state.windowDimensions,
        navigationUrl: payload.navigationUrl,
        dappsListDisplay: newDappsListDisplay,
      };
    }

    case fromActions.UPDATE_NAVIGATION_SUGGESTIONS_DISPLAY: {
      const payload: fromActions.UpdateNavigationSuggestinsDisplayPayload = action.payload;

      return {
        ...state,
        navigationSuggestionsDisplayed: payload.navigationSUggestionsDisplayed,
      };
    }

    case fromActions.UPDATE_LANGUAGE: {
      const payload: fromActions.UpdateLanguagePayload = action.payload;

      return {
        ...state,
        language: payload.language,
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getUiState = createSelector(
  state => state,
  (state: any) => state.ui
);

export const getLanguage = createSelector(getUiState, (state: State) => state.language);

export const getMenuCollapsed = createSelector(getUiState, (state: State) => state.menuCollapsed);

export const getDappsListDisplay = createSelector(getUiState, (state: State) => state.dappsListDisplay);

export const getDevMode = createSelector(getUiState, (state: State) => state.devMode);

export const getNavigationUrl = createSelector(getUiState, (state: State) => state.navigationUrl);

export const getBodyDimensions = createSelector(getUiState, (state: State) => state.windowDimensions);

export const getNavigationSuggestionsDisplayed = createSelector(
  getUiState,
  (state: State) => state.navigationSuggestionsDisplayed
);

export const getIsMobile = createSelector(getBodyDimensions, dimensions => !!(dimensions && dimensions[0] <= 769));

export const getIsTablet = createSelector(getBodyDimensions, dimensions => !!(dimensions && dimensions[0] <= 959));

export const getIsNavigationInSettings = createSelector(getNavigationUrl, navigationUrl =>
  navigationUrl.startsWith('/settings')
);

export const getIsNavigationInAccounts = createSelector(getNavigationUrl, navigationUrl =>
  navigationUrl.startsWith('/accounts')
);

export const getIsNavigationInDapps = createSelector(
  getNavigationUrl,
  navigationUrl => navigationUrl === '/' || navigationUrl.startsWith('/dapps')
);

export const getIsNavigationInDeploy = createSelector(getNavigationUrl, navigationUrl =>
  navigationUrl.startsWith('/deploy')
);

export const getIsNavigationInTransactions = createSelector(getNavigationUrl, navigationUrl =>
  navigationUrl.startsWith('/transactions')
);
