import { BlockchainNode, MultiCallBody, MultiCallParameters, MultiCallResult } from '/models';

interface ValidationError {
  dataPath: string;
  message: string;
}

export interface Request {
  execute: () => any;
  parse: (obj: any) => any;
  validate: (obj: any) => ValidationError[] | undefined;
}

export interface RequestResult<TResult> {
  result: TResult;
  validationErrors?: ValidationError[];
}

export const multiCallParseAndValidate = async (
  requests: Request[],
  options: MultiCallParameters
): Promise<RequestResult<any>[]> => {
  return multiCall(
    {
      type: 'explore-deploy-x',
      body: {
        terms: requests.map((r) => r.execute()),
      },
    },
    options
  ).then((r) => {
    const dataFromBlockchain = r.result.data;
    const dataFromBlockchainParsed: { data: { results: { data: string }[] } } = JSON.parse(dataFromBlockchain);

    var parsedResults = dataFromBlockchainParsed.data.results.map((r, i) => requests[i].parse(r));

    return requests.map(
      ({ validate }, i) =>
        ({
          result: parsedResults[i],
          validationErrors: validate(parsedResults[i]),
        } as RequestResult<any>)
    );
  });
};
