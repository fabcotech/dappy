import { takeEvery, put, select } from 'redux-saga/effects';

import { TransactionStatus } from '/models';
import * as fromBlockchain from '..';
import * as fromMain from '/store/main';
import { Action } from '/store/';

const rChainTransactionError = function* (action: Action) {
  const payload: fromBlockchain.RChainTransactionErrorPayload = action.payload;
  const modals: { [resourceId: string]: fromMain.Modal[] } = yield select(fromMain.getDappModals);

  if (payload.resourceId) {
    // Close modal if the currently openned modal is the transaction modal for this transation
    if (modals[payload.resourceId]) {
      const dappModals = modals[payload.resourceId];
      const displayedModal = dappModals[dappModals.length - 1];
      if (
        displayedModal &&
        ['PAYMENT_REQUEST_MODAL', 'TRANSACTION_MODAL'].includes(displayedModal.title) &&
        displayedModal.parameters &&
        displayedModal.parameters.id === payload.id
      ) {
        yield put(fromMain.closeDappModalAction({ resourceId: payload.resourceId }));
      }
    }

    yield put(
      fromMain.openDappModalAction({
        resourceId: payload.resourceId,
        title: 'Transaction failure',
        text: 'Transaction has failed to be sent, error : ' + (payload.value ? payload.value.message : 'unknown'),
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeDappModalAction({ resourceId: payload.resourceId }),
          },
        ],
      })
    );
  } else {
    yield put(
      fromMain.openModalAction({
        title: 'Transaction failure',
        text: 'Transaction has failed to be sent, error : ' + (payload.value ? payload.value.message : 'unknown'),
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      })
    );
  }

  yield put(
    fromBlockchain.updateRChainTransactionStatusAction({
      id: payload.id,
      status: TransactionStatus.Failed,
      value: payload.value,
    })
  );

  return true;
};

export const rChainTransactionErrorSaga = function* () {
  yield takeEvery(fromBlockchain.RCHAIN_TRANSACTION_ERROR, rChainTransactionError);
};
