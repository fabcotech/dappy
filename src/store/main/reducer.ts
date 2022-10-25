import { createSelector } from 'reselect';

import * as fromDapps from '../dapps';
import * as fromUi from '../ui';
import * as fromActions from './actions';
import { Action } from '..';
import { VERSION } from '/CONSTANTS';

export interface ModalButton {
  classNames: string;
  text: string;
  action?: { type: string; payload?: any } | { type: string; payload?: any }[];
}

export interface Modal {
  tabId?: string;
  parameters?: any;
  title: string;
  text: string;
  buttons: ModalButton[];
}

export interface State {
  currentVersion: undefined | string;
  isBeta: boolean;
  versionAwaitingUpdate: undefined | string;
  errors: { errorCode: number; error: string; trace?: string }[];
  modals: Modal[];
  dappModals: {
    [resourceId: string]: Modal[];
  };
  initializationOver: boolean;
  dispatchWhenInitializationOver: fromActions.DispatchWhenInitializationOverPayload['payload'][];
  loadResourceWhenReady: undefined | string;
}

export const initialState: State = {
  currentVersion: VERSION,
  isBeta: false,
  versionAwaitingUpdate: undefined,
  errors: [],
  modals: [],
  dappModals: {},
  initializationOver: false,
  dispatchWhenInitializationOver: [],
  loadResourceWhenReady: undefined,
};

export const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case fromActions.UPDATE_MAIN_FROM_STORAGE: {
      const payload = action.payload as fromActions.UpdateMainFromStoragePayload;
      return {
        ...state,
        ...payload.mainState,
      };
    }

    case fromActions.SAVE_ERROR: {
      return {
        ...state,
        errors: state.errors.concat(action.payload),
      };
    }

    case fromActions.OPEN_MODAL: {
      const { payload } = action;

      return {
        ...state,
        modals: state.modals.concat(payload),
      };
    }

    case fromActions.CLOSE_MODAL: {
      return {
        ...state,
        modals: state.modals.slice(1).concat([]),
      };
    }

    case fromActions.OPEN_DAPP_MODAL: {
      const { payload } = action;

      let dappModalsState: Modal[] = state.dappModals[payload.tabId];
      if (!dappModalsState) {
        dappModalsState = [];
      }

      // if the IP / DA button is re-clicked, simply toggle the modal (remove it)
      if (
        payload.title === 'LOAD_INFO_MODAL' &&
        dappModalsState &&
        dappModalsState[0] &&
        dappModalsState[0].title === 'LOAD_INFO_MODAL'
      ) {
        return {
          ...state,
          dappModals: {
            ...state.dappModals,
            [payload.tabId]: dappModalsState.slice(1).concat([]),
          },
        };
      }

      return {
        ...state,
        dappModals: {
          ...state.dappModals,
          [payload.tabId]: dappModalsState.concat(payload),
        },
      };
    }

    case fromActions.CLOSE_DAPP_MODAL: {
      const { payload } = action;

      const dappModalsState: Modal[] = state.dappModals[payload.tabId];

      return {
        ...state,
        dappModals: {
          ...state.dappModals,
          [payload.tabId]: dappModalsState.slice(1).concat([]),
        },
      };
    }

    case fromActions.CLOSE_ALL_DAPP_MODALS: {
      const { payload } = action;

      const newDappModals = state.dappModals;
      delete newDappModals[payload.tabId];

      return {
        ...state,
        dappModals: newDappModals,
      };
    }

    case fromDapps.STOP_TAB: {
      const { payload } = action;

      // ugly, I know, should we include dappId in the payload ?
      const dappModalsToRemove = Object.keys(state.dappModals).filter((tabId) => tabId.includes(payload.tabId));
      const newDappModals = { ...state.dappModals };

      dappModalsToRemove.forEach((tabId) => {
        delete newDappModals[tabId];
      });

      return {
        ...state,
        dappModals: newDappModals,
      };
    }

    case fromActions.UPDATE_INITIALIZATION_OVER: {
      return {
        ...state,
        initializationOver: true,
      };
    }

    case fromActions.DISPATCH_WHEN_INITIALIZATION_OVER: {
      const { payload } = action;
      return {
        ...state,
        dispatchWhenInitializationOver: state.dispatchWhenInitializationOver.concat(payload.payload),
      };
    }

    case fromActions.UPDATE_LOAD_RESOURCE_WHEN_READY: {
      const { payload } = action;

      return {
        ...state,
        loadResourceWhenReady: payload.loadResource,
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getMainState = createSelector(
  (state) => state,
  (state: any) => state.main
);

export const getErrors = createSelector(getMainState, (state: State) => state.errors);
export const getModal = createSelector(getMainState, (state: State) => state.modals[0]);
export const getDappModals = createSelector(getMainState, (state: State) => state.dappModals);
export const getCurrentVersion = createSelector(getMainState, (state: State) => state.currentVersion);
export const getIsBeta = createSelector(getMainState, (state: State) => state.isBeta);
export const getInitializationOver = createSelector(getMainState, (state: State) => state.initializationOver);
export const getDispatchWhenInitializationOver = createSelector(
  getMainState,
  (state: State) => state.dispatchWhenInitializationOver
);
export const getLoadResourceWhenReady = createSelector(getMainState, (state: State) => state.loadResourceWhenReady);

export const getShouldBrowserViewsBeDisplayed = createSelector(
  fromUi.getIsNavigationInDapps,
  fromUi.getNavigationSuggestionsDisplayed,
  getDappModals,
  getModal,
  fromDapps.getTabsFocusOrder,
  fromDapps.getTabs,
  (isNavigationInDapps, navigationSuggestionsDisplayed, dappModals, modal, tabsFocusOrder, tabs) => {
    // return undefined : no browser views displayed
    // return resourceId: string : the browser view corresponding to this resourceId should be displayed
    if (modal) {
      return undefined;
    }
    if (!navigationSuggestionsDisplayed && isNavigationInDapps && tabsFocusOrder.length > 0) {
      const tab = tabs.find((t) => t.id === tabsFocusOrder[tabsFocusOrder.length - 1]);
      // should always be true
      if (tab && (!dappModals[tab.id] || dappModals[tab.id].length === 0)) {
        return tab.id;
      }

      return undefined;
    }
      return undefined;
  }
);
