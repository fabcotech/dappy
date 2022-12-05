import { createSelector } from 'reselect';

import * as fromActions from './actions';
import { Blockchain, Account, BlockchainAccount, CertificateAccount } from '/models';
import { Action } from '..';

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
        blockchains[blockchain.chainId] = blockchain;
      });

      return {
        ...state,
        blockchains,
      };
    }

    case fromActions.UPDATE_SETTINGS_COMPLETED: {
      const settings: Settings = action.payload;

      return {
        ...state,
        settings,
      };
    }

    case fromActions.UPDATE_NODES_COMPLETED: {
      const { payload }: { payload: fromActions.UpdateNodesPayload } = action;

      if (!state.blockchains[payload.chainId]) {
        return state;
      }

      return {
        ...state,
        blockchains: {
          ...state.blockchains,
          [payload.chainId]: {
            ...state.blockchains[payload.chainId],
            nodes: payload.nodes,
          },
        },
      };
    }

    case fromActions.CREATE_BLOCKCHAIN_COMPLETED: {
      const { payload }: { payload: fromActions.CreateBlockchainPayload } = action;

      if (payload.override) {
        return {
          ...state,
          blockchains: {
            [payload.blockchain.chainId]: payload.blockchain,
          },
        };
      }

      return {
        ...state,
        blockchains: {
          ...state.blockchains,
          [payload.blockchain.chainId]: payload.blockchain,
        },
      };
    }

    case fromActions.REMOVE_BLOCKCHAIN_COMPLETED: {
      const { payload } = action;
      const newBlockchains = { ...state.blockchains };
      delete newBlockchains[payload.chainId];

      return {
        ...state,
        blockchains: newBlockchains,
      };
    }

    case fromActions.UPDATE_ACCOUNTS_FROM_STORAGE: {
      const { payload }: { payload: fromActions.UpdateAccountsFromStoragePayload } = action;

      const accounts: { [id: string]: Account } = {};
      payload.accounts.forEach((a) => {
        accounts[a.name] = a;
      });
      return {
        ...state,
        accounts,
      };
    }

    case fromActions.CREATE_ACCOUNT_COMPLETED: {
      const { payload }: { payload: fromActions.CreateAccountPayload } = action;

      return {
        ...state,
        accounts: {
          ...state.accounts,
          [payload.account.name]: payload.account,
        },
      };
    }

    case fromActions.DELETE_ACCOUNT_COMPLETED: {
      const { payload } = action;

      const newAccounts = { ...state.accounts };
      delete newAccounts[payload.account.name];

      return {
        ...state,
        accounts: newAccounts,
      };
    }

    case fromActions.UPDATE_ACCOUNTS_COMPLETED: {
      const { payload } = action;

      return {
        ...state,
        accounts: {
          ...state.accounts,
          ...payload.accounts,
        },
        executingAccountsCronJobs: false,
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getSettingsState = (state: any): State => state.settings;

export const getSettings = createSelector(getSettingsState, (state: State) => state.settings);
export const getBlockchains = createSelector(getSettingsState, (state: State) => state.blockchains);

export const getAccounts = createSelector(getSettingsState, (state: State) => state.accounts);

export const getRChainAccounts = createSelector(getSettingsState, (state: State) => {
  return Object.fromEntries(
    Object.entries(state.accounts).filter(([_, account]) => account.platform === 'rchain')
  ) as Record<string, BlockchainAccount>;
});

export const getEVMAccounts = createSelector(getSettingsState, (state: State) => {
  return Object.fromEntries(
    Object.entries(state.accounts).filter(([_, account]) => account.platform === 'evm')
  ) as Record<string, BlockchainAccount>;
});

export const getCertificateAccounts = createSelector(getSettingsState, (state: State) => {
  return Object.fromEntries(
    Object.entries(state.accounts).filter(([, account]) => account.platform === 'certificate')
  ) as Record<string, CertificateAccount>;
});

export const getExecutingAccountsCronJobs = createSelector(
  getSettingsState,
  (state: State) => state.executingAccountsCronJobs
);

export const getAvailableBlockchains = createSelector(getBlockchains, (blockchains) => {
  const availableBlockchains: { [chainId: string]: Blockchain } = {};
  Object.keys(blockchains).forEach((chainId) => {
    if (blockchains[chainId].nodes.length > 0) {
      availableBlockchains[chainId] = blockchains[chainId];
    }
  });

  return availableBlockchains;
});

export const getFirstBlockchain = createSelector(getBlockchains, (blockchains) => {
  return Object.values(blockchains).at(0);
});

export const getNamesBlockchain = createSelector(
  getAvailableBlockchains,
  (availableBlockchains): undefined | Blockchain => {
    const chainId = Object.keys(availableBlockchains)[0];
    if (chainId) {
      return availableBlockchains[chainId];
    }
    return undefined;
  }
);

export const getAvailableRChainBlockchains = createSelector(
  getAvailableBlockchains,
  (availableBlockchains) => {
    const rchainBlockchains: { [chainId: string]: Blockchain } = {};
    Object.keys(availableBlockchains).forEach((chainId) => {
      if (availableBlockchains[chainId].platform === 'rchain') {
        rchainBlockchains[chainId] = availableBlockchains[chainId];
      }
    });

    return rchainBlockchains;
  }
);

// if modified, must be modified in main also
export const getOkBlockchains = createSelector(getBlockchains, (blockchains) => {
  const okBlockchains: { [chainId: string]: Blockchain } = {};
  Object.keys(blockchains).forEach((chainId) => {
    if (!blockchains[chainId].nodes.length) {
      return;
    }

    okBlockchains[chainId] = {
      ...blockchains[chainId],
      nodes: blockchains[chainId].nodes,
    };
  });

  return okBlockchains;
});

export const getFirstReadyNode = createSelector(getBlockchains, (blockchains) => {
  const bc = Object.values(blockchains).find((b) => {
    return b.nodes[0];
  });
  return bc?.nodes[0];
});

export const getIsLoadReady = createSelector(
  getBlockchains,
  getSettings,
  (blockchains, settings) => {
    const key = Object.keys(blockchains)[0];
    const firstBlockchain = blockchains[key];
    if (!firstBlockchain) {
      return false;
    }

    return firstBlockchain.nodes.length >= settings.resolverAbsolute;
  }
);
