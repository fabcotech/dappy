const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

export const formatAmount = (amount: number) => {
  return formatter.format(amount).substr(1)
};

export const formatAmountNoDecimal = (amount: number) => {
  return formatter.format(amount).substr(1, formatter.format(amount).length - 4)
};
