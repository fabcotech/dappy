import { createSelector } from 'reselect';
import { BeesLoadErrors, BeesLoadCompleted } from '@fabcotech/bees';

import { TransitoryState, Tab, Fav, LastLoadError } from '/models';
import * as fromActions from './actions';
import { Action } from '..';
import { SetTabFavoritePayload } from './actions';

export interface State {
  search: string;
  searchError: undefined | { type: string; text?: string };
  searching: boolean;
  lastLoadErrors: { [tabId: string]: LastLoadError };
  loadStates: {
    [dappId: string]: {
      completed: BeesLoadCompleted;
      errors: BeesLoadErrors;
      pending: string[];
    };
  };
  tabs: Tab[];
  favs: Fav[];
  tabsFocusOrder: string[];
  transitoryStates: { [resourceId: string]: TransitoryState };
  errors: { errorCode: number; error: string; trace?: string }[];
}

export const initialState: State = {
  search: '',
  searchError: undefined,
  searching: false,
  lastLoadErrors: {},
  loadStates: {},
  tabs: [],
  favs: [],
  tabsFocusOrder: [],
  transitoryStates: {},
  errors: [],
};

export const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case fromActions.UPDATE_TABS_FROM_STORAGE: {
      const payload = action.payload as fromActions.UpdatTabsFromStoragePayload;

      return {
        ...state,
        tabs: payload.tabs.map((t) => ({
          ...t,
          active: false,
          error: undefined,
        })),
      };
    }

    case fromActions.UPDATE_FAVS_FROM_STORAGE: {
      const payload = action.payload as fromActions.UpdatFavsFromStoragePayload;

      return {
        ...state,
        favs: payload.favs,
      };
    }

    case fromActions.UPDATE_TAB_CAN_GO: {
      const payload = action.payload as fromActions.UpdateTabCanGoPayload;

      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id === payload.tabId) {
            return {
              ...t,
              canGoBackward: payload.canGoBackward,
              canGoForward: payload.canGoForward,
            };
          }
          return t;
        }),
      };
    }

    case fromActions.CLEAR_LOAD_ERROR: {
      const { payload } = action;

      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id === payload.tabId) {
            return {
              ...t,
              lastError: undefined,
            };
          }
          return t;
        }),
      };
    }

    case fromActions.INIT_TRANSITORY_STATE_AND_RESET_LOAD_ERROR: {
      const { payload } = action;

      let newLastLoadErrors = state.lastLoadErrors;
      if (payload.tabId) {
        newLastLoadErrors = { ...state.lastLoadErrors };
        delete newLastLoadErrors[payload.tabId];
      }

      return {
        ...state,
        transitoryStates: {
          [payload.tabId]: 'loading',
        },
        lastLoadErrors: newLastLoadErrors,
      };
    }

    case fromActions.UPDATE_LOAD_STATE: {
      const { payload } = action;

      return {
        ...state,
        loadStates: {
          ...state.loadStates,
          [payload.resourceId]: payload.loadState,
        },
      };
    }

    case fromActions.LOAD_RESOURCE_FAILED: {
      const { payload } = action;

      const tab = state.tabs.find((t) => t.id === payload.tabId);
      // tab has been closed
      if (!tab) {
        return {
          ...state,
          lastLoadErrors: {
            ...state.lastLoadErrors,
            [payload.tabId]: { url: payload.url, error: payload.error },
          },
          errors: state.errors.concat(action.payload),
        };
      }

      const newTransitoryStates = { ...state.transitoryStates };
      delete newTransitoryStates[tab.id];

      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id === payload.tabId) {
            return {
              ...t,
              img: undefined,
              title: '',
              lastError: { url: payload.url, error: payload.error },
            };
          }
          return t;
        }),
        lastLoadErrors: {
          ...state.lastLoadErrors,
          [payload.tabId]: { url: payload.url, error: payload.error },
        },
        transitoryStates: newTransitoryStates,
        errors: state.errors.concat(action.payload),
      };
    }

    case fromActions.FOCUS_TAB: {
      const { payload } = action;
      if (!state.tabs.find((d) => d.id === payload.tabId)) {
        return state;
      }

      const newDappsFocusOrder = state.tabsFocusOrder
        .filter((id) => id !== payload.tabId)
        .concat(payload.tabId);

      return {
        ...state,
        tabsFocusOrder: newDappsFocusOrder,
      };
    }

    case fromActions.FOCUS_AND_ACTIVATE_TAB: {
      const payload = action.payload as fromActions.FocusAndActivateTabPayload;
      const tab = state.tabs.find((d) => d.id === payload.tabId);
      if (!tab) {
        console.error(`tab ${payload.tabId} should exist`);
        return state;
      }

      const newDappsFocusOrder = state.tabsFocusOrder
        .filter((id) => id !== payload.tabId)
        .concat(payload.tabId);
      const newTabs = state.tabs.map((t) => {
        if (t.id === payload.tabId) {
          return {
            ...t,
            active: true,
            url: payload.url,
          };
        }
        return t;
      });

      return {
        ...state,
        tabsFocusOrder: newDappsFocusOrder,
        tabs: newTabs,
      };
    }

    case fromActions.UPDATE_TAB_SEARCH: {
      const payload = action.payload as fromActions.UpdateTabSearchPayload;

      return {
        ...state,
        tabs: state.tabs.map((tab, i) => {
          if (tab.id === payload.tabId) {
            return {
              ...tab,
              url: payload.url,
            };
          }
          return tab;
        }),
      };
    }
    case fromActions.CREATE_TAB: {
      const payload = action.payload as fromActions.CreateTabPayload;

      const newDappsFocusOrder = state.tabsFocusOrder.concat(payload.tabId);
      return {
        ...state,
        tabs: state.tabs
          .concat({
            id: payload.tabId,
            url: payload.url,
            title: payload.url,
            img: undefined,
            active: true,
            muted: false,
            index: state.tabs.length,
            favorite: false,
            lastError: undefined,
            data: {
              publicKey: undefined,
              chainId: undefined,
            },
          })
          .map((t, i) => ({
            ...t,
            index: i,
          })),
        tabsFocusOrder: newDappsFocusOrder,
      };
    }

    case fromActions.DID_CHANGE_FAVICON: {
      const payload: fromActions.DidChangeFaviconPayload = action.payload;

      const tab = state.tabs.find((t) => t.id === payload.tabId);
      const newFavs = state.favs.map((f) => {
        try {
          if (tab && new URL(f.url).hostname === new URL(tab.url).host) {
            f.img = payload.img;
          }
        } catch (err) {
          console.log(err);
        }
        return f;
      });

      return {
        ...state,
        favs: newFavs,
        tabs: state.tabs.map((t) => {
          if (t.id === payload.tabId) {
            return {
              ...t,
              img: payload.img,
            };
          }
          return t;
        }),
      };
    }

    case fromActions.REMOVE_TAB_COMPLETED: {
      const payload: fromActions.RemoveTabPayload = action.payload;

      const newTransitoryStates = { ...state.transitoryStates };
      delete newTransitoryStates[payload.tabId];

      const newTabsFocusOrder = state.tabsFocusOrder.filter((id) => id !== payload.tabId);

      return {
        ...state,
        tabs: state.tabs
          .filter((dio) => dio.id !== payload.tabId)
          .map((dio, i) => ({ ...dio, index: i })),
        tabsFocusOrder: newTabsFocusOrder,
        transitoryStates: newTransitoryStates,
      };
    }

    case fromActions.REMOVE_FAV_COMPLETED: {
      const { payload } = action;

      return {
        ...state,
        favs: state.favs
          .filter((fav) => fav.id !== payload.tabId)
          .map((fav, i) => ({ ...fav, index: i })),
      };
    }

    case fromActions.UNFOCUS_ALL_TABS: {
      return {
        ...state,
        tabsFocusOrder: [],
      };
    }

    case fromActions.LAUNCH_TAB_COMPLETED: {
      const { payload } = action;

      const newLastLoadErrors = { ...state.lastLoadErrors };
      delete newLastLoadErrors[payload.tab.id];

      return {
        ...state,
        tabs: state.tabs.map((tab, i) => {
          if (tab.id === payload.tab.id) {
            return {
              ...payload.tab,
            };
            return payload.tab;
          }
          return tab;
        }),
      };
    }

    case fromActions.UPDATE_TRANSITORY_STATE: {
      const { payload } = action;

      if (!state.transitoryStates[payload.tabId]) {
        if (payload.transitoryState) {
          return {
            ...state,
            transitoryStates: {
              ...state.transitoryStates,
              [payload.tabId]: payload.transitoryState,
            },
          };
        }
        return state;
      }

      let newTransitoryStates = state.transitoryStates;
      if (!payload.transitoryState) {
        newTransitoryStates = { ...state.transitoryStates };
        delete newTransitoryStates[payload.tabId];
      } else {
        newTransitoryStates = { ...state.transitoryStates };
        newTransitoryStates[payload.tabId] = payload.transitoryState;
      }

      return {
        ...state,
        transitoryStates: newTransitoryStates,
        tabs: state.tabs.map((t) => {
          if (t.id === payload.tabId) {
            return {
              ...t,
              lastError: undefined,
            };
          }
          return t;
        }),
      };
    }

    case fromActions.CREATE_FAV: {
      const payload: SetTabFavoritePayload = action.payload;

      return {
        ...state,
        favs: state.favs.concat(payload.fav),
      };
    }

    case fromActions.SET_TAB_MUTED: {
      const { payload } = action;

      return {
        ...state,
        tabs: state.tabs.map((tab: Tab) => {
          if (tab.id === payload.tabId) {
            return {
              ...tab,
              muted: payload.muted,
            };
          }
          return tab;
        }),
      };
    }

    case fromActions.UPDATE_TAB_URL_AND_TITLE: {
      const { payload } = action;
      return {
        ...state,
        tabs: state.tabs.map((tab: Tab) => {
          if (tab.id === payload.tabId) {
            return {
              ...tab,
              title: payload.title,
              url: payload.url,
            };
          }
          return tab;
        }),
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getDappsState = createSelector(
  (state) => state,
  (state: any) => state.dapps
);

export const getSearch = createSelector(getDappsState, (state: State) => state.search);
export const getSearchError = createSelector(getDappsState, (state: State) => state.searchError);
export const getSearching = createSelector(getDappsState, (state: State) => state.searching);
export const getLastLoadErrors = createSelector(
  getDappsState,
  (state: State) => state.lastLoadErrors
);
export const getLoadStates = createSelector(getDappsState, (state: State) => state.loadStates);
export const getTabsFocusOrder = createSelector(
  getDappsState,
  (state: State) => state.tabsFocusOrder
);
export const getTabs = createSelector(getDappsState, (state: State) => state.tabs);
export const getFavs = createSelector(getDappsState, (state: State) => state.favs);
export const getDappsTransitoryStates = createSelector(
  getDappsState,
  (state: State) => state.transitoryStates
);

// COMBINED SELECTORS

export const getFocusedTabId = createSelector(
  getTabsFocusOrder,
  (tabsFocusOrder) => tabsFocusOrder[tabsFocusOrder.length - 1]
);

export const getSearchTransitoryState = createSelector(
  getSearch,
  getDappsTransitoryStates,
  (search, transitoryStates): undefined | TransitoryState => transitoryStates[search]
);

export const getActiveTabs = createSelector(getTabs, (tabs) => {
  const activeTabs: { [tabId: string]: Tab } = {};
  tabs.forEach((t) => {
    if (t.active) {
      activeTabs[t.id] = t;
    }
  });

  return activeTabs;
});

/*
  Returns tab if it is active, meaning
  no .lastError and no transitory state
*/
export const getActiveTab = createSelector(
  getFocusedTabId,
  getTabs,
  getDappsTransitoryStates,
  (focusedTabId, tabs, transitoryStates): Tab | undefined => {
    const tab = tabs.find((t) => t.id === focusedTabId);
    if (!tab) {
      return undefined;
    }
    if (!transitoryStates[tab.id] && !tab.lastError) {
      return tab;
    }

    return undefined;
  }
);

export const getActiveTabHostname = createSelector(getActiveTab, (tab): string | undefined => {
  if (!tab) {
    return undefined;
  }

  return new URL(tab.url).hostname;
});
