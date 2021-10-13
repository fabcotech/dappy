import { readPursesTerm, readConfigTerm } from 'rchain-token';
import * as rchainToolkit from 'rchain-toolkit';

import * as fromBlockchain from '/store/blockchain';
import { Blockchain, RChainContractConfig, RChainTokenPurse } from '/models';
import { multiCallParseAndValidate, RequestResult } from '/utils/wsUtils';
import { getNodeIndex } from '/utils/getNodeIndex';
import { rchainTokenValidators } from '/store/decoders';

const parseRhoValToJs = (r: { data: string }) => {
  const data = JSON.parse(r.data);
  if (data && data.expr && data.expr[0]) {
    return rchainToolkit.utils.rhoValToJs(JSON.parse(r.data).expr[0]);
  }

  return undefined;
};

export async function getPursesAndContractConfig({
  blockchain,
  pursesIds,
  masterRegistryUri,
  contractId,
  version,
}: {
  blockchain: Blockchain;
  pursesIds: string[];
  masterRegistryUri: string;
  contractId: string;
  version: string;
}): Promise<[RequestResult<Record<string, RChainTokenPurse>>, RequestResult<RChainContractConfig>]> {
  const indexes = blockchain.nodes.filter((n) => n.readyState === 1).map(getNodeIndex);

  return multiCallParseAndValidate(
    [
      {
        execute: () => readPursesTerm({ masterRegistryUri, contractId, pursesIds }),
        parse: parseRhoValToJs,
        validate: rchainTokenValidators[version].purses,
      },
      {
        execute: () => readConfigTerm({ masterRegistryUri, contractId }),
        parse: parseRhoValToJs,
        validate: rchainTokenValidators[version].contractConfig,
      },
    ],
    {
      chainId: blockchain.chainId,
      urls: indexes,
      resolverMode: 'absolute',
      resolverAccuracy: 100,
      resolverAbsolute: indexes.length,
      multiCallId: fromBlockchain.EXPLORE_DEPLOY_X,
    }
  ) as Promise<[RequestResult<Record<string, RChainTokenPurse>>, RequestResult<RChainContractConfig>]>;
}