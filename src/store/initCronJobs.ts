import Redux from 'redux';

import * as fromSettings from './settings';
import {
  CRON_JOBS_SUBSCRIPTION_PERIOD_ACCOUNTS,
} from '../CONSTANTS';

export const initCronJobs = (store: Redux.Store) => {
  /* const accountsStream: NodeJS.Timeout = setInterval(() => {
    store.dispatch(fromSettings.executeAccountsCronJobsAction());
  }, CRON_JOBS_SUBSCRIPTION_PERIOD_ACCOUNTS); */

  /* store.dispatch(fromSettings.executeAccountsCronJobsAction()); */
};
