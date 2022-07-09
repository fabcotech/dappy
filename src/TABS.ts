import { DAPPY_NAME_SYSTEM_VISUAL_TLD } from './CONSTANTS';
import { Tab } from './models';

export const PREDEFINED_TABS: Tab[] = [
  {
    active: true,
    muted: false,
    favorite: false,
    counter: 1,
    id: '4197916470-3340326584-4078976114-3631401',
    img: undefined,
    index: 0,
    url: `dappy.${DAPPY_NAME_SYSTEM_VISUAL_TLD}`,
    title: 'Dappy',
    data: {
      publicKey: undefined,
      chainId: undefined,
    },
    lastError: undefined,
  },
  {
    active: true,
    muted: false,
    favorite: false,
    counter: 1,
    id: '4197916470-3340326584-4078976114-3631511401',
    img: undefined,
    index: 2,
    url: `rchain.${DAPPY_NAME_SYSTEM_VISUAL_TLD}`,
    title: 'RChain',
    data: {
      publicKey: undefined,
      chainId: undefined,
    },
    lastError: undefined,
  },
];
