import { createSelector } from 'reselect';

import {
  Dapp,
  TransitoryState,
  LoadCompleted,
  LoadErrors,
  Tab,
  LastLoadError,
  Identification,
  LoadedFile,
  IpApp,
} from '../../models';
import * as fromActions from './actions';
import * as fromHistory from '../history';
import { Action } from '../';
import { splitSearch } from '../../utils/splitSearch';
import { searchToAddress } from '../../utils/searchToAddress';

export interface State {
  search: string;
  searchError: undefined | { type: string; text?: string };
  searching: boolean;
  lastLoadErrors: { [tabId: string]: LastLoadError };
  loadStates: {
    [dappId: string]: {
      completed: LoadCompleted;
      errors: LoadErrors;
      pending: string[];
    };
  };
  dapps: { [dappId: string]: Dapp };
  loadedFiles: { [fileId: string]: LoadedFile };
  ipApps: { [appId: string]: IpApp };
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
  dapps: {},
  loadedFiles: {},
  ipApps: {},
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
        })),
      };
    }

    case fromActions.UPDATE_SEARCH: {
      const search: string = action.payload;

      return {
        ...state,
        search: search,
      };
    }

    case fromActions.CLEAR_SEARCH_AND_LOAD_ERROR: {
      const payload: fromActions.ClearSearchAndLoadErrorPayload = action.payload;

      const newLastLoadErrors = { ...state.lastLoadErrors };
      delete newLastLoadErrors[payload.tabId];

      return {
        ...state,
        lastLoadErrors: newLastLoadErrors,
        search: payload.clearSearch ? '' : state.search,
      };
    }

    case fromActions.INIT_TRANSITORY_STATE_AND_RESET_LOAD_ERROR: {
      const payload: fromActions.InitTransitoryStateAndResetLoadErrorPayload = action.payload;

      let newLastLoadErrors = state.lastLoadErrors;
      if (payload.tabId) {
        newLastLoadErrors = { ...state.lastLoadErrors };
        delete newLastLoadErrors[payload.tabId];
      }

      return {
        ...state,
        transitoryStates: {
          [payload.resourceId]: 'loading',
        },
        lastLoadErrors: newLastLoadErrors,
      };
    }

    case fromActions.UPDATE_LOAD_STATE: {
      const payload: fromActions.UpdateLoadStatePayload = action.payload;

      return {
        ...state,
        loadStates: {
          ...state.loadStates,
          [payload.resourceId]: payload.loadState,
        },
      };
    }

    case fromActions.LOAD_RESOURCE_FAILED: {
      const payload: fromActions.LoadResourceFailedPayload = action.payload;

      const tab = state.tabs.find((t) => t.id === payload.tabId);
      // tab has been closed
      if (!tab) {
        return {
          ...state,
          lastLoadErrors: {
            ...state.lastLoadErrors,
            [payload.tabId]: { search: payload.search, error: payload.error },
          },
          errors: state.errors.concat(action.payload),
        };
      }

      const newTransitoryStates = { ...state.transitoryStates };
      delete newTransitoryStates[tab.resourceId];

      const newDapps = { ...state.dapps };
      delete newDapps[tab.resourceId];

      return {
        ...state,
        lastLoadErrors: {
          ...state.lastLoadErrors,
          [payload.tabId]: { search: payload.search, error: payload.error },
        },
        transitoryStates: newTransitoryStates,
        errors: state.errors.concat(action.payload),
        dapps: newDapps,
      };
    }

    case fromActions.FOCUS_TAB: {
      const payload: fromActions.FocusTabPayload = action.payload;
      if (!state.tabs.find((d) => d.id === payload.tabId)) {
        return state;
      }

      let newDappsFocusOrder = state.tabsFocusOrder.filter((id) => id !== payload.tabId).concat(payload.tabId);

      return {
        ...state,
        tabsFocusOrder: newDappsFocusOrder,
      };
    }

    case fromActions.FOCUS_AND_ACTIVATE_TAB: {
      const payload = action.payload as fromActions.FocusAndActivateTabPayload;
      let tab = state.tabs.find((d) => d.id === payload.tabId);
      if (!tab) {
        console.error('tab ' + payload.tabId + ' should exist');
        return state;
      }

      const newDappsFocusOrder = state.tabsFocusOrder.filter((id) => id !== payload.tabId).concat(payload.tabId);
      const newTabs = state.tabs.map((t) => {
        if (t.id === payload.tabId) {
          return {
            ...t,
            active: true,
            resourceId: payload.resourceId,
            address: payload.address,
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
              address: payload.search,
            };
          } else {
            return tab;
          }
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
            resourceId: payload.resourceId,
            address: payload.search,
            title: payload.resourceId,
            img: undefined,
            active: true,
            muted: false,
            index: state.tabs.length,
            counter: 0,
          })
          .map((dio, i) => ({
            ...dio,
            index: i,
          })),
        tabsFocusOrder: newDappsFocusOrder,
      };
    }

    case fromActions.LAUNCH_DAPP_COMPLETED: {
      const payload: fromActions.LaunchDappCompletedPayload = action.payload;
      const dapp = payload.dapp;

      const newTransitoryStates = { ...state.transitoryStates };
      delete newTransitoryStates[dapp.id];

      const newLastLoadErrors = { ...state.lastLoadErrors };
      delete newLastLoadErrors[dapp.id];

      let newState = {
        ...state,
        search: '',
        dapps: {
          ...state.dapps,
          [dapp.id]: dapp,
        },
        transitoryStates: newTransitoryStates,
        lastLoadErrors: newLastLoadErrors,
      };

      newState = {
        ...newState,
        tabs: state.tabs.map((tab, i) => {
          if (tab.id === dapp.tabId) {
            return {
              ...tab,
              active: tab.active || tab.id === dapp.id,
              title: dapp.title,
              img: dapp.img,
              index: i,
            };
          } else {
            return tab;
          }
        }),
      };

      return newState;
    }

    case fromActions.LAUNCH_FILE_COMPLETED: {
      const payload: fromActions.LaunchFileCompletedPayload = action.payload;
      const file = payload.file;

      const newTransitoryStates = { ...state.transitoryStates };
      delete newTransitoryStates[file.id];

      const newLastLoadErrors = { ...state.lastLoadErrors };
      delete newLastLoadErrors[file.id];

      return {
        ...state,
        loadedFiles: {
          ...state.loadedFiles,
          [file.id]: file,
        },
        transitoryStates: newTransitoryStates,
        lastLoadErrors: newLastLoadErrors,
        tabs: state.tabs.map((tab, i) => {
          if (tab.id === payload.tabId) {
            return {
              ...tab,
              active: tab.active,
              title: file.name,
              img: undefined,
              index: i,
            };
          } else {
            return tab;
          }
        }),
      };
    }

    case fromActions.STOP_TAB: {
      const payload = action.payload as fromActions.StopTabPayload;

      const tab = state.tabs.find((t) => t.id === payload.tabId);
      if (!tab) {
        console.error('tab ' + payload.tabId + ' should exist');
        return state;
      }

      const resourceId = tab.resourceId;

      const newTabs = state.tabs.map((t) => {
        if (t.id === payload.tabId) {
          return {
            ...t,
            active: false,
          };
        } else {
          return t;
        }
      });

      let newDapps = state.dapps;
      if (newDapps[resourceId]) {
        newDapps = { ...state.dapps };
        delete newDapps[resourceId];
      }

      let newLoadedFiles = state.loadedFiles;
      if (newLoadedFiles[resourceId]) {
        newLoadedFiles = { ...state.loadedFiles };
        delete newLoadedFiles[resourceId];
      }

      let newIpApps = state.ipApps;
      if (newIpApps[resourceId]) {
        newIpApps = { ...state.ipApps };
        delete newIpApps[resourceId];
      }

      const newTransitoryStates = { ...state.transitoryStates };
      delete newTransitoryStates[tab.resourceId];

      const newDappsFocusOrder = state.tabsFocusOrder.filter((id) => id !== payload.tabId);

      return {
        ...state,
        ipApps: newIpApps,
        loadedFiles: newLoadedFiles,
        dapps: newDapps,
        tabsFocusOrder: newDappsFocusOrder,
        transitoryStates: newTransitoryStates,
        tabs: newTabs,
      };
    }

    case fromActions.UPDATE_RESOURCE_ADDRESS: {
      const payload: fromActions.UpdateResourceAddressPayload = action.payload;
      const tab = state.tabs.find(t => t.id === payload.tabId);
      if (!tab) {
        console.log('did not find tab ')
        return state;
      }
      if (state.dapps[tab.resourceId]) {
        const dapp = state.dapps[tab.resourceId];
        const newDapps = {
          ...state.dapps,
          [dapp.id]: {
            ...dapp,
            search: payload.searchSplitted.search,
            chainId: payload.searchSplitted.chainId,
            path: payload.searchSplitted.path,
          }
        }
        return {
          ...state,
          dapps: newDapps
        }
      } else if (state.ipApps[tab.resourceId]) {
        const ipApp = state.ipApps[tab.resourceId];
        const newIpApps = {
          ...state.ipApps,
          [ipApp.id]: {
            ...ipApp,
            search: payload.searchSplitted.search,
            chainId: payload.searchSplitted.chainId,
            path: payload.searchSplitted.path,
          }
        }
        return {
          ...state,
          ipApps: newIpApps
        }
      } else {
        // ignore loadedFiles
        return state;
      }
    }
    case fromActions.REMOVE_TAB_COMPLETED: {
      const payload: fromActions.RemoveTabCompletedPayload = action.payload;
      const resourceId = payload.resourceId;

      const tabsWithSameDappId = state.tabs.filter((t) => t.resourceId === payload.resourceId).length;
      if (tabsWithSameDappId === 1) {
        let newDapps = state.dapps;
        if (resourceId) {
          newDapps = { ...state.dapps };
          delete newDapps[resourceId];
        }

        let searchError = state.searchError;
        if (searchError && searchError.text === resourceId) {
          searchError = undefined;
        }

        return {
          ...state,
          dapps: newDapps,
          searchError: searchError,
          tabs: state.tabs.filter((dio) => dio.id !== payload.tabId).map((dio, i) => ({ ...dio, index: i })),
        };
      } else {
        return {
          ...state,
          tabs: state.tabs.filter((dio) => dio.id !== payload.tabId).map((dio, i) => ({ ...dio, index: i })),
        };
      }
    }

    case fromActions.FOCUS_SEARCH_DAPP: {
      return {
        ...state,
        tabsFocusOrder: state.tabsFocusOrder.filter((d) => d !== 'search').concat('search'),
      };
    }

    case fromActions.SAVE_IDENTIFICATION: {
      const payload: fromActions.SaveIdentificationPayload = action.payload;

      let dappIdentifications = state.identifications[payload.dappId];
      if (!dappIdentifications) {
        dappIdentifications = {};
      }

      return {
        ...state,
        identifications: {
          ...state.identifications,
          [payload.dappId]: {
            ...dappIdentifications,
            [payload.callId]: payload.identification,
          },
        },
      };
    }

    case fromActions.LAUNCH_IP_APP_COMPLETED: {
      const payload: fromActions.LaunchIpAppCompletedPayload = action.payload;
      const ipApp = payload.ipApp;

      const newLastLoadErrors = { ...state.lastLoadErrors };
      delete newLastLoadErrors[ipApp.id];

      return {
        ...state,
        ipApps: {
          ...state.ipApps,
          [ipApp.id]: ipApp,
        },
        lastLoadErrors: newLastLoadErrors,
        tabs: state.tabs.map((tab, i) => {
          if (tab.id === payload.ipApp.tabId) {
            return {
              ...tab,
              active: tab.active,
              title: ipApp.name,
              img: undefined,
              index: i,
            };
          } else {
            return tab;
          }
        }),
      };
    }

    case fromActions.UPDATE_TRANSITORY_STATE: {
      const payload: fromActions.UpdateTransitoryStatePayload = action.payload;

      if (!state.transitoryStates[payload.resourceId]) {
        if (payload.transitoryState) {
          return {
            ...state,
            transitoryStates: {
              ...state.transitoryStates,
              [payload.resourceId]: payload.transitoryState,
            },
          };
        } else {
          return state;
        }
      }

      let newTransitoryStates = state.transitoryStates;
      if (!payload.transitoryState) {
        newTransitoryStates = { ...state.transitoryStates };
        delete newTransitoryStates[payload.resourceId];
      } else {
        newTransitoryStates = { ...state.transitoryStates };
        newTransitoryStates[payload.resourceId] = payload.transitoryState;
      }

      return {
        ...state,
        transitoryStates: newTransitoryStates,
      };
    }

    case fromActions.SET_TAB_MUTED: {
      const payload: fromActions.SetTabMutedPayload = action.payload;

      return {
        ...state,
        tabs: state.tabs.map((tab: Tab) => {
          if (tab.id === payload.tabId) {
            return {
              ...tab,
              muted: payload.muted,
            };
          } else {
            return tab;
          }
        }),
      };
    }

    // avoid cross references
    case '[History] Save preview': {
      const payload: fromHistory.SavePreviewPayload = action.payload;

      return {
        ...state,
        tabs: state.tabs.map((tab, i) => {
          if (tab.id === payload.tabId) {
            return {
              ...tab,
              title: payload.preview.title,
              address: payload.preview.search,
              img: payload.preview.img,
            };
          } else {
            return tab;
          }
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
export const getDapps = createSelector(getDappsState, (state: State) => state.dapps);
export const getTabsFocusOrder = createSelector(getDappsState, (state: State) => state.tabsFocusOrder);
export const getTabs = createSelector(getDappsState, (state: State) => state.tabs);
export const getDappsTransitoryStates = createSelector(getDappsState, (state: State) => state.transitoryStates);

export const getIdentifications = createSelector(getDappsState, (state: State) => state.identifications);

export const getLoadedFiles = createSelector(getDappsState, (state: State) => state.loadedFiles);

export const getIpApps = createSelector(getDappsState, (state: State) => state.ipApps);

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
  | { completed: LoadCompleted; errors: LoadErrors; pending: string[] } => (search ? loadStates[search] : undefined));

export const getActiveTabs = createSelector(getTabs, (tabs) => {
  const activeTabs: { [tabId: string]: Tab } = {};
  tabs.forEach((t) => {
    if (t.active) {
      activeTabs[t.id] = t;
    }
  });

  return activeTabs;
});

export const getActiveResource = createSelector(
  getFocusedTabId,
  getTabs,
  getDapps,
  getIpApps,
  getLoadedFiles,
  (focusedTabId, tabs, dapps, ipApps, loadedFiles): Dapp | IpApp | LoadedFile | undefined => {
    const tab = tabs.find((t) => t.id === focusedTabId);
    if (!tab) {
      return undefined;
    }

    if (dapps[tab.resourceId]) {
      return dapps[tab.resourceId];
    } else if (ipApps[tab.resourceId]) {
      return ipApps[tab.resourceId];
    } else if (loadedFiles[tab.resourceId]) {
      return loadedFiles[tab.resourceId];
    }

    return undefined;
  }
);
