import Redux from 'redux';

import * as fromSettings from './settings';
import * as fromBlockchain from './blockchain';
import {
  CRON_JOBS_SUBSCRIPTION_PERIOD_INFOS,
  CRON_JOBS_SUBSCRIPTION_PERIOD_NODES,
  CRON_JOBS_SUBSCRIPTION_PERIOD_ACCOUNTS,
  CRON_JOBS_NAMES_MODULO_CONDITION,
} from '../CONSTANTS';

export const initCronJobs = (store: Redux.Store) => {
  const nodesStream: NodeJS.Timeout = setInterval(() => {
    store.dispatch(fromBlockchain.executeNodesCronJobsAction());
  }, CRON_JOBS_SUBSCRIPTION_PERIOD_NODES);

  const rchainStream: NodeJS.Timeout = setInterval(() => {
    store.dispatch(fromBlockchain.executeRChainCronJobsAction());
  }, CRON_JOBS_SUBSCRIPTION_PERIOD_INFOS);

  const recordsStream: NodeJS.Timeout = setInterval(() => {
    if (CRON_JOBS_NAMES_MODULO_CONDITION(new Date().getMinutes())) {
      console.log('launching records job', new Date().getMinutes());
      store.dispatch(fromBlockchain.executeRecordsCronJobsAction());
    } else {
      console.log('not launching records job');
    }
  }, 1000 * 60);

  const accountsStream: NodeJS.Timeout = setInterval(() => {
    store.dispatch(fromSettings.executeAccountsCronJobsAction());
  }, CRON_JOBS_SUBSCRIPTION_PERIOD_ACCOUNTS);

  store.dispatch(fromBlockchain.executeRChainCronJobsAction());
  store.dispatch(fromBlockchain.executeNodesCronJobsAction());
  store.dispatch(fromSettings.executeAccountsCronJobsAction());

  store.dispatch(fromBlockchain.saveRChainCronJobsStreamAction({ stream: rchainStream }));
  store.dispatch(fromBlockchain.saveRecordsCronJobsStreamAction({ stream: recordsStream }));
};
