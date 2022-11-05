export const getUniqueTransactionId = () => {
  return new Date().getTime() + Math.round(Math.random() * 10000).toString();
};
