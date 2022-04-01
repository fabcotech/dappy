import * as yup from 'yup';

export const networkMemberSchema = yup
  .object()
  .shape({
    ip: yup.string().required(),
    port: yup.string(),
    hostname: yup.string().required(),
    caCert: yup.string(),
    scheme: yup
      .string()
      .matches(/http|https/)
      .required(),
  })
  .required();
