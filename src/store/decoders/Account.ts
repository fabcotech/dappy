import * as yup from 'yup';

import { Account } from '../../models';

export const accountSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    publicKey: yup.string().required(),
    address: yup.string().required(),
    main: yup.boolean().required(),
    encrypted: yup.string().required(),
    balance: yup.number().required(),
    platform: yup
      .string()
      .matches(/rchain|/)
      .required(),
    boxes: yup.array().of(yup.string().required()),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateAccount = (account: any) =>
  new Promise<true>((resolve, reject) => {
    accountSchema
      .validate(account)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateAccounts = (accounts: any): Promise<Account[]> => {
  return new Promise<Account[]>((resolve, reject) => {
    if (!accounts || !Array.isArray(accounts)) {
      reject('Must be an array');
      return;
    }

    return Promise.all(accounts.map(validateAccount))
      .then(() => {
        resolve(accounts as Account[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
