import Redux from 'redux';

import * as fromSettings from './settings';
import * as fromBlockchain from './blockchain';
import {
  CRON_JOBS_SUBSCRIPTION_PERIOD_INFOS,
  CRON_JOBS_SUBSCRIPTION_PERIOD_NODES,
  CRON_JOBS_SUBSCRIPTION_PERIOD_ACCOUNTS,
} from '../CONSTANTS';

export const initCronJobs = (store: Redux.Store) => {
  const nodesStream: NodeJS.Timeout = setInterval(() => {
    store.dispatch(fromBlockchain.executeNodesCronJobsAction());
  }, CRON_JOBS_SUBSCRIPTION_PERIOD_NODES);

  const rchainStream: NodeJS.Timeout = setInterval(() => {
    store.dispatch(fromBlockchain.executeRChainCronJobsAction());
  }, CRON_JOBS_SUBSCRIPTION_PERIOD_INFOS);

  const accountsStream: NodeJS.Timeout = setInterval(() => {
    store.dispatch(fromSettings.executeAccountsCronJobsAction());
  }, CRON_JOBS_SUBSCRIPTION_PERIOD_ACCOUNTS);

  store.dispatch(fromBlockchain.executeRChainCronJobsAction());
  store.dispatch(fromBlockchain.executeNodesCronJobsAction());
  store.dispatch(fromSettings.executeAccountsCronJobsAction());

  store.dispatch(fromBlockchain.saveRChainCronJobsStreamAction({ stream: rchainStream }));
};
