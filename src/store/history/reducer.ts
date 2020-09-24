import { createSelector } from 'reselect';

import { Action } from '../';
import * as fromDapps from '../dapps';
import * as fromActions from './actions';
import { Session, Preview, SessionItem } from '../../models';
import { getFocusedTabId } from '../dapps';

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
  if ([fromDapps.LAUNCH_FILE_COMPLETED, fromActions.DID_NAVIGATE_IN_PAGE].includes(action.type)) {
    let address = '';
    let tabId = '';
    let previews = state.previews;

    if (action.type === fromDapps.LAUNCH_FILE_COMPLETED) {
      const payload: fromDapps.LaunchFileCompletedPayload = action.payload;
      address = payload.file.id;
      tabId = payload.tabId;
    } else if (action.type === fromActions.DID_NAVIGATE_IN_PAGE) {
      const payload: fromActions.DidNavigateInPagePayload = action.payload;
      address = payload.address;
      tabId = payload.tabId;
    }

    const session = state.sessions[tabId];
    const sessionItem: SessionItem = { address: address };

    if (session) {
      const mustAppendNewSessionItem = address !== session.items[session.cursor].address;

      const cursorAtTheEnd = session.cursor === session.items.length - 1;

      if (cursorAtTheEnd) {
        // User hits enter but is reloading the same resource
        if (!mustAppendNewSessionItem) {
          return state;
          // New resource ID, add item in session
        } else {
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
        }
        // cursor is not at the end
      } else {
        // User hits enter but is reloading the same resource
        if (!mustAppendNewSessionItem) {
          return state;
          // Nremove useless branch of the tree, start new one
        } else {
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
      }
    } else {
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
  }

  switch (action.type) {
    case fromActions.UPDATE_PREVIEWS_FROM_STORAGE: {
      const payload: fromActions.UpdatPreviewsFromStoragePayload = action.payload;

      const newPreviews: { [search: string]: Preview } = {};
      payload.previews.forEach((p) => {
        newPreviews[p.id] = p;
      });
      return {
        ...state,
        previews: newPreviews,
      };
    }

    case fromActions.SAVE_PREVIEW: {
      const payload: fromActions.SavePreviewPayload = action.payload;

      return {
        ...state,
        previews: {
          ...state.previews,
          [payload.preview.id]: payload.preview,
        },
      };
    }

    case fromActions.UPDATE_PREVIEW: {
      const payload: fromActions.UpdatePreviewPayload = action.payload;

      if (!state.previews[payload.previewId]) {
        console.log('cannot update unexisting preview ', payload.previewId);
        return state;
      }
      return {
        ...state,
        previews: {
          ...state.previews,
          [payload.previewId]: {
            ...state.previews[payload.previewId],
            ...payload,
          },
        },
      };
    }

    case fromDapps.STOP_TAB: {
      const payload: fromDapps.StopTabPayload = action.payload;

      const newSessions = { ...state.sessions };
      delete newSessions[payload.tabId];

      return {
        ...state,
        sessions: newSessions,
      };
    }

    case fromActions.GO_FORWARD_COMPLETED: {
      const payload: fromActions.GoForwardPayload = action.payload;
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
      const payload: fromActions.GoBackwardPayload = action.payload;
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
  fromDapps.getActiveResource,
  fromDapps.getFocusedTabId,
  (sessions, activeResource, focusedTabId) => {
    const session = sessions[focusedTabId];

    if (!session) {
      return false;
    }

    if (!activeResource && session.items[session.cursor]) {
      return true;
    }

    return !!session.items[session.cursor - 1];
  }
);
