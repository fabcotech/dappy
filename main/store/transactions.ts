import { TransactionState } from '../../src/models';

export const TRANSFER_TRANSACTIONS = '[MAIN] Transfer transactions';

export interface State {
  [transactionId: string]: TransactionState;
}

export const initialState: State = {};

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case TRANSFER_TRANSACTIONS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
};
