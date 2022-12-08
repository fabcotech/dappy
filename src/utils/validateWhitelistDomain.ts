export const validateWhitelistDomain = (domain: string): boolean => {
  return /^((\*|[a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)*(\*|[a-z0-9]|[a-z0-9][:a-z0-9-]*[a-z0-9])$/g.test(
    domain
  );
};
