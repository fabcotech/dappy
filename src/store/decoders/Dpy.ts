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

export const validateFile = (file: any) =>
  new Promise<true>((resolve, reject) => {
    fileSchema
      .validate(file)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
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

export const validateDpy = (dpy: any) =>
  new Promise<true>((resolve, reject) => {
    dpySchema
      .validate(dpy)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });
