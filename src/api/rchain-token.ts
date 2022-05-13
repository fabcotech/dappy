import { readPursesTerm, readConfigTerm } from '@fabcotech/rchain-token';
import * as rchainToolkit from '@fabcotech/rchain-toolkit';

import * as fromBlockchain from '/store/blockchain';
import { Blockchain, RChainContractConfig, RChainTokenPurse, MultiRequestParameters } from '/models';
import { multiRequestParseAndValidate, RequestResult } from '/utils/wsUtils';
import { getNodeIndex } from '/utils/getNodeIndex';
import { rchainTokenValidators } from '/store/decoders';

export const getPursesAndContractConfig = async ({
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
}) =>
  multiRequestParseAndValidate(
    [
      {
        query: () => readPursesTerm({ masterRegistryUri, contractId, pursesIds }),
        parse: parseRhoValToJs,
        validate: rchainTokenValidators[version].purses,
      },
      {
        query: () => readConfigTerm({ masterRegistryUri, contractId }),
        parse: parseRhoValToJs,
        validate: rchainTokenValidators[version].contractConfig,
      },
    ],
    getExploreDeployXOptions(blockchain.chainId, blockchain.nodes.map(getNodeIndex))
  ) as Promise<[RequestResult<Record<string, RChainTokenPurse>>, RequestResult<RChainContractConfig>]>;

export const getPurses = async ({
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
}) =>
  multiRequestParseAndValidate(
    [
      {
        query: () => readPursesTerm({ masterRegistryUri, contractId, pursesIds }),
        parse: parseRhoValToJs,
        validate: rchainTokenValidators[version].purses,
      },
    ],
    getExploreDeployXOptions(blockchain.chainId, blockchain.nodes.map(getNodeIndex))
  ) as Promise<[RequestResult<Record<string, RChainTokenPurse>>]>;

export const getContractConfig = async ({
  blockchain,
  masterRegistryUri,
  contractId,
}: {
  blockchain: Blockchain;
  masterRegistryUri: string;
  contractId: string;
}) => {
  return multiRequestParseAndValidate(
    [
      {
        query: () => readConfigTerm({ masterRegistryUri, contractId }),
        parse: parseRhoValToJs,
        validate: (payload: any) => rchainTokenValidators[payload.version].contractConfig(payload),
      },
    ],
    getExploreDeployXOptions(blockchain.chainId, blockchain.nodes.map(getNodeIndex))
  ) as Promise<[RequestResult<RChainContractConfig>]>;
}

const parseRhoValToJs = (r: { data: string }) => {
  const data = JSON.parse(r.data);
  if (data && data.expr && data.expr[0]) {
    return rchainToolkit.utils.rhoValToJs(JSON.parse(r.data).expr[0]);
  }

  return undefined;
};

const getExploreDeployXOptions = (chainId: string, indexes: string[]): MultiRequestParameters => ({
  chainId,
  urls: indexes,
  resolverMode: 'absolute',
  resolverAccuracy: 100,
  resolverAbsolute: indexes.length,
  multiCallId: fromBlockchain.EXPLORE_DEPLOY_X,
});
