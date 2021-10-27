import { takeEvery, select } from 'redux-saga/effects';

import { TransactionStatus, TransactionState } from '/models';
import * as fromBlockchain from '..';
import * as fromMain from '/store/main';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { Action, store } from '/store/';
import { searchToAddress } from '/utils/searchToAddress';

const performPostTransaction = function* (action: Action) {
  const payload: fromBlockchain.UpdateRChainTransactionStatusPayload = action.payload;
  if (payload.status !== TransactionStatus.Completed) {
    return true;
  }

  const transactions: {
    [transactionId: string]: TransactionState;
  } = yield select(fromBlockchain.getTransactions);

  const transaction = transactions[payload.id];
  if (
    transaction.origin.origin === 'deploy' &&
    transaction.value &&
    typeof transaction.value !== 'string' &&
    (transaction.value as any).address
  ) {
    store.dispatch(
      fromMain.openModalAction({
        title: 'Dapp available',
        text: 'The dapp has been successfully recorded in the blockchain',
        buttons: [
          {
            classNames: 'is-light',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
          {
            classNames: 'is-link',
            text: 'Navigate to dapp',
            action: [
              fromMain.closeModalAction(),
              fromDapps.loadResourceAction({
                address: searchToAddress((transaction.value as any).address, transaction.blockchainId),
              }),
              fromUi.navigateAction({ navigationUrl: '/dapps' }),
            ],
          },
        ],
      })
    );
  }

  return true;
};

export const performPostTransactionSaga = function* () {
  yield takeEvery(fromBlockchain.UPDATE_RCHAIN_TRANSACTION_STATUS, performPostTransaction);
};
