import { delay, call, put, select, take } from 'redux-saga/effects';
import { CRON_JOBS_LOG_CONTRACT_PERIOD } from '/CONSTANTS';

import { singleCall } from '/interProcess';
import { BlockchainNode, SingleCallResult } from '/models';
import { getFirstReadyNode } from '/store/settings';
import { EXECUTE_NODES_CRON_JOBS } from '/store/blockchain';
import { getNameSystemContractId } from '/store/blockchain';
import { updateContractLogs } from '../actions';

export const fetchContractLogs = function* (contractId: string) {
  const node: BlockchainNode | undefined = yield select(getFirstReadyNode);
  if (node) {
    try {
      const r: SingleCallResult = yield call(
        singleCall,
        {
          type: 'get-contract-logs',
          body: { contract: contractId },
        },
        node
      );

      yield put(
        updateContractLogs({
          contract: contractId,
          logs: r.data,
        })
      );
    } catch (e) {}
  }
};

export const cronJobContractLogs = function* () {
  yield take(EXECUTE_NODES_CRON_JOBS);
  while (true) {
    const nameSystemContractId: string | undefined = yield select(getNameSystemContractId);
    if (nameSystemContractId) {
      yield call(fetchContractLogs, nameSystemContractId);
    }
    yield delay(CRON_JOBS_LOG_CONTRACT_PERIOD);
  }
};
