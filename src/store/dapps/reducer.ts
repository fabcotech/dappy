import { createSelector } from 'reselect';
import { BeesLoadErrors, BeesLoadCompleted } from '@fabcotech/bees';

import { TransitoryState, Tab, LastLoadError, Identification } from '/models';
import * as fromActions from './actions';
import { Action } from '..';

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
  tabsFocusOrder: string[];
  transitoryStates: { [resourceId: string]: TransitoryState };
  identifications: {
    [dappId: string]: {
      [callId: string]: Identification;
    };
  };
  errors: { errorCode: number; error: string; trace?: string }[];
}

export const initialState: State = {
  search: '',
  searchError: undefined,
  searching: false,
  lastLoadErrors: {},
  loadStates: {},
  tabs: [],
  tabsFocusOrder: [],
  transitoryStates: {},
  identifications: {},
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
          counter: 0,
          error: undefined,
        })),
      };
    }

    case fromActions.UPDATE_SEARCH: {
      const search: string = action.payload;

      return {
        ...state,
        search,
      };
    }

    case fromActions.CLEAR_SEARCH_AND_LOAD_ERROR: {
      const { payload } = action;

      return {
        ...state,
        tabs: state.tabs.map((t) => {
          if (t.id === payload.tabId) {
            return {
              ...t,
              lastError: undefined
            };
          }
          return t;
        }),
        search: payload.clearSearch ? '' : state.search,
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
              lastError: { url: payload.url, error: payload.error }
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

      const newDappsFocusOrder = state.tabsFocusOrder.filter((id) => id !== payload.tabId).concat(payload.tabId);

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

      const newDappsFocusOrder = state.tabsFocusOrder.filter((id) => id !== payload.tabId).concat(payload.tabId);
      const newTabs = state.tabs.map((t) => {
        if (t.id === payload.tabId) {
          return {
            ...t,
            active: true,
            url: payload.url,
            counter: t.counter + 1,
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
            counter: 0,
            favorite: false,
            lastError: undefined,
            data: {
              publicKey: undefined,
              chainId: undefined,
            }
          })
          .map((t, i) => ({
            ...t,
            index: i,
          })),
        tabsFocusOrder: newDappsFocusOrder,
      };
    }

    case fromActions.DID_CHANGE_FAVICON: {
      const { payload } = action;
       return {
        ...state,
        tabs: state.tabs.map((tab, i) => {
          if (tab.id === payload.tabId) {
            return {
              ...tab,
              img: payload.img,
            };
          }
            return tab;
        }),
      };
    }

    case fromActions.REMOVE_RESOURCE: {
      const payload = action.payload as fromActions.RemoveResourcePayload;

      const newTransitoryStates = { ...state.transitoryStates };
      delete newTransitoryStates[payload.tabId];

      return {
        ...state,
        transitoryStates: newTransitoryStates,
      };
    }

    case fromActions.STOP_TAB: {
      const payload = action.payload as fromActions.StopTabPayload;

      const tab = state.tabs.find((t) => t.id === payload.tabId);
      if (!tab) {
        console.error(`tab ${payload.tabId} should exist`);
        return state;
      }

      const newTabs = state.tabs.map((t) => {
        if (t.id === payload.tabId) {
          return {
            ...t,
            active: false,
          };
        }
          return t;
      });

      const newTransitoryStates = { ...state.transitoryStates };
      delete newTransitoryStates[tab.id];

      const newDappsFocusOrder = state.tabsFocusOrder.filter((id) => id !== payload.tabId);

      return {
        ...state,
        tabsFocusOrder: newDappsFocusOrder,
        transitoryStates: newTransitoryStates,
        tabs: newTabs,
      };
    }

    case fromActions.REMOVE_TAB_COMPLETED: {
      const { payload } = action;

      return {
        ...state,
        tabs: state.tabs.filter((dio) => dio.id !== payload.tabId).map((dio, i) => ({ ...dio, index: i })),
      };
    }

    case fromActions.FOCUS_SEARCH_DAPP: {
      return {
        ...state,
        tabsFocusOrder: state.tabsFocusOrder.filter((d) => d !== 'search').concat('search'),
      };
    }

    case fromActions.SAVE_IDENTIFICATION: {
      const { payload } = action;

      let dappIdentifications = state.identifications[payload.tabId];
      if (!dappIdentifications) {
        dappIdentifications = {};
      }

      return {
        ...state,
        identifications: {
          ...state.identifications,
          [payload.tabId]: {
            ...dappIdentifications,
            [payload.callId]: payload.identification,
          },
        },
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
              counter: payload.tab.counter + 1
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
              lastError: undefined
            };
          }
          return t;
        }),
      };
    }

    case fromActions.SET_TAB_FAVORITE: {
      const { payload } = action;

      return {
        ...state,
        tabs: state.tabs.map((tab: Tab) => {
          if (tab.id === payload.tabId) {
            return {
              ...tab,
              favorite: payload.favorite,
            };
          }
            return tab;
        }),
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
export const getLastLoadErrors = createSelector(getDappsState, (state: State) => state.lastLoadErrors);
export const getLoadStates = createSelector(getDappsState, (state: State) => state.loadStates);
export const getTabsFocusOrder = createSelector(getDappsState, (state: State) => state.tabsFocusOrder);
export const getTabs = createSelector(getDappsState, (state: State) => state.tabs);
export const getDappsTransitoryStates = createSelector(getDappsState, (state: State) => state.transitoryStates);

export const getIdentifications = createSelector(getDappsState, (state: State) => state.identifications);

// COMBINED SELECTORS

export const getIsSearchFocused = createSelector(
  getTabsFocusOrder,
  (tabsFocusOrder) => tabsFocusOrder[tabsFocusOrder.length - 1] === 'search'
);

export const getTabsFocusOrderWithoutSearch = createSelector(getTabsFocusOrder, (tabsFocusOrder) =>
  tabsFocusOrder.filter((d) => d !== 'search')
);

export const getFocusedTabId = createSelector(
  getTabsFocusOrderWithoutSearch,
  (tabsFocusOrder) => tabsFocusOrder[tabsFocusOrder.length - 1]
);

export const getSearchTransitoryState = createSelector(
  getSearch,
  getDappsTransitoryStates,
  (search, transitoryStates): undefined | TransitoryState => transitoryStates[search]
);

export const getSearchLoadStates = createSelector(getSearch, getLoadStates, (search, loadStates):
  | undefined
  | { completed: BeesLoadCompleted; errors: BeesLoadErrors; pending: string[] } =>
  (search ? loadStates[search] : undefined)
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
