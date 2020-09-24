export const buildUnforgeableNameQuery = (unforgeableName: string) => {
  return {
    UnforgPrivate: { data: unforgeableName },
  };
};
