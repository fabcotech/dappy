export const buildUnforgeableNameQuery = (unforgeableName: string) => {
  return {
    UnforgDeploy: { data: unforgeableName },
  };
};
