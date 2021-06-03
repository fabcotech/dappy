import * as React from 'react';
import { DateTime } from 'luxon';

import { TransactionState, TransactionOriginDapp, TransactionOriginRecord, Blockchain, TransactionStatus } from '../../models';

interface TransactionListItemProps {
  transactionState: TransactionState;
  blockchains: {
    [chainId: string]: Blockchain;
  };
  id: string;
}

export const TransactionsListItem = (props: TransactionListItemProps) => {
  const blockchain: undefined | Blockchain = props.blockchains[props.transactionState.blockchainId];

  let Value = <span></span>;
  if (typeof props.transactionState.value === 'string') {
    Value = <span>{props.transactionState.value}</span>;
  } else if (props.transactionState.value && props.transactionState.value.hasOwnProperty('address')) {
    Value = (
      <span>
        {`Address is ${props.transactionState.value.address} `}
        <a type="button" onClick={() => window.copyToClipboard(props.transactionState.value.address)}>
          {t('copy address')}
        </a>
      </span>
    );
  } else if (
    props.transactionState.origin.origin === 'rchain-token' &&
    props.transactionState.origin.operation === 'deploy-box' &&
    props.transactionState.status === 'completed' &&
    props.transactionState.value &&
    props.transactionState.value.hasOwnProperty('boxId')
  ) {
    Value = (
      <span>
        {`Box address is ${props.transactionState.value.boxId} `}
        <a type="button" onClick={() => window.copyToClipboard(props.transactionState.value.boxId)}>
          {t('copy box id')}
        </a>
      </span>
    );
  } else if (
    props.transactionState.origin.origin === 'rchain-token' &&
    props.transactionState.origin.operation === 'deploy' &&
    props.transactionState.status === 'completed' &&
    props.transactionState.value &&
    props.transactionState.value.hasOwnProperty('masterRegistryUri') &&
    props.transactionState.value.hasOwnProperty('contractId')
  ) {
    Value = (
      <span>
        {`Contract address is ${props.transactionState.value.masterRegistryUri}.${props.transactionState.value.contractId} `}
        <a type="button" onClick={() => window.copyToClipboard(props.transactionState.value.masterRegistryUri + "." + props.transactionState.value.contractId)}>
          {t('copy address')}
        </a>
        {' or '}
        <a type="button" onClick={() => window.copyToClipboard(props.transactionState.value.contractId)}>
          {t('copy contract id')}
        </a>
      </span>
    );
  } else {
    Value = <span>{JSON.stringify(props.transactionState.value)}</span>;
  }
  return (
    <tr>
      <th>{DateTime.fromISO(props.transactionState.sentAt).toLocaleString(DateTime.DATETIME_SHORT)}</th>
      <th>{props.id}</th>
      <th>{blockchain ? blockchain.chainName : props.transactionState.blockchainId}</th>
      <th className="origin">
        {props.transactionState.origin.origin === 'transfer' ? 'transfer' : undefined}
        {props.transactionState.origin.origin === 'deploy' ? 'deploy' : undefined}
        {props.transactionState.origin.origin === 'rholang' ? 'rholang' : undefined}
        {props.transactionState.origin.origin === 'rchain-token'
          ? `rchain-token ${props.transactionState.origin.operation}`
          : undefined}
        {props.transactionState.origin.origin === 'dapp'
          ? 'dapp ' + (props.transactionState.origin as TransactionOriginDapp).dappTitle
          : undefined}
        {props.transactionState.origin.origin === 'record'
          ? 'record ' + (props.transactionState.origin as TransactionOriginRecord).recordName
          : undefined}
      </th>
      <th className="value">{Value}</th>
      <th>
        <span className={`tag ${props.transactionState.status}`}>{props.transactionState.status === TransactionStatus.Completed ? "recorded in the blockchain" : props.transactionState.status }</span>
      </th>
    </tr>
  );
};
