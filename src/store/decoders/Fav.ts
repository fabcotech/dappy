import * as yup from 'yup';
import { Fav } from '/models';

export const FavSchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    title: yup.string().required(),
    img: yup.string(),
    url: yup.string().required(),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateFav = (fav: any) =>
  new Promise<true>((resolve, reject) => {
    FavSchema.validate(fav)
      .then(() => {
        resolve(true);
      })
      .catch((err: yup.ValidationError) => {
        reject(err);
      });
  });

export const validateFavs = (fabs: any): Promise<Fav[]> => {
  return new Promise((resolve, reject) => {
    if (!fabs || !Array.isArray(fabs)) {
      reject();
      return;
    }

    return Promise.all(fabs.map(validateFav))
      .then(() => {
        resolve(fabs as Fav[]);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
