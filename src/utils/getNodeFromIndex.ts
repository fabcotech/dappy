export const getNodeFromIndex = (index: string): { ip: string; hostname: string } => {
  return {
    ip: index.split('---')[0],
    hostname: index.split('---')[1],
  };
};
