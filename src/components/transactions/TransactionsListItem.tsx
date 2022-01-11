import * as React from 'react';
import { DateTime } from 'luxon';

import {
  TransactionState,
  TransactionOriginDapp,
  TransactionOriginRecord,
  Blockchain,
  TransactionStatus,
  RChainTokenDeployPayload,
  RChainTokenDeployBoxPayload,
} from '/models';

import { copyToClipboard } from '/interProcess';

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
    const value = props.transactionState.value as { status: string; address: string };
    Value = (
      <span>
        {`Address is ${value.address} `}
        <a type="button" onClick={() => copyToClipboard(value.address)}>
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
    const value: RChainTokenDeployBoxPayload = props.transactionState.value as RChainTokenDeployBoxPayload;
    Value = (
      <span>
        {`Box address is ${value.boxId} `}
        <a type="button" onClick={() => copyToClipboard(value.boxId)}>
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
    const value: RChainTokenDeployPayload = props.transactionState.value as RChainTokenDeployPayload;
    Value = (
      <span>
        {`Contract address is ${value.masterRegistryUri}.${value.contractId} `}
        <a type="button" onClick={() => copyToClipboard(value.masterRegistryUri + '.' + value.contractId)}>
          {t('copy address')}
        </a>
        {' or '}
        <a type="button" onClick={() => copyToClipboard(value.contractId)}>
          {t('copy contract id')}
        </a>
      </span>
    );
  } else if (
    props.transactionState.origin.origin === 'rchain-token' &&
    props.transactionState.origin.operation === 'tips' &&
    props.transactionState.status === 'completed' &&
    props.transactionState.value &&
    props.transactionState.value.hasOwnProperty('contractId')
  ) {
    const value: RChainTokenDeployPayload = props.transactionState.value as RChainTokenDeployPayload;
    Value = (
      <span>
        {`Dapp address is tips?contract=${value.contractId} `}
        <a type="button" onClick={() => copyToClipboard(`tips?contract=${value.contractId}`)}>
          {t('copy dapp address')}
        </a>
        {' or '}
        <a type="button" onClick={() => copyToClipboard(value.contractId)}>
          {t('copy contract id')}
        </a>
      </span>
    );
  } else {
    Value = <span>{JSON.stringify(props.transactionState.value)}</span>;
  }
  return (
    <tr>
      <td>{DateTime.fromISO(props.transactionState.sentAt).toLocaleString(DateTime.DATETIME_SHORT)}</td>
      <td>{props.id}</td>
      <td>{blockchain ? blockchain.chainName : props.transactionState.blockchainId}</td>
      <td className="origin">
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
      </td>
      <td className="value">{Value}</td>
      <td>
        <span className={`tag ${props.transactionState.status}`}>
          {props.transactionState.status === TransactionStatus.Completed
            ? 'recorded in tde blockchain'
            : props.transactionState.status}
        </span>
      </td>
    </tr>
  );
};
