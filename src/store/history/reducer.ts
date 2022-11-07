import { createSelector } from 'reselect';

import { Action } from '..';
import { Preview } from '/models';

export interface State {
  previews: {
    [search: string]: Preview;
  };
}

export const initialState: State = {
  previews: {},
};

export const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};

// SELECTORS

export const getHistoryState = createSelector(
  (state) => state,
  (state: any) => state.history
);

export const getPreviews = createSelector(getHistoryState, (state: State) => state.previews);
