import { delay, call, put, select, take } from 'redux-saga/effects';
import { CRON_JOBS_LOG_CONTRACT_PERIOD } from '/CONSTANTS';
import { DappyNetworkMember } from '@fabcotech/dappy-lookup';

import { singleCall } from '/interProcess';
import { SingleCallResult } from '/models';
import { getFirstReadyNode } from '/store/settings';
import { getContractLogs } from '/store/ui';
import { EXECUTE_NODES_CRON_JOBS } from '/store/blockchain';
import { getNameSystemContractId } from '/store/blockchain';
import { updateContractLogsAction } from '../actions';
import { addContractLogsOneByOne } from './addContractLogsOneByOne';

export const fetchContractLogs = function* (contractId: string) {
  const node: DappyNetworkMember | undefined = yield select(getFirstReadyNode);
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
      const logs: {
        [name: string]: string[];
      } = yield select(getContractLogs);

      const contractLogs: string[] = logs[contractId];
      if (contractLogs && contractLogs.length) {
        const newLogs: string[] = r.data.filter((l: string) => {
          return !contractLogs.find((cl) => cl === l);
        });
        if (newLogs.length) {
          yield call(addContractLogsOneByOne, { contractId: contractId, newLogs: newLogs });
        }
      } else {
        yield put(
          updateContractLogsAction({
            contract: contractId,
            logs: r.data,
          })
        );
      }
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
