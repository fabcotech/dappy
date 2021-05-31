import * as React from 'react';
import { BeesLoadError, BeesLoadErrorWithArgs } from 'beesjs';

import './LoadErrorHtml.scss';

const Button = (props: { ok: () => void }) => (
  <div className="ack-button-div">
    <button type="button" className="button is-danger is-outlined is-medium" onClick={() => props.ok()}>
      Ok
    </button>
  </div>
);

const TITLES: { [key: string]: string } = {
  [BeesLoadError.IncompleteAddress]: 'Incomplete address',
  [BeesLoadError.ChainNotFound]: 'Blockchain not found',
  [BeesLoadError.ResourceNotFound]: 'Resource not found',
  [BeesLoadError.InsufficientNumberOfNodes]: 'Not enough nodes to query',
  [BeesLoadError.OutOfNodes]: 'Out of nodes to query',
  [BeesLoadError.ServerError]: 'Too many server errors',
  [BeesLoadError.UnstableState]: 'Unstable or unsafe state',
  [BeesLoadError.UnaccurateState]: 'Unaccurate state',
  [BeesLoadError.MissingBlockchainData]: 'Missing data from the blockchain',
  [BeesLoadError.FailedToParseResponse]: 'Failed to parse result',
  [BeesLoadError.InvalidManifest]: 'Invalid response',
  [BeesLoadError.InvalidSignature]: 'Invalid signature',
  [BeesLoadError.ResourceNotFound]: 'Record not found',
};

const DESCRIPTIONS: { [key: string]: (args: { [key: string]: any }) => string } = {
  [BeesLoadError.IncompleteAddress]: (args) =>
    `The address ${args.search} is incomplete or invalid. It must have the following structure : network/xxx ${args.plus || ''}`,
  [BeesLoadError.ChainNotFound]: (args) => `Could not find a network to query for network ID ${args.chainId}`,
  [BeesLoadError.ResourceNotFound]: (args) =>
    `The resource on the blockchain was not found, make sure that the following resource exists : ${args.search}`,
  [BeesLoadError.InsufficientNumberOfNodes]: (args) =>
    `There is not enough nodes to query to resolve the request, the request requires at least ${args.expected} but there are only ${args.got} nodes to query. Lower your resolver settings or retry later`,
  [BeesLoadError.OutOfNodes]: (args) => {
    const n = args.alreadyQueried === 1 ? 'request' : 'requests';
    return `Not enough available nodes to query to resolve the request. Needed ${args.resolverAbsolute} identical responses, queried ${args.alreadyQueried} nodes successfully ${n}. Lower your resolver settings or retry later`;
  },
  [BeesLoadError.ServerError]: (args) => `Server error : ${args.message}`,
  [BeesLoadError.UnstableState]: (args) =>
    `The requests resulted in ${args.numberOfLoadStates} different responses from ${args.numberOfLoadStates} different group of nodes. The resource you are querying is in an unstable/unsecure state, retry later`,
  [BeesLoadError.UnaccurateState]: (args) =>
    `There are two many different responses, the settings can not be satisfied : ${args.loadStates
      .map((l: any) => `${l.okResponses} (${l.percent}%) of response ${l.key}`)
      .join(', ')}`,
  [BeesLoadError.MissingBlockchainData]: (args) =>
    `Data is missing from the blockchain, please run the benchmaks for blockchain ${args.chainId}`,
  [BeesLoadError.InvalidServers]: (args) =>
    `Did not find a primary server to address the request to : ${args.search}`,
  [BeesLoadError.FailedToParseResponse]: (args) =>
    `Response received from the blockchain could not be parsed : ${args.message}`,
  [BeesLoadError.InvalidManifest]: (args) =>
    `Response received from the blockchain could not be parsed as a valid file ${
      args.message ? `: ${args.message}` : ''
    }`,
  [BeesLoadError.InvalidRecords]: (args) => `Record found "${args.name}" is invalid : ${args.message}`,
  [BeesLoadError.InvalidSignature]: (args) =>
    'The signature of the response received from the blockchain does not match the public key associated with the name',
  [BeesLoadError.RecordNotFound]: (args) => `Could not find a record associated with name "${args.name}"`,
};

export const loadErrorText = (loadError: BeesLoadErrorWithArgs) => {
  return DESCRIPTIONS[loadError.error] ? DESCRIPTIONS[loadError.error](loadError.args) : 'Unknown load error';
};

export const LoadErrorHtml = (props: { loadError: BeesLoadErrorWithArgs; clearSearchAndLoadError: () => void }) => {
  return (
    <div>
      <h4 className="title is-4">{TITLES[props.loadError.error] || 'Load error'}</h4>
      <p>{loadErrorText(props.loadError)}</p>
      <Button ok={props.clearSearchAndLoadError} />
    </div>
  );
};
