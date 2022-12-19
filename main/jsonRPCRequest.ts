import https from 'https';
import { ChainRaw, CHAINS_RAW_LIST } from './chainData';

export const fetch = <T>(
  options: https.RequestOptions,
  data: object,
  parseResponse: (r: string) => T
) => {
  return new Promise<string>((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        resolve(body.toString());
      });

      res.on('error', (error) => {
        reject(error);
      });
    });
    req.write(JSON.stringify(data));
    req.end();
  }).then(parseResponse);
};

export const chainsByHex = CHAINS_RAW_LIST.reduce((acc, chain) => {
  acc[chain.hex] = chain;
  return acc;
}, {} as Record<string, ChainRaw>);

export const getHostAndPath = (url: string) => {
  const [hostname, ...path] = url.replace(/https?:\/\//, '').split('/');
  return {
    hostname,
    path: `/${path.join('/')}`,
  };
};

export const getRPCUrl = (chainId: string) => {
  return getHostAndPath(chainsByHex[chainId].thirdPartyRPC);
};

const JSONRPCData = {
  jsonrpc: '2.0',
  id: 1,
};

const JSONRPCOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const fetchEthBlockNumber = (chainId: string) =>
  fetch(
    {
      ...JSONRPCOptions,
      ...getRPCUrl(chainId),
    },
    {
      ...JSONRPCData,
      method: 'eth_blockNumber',
      params: [],
    },
    (r: string) => JSON.parse(r).result
  );

export const fetchEthCall = (chainId: string, params: unknown[]) =>
  fetch(
    {
      ...JSONRPCOptions,
      ...getRPCUrl(chainId),
    },
    {
      ...JSONRPCData,
      method: 'eth_call',
      params,
    },
    (r: string) => JSON.parse(r).result
  );

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

export const fetchGasPrice = (chainId: string) =>
  fetch(
    {
      ...JSONRPCOptions,
      ...getRPCUrl(chainId),
    },
    {
      ...JSONRPCData,
      method: 'eth_gasPrice',
    },
    (r: string) => JSON.parse(r).result
  );
