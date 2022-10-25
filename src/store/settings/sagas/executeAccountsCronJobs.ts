import { takeEvery, select, put } from 'redux-saga/effects';
import { BeesLoadCompleted } from '@fabcotech/bees';
import Ajv from 'ajv';

import * as fromSettings from '..';
import * as fromBlockchain from '/store/blockchain/';

import { LOGREV_TO_REV_RATE } from '/CONSTANTS';
import { blockchain as blockchainUtils } from '/utils/blockchain';
import { getNodeIndex } from '/utils/getNodeIndex';
import { Blockchain, BlockchainAccount, DappyLoadError, MultiRequestResult } from '/models';
import { multiRequest } from '/interProcess';

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

function* executeAccountsCronJobs() {
  const accounts: Record<string, BlockchainAccount> = yield select(fromSettings.getRChainAccounts);
  const blockchains: {
    [key: string]: Blockchain;
  } = yield select(fromSettings.getBlockchains);
  const firstBlockchain = blockchains[Object.keys(blockchains)[0]];
  if (!firstBlockchain) {
    return;
  }

  let multiRequestResult: MultiRequestResult | undefined;
  try {
    multiRequestResult = yield multiRequest(
      {
        type: 'explore-deploy-x',
        body: {
          terms: Object.keys(accounts).map((k) =>
            blockchainUtils.rchain.balanceTerm(accounts[k].address)
          ),
        },
      },
      {
        // todo, accounts must be attached to a blockchain
        chainId: firstBlockchain.chainId,
        urls: firstBlockchain.nodes.map(getNodeIndex),
        resolverMode: 'absolute',
        resolverAccuracy: 100,
        resolverAbsolute: firstBlockchain.nodes.length,
        multiCallId: fromBlockchain.EXPLORE_DEPLOY_X,
      }
    );
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        fromSettings.updateAccountBalanceFailedAction({
          date: new Date().toISOString(),
          error: {
            error: e.message as DappyLoadError,
            args: {},
          },
          loadState: {},
        })
      );
    }
    return;
  }

  let responseParsed: any;
  try {
    responseParsed = JSON.parse((multiRequestResult as MultiRequestResult).result);
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        fromSettings.updateAccountBalanceFailedAction({
          date: new Date().toISOString(),
          error: {
            error: DappyLoadError.FailedToParseResponse,
            args: { message: e.message },
          },
          loadState: (multiRequestResult as MultiRequestResult).loadState,
        })
      );
    }
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
    if (err instanceof Error) {
      yield put(
        fromSettings.updateAccountBalanceFailedAction({
          date: new Date().toISOString(),
          error: {
            error: DappyLoadError.FailedToParseResponse,
            args: { message: err.message },
          },
          loadState: (multiRequestResult as MultiRequestResult).loadState,
        })
      );
      return;
    }
  }

  if (valid) {
    yield put(
      fromSettings.updateAccountBalanceAction({
        balances: Object.keys(accounts).map((k, i) => {
          return {
            accountName: k,
            // todo can a dappy-node not send all the ED results ?
            balance: responseParsed.data.results[i]
              ? JSON.parse(responseParsed.data.results[i].data).expr[0].ExprInt.data /
                LOGREV_TO_REV_RATE
              : 0,
          };
        }),
      })
    );
  } else {
    yield put(
      fromSettings.updateAccountBalanceFailedAction({
        date: new Date().toISOString(),
        error: { error: DappyLoadError.FailedToParseResponse, args: {} },
        loadState: (multiRequestResult as MultiRequestResult).loadState as BeesLoadCompleted,
      })
    );
    return;
  }
  return;
}

export const executeAccountsCronJobsSaga = function* () {
  yield takeEvery(fromSettings.EXECUTE_ACCOUNTS_CRON_JOBS, executeAccountsCronJobs);
};
