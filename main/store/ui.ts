import { createSelector } from 'reselect';

import * as fromUiRenderer from '../../src/store/ui';

export const SYNC_UI = '[MAIN] Sync ui';

export interface State {
  ui: fromUiRenderer.State;
}

export const initialState: State = {
  ui: fromUiRenderer.initialState,
};

export const reducer = (state = initialState, action: any = {}): State => {
  switch (action.type) {
    case SYNC_UI: {
      return {
        ui: action.payload,
      };
    }

    default:
      return state;
  }
};

export const getUiMainState = createSelector(
  (state) => state,
  (state: any) => state.ui
);

export const getUi = createSelector(getUiMainState, (state: State) => state.ui);
