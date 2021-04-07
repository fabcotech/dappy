import * as React from 'react';
import { DateTime } from 'luxon';

import { TransactionState, TransactionOriginDapp, TransactionOriginRecord, Blockchain } from '../../models';

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
    props.transactionState.value.hasOwnProperty('registryUri')
  ) {
    Value = (
      <span>
        {`Box address is ${props.transactionState.value.registryUri} `}
        <a type="button" onClick={() => window.copyToClipboard(props.transactionState.value.registryUri)}>
          {t('copy address')}
        </a>
      </span>
    );
  } else if (
    props.transactionState.origin.origin === 'rchain-token' &&
    props.transactionState.origin.operation === 'deploy' &&
    props.transactionState.status === 'completed' &&
    props.transactionState.value &&
    props.transactionState.value.hasOwnProperty('registryUri')
  ) {
    Value = (
      <span>
        {`Contract address is ${props.transactionState.value.registryUri} `}
        <a type="button" onClick={() => window.copyToClipboard(props.transactionState.value.registryUri)}>
          {t('copy address')}
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
        <span className={`tag ${props.transactionState.status}`}>{props.transactionState.status}</span>
      </th>
    </tr>
  );
};
