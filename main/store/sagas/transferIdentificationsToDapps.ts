import { takeEvery, select } from 'redux-saga/effects';

import * as fromIdentifications from '../identifications';
import * as fromBrowserViews from '../browserViews';
import * as fromDapps from '../../../src/store/dapps';
import * as fromCommon from '../../../src/common';

const transferIdentificationtionsToDapps = function*(action: any) {
  const payload: fromDapps.SaveIdentificationPayload = action.payload;

  const browserViews = yield select(fromBrowserViews.getBrowserViewsMain);

  if (!browserViews[payload.dappId]) {
    console.log('error cannot transfer transaction to not found browser view');
    return;
  }
  if (!browserViews[payload.dappId].commEvent) {
    console.log('error cannot transfer transaction to browser view (no comm event)');
    return;
  }
  console.log({ [payload.callId]: payload.identification });
  browserViews[payload.dappId].commEvent.reply(
    'message-from-main',
    fromCommon.updateIdentificationsAction({ identifications: { [payload.callId]: payload.identification } })
  );
};

export const transferIdentificationtionsToDappsSaga = function*() {
  yield takeEvery(fromIdentifications.TRANSFER_IDENTIFICATIONS, transferIdentificationtionsToDapps);
};
