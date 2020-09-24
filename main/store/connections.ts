import { createSelector } from 'reselect';
import WSC from 'ws';

export const UPDATE_CONNECTIONS = '[MAIN] Update connections';

export interface Connections {
  [chainId: string]: {
    [url: string]: WSC;
  };
}

export interface State {
  connections: Connections;
}

export const initialState: State = {
  connections: {},
};

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case UPDATE_CONNECTIONS: {
      return {
        ...state,
        connections: action.payload,
      };
    }

    default:
      return state;
  }
};

const getConnectionsMainState = createSelector(
  (state) => state,
  (state: any) => state.connections
);

export const getConnections = createSelector(getConnectionsMainState, (state: State) => state.connections);
