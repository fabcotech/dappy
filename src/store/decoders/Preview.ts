import * as yup from 'yup';
import { Preview } from '../../models';

export const PreviewSchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    title: yup.string().required(),
    search: yup.string().required(),
    img: yup.string(),
    url: yup.string(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validatePreview = (tab: any): Promise<boolean> =>
  new Promise((resolve, reject) => {
    PreviewSchema.validate(tab)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validatePreviews = (previews: any): Promise<Preview[]> => {
  return new Promise((resolve, reject) => {
    if (!previews || !Array.isArray(previews)) {
      reject();
      return;
    }

    return Promise.all(previews.map(validatePreview))
      .then(() => {
        resolve(previews as Preview[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
