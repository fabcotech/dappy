export const buildUnforgeableDeployQuery = (unforgeableName: string) => {
  return {
    UnforgDeploy: { data: unforgeableName },
  };
};
