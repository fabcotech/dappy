import * as yup from 'yup';

export const fileSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    mimeType: yup.string().required(),
    data: yup.string().required(),
    signature: yup.string(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateFile = (file: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    fileSchema
      .validate(file)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

export const dpySchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    mimeType: yup
      .string()
      .matches(/application\/dappy/)
      .required(),
    data: yup.string().required(),
    signature: yup.string(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateDpy = (dpy: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    dpySchema
      .validate(dpy)
      .then(() => {
        resolve();
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
