import { createSelector } from 'reselect';

import * as fromSettingsRenderer from '../../src/store/settings';

export const SYNC_SETTINGS = '[MAIN] Sync settings';

export interface State extends fromSettingsRenderer.Settings {}

export const initialState: State = fromSettingsRenderer.initialState.settings;

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case SYNC_SETTINGS: {
      return action.payload;
    }

    default:
      return state;
  }
};

export const getSettingsMainState = createSelector(
  (state) => state,
  (state: any) => state.settings
);

export const getSettings = createSelector(getSettingsMainState, (state: State) => state);
