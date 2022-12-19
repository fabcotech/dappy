export const fetchEstimatedGas = (chainId: string, params: unknown[]) =>
  fetch(
    {
      ...JSONRPCOptions,
      ...getRPCUrl(chainId),
    },
    {
      ...JSONRPCData,
      method: 'eth_estimateGas',
      params,
    },
    (r: string) => JSON.parse(r).result
  );
