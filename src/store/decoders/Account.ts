import * as yup from 'yup';

import { Account } from '/models';

const whitelistSchema = yup.array().of(
  yup
    .object()
    .shape({
      host: yup.string().required(),
      blitz: yup.boolean().required(),
      transactions: yup.boolean().required(),
    })
    .required()
);

export const blockchainAccountSchema = yup
  .object()
  .shape({
    platform: yup
      .string()
      .matches(/rchain|evm/)
      .required(),
    name: yup.string().required(),
    publicKey: yup.string().required(),
    address: yup.string().required(),
    main: yup.boolean().required(),
    encrypted: yup.string().required(),
    balance: yup.number().required(),
    boxes: yup.array().of(yup.string().required()),
    whitelist: whitelistSchema,
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const certificateAccountSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    main: yup.boolean().required(),
    platform: yup.mixed().oneOf(['certificate']),
    key: yup.string().required(),
    certificate: yup.string().required(),
    whitelist: whitelistSchema,
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const accountSchema = yup.lazy((value) => {
  if (/rchain|evm/.test(value.platform)) {
    return blockchainAccountSchema;
  }
  return certificateAccountSchema;
});

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
      reject(new Error('Must be an array'));
      return;
    }

    Promise.all(accounts.map(validateAccount))
      .then(() => {
        resolve(accounts as Account[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
