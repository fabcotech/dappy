import { createSelector } from 'reselect';

import { Action } from '../';
import * as fromActions from './actions';
import { Cookie } from '../../models';

export interface State {
  cookies: {
    [address: string]: Cookie[];
  };
}

export const initialState: State = {
  cookies: {},
};

export const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case fromActions.UPDATE_COOKIES_FROM_STORAGE: {
      const payload: fromActions.UpdateCookiesFromStoragePayload = action.payload;

      let newCookies: { [address: string]: Cookie[] } = {};
      payload.cookiesFromStorage.forEach((c) => {
        newCookies[c.host] = c.cookies;
      });
      return {
        ...state,
        cookies: newCookies,
      };
    }

    case fromActions.SAVE_COOKIES_FOR_DOMAIN_COMPLETED: {
      const payload: fromActions.SaveCookiesForDomainPayload = action.payload;

      return {
        ...state,
        cookies: {
          ...state.cookies,
          [payload.host]: payload.cookies,
        },
      };
    }

    default:
      return state;
  }
};

// SELECTORS

export const getCookiesState = createSelector(
  (state) => state,
  (state: any) => state.cookies
);

export const getCookies = createSelector(getCookiesState, (state: State) => state.cookies);

// COMBINED SELECTORS
