import { createSelector } from 'reselect';

import * as fromActions from './actions';
import {
  ACCESS_ACCOUNTS,
  ACCESS_SECURITY,
  ACCESS_SETTINGS,
  ACCESS_TRANSACTIONS,
  ACCESS_WHITELIST,
  parseWhitelist,
  getWhitelistArgument,
} from '/CONSTANTS';
import { Action } from '..';
import { NavigationUrl, Language } from '/models';

export interface State {
  gcu: undefined | string;
  platform: 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32' | undefined;
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
  showAccountCreationAtStartup: boolean;
  isBalancesHidden: boolean;
  whitelist: { host: string; topLevel: boolean; secondLevel: boolean }[];
}

export const initialState: State = {
  gcu: undefined,
  language: 'en',
  platform: undefined,
  menuCollapsed: false,
  devMode: false,
  tabsListDisplay: 1,
  navigationUrl: '/',
  windowDimensions: undefined,
  navigationSuggestionsDisplayed: false,
  contractLogs: {},
  showAccountCreationAtStartup: true,
  isBalancesHidden: false,
  whitelist: [{ host: '*', topLevel: true, secondLevel: true }],
};

export const updateShowAccountCreationAtStartupReducer = (action: Action, state = initialState) => {
  const { show }: fromActions.UpdateShowAccountCreationAtStartupPayload = action.payload;

  return {
    ...state,
    showAccountCreationAtStartup: show,
  };
};

export const toggleBalanceVisibilityReducer = (state = initialState) => {
  return {
    ...state,
    isBalancesHidden: !state.isBalancesHidden,
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

      const harcodedWhitelist = parseWhitelist(getWhitelistArgument(window.location.search));
      const whitelist = harcodedWhitelist || payload.uiState.whitelist;

      return {
        ...state,
        ...payload.uiState,
        whitelist: whitelist,
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

      if (payload.navigationUrl.startsWith('/settings') && !ACCESS_SETTINGS) {
        payload.navigationUrl = '/';
      }
      if (payload.navigationUrl === '/accounts' && !ACCESS_ACCOUNTS) payload.navigationUrl = '/';
      if (payload.navigationUrl.startsWith('/deploy')) payload.navigationUrl = '/';
      if (payload.navigationUrl === '/transactions' && !ACCESS_TRANSACTIONS) {
        payload.navigationUrl = '/';
      }
      if (payload.navigationUrl === '/whitelist' && !ACCESS_WHITELIST) payload.navigationUrl = '/';

      return {
        ...state,
        windowDimensions: state.windowDimensions,
        navigationUrl: payload.navigationUrl,
        tabsListDisplay: newTabsListDisplay,
      };
    }

    case fromActions.UPDATE_NAVIGATION_SUGGESTIONS_DISPLAY: {
      const { payload } = action;

      return {
        ...state,
        navigationSuggestionsDisplayed: payload.navigationSUggestionsDisplayed,
      };
    }

    case fromActions.UPDATE_PLATFORM: {
      const { payload } = action;

      return {
        ...state,
        platform: payload.platform,
      };
    }

    case fromActions.UPDATE_WHITELIST: {
      const { payload } = action;

      return {
        ...state,
        whitelist: payload.whitelist,
      };
    }

    case fromActions.UPDATE_LANGUAGE: {
      const { payload } = action;

      return {
        ...state,
        language: payload.language,
      };
    }

    case fromActions.UPDATE_GCU: {
      const { payload } = action;

      return {
        ...state,
        gcu: payload.gcu,
      };
    }

    case fromActions.UPDATE_SHOW_ACCOUNT_CREATION_AT_STARTUP: {
      return updateShowAccountCreationAtStartupReducer(action, state);
    }

    case fromActions.TOGGLE_BALANCES_VISIBILITY: {
      return toggleBalanceVisibilityReducer(state);
    }

    default:
      return state;
  }
};

// SELECTORS

export const getUiState = (state: any) => state.ui;

export const getLanguage = createSelector(getUiState, (state: State) => state.language);

export const getMenuCollapsed = createSelector(getUiState, (state: State) => state.menuCollapsed);

export const getTabsListDisplay = createSelector(
  getUiState,
  (state: State) => state.tabsListDisplay
);

export const getDevMode = createSelector(getUiState, (state: State) => state.devMode);

export const getPlatform = createSelector(getUiState, (state: State) => state.platform);

export const getWhitelist = createSelector(getUiState, (state: State) => state.whitelist);

export const getNavigationUrl = createSelector(getUiState, (state: State) => state.navigationUrl);

export const getGcu = createSelector(getUiState, (state: State) => state.gcu);

export const getBodyDimensions = createSelector(
  getUiState,
  (state: State) => state.windowDimensions
);

export const getNavigationSuggestionsDisplayed = createSelector(
  getUiState,
  (state: State) => state.navigationSuggestionsDisplayed
);

export const getIsMobile = createSelector(
  getBodyDimensions,
  (dimensions) => !!(dimensions && dimensions[0] <= 769)
);

export const getIsTablet = createSelector(
  getBodyDimensions,
  (dimensions) => !!(dimensions && dimensions[0] <= 959)
);

export const getIsNavigationInSettings = createSelector(getNavigationUrl, (navigationUrl: string) =>
  navigationUrl.startsWith('/settings')
);

export const getIsNavigationInAccounts = createSelector(getNavigationUrl, (navigationUrl: string) =>
  navigationUrl.startsWith('/accounts')
);

export const getIsNavigationInDapps = createSelector(
  getNavigationUrl,
  (navigationUrl: string) => navigationUrl === '/' || navigationUrl.startsWith('/dapps')
);

export const getIsNavigationInWhitelist = createSelector(
  getNavigationUrl,
  (navigationUrl: string) => navigationUrl.startsWith('/whitelist')
);

export const getIsNavigationInTransactions = createSelector(
  getNavigationUrl,
  (navigationUrl: string) => navigationUrl.startsWith('/transactions')
);

export const getContractLogs = createSelector(getUiState, (ui) => ui.contractLogs);

export const showAccountCreationAtStartup = createSelector(
  getUiState,
  (ui) => ui.showAccountCreationAtStartup
);

export const getIsBalancesHidden = createSelector(getUiState, (ui) => ui.isBalancesHidden);
