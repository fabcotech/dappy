import * as React from 'react';
import { BeesLoadError, BeesLoadErrorWithArgs } from 'beesjs';

import { DappyLoadError, DappyLoadErrorWithArgs } from '/models/';
import './LoadErrorHtml.scss';

const Button = (props: { ok: () => void }) => (
  <div className="ack-button-div">
    <button type="button" className="button is-danger is-outlined is-medium" onClick={() => props.ok()}>
      Ok
    </button>
  </div>
);

const TITLES: { [key: string]: string } = {
  [DappyLoadError.IncompleteAddress]: 'Incomplete address',
  [DappyLoadError.ChainNotFound]: 'Blockchain not found',
  [DappyLoadError.ResourceNotFound]: 'Resource not found',
  [DappyLoadError.ServerError]: 'Server or network error',
  [DappyLoadError.MissingBlockchainData]: 'Missing data from the blockchain',
  [DappyLoadError.FailedToParseResponse]: 'Failed to parse result',
  [DappyLoadError.InvalidManifest]: 'Invalid response',
  [DappyLoadError.InvalidSignature]: 'Invalid signature',
  [DappyLoadError.RecordNotFound]: 'Record not found',
  [DappyLoadError.DNSResolutionError]: 'Name System (DNS) resolution error',
  [DappyLoadError.DappyResolutionError]: 'Dappy Name System resolution error',
  [BeesLoadError.OutOfNodes]: 'Out of nodes to query',
  [BeesLoadError.UnstableState]: 'Unstable or unsafe state',
  [BeesLoadError.UnaccurateState]: 'Unaccurate state',
};

const DESCRIPTIONS: { [key: string]: (args: { [key: string]: any }) => string } = {
  [DappyLoadError.IncompleteAddress]: (args) =>
    `The address ${args.url} is incomplete or invalid. It must have the following structure : network:xxx ${
      args.plus || ''
    }`,
  [DappyLoadError.UnsupportedAddress]: (args) =>
    `The address format is not supported : ${args.plus}`,
  [DappyLoadError.ChainNotFound]: (args) => `Could not find a network to query for network ID ${args.chainId}`,
  [DappyLoadError.ResourceNotFound]: (args) =>
    `The resource on the blockchain was not found, make sure that the following resource exists : ${args.url}`,
  [BeesLoadError.InsufficientNumberOfNodes]: (args) =>
    `There is not enough nodes to query to resolve the request, the request requires at least ${args.expected} but there are only ${args.got} nodes to query. Lower your resolver settings or retry later`,
  [DappyLoadError.ServerError]: (args) => `Server error : ${args.message}`,
  [DappyLoadError.MissingBlockchainData]: (args) =>
  `Data is missing from the blockchain, please run the benchmaks for blockchain ${args.chainId}`,
  [DappyLoadError.InvalidServers]: (args) => `Did not find a primary server to address the request to : ${args.search}`,
  [DappyLoadError.FailedToParseResponse]: (args) =>
  `Response received from the blockchain could not be parsed : ${args.message}`,
  [DappyLoadError.InvalidManifest]: (args) =>
  `Response received from the blockchain could not be parsed as a valid file ${
    args.message ? `: ${args.message}` : ''
  }`,
  [DappyLoadError.InvalidRecords]: (args) => `Record found "${args.name}" is invalid : ${args.message}`,
  [DappyLoadError.InvalidSignature]: (args) =>
  'The signature of the response received from the blockchain does not match the public key associated with the name',
  [DappyLoadError.RecordNotFound]: (args) => `Could not find a record associated with name "${args.name}"`,
  [DappyLoadError.DNSResolutionError]: (args) => `Could not resolve host with DNS : ${args.plus}`,
  [DappyLoadError.DappyResolutionError]: (args) => `Could not resolve host with dappy name system : ${args.plus}`,

  [BeesLoadError.OutOfNodes]: (args) => {
    const n = args.alreadyQueried === 1 ? 'request' : 'requests';
    return `Not enough available nodes to query to resolve the request. Needed ${args.resolverAbsolute} identical responses, queried ${args.alreadyQueried} nodes successfully ${n}. Lower your resolver settings or retry later`;
  },
  [BeesLoadError.UnstableState]: (args) =>
    `The requests resulted in ${args.numberOfLoadStates} different responses from ${args.numberOfLoadStates} different group of nodes. The resource you are querying is in an unstable/unsecure state, retry later`,
  [BeesLoadError.UnaccurateState]: (args) =>
    `There are two many different responses, the settings can not be satisfied : ${args.loadStates
      .map((l: any) => `${l.okResponses} (${l.percent}%) of response ${l.key}`)
      .join(', ')}`,
};

export const loadErrorText = (loadError: BeesLoadErrorWithArgs | DappyLoadErrorWithArgs) => {
  return DESCRIPTIONS[loadError.error] ? DESCRIPTIONS[loadError.error](loadError.args) : 'Unknown load error';
};

export const LoadErrorHtml = (props: { loadError: BeesLoadErrorWithArgs | DappyLoadErrorWithArgs; clearSearchAndLoadError: () => void }) => {
  return (
    <div>
      <h4 className="title is-4">{TITLES[props.loadError.error] || 'Load error'}</h4>
      <p>{loadErrorText(props.loadError)}</p>
      <Button ok={props.clearSearchAndLoadError} />
    </div>
  );
};
