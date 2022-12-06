import { createSelector } from 'reselect';

import * as fromSettingsRenderer from '../../src/store/settings';
import { BlockchainAccount } from '/models';

export const SYNC_SETTINGS = '[MAIN] Sync settings';

export interface State {
  settings: fromSettingsRenderer.Settings;
  accounts: fromSettingsRenderer.State['accounts'];
}

export const initialState: State = {
  settings: fromSettingsRenderer.initialState.settings,
  accounts: {},
};

export const reducer = (state = initialState, action: any = {}): State => {
  switch (action.type) {
    case SYNC_SETTINGS: {
      return {
        settings: action.payload.settings,
        accounts: action.payload.accounts,
      };
    }

    default:
      return state;
  }
};

export const getSettingsMainState = createSelector(
  (state) => state,
  (state: any) => state.settings
);

export const getSettings = createSelector(getSettingsMainState, (state: State) => state.settings);

export const getEVMAccounts = createSelector(getSettingsMainState, (state: State) => {
  return Object.fromEntries(
    Object.entries(state.accounts).filter(([_, account]) => account.platform === 'evm')
  ) as Record<string, BlockchainAccount>;
});
