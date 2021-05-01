export const validateSearch = (search: string): boolean => {
  return /[a-z]*\/[a-z]([A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};

export const validateSearchWithProtocol = (search: string): boolean => {
  return /^dappy:\/\/\w[a-z]*\/[a-z]([A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};

export const validateShortcutSearchWithProtocol = (search: string): boolean => {
  return /^dappy:\/\/[a-z]([A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};
