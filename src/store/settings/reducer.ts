import { createSelector } from 'reselect';

import * as fromActions from './actions';
import { Blockchain, Account, BlockchainNode } from '/models';
import { Action } from '../';

export interface Settings {
  devMode: boolean;
  resolver: 'auto' | 'custom';
  resolverMode: 'absolute';
  resolverAccuracy: number;
  resolverAbsolute: number;
}

export interface State {
  settings: Settings;
  accounts: {
    [key: string]: Account;
  };
  blockchains: {
    [chainId: string]: Blockchain;
  };
  errors: { errorCode: number; error: string }[];
  executingAccountsCronJobs: boolean;
}

export const initialState: State = {
  settings: {
    resolver: 'custom',
    resolverMode: 'absolute',
    resolverAccuracy: 100,
    resolverAbsolute: 1,
    devMode: false,
  },
  accounts: {},
  blockchains: {},
  errors: [],
  executingAccountsCronJobs: false,
};

export const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case fromActions.UPDATE_BLOCKCHAINS_FROM_STORAGE: {
      const blockchainsFromStorage: Blockchain[] = action.payload;

      const blockchains: { [chainId: string]: Blockchain } = {};
      blockchainsFromStorage.forEach((blockchain) => {
        blockchains[blockchain.chainId] = {
          ...blockchain,
          nodes: blockchain.nodes.map((n) => ({ ...n, readyState: 3 })),
        };
      });

      return {
        ...state,
        blockchains: blockchains,
      };
    }

    case fromActions.UPDATE_SETTINGS_COMPLETED: {
      const settings: Settings = action.payload;

      return {
        ...state,
        settings: settings,
      };
    }

    case fromActions.ADD_NODES_IF_DO_NOT_EXIST: {
      const payload: fromActions.AddNodesIfDoNotExistPayload = action.payload;

      if (!state.blockchains[payload.chainId]) {
        return state;
      }

      // Nodes to update
      const blockchain = state.blockchains[payload.chainId];
      let newNodes = blockchain.nodes.map((n) => {
        const fn = payload.nodes.find((no) => no.ip === n.ip && no.host === n.host);
        if (fn) {
          return {
            ...n,
            ...fn,
          };
        }
        return n;
      });

      // Nodes to add
      const nodesToAdd: BlockchainNode[] = [];
      payload.nodes.forEach((n) => {
        const fn = blockchain.nodes.find((no) => no.ip === n.ip && no.host === n.host);
        if (!fn) {
          nodesToAdd.push(n);
        }
      });

      // Nodes to remove
      newNodes = newNodes.filter((bn) => {
        if (
          ['network', 'default'].includes(bn.origin) &&
          !payload.nodes.find((n) => n.ip === bn.ip && n.host === bn.host)
        ) {
          console.log('NOT FOUND');
          return false;
        }

        return true;
      });

      return {
        ...state,
        blockchains: {
          ...state.blockchains,
          [payload.chainId]: {
            ...state.blockchains[payload.chainId],
            nodes: newNodes.concat(nodesToAdd),
          },
        },
      };
    }

    case fromActions.UPDATE_NODE_ACTIVE_COMPLETED: {
      const payload: fromActions.UpdateNodeActivePayload = action.payload;

      if (!state.blockchains[payload.chainId]) {
        return state;
      }

      const blockchain = state.blockchains[payload.chainId];

      const newNodes = blockchain.nodes.map((n) => {
        if (n.ip === payload.nodeIp) {
          return {
            ...n,
            active: payload.active,
          };
        }

        return n;
      });

      return {
        ...state,
        blockchains: {
          ...state.blockchains,
          [payload.chainId]: {
            ...state.blockchains[payload.chainId],
            nodes: newNodes,
          },
        },
      };
    }

    case fromActions.UPDATE_NODE_READY_STATE: {
      const payload: fromActions.UpdateNodeReadyStatePayload = action.payload;
      const blockchain = state.blockchains[payload.chainId];
      if (!blockchain) {
        return state;
      }

      const newNodes = blockchain.nodes.map((n) => {
        if (n.ip === payload.ip && n.host === payload.host) {
          return {
            ...n,
            readyState: payload.readyState,
            ssl: payload.ssl,
          };
        }

        return n;
      });

      return {
        ...state,
        blockchains: {
          ...state.blockchains,
          [payload.chainId]: {
            ...state.blockchains[payload.chainId],
            nodes: newNodes,
          },
        },
      };
    }

    case fromActions.UPDATE_NODES_COMPLETED: {
      const payload: fromActions.UpdateNodesPayload = action.payload;

      if (!state.blockchains[payload.chainId]) {
        return state;
      }

      const blockchain = state.blockchains[payload.chainId];

      const nodesToAdd: BlockchainNode[] = [];
      payload.nodes.forEach((n) => {
        const fn = blockchain.nodes.find((no) => `${no.ip}-${no.host}-${no.cert}` === `${n.ip}-${n.host}-${n.cert}`);
        if (!fn) {
          nodesToAdd.push(n);
        }
      });

      const newNodes: BlockchainNode[] = blockchain.nodes.filter((n) => {
        return (
          n.origin !== 'user' ||
          !!payload.nodes.find((no) => `${no.ip}-${no.host}-${no.cert}` === `${n.ip}-${n.host}-${n.cert}`)
        );
      });

      return {
        ...state,
        blockchains: {
          ...state.blockchains,
          [payload.chainId]: {
            ...state.blockchains[payload.chainId],
            nodes: newNodes.concat(nodesToAdd),
          },
        },
      };
    }

    case fromActions.CREATE_BLOCKCHAIN_COMPLETED: {
      const payload: fromActions.CreateBlockchainPayload = action.payload;

      return {
        ...state,
        blockchains: {
          ...state.blockchains,
          [payload.chainId]: {
            chainId: payload.chainId,
            chainName: payload.chainName,
            platform: payload.platform,
            nodes: payload.nodes,
          },
        },
      };
    }

    case fromActions.REMOVE_BLOCKCHAIN_COMPLETED: {
      const payload: fromActions.RemoveBlockchainPayload = action.payload;
      const newBlockchains = { ...state.blockchains };
      delete newBlockchains[payload.chainId];

      return {
        ...state,
        blockchains: newBlockchains,
      };
    }

    case fromActions.UPDATE_ACCOUNTS_FROM_STORAGE: {
      const payload: fromActions.UpdateAccountsFromStoragePayload = action.payload;

      const accounts: { [id: string]: Account } = {};
      payload.accounts.forEach((a) => {
        accounts[a.name] = a;
      });
      return {
        ...state,
        accounts: accounts,
      };
    }

    case fromActions.CREATE_ACCOUNT_COMPLETED: {
      const payload: fromActions.CreateAccountPayload = action.payload;

      return {
        ...state,
        accounts: {
          ...state.accounts,
          [payload.account.name]: payload.account,
        },
      };
    }

    case fromActions.DELETE_ACCOUNT_COMPLETED: {
      const payload: fromActions.CreateAccountPayload = action.payload;

      let newAccounts = { ...state.accounts };
      delete newAccounts[payload.account.name];

      return {
        ...state,
        accounts: newAccounts,
      };
    }

    case fromActions.UPDATE_ACCOUNTS_BALANCE: {
      const payload: fromActions.UpdateAccountsBalancePayload = action.payload;

      let newAccounts: { [accountName: string]: Account } = {};
      payload.balances.forEach((k) => {
        if (!!state.accounts[k.accountName]) {
          newAccounts = {
            ...newAccounts,
            [k.accountName]: {
              ...state.accounts[k.accountName],
              balance: k.balance,
            },
          };
        }
      });

      return {
        ...state,
        accounts: {
          ...state.accounts,
          ...newAccounts,
        },
      };
    }

    case fromActions.UPDATE_ACCOUNTS_COMPLETED: {
      const payload: fromActions.UpdateAccountsCompletedPayload = action.payload;

      return {
        ...state,
        accounts: {
          ...state.accounts,
          ...payload.accounts,
        },
        executingAccountsCronJobs: false,
      };
    }

    case fromActions.UPDATE_ACCOUNTS_BALANCE_FAILED: {
      const payload: fromActions.UpdateAccountBalanceFailedPayload = action.payload;

      return {
        ...state,
        executingAccountsCronJobs: false,
      };
    }

    case fromActions.EXECUTE_ACCOUNTS_CRON_JOBS: {
      const payload: fromActions.UpdateAccountsCompletedPayload = action.payload;

      return {
        ...state,
        executingAccountsCronJobs: true,
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getSettingsState = createSelector(
  (state) => state,
  (state: any) => state.settings
);

export const getSettings = createSelector(getSettingsState, (state: State) => state.settings);
export const getBlockchains = createSelector(getSettingsState, (state: State) => state.blockchains);

export const getAccounts = createSelector(getSettingsState, (state: State) => state.accounts);

export const getExecutingAccountsCronJobs = createSelector(getSettingsState, (state: State) => state.executingAccountsCronJobs);

export const getAvailableBlockchains = createSelector(getBlockchains, (blockchains) => {
  const availableBlockchains: { [chainId: string]: Blockchain } = {};
  Object.keys(blockchains).forEach((chainId) => {
    if (blockchains[chainId].nodes.length > 0) {
      availableBlockchains[chainId] = blockchains[chainId];
    }
  });

  return availableBlockchains;
});

export const getNamesBlockchain = createSelector(getAvailableBlockchains, (availableBlockchains):
  | undefined
  | Blockchain => {
  const chainId = Object.keys(availableBlockchains)[0];
  if (chainId) {
    return availableBlockchains[chainId];
  } else {
    return undefined;
  }
});

export const getAvailableRChainBlockchains = createSelector(getAvailableBlockchains, (availableBlockchains) => {
  const rchainBlockchains: { [chainId: string]: Blockchain } = {};
  Object.keys(availableBlockchains).forEach((chainId) => {
    if (availableBlockchains[chainId].platform === 'rchain') {
      rchainBlockchains[chainId] = availableBlockchains[chainId];
    }
  });

  return rchainBlockchains;
});

// if modified, must be modified in main also
export const getOkBlockchains = createSelector(getBlockchains, (blockchains) => {
  const okBlockchains: { [chainId: string]: Blockchain } = {};
  Object.keys(blockchains).forEach((chainId) => {
    let nodes = blockchains[chainId].nodes.filter((n) => n.active && n.readyState === 1);
    if (!nodes.length) {
      return;
    }

    okBlockchains[chainId] = {
      ...blockchains[chainId],
      nodes: nodes.filter((n) => n.readyState === 1),
    };
  });

  return okBlockchains;
});

export const getIsLoadReady = createSelector(getBlockchains, getSettings, (blockchains, settings) => {
  const key = Object.keys(blockchains)[0];
  const firstBlockchain = blockchains[key];
  if (!firstBlockchain) {
    return false;
  }

  const nodes = firstBlockchain.nodes.filter((n) => n.active && n.readyState === 1);
  return nodes.length >= settings.resolverAbsolute;
});
