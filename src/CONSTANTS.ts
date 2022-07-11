export const RELOAD_INDEXEDDB_PERIOD = 1000 * 60 * 10;
export const CRON_JOBS_SUBSCRIPTION_PERIOD_INFOS = 40 * 1000;
export const RCHAIN_INFOS_EXPIRATION = 0;

export const CRON_JOBS_SUBSCRIPTION_PERIOD_RECORDS_BY_PUBLIC_KEY = 5 * 60 * 1000;
export const CRON_JOBS_SUBSCRIPTION_PERIOD_ACCOUNTS = 1 * 60 * 1000;
export const CRON_JOBS_SUBSCRIPTION_PERIOD_NODES = 20 * 60 * 1000;
export const CRON_JOBS_LOG_CONTRACT_PERIOD = 60000;
export const WS_PAYLOAD_PAX_SIZE = 512000; // bits

export const REV_TRANSFER_PHLO_LIMIT = 50000000;
export const RCHAIN_TOKEN_OPERATION_PHLO_LIMIT = 10000000;
export const DEFAULT_PHLO_LIMIT = 50000000;
export const LOGREV_TO_REV_RATE = 100000000;

export const VERSION = process.env.PACKAGE_VERSION;

export const RCHAIN_TOKEN_SUPPORTED_VERSIONS = ['17.0.6'];

export const DAPPY_NAME_SYSTEM_VISUAL_TLD = 'd';
export const MAIN_CHAIN_ID = 'd';
export const DAPPY_TOKEN_CONTRACT_ID = 'dappytoken';
export const CHAIN_IDS: { [chainId: string]: { name: string; platform: 'rchain' } } = {
  betanetwork: {
    name: 'Beta network',
    platform: 'rchain',
  },
};

export const DEVELOPMENT = typeof location !== 'undefined' && location.host === 'localhost:3033';

export const LOGS_PER_CONTRACT = 200;

export const FAKE_BALANCE = 1000000;

/*
  If blitz is activated, header verification and exchange will
  take place, no matter if ACCESS_SECURITY is true or false, it meanse
  that you can have ACCESS_SECURITY=false and default account settings
  that will make blitz work
*/
export const BLITZ_AUTHENTICATION = true;

// WHITE LABEL
/*
  Sections you can or cannot navigate to
*/
export const ACCESS_SETTINGS = true;
export const ACCESS_NAME_SYSTEM = true;
export const ACCESS_ACCOUNTS = true;
export const ACCESS_SECURITY = true;
export const ACCESS_DEPLOY = true;
export const ACCESS_TRANSACTIONS = true;
/*
  Remove LEFT_MENU_COLORS or set it to undefined if
  you don't want special colors ex: ['#7fcaff', '#8fdaff']
*/
export const LEFT_MENU_COLORS: undefined | [string, string] = undefined;

export const BRAND_NAME: undefined | string = undefined;

/*
  Iin order to add an image you must add your logo
  (png 512x512) in /images, then import it :
  import brand_img from '/images/labo_mercier.png';

  and export it in this file :
  BRAND_IMG: undefined | string = brand_img;
*/
export const BRAND_IMG: undefined | string = undefined;
