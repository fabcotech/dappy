import { delay, put } from 'redux-saga/effects';
import { CRON_JOBS_LOG_CONTRACT_PERIOD } from '/CONSTANTS';

import { updateContractLogs } from '../actions';

export const addContractLogsOneByOne = function* (payload: { newLogs: string[]; contractId: string }) {
  /*
    Logs must be added one by one, this operation must be
    over when next cron jobs i sexecuted, to avoid superpositions
  */
  let average = (CRON_JOBS_LOG_CONTRACT_PERIOD * 0.7) / payload.newLogs.length;
  let logs: string[] = [...payload.newLogs];
  while (logs.length !== 0) {
    const d = average + ((Math.random() - 1) * average) / 3;
    yield delay(d);
    yield put(
      updateContractLogs({
        contract: payload.contractId,
        logs: [logs[logs.length - 1]],
      })
    );
    logs = logs.slice(0, logs.length - 1);
  }
};
