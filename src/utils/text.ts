export const text = {
  truncate: (a: string, n: number) => {
    if (a && a.length > n) {
      return a.substring(0, n) + '...';
    } else {
      return a;
    }
  },
};
