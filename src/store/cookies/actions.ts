import { Cookie } from '../../models';

export const UPDATE_COOKIES_FROM_STORAGE = '[Cookies] Upate cookies from storage';
export const SAVE_COOKIES_FOR_DOMAIN = '[Cookies] Save cookies for domain';
export const SAVE_COOKIES_FOR_DOMAIN_COMPLETED = '[Cookies] Save cookies for domain completed';

export interface UpdateCookiesFromStoragePayload {
  cookiesFromStorage: {
    dappyDomain: string;
    cookies: Cookie[]
  }[]
}
export const updateCookiesFromStorageAction = (values: UpdateCookiesFromStoragePayload) => ({
  type: UPDATE_COOKIES_FROM_STORAGE,
  payload: values,
});

export interface SaveCookiesForDomainPayload {
  dappyDomain: string;
  cookies: Cookie[];
}
export const saveCookiesForDomainAction = (values: SaveCookiesForDomainPayload) => ({
  type: SAVE_COOKIES_FOR_DOMAIN,
  payload: values,
});
export const saveCookiesForDomainCompletedAction = (values: SaveCookiesForDomainPayload) => ({
  type: SAVE_COOKIES_FOR_DOMAIN_COMPLETED,
  payload: values,
});
