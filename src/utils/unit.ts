import { Fee } from '../models';

export const feePermillage = (f: Fee) => (f[1] / 10000).toFixed(3);

export const toDurationString = (milliseconds: number) => `${milliseconds}`;