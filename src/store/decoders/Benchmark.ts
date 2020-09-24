import * as yup from 'yup';

const benchmarkSchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    chainId: yup.string().required(),
    url: yup.string().required(),
    responseTime: yup.number(),
    date: yup.string().required(),
    info: yup.object().shape({
      dappyNodeVersion: yup.string().required(),
      rnodeVersion: yup.string().required(),
    }),
  })
  .required()
  .noUnknown(true)
  .strict(true);

export const validateBenchmark = (b: any) => {
  return benchmarkSchema.isValid(b);
};

export const validateBenchmarks = (benchmarks: any) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(benchmarks)) {
      reject();
      return;
    }
    if (!benchmarks.length) {
      resolve();
      return;
    }
    return Promise.all(Object.keys(benchmarks).map(b => benchmarkSchema.isValid(b))).then(results => {
      if (results.find(valid => !valid)) {
        reject();
      } else {
        resolve();
      }
    });
  });
};
