import { takeEvery, select } from 'redux-saga/effects';

import { store } from '../..';
import * as fromBlockchain from '..';
import * as fromSettings from '../../settings';
import * as fromMain from '../../main';
import { Blockchain } from '../../../models';
import { Action } from '../../';
import { validateRecordFromNetwork } from '../../decoders';
import { MultiCallError, Account } from '../../../models/';
import { multiCall } from '../../../utils/wsUtils';
import { getNodeIndex } from '../../../utils/getNodeIndex';

const executeRecordsByPublicKeyCronJobs = function* (action: Action) {
  const namesBlockchain: Blockchain | undefined = yield select(fromSettings.getNamesBlockchain);
  const accounts: {
    [key: string]: Account;
  } = yield select(fromSettings.getAccounts);

  const publicKeys: { [a: string]: boolean } = {};

  Object.keys(accounts).forEach((k) => {
    publicKeys[accounts[k].publicKey] = true;
  });

  try {
    if (!namesBlockchain || Object.keys(publicKeys).length === 0) {
      return;
    }

    /*
      Do not touch the lines below, do not add a condition on n.readyState or n.active
      Nodes are level 1 data, they must be retreived by asking ALL members of
      the Dappy network
    */
    const indexes = namesBlockchain.nodes.map(getNodeIndex);

    multiCall(
      {
        type: 'get-x-records-by-public-key',
        body: { publicKeys: Object.keys(publicKeys).slice(0, 5) },
      },
      {
        chainId: namesBlockchain.chainId,
        urls: indexes,
        resolverMode: 'absolute',
        resolverAccuracy: 100,
        resolverAbsolute: indexes.length,
        multiCallId: fromBlockchain.EXECUTE_NODES_CRON_JOBS,
      }
    )
      .then((a) => {
        const resultFromBlockchain = JSON.parse(a.result.data);
        const records = resultFromBlockchain.records;

        records.forEach(async (recordFromBlockchain: any) => {
          if (recordFromBlockchain && recordFromBlockchain.servers) {
            const servers = JSON.parse(`{ "value": ${recordFromBlockchain.servers}}`).value;
            recordFromBlockchain.servers = servers;
          }
          if (recordFromBlockchain.badges) {
            recordFromBlockchain.badges = JSON.parse(recordFromBlockchain.badges);
          }
          if (typeof recordFromBlockchain.price === "string" && recordFromBlockchain.price.length) {
            recordFromBlockchain.price = parseInt(recordFromBlockchain.price, 10);
          }
          try {
            await validateRecordFromNetwork(recordFromBlockchain);
            const record = {
              ...recordFromBlockchain,
              loadedAt: new Date().toString(),
              origin: 'blockchain',
            };
            store.dispatch(fromBlockchain.getOneRecordCompletedAction({ record: record }));
          } catch (err) {
            console.log('Records could not be validated');
            console.log(err);
            console.log(recordFromBlockchain);
            store.dispatch(
              fromMain.saveErrorAction({
                errorCode: 2054,
                error: '[Blockchain] Failed to validate record from records by public key cron jobs',
                trace: err,
              })
            );
          }
        });
        return;
      })
      .catch((err: MultiCallError) => {
        console.log('executeRecordsByPublicKeyCronJobs');
        console.log(err);
      });
  } catch (e) {
    store.dispatch(
      fromMain.saveErrorAction({
        errorCode: 2053,
        error: '[Blockchain] Failed to execute records by public key cron jobs (1)',
        trace: e,
      })
    );
  }
};

export const executeRecordsByPublicKeyCronJobsSaga = function* () {
  yield takeEvery(fromBlockchain.EXECUTE_RECORDS_BY_PUBLIC_KEY_CRON_JOBS, executeRecordsByPublicKeyCronJobs);
};
