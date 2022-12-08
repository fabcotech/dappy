import { takeEvery, select } from 'redux-saga/effects';

import * as fromSettings from '..';
import { Action } from '/store';

function* executeAccountsCronJobs(action: Action) {
  console.log('executeAccountsCronJobs');
  const evmAccounts = yield select(fromSettings.getEVMAccounts);
  console.log('evmAccounts');
  console.log(evmAccounts);
}

export function* executeAccountsCronJobsSaga() {
  yield takeEvery(fromSettings.EXECUTE_ACCOUNTS_CRON_JOBS, executeAccountsCronJobs);
}
