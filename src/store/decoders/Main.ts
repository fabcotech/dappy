import * as yup from 'yup';

export const mainSchema = yup
  .object()
  .shape({
    currentVersion: yup.string().required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateMain = (main: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    mainSchema
      .validate(main)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });
