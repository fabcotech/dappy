import { cronJobContractLogs, fetchContractLogs } from './cronJobContractLogs';
import { CRON_JOBS_LOG_CONTRACT_PERIOD } from '/CONSTANTS';
import { EXECUTE_NODES_CRON_JOBS } from '/store/blockchain';
import { getNameSystemContractId } from '/store/blockchain';
import { delay, select, call, put, take } from 'redux-saga/effects';
import { singleCall } from '/interProcess';
import { getFirstReadyNode } from '/store/settings';
import { updateContractLogsAction } from '../actions';
import { getFakeBlockChainNode, getFakeLogs } from '/fakeData';
import { getContractLogs } from '../reducer';

describe('saga ui cronJobContractLogs', () => {
  it('should wait for nodes cron jobs before anything', () => {
    const saga = cronJobContractLogs();
    expect(saga.next().value).toEqual(take(EXECUTE_NODES_CRON_JOBS));
  });
  it('should fetch dappynamesystem contract logs with a delay', () => {
    const saga = cronJobContractLogs();
    expect(saga.next().value).toEqual(take(EXECUTE_NODES_CRON_JOBS));
    expect(saga.next().value).toEqual(select(getNameSystemContractId));
    expect(saga.next('dappynamesystem').value).toEqual(call(fetchContractLogs, 'dappynamesystem'));
    expect(saga.next().value).toEqual(delay(CRON_JOBS_LOG_CONTRACT_PERIOD));
  });
  it('should not fetch contract logs if no name system contract is found', () => {
    const saga = cronJobContractLogs();
    expect(saga.next().value).toEqual(take(EXECUTE_NODES_CRON_JOBS));
    expect(saga.next().value).toEqual(select(getNameSystemContractId));
    expect(saga.next(undefined).value).toEqual(delay(CRON_JOBS_LOG_CONTRACT_PERIOD));
  });
  it('should fetch and save logs', () => {
    const fakeNode = getFakeBlockChainNode();
    const contractId = 'dappynamesystem';
    const saga = fetchContractLogs(contractId);
    const r = { data: ['a', 'b', 'c'] };

    expect(saga.next().value).toEqual(select(getFirstReadyNode));
    expect(saga.next(fakeNode as any).value).toEqual(
      call(
        singleCall,
        {
          type: 'get-contract-logs',
          body: { contract: contractId },
        },
        fakeNode
      )
    );
    expect(saga.next(r as any).value).toEqual(select(getContractLogs));
    expect(saga.next(getFakeLogs(contractId) as any).value).toEqual(
      put(
        updateContractLogsAction({
          contract: contractId,
          logs: r.data,
        })
      )
    );
  });

  it('should not fetch logs if there is no node available', () => {
    const contractId = 'dappynamesystem';
    const saga = fetchContractLogs(contractId);

    expect(saga.next().value).toEqual(select(getFirstReadyNode));
    expect(saga.next().done).toBeTruthy();
  });
});
