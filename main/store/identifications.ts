import { Identification } from '../../src/models';
import * as fromDapps from '../../src/store/dapps';

export const TRANSFER_IDENTIFICATIONS = '[MAIN] Transfer identification';

export interface State {
  [dappId: string]: {
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
        [payload.dappId]: {
          ...state[payload.dappId],
          [payload.callId]: payload.identification,
        },
      };
    }

    default:
      return state;
  }
};
