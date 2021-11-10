import { createSelector } from 'reselect';

import * as fromActions from './actions';
import { Action } from '../';
import { State as StoreState } from '../';
import { NavigationUrl, Language } from '/models';
import { init } from '@sentry/browser';

export interface State {
  gcu: undefined | string;
  language: Language;
  menuCollapsed: boolean;
  devMode: boolean;
  tabsListDisplay: number;
  navigationUrl: NavigationUrl;
  windowDimensions: undefined | [number, number];
  navigationSuggestionsDisplayed: boolean;
  contractLogs: {
    [name: string]: string[];
  };
}

export const initialState: State = {
  gcu: undefined,
  language: 'en',
  menuCollapsed: false,
  devMode: false,
  tabsListDisplay: 1,
  navigationUrl: '/',
  windowDimensions: undefined,
  navigationSuggestionsDisplayed: false,
  contractLogs: {},
};

const onlyUnique = (value: string, index: number, self: string[]) => self.indexOf(value) === index;

export const updateContractLogsReducer = (state = initialState, action: Action) => {
  const { contract, logs }: fromActions.UpdateContractLogsPayload = action.payload;

  return {
    ...state,
    contractLogs: {
      ...state.contractLogs,
      [contract]: [...logs, ...(state.contractLogs[contract] || [])].filter(onlyUnique),
    },
  };
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

      let newTabsListDisplay = state.tabsListDisplay;
      if (payload.navigationUrl === '/dapps' && state.navigationUrl === '/dapps') {
        newTabsListDisplay += 1;
        if (newTabsListDisplay > 3) {
          newTabsListDisplay = 1;
        }
      }
      return {
        ...state,
        windowDimensions: state.windowDimensions,
        navigationUrl: payload.navigationUrl,
        tabsListDisplay: newTabsListDisplay,
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

    case fromActions.UPDATE_GCU: {
      const payload: fromActions.UpdateGcuPayload = action.payload;

      return {
        ...state,
        gcu: payload.gcu,
      };
    }

    case fromActions.UPDATE_CONTRACT_LOGS: {
      return updateContractLogsReducer(state, action);
    }
    default:
      return state;
  }
};

// SELECTORS

export const getUiState = (state: StoreState) => state.ui;

export const getLanguage = createSelector(getUiState, (state: State) => state.language);

export const getMenuCollapsed = createSelector(getUiState, (state: State) => state.menuCollapsed);

export const getTabsListDisplay = createSelector(getUiState, (state: State) => state.tabsListDisplay);

export const getDevMode = createSelector(getUiState, (state: State) => state.devMode);

export const getNavigationUrl = createSelector(getUiState, (state: State) => state.navigationUrl);

export const getGcu = createSelector(getUiState, (state: State) => state.gcu);

export const getBodyDimensions = createSelector(getUiState, (state: State) => state.windowDimensions);

export const getNavigationSuggestionsDisplayed = createSelector(
  getUiState,
  (state: State) => state.navigationSuggestionsDisplayed
);

export const getIsMobile = createSelector(getBodyDimensions, (dimensions) => !!(dimensions && dimensions[0] <= 769));

export const getIsTablet = createSelector(getBodyDimensions, (dimensions) => !!(dimensions && dimensions[0] <= 959));

export const getIsNavigationInSettings = createSelector(getNavigationUrl, (navigationUrl: string) =>
  navigationUrl.startsWith('/settings')
);

export const getIsNavigationInNames = createSelector(getNavigationUrl, (navigationUrl: string) =>
  navigationUrl.startsWith('/names')
);

export const getIsNavigationInAccounts = createSelector(getNavigationUrl, (navigationUrl: string) =>
  navigationUrl.startsWith('/accounts')
);

export const getIsNavigationInDapps = createSelector(
  getNavigationUrl,
  (navigationUrl: string) => navigationUrl === '/' || navigationUrl.startsWith('/dapps')
);

export const getIsNavigationInDeploy = createSelector(getNavigationUrl, (navigationUrl: string) =>
  navigationUrl.startsWith('/deploy')
);

export const getIsNavigationInTransactions = createSelector(getNavigationUrl, (navigationUrl: string) =>
  navigationUrl.startsWith('/transactions')
);

export const getContractLogs = createSelector(getUiState, (ui) => ui.contractLogs);
