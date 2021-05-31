import React from 'react';
import { BeesLoadError } from 'beesjs';

import { LoadRecordsError } from '../../models';

export function RecordLoadErrorLight(props: { loadError: LoadRecordsError; instance: string }) {
  const loadStatesNumber = Object.keys(props.loadError.loadState).length;
  let nodeUrlsReached = 0;
  Object.keys(props.loadError.loadState).forEach(k => {
    nodeUrlsReached += props.loadError.loadState[k].nodeUrls.length;
  });
  if (loadStatesNumber === 0) {
    return <span>Could not reach any node</span>;
  }

  if (loadStatesNumber > 1) {
    return (
      <span>
        Received {loadStatesNumber} different snapshots of the {props.instance}s from {nodeUrlsReached} nodes
      </span>
    );
  }

  if (props.loadError.error.error === BeesLoadError.InvalidRecords) {
    return <span>Records received could not be parsed</span>;
  }

  if (props.loadError.error.error === BeesLoadError.OutOfNodes) {
    return (
      <span>
        Not enough available nodes to query, needed {props.loadError.error.args.resolverAbsolute} but only got{' '}
        {props.loadError.error.args.alreadyQueried} successful request
        {props.loadError.error.args.alreadyQueried === 1 ? '' : 's'}
      </span>
    );
  }

  return <span>Unknown error</span>;
}
