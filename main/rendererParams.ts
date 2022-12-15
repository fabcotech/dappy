import { dappyNetworks } from '@fabcotech/dappy-lookup';

function tryParseArg(
  arg: string
): { valid: false; arg: undefined } | { valid: true; arg: { name: string; value: string } } {
  const m = arg.match(/^--([^=]+)=?(.+)?$/);

  if (m) {
    return {
      valid: true,
      arg: {
        name: m[1],
        value: m[2],
      },
    };
  }

  return {
    valid: false,
    arg: undefined,
  };
}

const allArgs: Record<string, (value: string) => string> = {
  network: (networkId: string): string => {
    if (Object.keys(dappyNetworks).includes(networkId)) {
      return `network=${networkId}`;
    }
    throw new Error(`Unknown dappy network ${networkId}`);
  },
  whitelist: (env: string) => `whitelist=${env}`,
};

export function getRendererParams(args: string[]) {
  const argKeyValues = args
    .map((a) => {
      const { valid, arg } = tryParseArg(a);
      if (valid) {
        if (arg.name in allArgs) {
          return allArgs[arg.name](arg.value);
        }
      } else {
        throw new Error(`Invalid argument ${a}`);
      }
    })
    .filter((a) => a?.length);
  return argKeyValues.length ? `?${argKeyValues.join('&')}` : '';
}
