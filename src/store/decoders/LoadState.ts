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

export const validateLoadState = (loadState: any) =>
  new Promise<true>((resolve, reject) => {
    loadStateSchema
      .validate(loadState)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });
