import { Blockchain } from '../../src/models';
import { createSelector } from 'reselect';

export const SYNC_BLOCKCHAINS = '[MAIN] Sync blockchains';

export interface State {
  [chainId: string]: Blockchain;
}

export const initialState: State = {};

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case SYNC_BLOCKCHAINS: {
      return action.payload;
    }

    default:
      return state;
  }
};

const getBlockchainsMainState = createSelector(
  (state) => state,
  (state: any) => state.blockchains
);

export const getBlockchains = createSelector(getBlockchainsMainState, (state: State) => state);

// if modified, must be modified in renderer also
export const getOkBlockchainsMain = createSelector(getBlockchainsMainState, (blockchains: State) => {
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
