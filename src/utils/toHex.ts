import { utils } from 'ethers';

export const toHex = (f: string | undefined) => {
  if (!f) return '0x';
  return utils.hexlify(parseInt(f, 10)).replace('0x0', '0x');
};
