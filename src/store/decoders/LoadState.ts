import * as yup from 'yup';

export const loadStateSchema = yup
  .object()
  .shape({
    errors: yup.object().required(),
    pending: yup.array().of(yup.string()),
    completed: yup
      .object()
      .shape({
        data: yup.string(),
        nodeUrls: yup.array().of(yup.string()),
      })
      .required()
      .noUnknown(true)
      .strict(true),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateLoadState = (loadState: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    loadStateSchema
      .validate(loadState)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
