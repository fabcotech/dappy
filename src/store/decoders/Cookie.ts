import * as yup from 'yup';

import { Cookie } from '../../models';

export const cookieSchema = yup
  .object()
  .shape({
    dappyDomain: yup.string().required(),
    cookies: yup.array().of(
      yup
        .object()
        .shape({
          name: yup.string().required(),
          value: yup.string(),
          domain: yup.string().required(),
          expirationDate: yup.number().required(),
        })
        .required()
        .noUnknown(true)
        .strict(true)
    ),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateCookie = (c: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    cookieSchema
      .validate(c)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateCookies = (cookies: any): Promise<{ dappyDomain: string; cookies: Cookie[] }[]> => {
  return new Promise((resolve, reject) => {
    if (!cookies || !Array.isArray(cookies)) {
      reject('Must be an array');
      return;
    }

    return Promise.all(cookies.map(validateCookie))
      .then(() => {
        resolve(cookies as { dappyDomain: string; cookies: Cookie[] }[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
