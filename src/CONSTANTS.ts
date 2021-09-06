export const RELOAD_INDEXEDDB_PERIOD = 1000 * 60 * 10;
export const CRON_JOBS_SUBSCRIPTION_PERIOD_INFOS = 40 * 1000;
export const RCHAIN_INFOS_EXPIRATION = 0;

export const CRON_JOBS_SUBSCRIPTION_PERIOD_RECORDS_BY_PUBLIC_KEY = 5 * 60 * 1000;
export const CRON_JOBS_SUBSCRIPTION_PERIOD_ACCOUNTS = 1 * 60 * 1000;
export const CRON_JOBS_SUBSCRIPTION_PERIOD_NODES = 20 * 60 * 1000;
export const WS_PAYLOAD_PAX_SIZE = 512000; // bits
export const WS_RECONNECT_PERIOD = 10000;

export const REV_TRANSFER_PHLO_LIMIT = 50000000;
export const RCHAIN_TOKEN_OPERATION_PHLO_LIMIT = 2000000;
export const DEFAULT_PHLO_LIMIT = 50000000;
export const LOGREV_TO_REV_RATE = 100000000;

export const VERSION = '0.4.7';

export const RCHAIN_TOKEN_SUPPORTED_VERSIONS = ['11.0.0'];

export const MAIN_CHAIN_ID = 'd';
export const DAPPY_TOKEN_CONTRACT_ID = 'dappytoken';
export const CHAIN_IDS: { [chainId: string]: { name: string; platform: 'rchain' } } = {
  betanetwork: {
    name: 'Beta network',
    platform: 'rchain',
  },
};

export const DEVELOPMENT = typeof location !== 'undefined' && location.host === 'localhost:3033';
