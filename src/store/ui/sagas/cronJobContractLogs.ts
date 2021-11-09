import { delay, call, put, takeEvery, select } from 'redux-saga/effects';
import { CRON_JOBS_LOG_CONTRACT_PERIOD } from '/CONSTANTS';

import { singleCall } from '/interProcess';
import { BlockchainNode, SingleCallResult } from '/models';
import { getFirstReadyNode } from '/store/settings';
import { updateContractLogs } from '../actions';

const fetchContractLogs = function* (contract: string) {
  const node: BlockchainNode | undefined = yield select(getFirstReadyNode);
  if (node) {
    try {
      const r: SingleCallResult = yield singleCall(
        {
          type: 'get-contract-logs',
          body: { contract },
        },
        node
      );

      yield put(
        updateContractLogs({
          contract,
          logs: r.data,
        })
      );
    } catch (e) {}
  }
};

export const cronJobContractLogs = function* () {
  while (true) {
    yield delay(CRON_JOBS_LOG_CONTRACT_PERIOD);
    const nameSystemContract = 'dappynamesystem';
    yield call(fetchContractLogs, nameSystemContract);
  }
};
