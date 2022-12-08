import { utils } from 'ethers';

export const toHex = (f: string) => {
  return utils.hexlify(parseInt(f, 10)).replace('0x0', '0x');
};
