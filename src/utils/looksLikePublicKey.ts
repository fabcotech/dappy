export const looksLikePublicKey = (astring: string) => {
  if (typeof astring === "string" && astring.length === 130) {
    return true;
  }
  return false;
};
