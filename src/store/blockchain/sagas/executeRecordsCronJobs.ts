import { takeEvery, select } from 'redux-saga/effects';

import { store } from '../..';
import * as fromBlockchain from '..';
import * as fromSettings from '../../settings';
import * as fromMain from '../../main';
import { Blockchain, LoadError, Record } from '../../../models';
import { Action } from '../../';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { validateRecordsFromNetwork } from '../../decoders';
import { MultiCallError } from '../../../models/WebSocket';
import { multiCall } from '../../../utils/wsUtils';

const executeRecordsCronJobs = function* (action: Action) {
  const namesBlockchain: Blockchain | undefined = yield select(fromSettings.getNamesBlockchain);

  const t = new Date().getTime();
  try {
    if (!namesBlockchain) {
      return;
    }

    /*
      Do not touch the lines below, do not add a condition on n.readyState or n.active
      rchain infos are level 1 data, they must be retreived by asking ALL members of
      the Dappy network
    */
    const indexes = namesBlockchain.nodes.map(getNodeIndex);

    multiCall(
      { type: 'get-all-records' },
      {
        chainId: namesBlockchain.chainId,
        urls: indexes,
        resolverMode: 'absolute',
        resolverAccuracy: 100,
        resolverAbsolute: indexes.length,
        multiCallId: fromBlockchain.EXECUTE_RECORDS_CRON_JOBS,
      }
    )
      .then((a) => {
        const resultFromBlockchain = JSON.parse(a.result.data);
        const recordsToValidate = JSON.parse(resultFromBlockchain.data).map((r: any) => {
          if (r.badges) {
            return {
              ...r,
              badges: JSON.parse(r.badges),
            };
          }
        });
        validateRecordsFromNetwork(recordsToValidate)
          .then((records) => {
            const u = new Date().getTime() - t;
            store.dispatch(
              fromBlockchain.getAllRecordsCompletedAction({
                records: records.map((r) => {
                  return {
                    ...r,
                    loadedAt: new Date().toString(),
                    origin: 'blockchain',
                  };
                }) as Record[],
                date: new Date().toISOString(),
                time: u,
                loadState: a.loadState,
                loadErrors: a.loadErrors,
              })
            );
          })
          .catch((err) => {
            const u = new Date().getTime() - t;
            store.dispatch(
              fromBlockchain.getAllRecordsFailedAction({
                chainId: namesBlockchain.chainId,
                date: new Date().toISOString(),
                time: u,
                loadState: a.loadState,
                error: {
                  error: LoadError.InvalidRecords,
                  args: {
                    message: 'Failed to parse records : ' + err.message,
                  },
                },
              })
            );
          });
      })
      .catch((err: MultiCallError) => {
        const u = new Date().getTime() - t;
        store.dispatch(
          fromBlockchain.getAllRecordsFailedAction({
            chainId: namesBlockchain.chainId,
            loadState: err.loadState, // todo check if important
            date: new Date().toISOString(),
            time: u,
            error: err.error,
          })
        );
      });
  } catch (e) {
    store.dispatch(
      fromMain.saveErrorAction({
        errorCode: 2026,
        error: '[Blockchain] Failed to get all names',
        trace: e,
      })
    );
  }
};

export const executeRecordsCronJobsSaga = function* () {
  yield takeEvery(fromBlockchain.EXECUTE_RECORDS_CRON_JOBS, executeRecordsCronJobs);
};
