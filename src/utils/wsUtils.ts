import { MultiRequestParameters } from '/models';
import { multiRequest } from '/interProcess';

interface ValidationError {
  dataPath: string;
  message: string;
}

export interface Request {
  query: () => any;
  parse: (obj: any) => any;
  validate: (obj: any) => ValidationError[];
}

export interface RequestResult<TResult> {
  result: TResult;
  validationErrors: ValidationError[];
}

export const multiRequestParseAndValidate = async (
  requests: Request[],
  options: MultiRequestParameters
): Promise<RequestResult<any>[]> => {
  return multiRequest(
    {
      type: 'explore-deploy-x',
      body: {
        terms: requests.map((r) => r.query()),
      },
    },
    options
  ).then((r) => {
    const dataFromBlockchain = r.result;
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
