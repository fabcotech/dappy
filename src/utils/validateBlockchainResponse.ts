import Ajv from 'ajv';

import { LoadErrorWithArgs, LoadError } from '../models';

const ajv = new Ajv();
const schema = {
  schemaId: 'dpy-or-file-ast-rholang',
  type: 'object',
  properties: {
    expr: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ExprMap: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
              },
            },
            required: ['data'],
          },
        },
        required: ['ExprMap'],
      },
    },
    block: {
      type: 'object',
      properties: {
        seqNum: {
          type: 'number',
        },
        timestamp: {
          type: 'number',
        },
      },
      required: ['seqNum', 'timestamp'],
    },
  },
  required: ['expr', 'block'],
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const validate = ajv.compile(schema);

export const validateBlockchainResponse = (
  response: any,
  searchedFor: string,
  atLeastOneExpr = false
): LoadErrorWithArgs | null => {
  const parsedResponse = JSON.parse(response);
  if (!parsedResponse.success) {
    return {
      error: LoadError.ResourceNotFound,
      args: {
        search: searchedFor,
      },
    };
  }

  if (['"Computation ran out of phlogistons."'].includes(parsedResponse.data)) {
    return {
      error: LoadError.FailedToParseResponse,
      args: {
        message: parsedResponse.data,
      },
    };
  }

  const parsedData = JSON.parse(parsedResponse.data);
  const valid = validate(parsedData);
  if (!valid) {
    return {
      error: LoadError.FailedToParseResponse,
      args: {
        message: '[data] must be an object and have string at path ".expr[0].ExprString.data"',
      },
    };
  }

  if (atLeastOneExpr && !parsedData.expr[0]) {
    return {
      error: LoadError.FailedToParseResponse,
      args: {
        message: '[data] must be an object and have string at path ".expr[0].ExprString.data"',
      },
    };
  }

  return null;
};
