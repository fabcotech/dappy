import { createSelector } from 'reselect';

import { Action } from '..';
import * as fromDapps from '../dapps';
import * as fromActions from './actions';
import { Session, Preview, SessionItem } from '/models';

export interface State {
  sessions: {
    [tabId: string]: Session;
  };
  previews: {
    [search: string]: Preview;
  };
}

export const initialState: State = {
  sessions: {},
  previews: {},
};

export const reducer = (state = initialState, action: Action): State => {
  if ([fromDapps.LAUNCH_TAB_COMPLETED, fromActions.DID_NAVIGATE_IN_PAGE].includes(action.type)) {
    let url = '';
    let tabId = '';

    if (action.type === fromDapps.LAUNCH_TAB_COMPLETED) {
      const { payload } = action;
      url = payload.tab.url;
      tabId = payload.tab.id;
    } else if (action.type === fromActions.DID_NAVIGATE_IN_PAGE) {
      const { payload } = action;
      url = payload.url;
      tabId = payload.tabId;
    }

    const session = state.sessions[tabId];
    const sessionItem: SessionItem = { url };

    if (session) {
      const mustAppendNewSessionItem = url !== session.items[session.cursor].url;

      const cursorAtTheEnd = session.cursor === session.items.length - 1;

      if (cursorAtTheEnd) {
        // User hits enter but is reloading the same resource
        if (!mustAppendNewSessionItem) {
          return state;
          // New resource ID, add item in session
        }
          return {
            ...state,
            sessions: {
              ...state.sessions,
              [tabId]: {
                items: session.items.concat(sessionItem),
                cursor: session.cursor + 1,
              },
            },
          };

        // cursor is not at the end
      }
        // User hits enter but is reloading the same resource
        if (!mustAppendNewSessionItem) {
          return state;
          // Nremove useless branch of the tree, start new one
        }
          const newItems = session.items.slice(0, session.cursor + 1).concat(sessionItem);
          return {
            ...state,
            sessions: {
              ...state.sessions,
              [tabId]: {
                items: newItems,
                cursor: session.cursor + 1,
              },
            },
          };
    }
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [tabId]: {
            items: [sessionItem],
            cursor: 0,
          },
        },
      };
  }

  switch (action.type) {
    case fromDapps.STOP_TAB: {
      const { payload } = action;

      const newSessions = { ...state.sessions };
      delete newSessions[payload.tabId];

      return {
        ...state,
        sessions: newSessions,
      };
    }

    case fromActions.GO_FORWARD_COMPLETED: {
      const { payload } = action;
      const session = state.sessions[payload.tabId];

      return {
        ...state,
        sessions: {
          ...state.sessions,
          [payload.tabId]: {
            ...session,
            cursor: session.cursor + 1,
          },
        },
      };
    }
    case fromActions.GO_BACKWARD_COMPLETED: {
      const { payload } = action;
      const session = state.sessions[payload.tabId];

      return {
        ...state,
        sessions: {
          ...state.sessions,
          [payload.tabId]: {
            ...session,
            cursor: session.cursor - 1,
          },
        },
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getHistoryState = createSelector(
  (state) => state,
  (state: any) => state.history
);

export const getSessions = createSelector(getHistoryState, (state: State) => state.sessions);

export const getPreviews = createSelector(getHistoryState, (state: State) => state.previews);

// COMBINED SELECTORS

export const getCanGoForward = createSelector(getSessions, fromDapps.getFocusedTabId, (sessions, focusedTabId) => {
  const session = sessions[focusedTabId];
  if (!session) {
    return false;
  }
  return !!session.items[session.cursor + 1];
});

export const getCanGoBackward = createSelector(
  getSessions,
  fromDapps.getActiveTab,
  fromDapps.getFocusedTabId,
  (sessions, activeTab, focusedTabId) => {
    const session = sessions[focusedTabId];

    if (!session) {
      return false;
    }

    if (!activeTab && session.items[session.cursor]) {
      return true;
    }

    return !!session.items[session.cursor - 1];
  }
);
