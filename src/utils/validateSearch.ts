export const validateName = (name: string) => {
  if (typeof name !== 'string') {
    return false;
  }
  const matchs = name.match(/[a-z]+([a-z0-9]*)/);
  if (matchs && matchs.length) {
    return matchs[0] && matchs.index === 0 && matchs[0].length === name.length;
  }
  return false;
};

export const validateSearch = (search: string): boolean => {
  return /[a-z]*:(\w[A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};

export const validateSearchWithProtocol = (search: string): boolean => {
  return /^dappy:\/\/\w[a-z]*:(\w[A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};

export const validateShortcutSearchWithProtocol = (search: string): boolean => {
  return /^dappy:\/\/(\w[A-Za-z0-9]*)(\w[A-Za-z0-9?%&()*+-_.\/:.@=\[\]{}]*)?$/gs.test(search);
};
