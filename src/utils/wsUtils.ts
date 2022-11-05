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
