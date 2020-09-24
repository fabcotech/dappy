import * as yup from 'yup';
import { TransactionState } from '../../models';

// todo have the origin validation working ?
export const transactionOriginSchemas = yup.mixed().oneOf([
  // transfer
  yup.object().shape({
    origin: yup
      .string()
      .matches(/transfer/)
      .required(),
  }),
  // dapp
  yup.object().shape({
    origin: yup.string().matches(/dapp/).required(),
    dappId: yup.string().required(),
    dappTitle: yup.string().required(),
    callId: yup.string().required(),
  }),
  // record
  yup.object().shape({
    origin: yup
      .string()
      .matches(/record/)
      .required(),
    recordName: yup.string().required(),
  }),
  // deploy
  yup.object().shape({
    origin: yup
      .string()
      .matches(/deploy/)
      .required(),
  }),
  // rholang
  yup.object().shape({
    origin: yup
      .string()
      .matches(/rholang/)
      .required(),
  }),
]);

export const transactionStateSchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    transaction: yup.object(),
    status: yup
      .string()
      .matches(/pending|aired|failed|abandonned|completed/)
      .required(),
    platform: yup
      .string()
      .matches(/rchain/)
      .required(),
    // todo validate value properly ?
    value: yup.mixed().test('is-transaction-value', '${path} is not valid transaction value', (v: any) => {
      if (typeof v === 'string' || typeof v === 'undefined') {
        return true;
      }
      if (v !== null && typeof v === 'object' && typeof v.address == 'string') {
        return true;
      }
      if (v !== null && typeof v === 'object' && typeof v.message == 'string') {
        return true;
      }
      if (v !== null && typeof v === 'object' && typeof v.status == 'string') {
        return true;
      }

      if (v !== null && typeof v === 'object') {
        return true;
      }
      return false;
    }),
    blockchainId: yup.string().required(),
    blockchainInfo: yup.string(),
    sentAt: yup.string().required(),
    origin: yup.object().required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateTransactionState = (transactionState: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    transactionStateSchema
      .validate(transactionState)
      .then(() => {
        resolve(true);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

export const validateTransactionStates = (transactionStates: any): Promise<TransactionState[]> => {
  return new Promise((resolve, reject) => {
    if (!transactionStates || !Array.isArray(transactionStates)) {
      reject('Must be an array');
      return;
    }

    return Promise.all(transactionStates.map(validateTransactionState))
      .then(() => {
        resolve(transactionStates as TransactionState[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
