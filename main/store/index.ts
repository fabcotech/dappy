import { createStore, combineReducers, Store, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import * as fromSettings from './settings';
import * as fromBlockchains from './blockchains';
import * as fromBrowserViews from './browserViews';
import * as fromTransactions from './transactions';
import * as fromIdentifications from './identifications';
import { sagas } from './sagas';

export interface State {
  settings: fromSettings.State;
  blockchains: fromBlockchains.State;
  transactions: fromTransactions.State;
  identifications: fromIdentifications.State;
  browserViews: fromBrowserViews.State;
}

const rootSagas = function* () {
  yield all([sagas()]);
};

const sagaMiddleware = createSagaMiddleware();

export const store: Store<State> = createStore(
  combineReducers({
   settings: fromSettings.reducer,
    blockchains: fromBlockchains.reducer,
     browserViews: fromBrowserViews.reducer,
    transactions: fromTransactions.reducer,
    identifications: fromIdentifications.reducer,
  }),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSagas);
