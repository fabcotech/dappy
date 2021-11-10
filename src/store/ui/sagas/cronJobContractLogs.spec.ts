import { cronJobContractLogs, fetchContractLogs } from './cronJobContractLogs';
import { CRON_JOBS_LOG_CONTRACT_PERIOD } from '/CONSTANTS';
import { getNameSystemContractId } from '/store/blockchain';
import { delay, select, call, put } from 'redux-saga/effects';
import { singleCall } from '/interProcess';
import { getFirstReadyNode } from '/store/settings';
import { BlockchainNode } from '/models';
import { updateContractLogs } from '../actions';

describe('saga ui cronJobContractLogs', () => {
  it('should fetch dappynamesystem contract logs with a delay', () => {
    const saga = cronJobContractLogs();
    expect(saga.next().value).toEqual(delay(CRON_JOBS_LOG_CONTRACT_PERIOD));
    expect(saga.next().value).toEqual(select(getNameSystemContractId));
    expect(saga.next('dappynamesystem').value).toEqual(call(fetchContractLogs, 'dappynamesystem'));
  });
  it('should not fetch contract logs if no name system contract is found', () => {
    const saga = cronJobContractLogs();
    expect(saga.next().value).toEqual(delay(CRON_JOBS_LOG_CONTRACT_PERIOD));
    expect(saga.next().value).toEqual(select(getNameSystemContractId));
    expect(saga.next(undefined).value).toEqual(delay(CRON_JOBS_LOG_CONTRACT_PERIOD));
  });
  it('should fetch and save logs', () => {
    const fakeNode: BlockchainNode = {
      ip: '127.0.0.1',
      host: 'dappy.dev',
      origin: 'user',
      active: true,
      readyState: 1,
      ssl: true,
    };
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
    expect(saga.next(r as any).value).toEqual(
      put(
        updateContractLogs({
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
