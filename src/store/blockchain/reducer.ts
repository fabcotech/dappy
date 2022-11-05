import { createSelector } from 'reselect';

import * as fromActions from './actions';
import { TransactionState } from '/models';

export interface State {
  transactions: /* TODO: rename to transactionStates */ {
    [transactionId: string]: TransactionState;
  };
}

export const initialState: State = {
  transactions: {},
};

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case fromActions.UPDATE_TRANSACTIONS_FROM_STORAGE: {
      const { payload }: { payload: { transactions: TransactionState[] } } = action;

      const newTransactions: { [id: string]: TransactionState } = {};
      payload.transactions.forEach((t) => {
        newTransactions[t.id] = t;
      });

      return {
        ...state,
        transactions: newTransactions,
      };
    }

    case fromActions.SAVE_ETHEREUM_TRANSACTION: {
      const { payload } = action;
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [payload.id]: {
            id: payload.id,
            transaction: payload.transaction,
            status: payload.status,
            origin: payload.origin,
            platform: payload.platform,
            blockchainId: payload.blockchainId,
            sentAt: payload.sentAt,
            value: undefined,
            blockchainInfo: '',
          },
        },
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getBlockchainState = createSelector(
  (state) => state,
  (state: any) => state.blockchain
);

export const getTransactions = createSelector(
  getBlockchainState,
  (state: State) => state.transactions
);
