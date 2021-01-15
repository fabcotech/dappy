import * as React from 'react';
import { LoadError, LoadErrorWithArgs } from '../../models';
import './LoadErrorHtml.scss';

const Button = (props: { ok: () => void }) => (
  <div className="ack-button-div">
    <button type="button" className="button is-danger is-outlined is-medium" onClick={() => props.ok()}>
      Ok
    </button>
  </div>
);

const TITLES: { [key: string]: string } = {
  [LoadError.IncompleteAddress]: 'Incomplete address',
  [LoadError.ChainNotFound]: 'Blockchain not found',
  [LoadError.ResourceNotFound]: 'Resource not found',
  [LoadError.InsufficientNumberOfNodes]: 'Not enough nodes to query',
  [LoadError.OutOfNodes]: 'Out of nodes to query',
  [LoadError.ServerError]: 'Too many server errors',
  [LoadError.UnstableState]: 'Unstable or unsafe state',
  [LoadError.UnaccurateState]: 'Unaccurate state',
  [LoadError.MissingBlockchainData]: 'Missing data from the blockchain',
  [LoadError.FailedToParseResponse]: 'Failed to parse result',
  [LoadError.InvalidManifest]: 'Invalid response',
  [LoadError.InvalidSignature]: 'Invalid signature',
  [LoadError.ResourceNotFound]: 'Record not found',
};

const DESCRIPTIONS: { [key: string]: (args: { [key: string]: any }) => string } = {
  [LoadError.IncompleteAddress]: (args) =>
    `The address ${args.search} is incomplete or invalid. It must have the following structure : rchain/network/xxx`,
  [LoadError.ChainNotFound]: (args) => `Could not find a network to query for network ID ${args.chainId}`,
  [LoadError.ResourceNotFound]: (args) =>
    `The resource on the blockchain was not found, make sure that the following resource exists : ${args.search}`,
  [LoadError.InsufficientNumberOfNodes]: (args) =>
    `There is not enough nodes to query to resolve the request, the request requires at least ${args.expected} but there are only ${args.got} nodes to query. Lower your resolver settings or retry later`,
  [LoadError.OutOfNodes]: (args) => {
    const n = args.alreadyQueried === 1 ? 'request' : 'requests';
    return `Not enough available nodes to query to resolve the request. Needed ${args.resolverAbsolute} identical responses, queried ${args.alreadyQueried} nodes successfully ${n}. Lower your resolver settings or retry later`;
  },
  [LoadError.ServerError]: (args) => `Server error : ${args.message}`,
  [LoadError.UnstableState]: (args) =>
    `The requests resulted in ${args.numberOfLoadStates} different responses from ${args.numberOfLoadStates} different group of nodes. The resource you are querying is in an unstable/unsecure state, retry later`,
  [LoadError.UnaccurateState]: (args) =>
    `There are two many different responses, the settings can not be satisfied : ${args.loadStates
      .map((l: any) => `${l.okResponses} (${l.percent}%) of response ${l.key}`)
      .join(', ')}`,
  [LoadError.MissingBlockchainData]: (args) =>
    `Data is missing from the blockchain, please run the benchmaks for blockchain ${args.chainId}`,
  [LoadError.FailedToParseResponse]: (args) =>
    `Response received from the blockchain could not be parsed : ${args.message}`,
  [LoadError.InvalidManifest]: (args) =>
    `Response received from the blockchain could not be parsed as a valid file ${
      args.message ? `: ${args.message}` : ''
    }`,
  [LoadError.InvalidRecords]: (args) => `Record found "${args.name}" is invalid : ${args.message}`,
  [LoadError.InvalidSignature]: (args) =>
    'The signature of the response received from the blockchain does not match the public key associated with the name',
  [LoadError.RecordNotFound]: (args) => `Could not find a record associated with name "${args.name}"`,
};

export const loadErrorText = (loadError: LoadErrorWithArgs) => {
  return DESCRIPTIONS[loadError.error] ? DESCRIPTIONS[loadError.error](loadError.args) : 'Unknown load error';
};

export const LoadErrorHtml = (props: { loadError: LoadErrorWithArgs; clearSearchAndLoadError: () => void }) => {
  return (
    <div>
      <h4 className="title is-4">{TITLES[props.loadError.error] || 'Load error'}</h4>
      <p>{loadErrorText(props.loadError)}</p>
      <Button ok={props.clearSearchAndLoadError} />
    </div>
  );
};
