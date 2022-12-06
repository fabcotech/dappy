import { createSelector } from 'reselect';

import * as fromDappsRenderer from '../../src/store/dapps';
import { Tab } from '/models';

export const TRANSFER_TABS = '[MAIN] Transfer tabs';

export interface State {
  tabs: Tab[];
}

export const initialState: State = {
  tabs: fromDappsRenderer.initialState.tabs,
};

export const reducer = (state = initialState, action: any = {}): State => {
  switch (action.type) {
    case TRANSFER_TABS: {
      const payload: Tab[] = action.payload;
      return {
        ...state,
        tabs: payload,
      };
    }

    default:
      return state;
  }
};

export const getTabsMainState = createSelector(
  (state) => state,
  (state: any) => state.tabs
);

export const getTabs = createSelector(getTabsMainState, (state: State) => state.tabs);
