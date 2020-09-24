import { IpApp } from '../../src/models';

export const SYNC_IP_APPS = '[MAIN] Sync IP apps';

export interface State {
  [appId: string]: IpApp;
}

export const initialState: State = {};

export const reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case SYNC_IP_APPS: {
      return action.payload;
    }

    default:
      return state;
  }
};
