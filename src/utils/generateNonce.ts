import uuidv4 from 'uuid/v4';

export const generateNonce = () => {
  return uuidv4().replace(/-/g, '');
};
