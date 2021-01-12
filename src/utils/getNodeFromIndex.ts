export const getNodeFromIndex = (index: string): { ip: string; host: string } => {
  return {
    ip: index.split('---')[0],
    host: index.split('---')[1],
  };
};
