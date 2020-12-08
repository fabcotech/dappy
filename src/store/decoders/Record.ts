import * as yup from 'yup';

import { Record, RecordFromNetwork } from '../../models';

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
    address: yup.string(),
    nonce: yup.string().required(),
    servers: yup.array(recordServerSchema),
    badges: yup.object(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateRecordFromNetwork = (record: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    recordFromNetworkSchema
      .validate(record)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

export const validateRecordsFromNetwork = (records: any): Promise<RecordFromNetwork[]> => {
  return new Promise((resolve, reject) => {
    if (!records || !Array.isArray(records)) {
      reject('Must be an array');
      return;
    }

    const recordsParsed = records.map((r) => {
      if (r.servers) {
        r.servers = JSON.parse(`{ "value": ${r.servers}}`).value;
      }
      return r;
    });

    return Promise.all(recordsParsed.map(validateRecordFromNetwork))
      .then(() => {
        resolve(recordsParsed as RecordFromNetwork[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const ipRecordSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    publicKey: yup.string().required(),
    loadedAt: yup.string().required(),
    servers: yup.array(recordServerSchema),
    badges: yup.object(),
    origin: yup
      .string()
      .matches(/blockchain|user/)
      .required(),
    nonce: yup.string(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const dappRecordSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    publicKey: yup.string().required(),
    address: yup.string().required(),
    loadedAt: yup.string().required(),
    servers: yup.array(recordServerSchema),
    badges: yup.object(),
    origin: yup
      .string()
      .matches(/blockchain|user/)
      .required(),
    nonce: yup.string(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const recordSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    publicKey: yup.string().required(),
    address: yup.string(),
    loadedAt: yup.string().required(),
    servers: yup.array(recordServerSchema),
    badges: yup.object(),
    origin: yup
      .string()
      .matches(/blockchain|user/)
      .required(),
    nonce: yup.string(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateRecord = (record: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    recordSchema
      .validate(record)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
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
