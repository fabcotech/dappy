import * as yup from 'yup';

import { Cookie } from '/models';

export const cookieSchema = yup
  .object()
  .shape({
    host: yup.string().required(),
    cookies: yup.array().of(
      yup
        .object()
        .shape({
          name: yup.string().required(),
          value: yup.string(),
          sameSite: yup.string().required(),
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

export const validateCookie = (c: any) =>
  new Promise<true>((resolve, reject) => {
    cookieSchema
      .validate(c)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateCookies = (cookies: any): Promise<{ host: string; cookies: Cookie[] }[]> => {
  return new Promise<{ host: string; cookies: Cookie[] }[]>((resolve, reject) => {
    if (!cookies || !Array.isArray(cookies)) {
      reject('Must be an array');
      return;
    }
    // migration
    // adding .sameSite if cookie does not have it
    const cookiesMigrated: { host: string; cookies: Cookie[] }[] = cookies.map((c) => {
      return {
        ...c,
        cookies: c.cookies.map((c: any) => {
          return {
            ...c,
            sameSite: c.sameSite || 'lax',
          };
        }),
      };
    });
    return Promise.all(cookiesMigrated.map(validateCookie))
      .then(() => {
        resolve(cookiesMigrated);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
