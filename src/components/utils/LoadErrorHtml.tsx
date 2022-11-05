import * as React from 'react';
import { BeesLoadError, BeesLoadErrorWithArgs } from '@fabcotech/bees';

import { DappyLoadError, DappyLoadErrorWithArgs, SimpleError } from '/models/';
import './LoadErrorHtml.scss';
import { openExternal } from '/interProcess';

const Button = (props: { ok: () => void }) => (
  <div className="ack-button-div">
    <button type="button" className="button is-outlined is-medium" onClick={() => props.ok()}>
      Ok
    </button>
  </div>
);

const TITLES: { [key: string]: string } = {
  [DappyLoadError.IncompleteAddress]: 'Incomplete address',
  [DappyLoadError.ChainNotFound]: 'Blockchain not found',
  [DappyLoadError.ResourceNotFound]: 'Resource not found',
  [DappyLoadError.DangerousLink]: 'Unknown scheme or suspect link',
  [DappyLoadError.ServerError]: 'Server or network error',
  [DappyLoadError.MissingBlockchainData]: 'Missing data from the blockchain',
  [DappyLoadError.FailedToParseResponse]: 'Failed to parse result',
  [DappyLoadError.InvalidManifest]: 'Invalid response',
  [DappyLoadError.InvalidSignature]: 'Invalid signature',
  [DappyLoadError.RecordNotFound]: 'Record not found',
  [DappyLoadError.DappyLookup]: 'Lookup error',
  [DappyLoadError.DNSResolutionError]: 'Name System (DNS) resolution error',
  [DappyLoadError.DappyResolutionError]: 'Dappy Name System resolution error',
  [BeesLoadError.OutOfNodes]: 'Out of nodes to query',
  [BeesLoadError.UnaccurateState]: 'Unaccurate state',
};

const DESCRIPTIONS: { [key: string]: (args: { [key: string]: any }) => JSX.Element } = {
  [DappyLoadError.IncompleteAddress]: (args) => (
    <p>
      The address {args.url} is incomplete or invalid. It must have the following structure :
      network:xxx {args.plus || ''}
    </p>
  ),
  [DappyLoadError.UnsupportedAddress]: (args) => (
    <p>The address format is not supported : ${args.plus}</p>
  ),
  [DappyLoadError.ChainNotFound]: (args) => (
    <p>Could not find a network to query for network ID {args.chainId}</p>
  ),
  [DappyLoadError.DangerousLink]: (args) => (
    <p>
      The page is trying to redirect you to a non https protocol that dappy browser will not handle,
      do you want to follow external link ?
      <br />
      <br />
      <a
        onClick={(e) => {
          e.preventDefault();
          openExternal(args.url);
        }}
      >
        {args.url}
      </a>
    </p>
  ),
  [DappyLoadError.ResourceNotFound]: (args) => (
    <p>
      The resource on the blockchain was not found, make sure that the following resource exists :{' '}
      {args.url}
    </p>
  ),
  [DappyLoadError.ServerError]: (args) => <p>Server error : {args.message}</p>,
  [DappyLoadError.MissingBlockchainData]: (args) => (
    <p>
      Data is missing from the blockchain, please run the benchmaks for blockchain {args.chainId}
    </p>
  ),
  [DappyLoadError.InvalidServers]: (args) => (
    <p>Did not find a primary server to address the request to : {args.search}</p>
  ),
  [DappyLoadError.FailedToParseResponse]: (args) => (
    <p>Response received from the blockchain could not be parsed : {args.message}</p>
  ),
  [DappyLoadError.InvalidManifest]: (args) => (
    <p>
      Response received from the blockchain could not be parsed as a valid file{' '}
      {args.message ? args.message : undefined}
    </p>
  ),
  [DappyLoadError.InvalidRecords]: (args) => (
    <p>
      Record found "{args.name}" is invalid : ${args.message}
    </p>
  ),
  [DappyLoadError.DappyLookup]: (args) => <p>Lookup error : {args.message}</p>,
  [DappyLoadError.InvalidSignature]: (args) => (
    <p>
      The signature of the response received from the blockchain does not match the public key
      associated with the name
    </p>
  ),
  [DappyLoadError.RecordNotFound]: (args) => (
    <p>Could not find a record associated with name "{args.name}"</p>
  ),
  [DappyLoadError.DNSResolutionError]: (args) => (
    <p>Could not resolve host with DNS : {args.plus}</p>
  ),
  [DappyLoadError.DappyResolutionError]: (args) => (
    <p>Could not resolve host with dappy name system : {args.plus}</p>
  ),
  [BeesLoadError.OutOfNodes]: (args) => {
    const n = args.alreadyQueried === 1 ? 'request' : 'requests';
    return (
      <p>
        Not enough available nodes to query to resolve the request. Needed {args.resolverAbsolute}{' '}
        identical responses, queried {args.alreadyQueried} nodes successfully {n}. Lower your
        resolver settings or retry later
      </p>
    );
  },
  [BeesLoadError.UnaccurateState]: (args) => (
    <p>
      There are two many different responses, the settings can not be satisfied :{' '}
      {args.loadStates
        .map((l: any) => `${l.okResponses} (${l.percent}%) of response ${l.key}`)
        .join(', ')}
    </p>
  ),
};

export const loadErrorText = (loadError: BeesLoadErrorWithArgs | DappyLoadErrorWithArgs) => {
  if (DESCRIPTIONS[loadError.error]) {
    return DESCRIPTIONS[loadError.error](loadError.args);
  }
  return <p>{loadError.error}</p>;
};

export const LoadErrorHtml = (props: {
  loadError: BeesLoadErrorWithArgs | DappyLoadErrorWithArgs | SimpleError;
  clearSearchAndLoadError: () => void;
}) => {
  if ((props.loadError as SimpleError).title) {
    return (
      <div>
        <h4 className="title is-4">{(props.loadError as SimpleError).title}</h4>
        <p>{(props.loadError as SimpleError).message}</p>
        <Button ok={props.clearSearchAndLoadError} />
      </div>
    );
  }
  if (TITLES[props.loadError.error]) {
    return (
      <div>
        <h4 className="title is-4">{TITLES[props.loadError.error] || 'Load error'}</h4>
        {loadErrorText(props.loadError)}
        <Button ok={props.clearSearchAndLoadError} />
      </div>
    );
  }
  return (
    <div>
      <h4 className="title is-4">{props.loadError.error}</h4>
      <p>{props.loadError.args ? props.loadError.args.message : 'Unknown error'}</p>
      <Button ok={props.clearSearchAndLoadError} />
    </div>
  );
};
