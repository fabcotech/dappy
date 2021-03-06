import * as yup from 'yup';

export const settingsSchema = yup
  .object()
  .shape({
    devMode: yup.boolean().required(),
    resolver: yup
      .string()
      .matches(/auto|custom/)
      .required(),
    resolverMode: yup
      .string()
      .matches(/absolute/)
      .required(),
    resolverAccuracy: yup
      .number()
      .min(51)
      .max(100)
      .required(),
    resolverAbsolute: yup
      .number()
      .min(1)
      .max(10)
      .required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateSettings = (settings: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    settingsSchema
      .validate(settings)
      .then(a => {
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
