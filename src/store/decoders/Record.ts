import * as yup from 'yup';

import { Record } from '/models';

export const recordServerSchema = yup
  .object()
  .shape({
    ip: yup.string().required(),
    host: yup.string().required(),
    cert: yup.string().required(),
    primary: yup.boolean().required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const recordFromNetworkSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    publicKey: yup.string().required(),
    box: yup.string().required(),
    price: yup.number(),
    address: yup.string(),
    csp: yup.string(),
    servers: yup.array(recordServerSchema),
    badges: yup.object(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateRecordFromNetwork = (record: any) =>
  new Promise<true>((resolve, reject) => {
    recordFromNetworkSchema
      .validate(record)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const ipRecordSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    publicKey: yup.string().required(),
    box: yup.string().required(),
    price: yup.number(),
    loadedAt: yup.string().required(),
    servers: yup.array(recordServerSchema),
    csp: yup.string(),
    badges: yup.object(),
    origin: yup
      .string()
      .matches(/blockchain|user/)
      .required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const dappRecordSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    publicKey: yup.string().required(),
    box: yup.string().required(),
    price: yup.number(),
    address: yup.string().required(),
    loadedAt: yup.string().required(),
    servers: yup.array(recordServerSchema),
    csp: yup.string(),
    badges: yup.object(),
    origin: yup
      .string()
      .matches(/blockchain|user/)
      .required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const recordSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    publicKey: yup.string().required(),
    box: yup.string().required(),
    price: yup.number(),
    address: yup.string(),
    csp: yup.string(),
    loadedAt: yup.string().required(),
    servers: yup.array(recordServerSchema),
    badges: yup.object(),
    origin: yup
      .string()
      .matches(/blockchain|user/)
      .required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateRecord = (record: any) =>
  new Promise<true>((resolve, reject) => {
    recordSchema
      .validate(record)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateRecords = (records: any): Promise<Record[]> => {
  return new Promise((resolve, reject) => {
    if (!records || !Array.isArray(records)) {
      reject('Must be an array');
      return;
    }

    return Promise.all(records.map(validateRecord))
      .then(() => {
        resolve(records as Record[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
