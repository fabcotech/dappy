import { createSelector } from 'reselect';
import { Subscription } from 'xstream';

import * as fromActions from './actions';
import * as fromSettings from '../settings';
import {
  Record,
  Benchmark,
  RChainInfos,
  TransactionStatus,
  TransactionState,
  LoadRecordsSuccess,
  LoadRecordsError,
  LoadNodesError,
} from '/models';

export interface State {
  rchain: {
    cronStream: undefined | NodeJS.Timeout;
    cronSubscription: undefined | Subscription;
    infos: { [chainId: string]: RChainInfos };
    loadErrors: fromActions.UpdateRChainBlockchainInfoFailedPayload[];
  };
  records: {
    records: { [name: string]: Record };
    date: string;
    loadErrors: LoadRecordsError[];
    loadSuccesses: LoadRecordsSuccess[];
  };
  loadNodesErrors: LoadNodesError[];
  transactions: {
    [transactionId: string]: TransactionState;
  };
  benchmarks: {
    [chainIdAndNodeIndex: string]: Benchmark;
  };
  benchmarkTransitoryStates: {
    [chainId: string]: undefined | 'loading';
  };
}

export const initialState: State = {
  rchain: {
    cronStream: undefined,
    cronSubscription: undefined,
    infos: {},
    loadErrors: [],
  },
  records: {
    records: {},
    date: '',
    loadErrors: [],
    loadSuccesses: [],
  },
  loadNodesErrors: [],
  transactions: {},
  benchmarks: {},
  benchmarkTransitoryStates: {},
};

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case fromActions.UPDATE_BENCHMARKS_FROM_STORAGE: {
      const benchmarksFromStorage: Benchmark[] = action.payload.benchmarks;

      const benchmarks: { [chainIdAndNodeIndex: string]: Benchmark } = {};
      benchmarksFromStorage.forEach((benchmark) => {
        benchmarks[benchmark.id] = benchmark;
      });

      return {
        ...state,
        benchmarks: benchmarks,
      };
    }

    case fromActions.SAVE_RCHAIN_CRON_JOBS_STREAM: {
      const payload: fromActions.SaveRChainConJobsStreamPayload = action.payload;

      return {
        ...state,
        rchain: {
          ...state.rchain,
          cronStream: payload.stream,
        },
      };
    }

    case fromActions.GET_NODES_FAILED: {
      const payload: LoadNodesError = action.payload;
      return {
        ...state,
        loadNodesErrors: [payload].concat(state.loadNodesErrors),
      };
    }

    case fromActions.UPDATE_RCHAIN_BLOCKCHAIN_INFO_COMPLETED: {
      const payload: fromActions.UpdateRChainBlockchainInfoCompletedPayload = action.payload;

      return {
        ...state,
        rchain: {
          ...state.rchain,
          infos: {
            ...state.rchain.infos,
            [payload.chainId]: {
              ...state.rchain.infos[payload.chainId],
              chainId: payload.chainId,
              date: payload.date,
              info: payload.info,
            },
          },
        },
      };
    }

    case fromActions.UPDATE_RCHAIN_BLOCKCHAIN_INFOS_FROM_STORAGE: {
      const payload = action.payload as fromActions.UpdateRChainBlockchainInfosFromStoragePayload;

      let newRchainInfos = state.rchain.infos;
      payload.rchainInfos.forEach((rchainInfo) => {
        newRchainInfos = {
          ...newRchainInfos,
          [rchainInfo.chainId]: rchainInfo,
        };
      });

      return {
        ...state,
        rchain: {
          ...state.rchain,
          infos: newRchainInfos,
        },
      };
    }

    case fromActions.UPDATE_RCHAIN_BLOCKCHAIN_INFO_FAILED: {
      const payload: fromActions.UpdateRChainBlockchainInfoFailedPayload = action.payload;

      return {
        ...state,
        rchain: {
          ...state.rchain,
          loadErrors: state.rchain.loadErrors.concat(payload),
        },
      };
    }

    case fromActions.UPDATE_RECORDS_FROM_STORAGE: {
      const payload: fromActions.UpdateRecordsFromStoragePayload = action.payload;

      const records: { [name: string]: Record } = {};
      payload.records.forEach((record) => {
        records[record.id] = record;
      });

      return {
        ...state,
        records: {
          ...state.records,
          records: records,
        },
      };
    }

    case fromActions.GET_ALL_RECORDS_FAILED: {
      const payload: LoadRecordsError = action.payload;

      return {
        ...state,
        records: {
          ...state.records,
          loadErrors: [payload].concat(state.records.loadErrors),
        },
      };
    }

    case fromActions.GET_ONE_RECORD_COMPLETED: {
      const payload: fromActions.GetOneRecordCompletedPayload = action.payload;

      return {
        ...state,
        records: {
          ...state.records,
          records: {
            ...state.records.records,
            [payload.record.id]: payload.record,
          },
        },
      };
    }

    case fromActions.REMOVE_OLD_RECORDS_COMPLETED: {
      const payload: fromActions.RemoveOldRecordsCompletedPayload = action.payload;

      const newRecords: { [key: string]: Record } = {};
      Object.keys(state.records.records).forEach((k) => {
        const record = state.records.records[k];
        if (!payload.names.includes(record.id)) {
          newRecords[k] = record;
        }
      });

      return {
        ...state,
        records: {
          ...state.records,
          records: newRecords,
        },
      };
    }

    case fromActions.ADD_RECORD: {
      const payload: fromActions.AddRecordPayload = action.payload;

      return {
        ...state,
        records: {
          ...state.records,
          records: {
            ...state.records.records,
            [payload.record.id]: payload.record,
          },
        },
      };
    }

    case fromActions.UPDATE_TRANSACTIONS_FROM_STORAGE: {
      const payload: { transactions: TransactionState[] } = action.payload;

      const newTransactions: { [id: string]: TransactionState } = {};
      payload.transactions.forEach((t) => {
        newTransactions[t.id] = t;
      });

      return {
        ...state,
        transactions: newTransactions,
      };
    }

    case fromActions.ADD_RCHAIN_TRANSACTION:
    case fromActions.SEND_RCHAIN_TRANSACTION: {
      const payload: fromActions.SendRChainTransactionPayload = action.payload;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [payload.id]: {
            transaction: payload.transaction,
            status: TransactionStatus.Pending,
            origin: payload.origin,
            platform: payload.platform,
            blockchainId: payload.blockchainId,
            blockchainInfo: state.rchain.infos[payload.blockchainId]
              ? state.rchain.infos[payload.blockchainId].info.rchainNetwork
              : '',
            sentAt: payload.sentAt,
            value: undefined,
            id: payload.id,
          },
        },
      };
    }

    // case fromActions.SAVE_ETHEREUM_SIGNED_TRANSACTION: {
    //   const payload: fromActions.saveEthereumSignedTransactionPayload = action.payload;
    //   return {
    //     ...state,
    //     transactions: {
    //       ...state.transactions,
    //       [payload.id]: {
    //         id: payload.id,
    //         transaction: payload.transaction,
    //         status: TransactionStatus.Signed,
    //         origin: payload.origin,
    //         platform: payload.platform,
    //         blockchainId: payload.blockchainId,
    //         sentAt: payload.sendAt,
    //         value: undefined,
    //         blockchainInfo: '',
    //       },
    //     },
    //   };
    // }

    case fromActions.SAVE_FAILED_RCHAIN_TRANSACTION: {
      const payload: fromActions.SaveFailedRChainTransactionPayload = action.payload;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [payload.id]: {
            transaction: undefined,
            status: TransactionStatus.Failed,
            origin: payload.origin,
            platform: payload.platform,
            blockchainId: payload.blockchainId,
            sentAt: payload.sentAt,
            value: payload.value,
            id: payload.id,
          },
        },
      };
    }

    case fromActions.UPDATE_RCHAIN_TRANSACTION_STATUS: {
      const payload: fromActions.UpdateRChainTransactionStatusPayload = action.payload;

      let newTransaction: TransactionState = {
        ...state.transactions[payload.id],
        status: payload.status,
      };
      if (payload.value) {
        newTransaction = {
          ...state.transactions[payload.id],
          status: payload.status,
          value: payload.value,
        };
      } else if (state.transactions[payload.id].value) {
        newTransaction = {
          ...state.transactions[payload.id],
          status: payload.status,
          value: state.transactions[payload.id].value,
        };
      }

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [payload.id]: newTransaction,
        },
      };
    }

    case fromActions.UPDATE_RCHAIN_TRANSACTION_VALUE: {
      const payload: fromActions.UpdateRChainTransactionValuePayload = action.payload;

      return {
        ...state,
        transactions: {
          ...state.transactions,
          [payload.id]: {
            ...state.transactions[payload.id],
            value: payload.value,
          },
        },
      };
    }

    case fromActions.PERFORM_MANY_BENCHMARKS_COMPLETED: {
      const payload: fromActions.PerformManyBenchmarksCompletedPayload = action.payload;

      let newBenchmarks = { ...state.benchmarks };
      payload.benchmarks.forEach((b) => {
        newBenchmarks = {
          ...newBenchmarks,
          [b.id]: b,
        };
      });

      let newBenchmarkTransitoryStates = { ...state.benchmarkTransitoryStates };
      payload.benchmarks.forEach((b) => {
        newBenchmarkTransitoryStates = {
          ...newBenchmarkTransitoryStates,
          [b.id]: undefined,
        };
      });

      return {
        ...state,
        benchmarks: newBenchmarks,
        benchmarkTransitoryStates: newBenchmarkTransitoryStates,
      };
    }

    case fromSettings.REMOVE_BLOCKCHAIN: {
      const newBenchmarks = { ...state.benchmarks };
      delete newBenchmarks[action.payload];
      const newBenchmarkTransitoryStates = {
        ...state.benchmarkTransitoryStates,
      };
      delete newBenchmarkTransitoryStates[action.payload];
      const newRChainInfos = { ...state.rchain.infos };
      delete newRChainInfos[action.payload];

      return {
        ...state,
        benchmarks: newBenchmarks,
        benchmarkTransitoryStates: newBenchmarkTransitoryStates,
        rchain: {
          ...state.rchain,
          infos: newRChainInfos,
        },
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getBlockchainState = createSelector(
  (state) => state,
  (state: any) => state.blockchain
);

export const getRChainInfos = createSelector(getBlockchainState, (state: State) => state.rchain.infos);

export const getBenchmarks = createSelector(getBlockchainState, (state: State) => state.benchmarks);

export const getBenchmarkTransitoryStates = createSelector(
  getBlockchainState,
  (state: State) => state.benchmarkTransitoryStates
);

export const getRecords = createSelector(getBlockchainState, (state: State) => state.records.records);

export const getTransactions = createSelector(getBlockchainState, (state: State) => state.transactions);

export const getLoadRecordsErrors = createSelector(getBlockchainState, (state: State) => state.records.loadErrors);

export const getLoadRecordsSuccesses = createSelector(
  getBlockchainState,
  (state: State) => state.records.loadSuccesses
);

export const getLoadNodesErrors = createSelector(getBlockchainState, (state: State) => state.loadNodesErrors);

export const getDappTransactions = createSelector(getTransactions, (transactions) =>
  Object.values(transactions).filter((t) => t.origin.origin === 'dapp')
);

export const getNamesBlockchainInfos = createSelector(
  fromSettings.getNamesBlockchain,
  getRChainInfos,
  (namesBlockchain, rchainInfos) => {
    if (namesBlockchain && rchainInfos[namesBlockchain.chainId]) {
      return rchainInfos[namesBlockchain.chainId];
    } else {
      return undefined;
    }
  }
);

export const getNameSystemContractId = createSelector(getNamesBlockchainInfos, (i) => i?.info.rchainNamesContractId);

export const getRecordNamesInAlphaOrder = createSelector(getRecords, (records: { [name: string]: Record }) => {
  return Object.keys(records).sort((a, b) => {
    if (a < b) {
      return -1;
    } else {
      return 1;
    }
  });
});

// todo, this is all reprocessed everytime state.records change
// maybe do it another way
export const getRecordBadges = createSelector(getRecords, (records: { [name: string]: Record }) => {
  const recordBadges: { [name: string]: { [name: string]: string } } = {};

  Object.keys(records).forEach((name) => {
    Object.keys(records[name].data.badges || {}).forEach((n) => {
      if (!recordBadges[n]) {
        recordBadges[n] = {};
      }
      recordBadges[n][name] = records[name].data.badges[n];
    });
  });

  return recordBadges;
});

export const getLastFinalizedBlockNumber = createSelector(getRecords, (records: { [name: string]: Record }) => {
  return Object.keys(records).sort((a, b) => {
    if (a < b) {
      return -1;
    } else {
      return 1;
    }
  });
});
