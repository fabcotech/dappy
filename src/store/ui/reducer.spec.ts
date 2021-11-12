import { updateContractLogsReducer, initialState } from './reducer';
import { updateContractLogs } from './actions';

import { LOGS_PER_CONTRACT } from '/CONSTANTS';

describe('reducer ui', () => {
  it('should update contract logs', () => {
    const state = {
      ...initialState,
    };
    const contractId = 'dappynamesystem';
    const logs = ['a', 'b', 'c'];
    const newState = updateContractLogsReducer(
      state,
      updateContractLogs({
        contract: contractId,
        logs,
      })
    );

    expect(newState.contractLogs).toEqual({
      [contractId]: logs,
    });
  });
  it('should prepend new contract logs', () => {
    const contractId = 'dappynamesystem';
    const logs = ['a', 'b', 'c'];
    const state = {
      ...initialState,
      contractLogs: {
        [contractId]: logs,
      },
    };
    const newState = updateContractLogsReducer(
      state,
      updateContractLogs({
        contract: contractId,
        logs: ['d', 'e', 'f'],
      })
    );

    expect(newState.contractLogs).toEqual({
      [contractId]: ['d', 'e', 'f', 'a', 'b', 'c'],
    });
  });
  it('should limit logs per contract', () => {
    const contractId = 'dappynamesystem';
    const logs = [];
    for (let i = 0; i < LOGS_PER_CONTRACT + 10; i++) {
      logs.push(`l${i}`);
    }
    const state = {
      ...initialState,
      contractLogs: {
        [contractId]: [],
      },
    };
    const newState = updateContractLogsReducer(
      state,
      updateContractLogs({
        contract: contractId,
        logs,
      })
    );

    expect(newState.contractLogs).toEqual({
      [contractId]: logs.slice(0, LOGS_PER_CONTRACT),
    });
  });
});
