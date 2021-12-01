import { createSelector } from 'reselect';

import { Identification } from '../../src/models';
import * as fromDapps from '../../src/store/dapps';

export const TRANSFER_IDENTIFICATIONS = '[MAIN] Transfer identification';

export interface State {
  [resourceId: string]: {
    [callId: string]: Identification;
  };
}

export const initialState: State = {};

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case TRANSFER_IDENTIFICATIONS: {
      const payload: fromDapps.SaveIdentificationPayload = action.payload;

      return {
        ...state,
        [payload.resourceId]: {
          ...state[payload.resourceId],
          [payload.callId]: payload.identification,
        },
      };
    }

    default:
      return state;
  }
};

const getIdentificationsMainState = createSelector(
  (state) => state,
  (state: any) => state.identifications
);

export const getIdentificationsMain = createSelector(getIdentificationsMainState, (state: State) => state);
