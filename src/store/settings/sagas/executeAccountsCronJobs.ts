import { takeEvery, select, put } from 'redux-saga/effects';
import Ajv from 'ajv';

import * as fromSettings from '..';

import { LOGREV_TO_REV_RATE } from '../../../CONSTANTS';
import { blockchain as blockchainUtils } from '../../../utils/blockchain';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { Account, Blockchain, LoadErrorWithArgs, LoadCompleted, LoadError, MultiCallResult } from '../../../models';
import { Action } from '../actions';
import { multiCall } from '../../../utils/wsUtils';

const ajv = new Ajv();
const balancesSchema = {
  schemaId: 'balances',
  type: 'object',
  properties: {
    expr: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ExprInt: {
            type: 'object',
            properties: {
              data: {
                type: 'number',
              },
            },
            required: ['data'],
          },
        },
        required: ['ExprInt'],
      },
    },
  },
  required: ['expr'],
};

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const validateBalances = ajv.compile(balancesSchema);

const executeAccountsCronJobs = function* (action: Action) {
  const accounts: {
    [key: string]: Account;
  } = yield select(fromSettings.getAccounts);
  const blockchains: {
    [key: string]: Blockchain;
  } = yield select(fromSettings.getBlockchains);
  const firstBlockchain = blockchains[Object.keys(blockchains)[0]];
  if (!firstBlockchain) {
    return;
  }

  let multiCallResult: MultiCallResult | undefined = undefined;
  try {
    multiCallResult = yield multiCall(
      {
        type: 'explore-deploy-x',
        body: { terms: Object.keys(accounts).map((k) => blockchainUtils.rchain.balanceTerm(accounts[k].address)) },
      },
      {
        // todo, accounts must be attached to a blockchain
        chainId: firstBlockchain.chainId,
        urls: firstBlockchain.nodes.map(getNodeIndex),
        resolverMode: 'absolute',
        resolverAccuracy: 100,
        resolverAbsolute: firstBlockchain.nodes.length,
        multiCallId: fromSettings.EXECUTE_ACCOUNTS_CRON_JOBS,
      }
    );
  } catch (e) {
    yield put(
      fromSettings.updateAccountBalanceFailedAction({
        date: new Date().toISOString(),
        error: e.error as LoadErrorWithArgs,
        loadState: e.loadState as LoadCompleted,
      })
    );
    return;
  }

  let responseParsed: any;
  try {
    responseParsed = JSON.parse((multiCallResult as MultiCallResult).result.data);
  } catch (e) {
    yield put(
      fromSettings.updateAccountBalanceFailedAction({
        date: new Date().toISOString(),
        error: {
          error: LoadError.FailedToParseResponse,
          args: { message: e.message || e },
        },
        loadState: (multiCallResult as MultiCallResult).loadState,
      })
    );
    return;
  }

  let valid = false;
  try {
    valid =
      responseParsed.success &&
      responseParsed.data &&
      responseParsed.data.results.every((r: { success: boolean; data: any }) => {
        return r.success && validateBalances(JSON.parse(r.data));
      });
  } catch (err) {
    yield put(
      fromSettings.updateAccountBalanceFailedAction({
        date: new Date().toISOString(),
        error: {
          error: LoadError.FailedToParseResponse,
          args: { message: err.message || err },
        },
        loadState: (multiCallResult as MultiCallResult).loadState,
      })
    );
    return;
  }

  if (valid) {
    yield put(
      fromSettings.updateAccountBalanceAction({
        balances: Object.keys(accounts).map((k, i) => {
          return {
            accountName: k,
            // todo can a dappy-node not send all the ED results ?
            balance: responseParsed.data.results[i]
              ? JSON.parse(responseParsed.data.results[i].data).expr[0].ExprInt.data / LOGREV_TO_REV_RATE
              : 0,
          };
        }),
      })
    );
  } else {
    yield put(
      fromSettings.updateAccountBalanceFailedAction({
        date: new Date().toISOString(),
        error: { error: LoadError.FailedToParseResponse } as LoadErrorWithArgs,
        loadState: multiCallResult.loadState as LoadCompleted,
      })
    );
    return;
  }
  return;
};

export const executeAccountsCronJobsSaga = function* () {
  yield takeEvery(fromSettings.EXECUTE_ACCOUNTS_CRON_JOBS, executeAccountsCronJobs);
};
