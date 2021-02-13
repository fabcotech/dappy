import { createSelector } from 'reselect';

import { Transaction, TransactionOriginDapp, TransactionState } from '../../src/models';

export const TRANSFER_TRANSACTIONS = '[MAIN] Transfer transactions';

export interface State {
  [dappId: string]: {
    [transactionId: string]: TransactionState;
  };
}

export const initialState: State = {};

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case TRANSFER_TRANSACTIONS: {
      const payload: TransactionState = action.payload;
      return {
        ...state,
        [(payload.origin as TransactionOriginDapp).dappId]: {
          ...(state[(payload.origin as TransactionOriginDapp).dappId] || {}),
          [payload.id]: payload,
        },
      };
    }

    default:
      return state;
  }
};

const getTransactionsMainState = createSelector(
  (state) => state,
  (state: any) => state.transactions
);

export const getTransactionsMain = createSelector(getTransactionsMainState, (state: State) => state);
