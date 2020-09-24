import { createSelector } from 'reselect';
import { DappyBrowserView } from '../models';

export const LOAD_OR_RELOAD_BROWSER_VIEW = '[MAIN] Load or reload browser view';
export const LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED = '[MAIN] Load or reload browser view completed';
export const DESTROY_BROWSER_VIEW = '[MAIN] Destroy browser view';
export const UPDATE_BROWSER_VIEWS_POSITION = '[MAIN] Update browser views position';
export const SAVE_BROWSER_VIEW_COMM_EVENT = '[MAIN] Save browser view comm event';
export const DISPLAY_ONLY_BROWSER_VIEW_X = '[MAIN] Display only browser view x';
export const DISPLAY_ONLY_BROWSER_VIEW_X_COMPLETED = '[MAIN] Display only browser view x completed';
export const SET_BROWSER_VIEW_MUTED = '[MAIN] Set browser view muted';

export interface State {
  browserViews: {
    [resourceId: string]: DappyBrowserView;
  };
  position: undefined | { x: number; y: number; width: number; height: number };
}

export const initialState: State = { browserViews: {}, position: undefined };

// todo DO a saga
export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case LOAD_OR_RELOAD_BROWSER_VIEW_COMPLETED: {
      return {
        ...state,
        browserViews: {
          ...state.browserViews,
          ...action.payload,
        },
      };
    }

    case DESTROY_BROWSER_VIEW: {
      if (state.browserViews[action.payload.resourceId]) {
        action.meta.browserWindow.removeBrowserView(state.browserViews[action.payload.resourceId].browserView);
        state.browserViews[action.payload.resourceId].browserView.destroy();
        let newBrowserViews = { ...state.browserViews };
        delete newBrowserViews[action.payload.resourceId];

        return {
          ...state,
          browserViews: newBrowserViews,
        };
      } else {
        return state;
      }
    }

    case UPDATE_BROWSER_VIEWS_POSITION: {
      Object.keys(state.browserViews).forEach((k) => {
        if (state.browserViews[k].visible) {
          state.browserViews[k].browserView.setBounds(action.payload);
        }
      });

      return {
        ...state,
        position: action.payload,
      };
    }

    case SAVE_BROWSER_VIEW_COMM_EVENT: {
      return {
        ...state,
        browserViews: {
          ...state.browserViews,
          [action.payload.id]: {
            ...state.browserViews[action.payload.id],
            commEvent: action.payload.commEvent,
          },
        },
      };
    }

    case DISPLAY_ONLY_BROWSER_VIEW_X_COMPLETED: {
      return {
        ...state,
        browserViews: {
          ...state.browserViews,
          ...action.payload,
        },
      };
    }

    default:
      return state;
  }
};

const getBrowserViewsMainState = createSelector(
  (state) => state,
  (state: any) => state.browserViews
);

export const getBrowserViewsMain = createSelector(getBrowserViewsMainState, (state: State) => state.browserViews);
export const getBrowserViewsPositionMain = createSelector(getBrowserViewsMainState, (state: State) => state.position);
