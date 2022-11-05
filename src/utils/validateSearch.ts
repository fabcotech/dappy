export const validateSearch = (search: string): boolean => {
  return /[a-z]*:(\w[A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}#]*)?$/gs.test(search);
};
