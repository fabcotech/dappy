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
  TransactionOrigin,
  TransactionAddressValue,
} from '/models';

import { copyToClipboard } from '/interProcess';

const isAddress = (state: TransactionState) =>
  typeof state.value === 'object' && 'address' in state.value && 'status' in state.value;

const isDeployBox = (state: TransactionState) =>
  state.origin.origin === 'rchain-token' &&
  state.origin.operation === 'deploy-box' &&
  state.status === 'completed' &&
  state.value &&
  state.value.hasOwnProperty('boxId');

const isRChainTokenDeploy = (state: TransactionState) =>
  state.origin.origin === 'rchain-token' &&
  state.origin.operation === 'deploy' &&
  state.status === 'completed' &&
  state.value &&
  state.value.hasOwnProperty('masterRegistryUri') &&
  state.value.hasOwnProperty('contractId');

const isRChainTokenTip = (state: TransactionState) =>
  state.origin.origin === 'rchain-token' &&
  state.origin.operation === 'tips' &&
  state.status === 'completed' &&
  state.value &&
  state.value.hasOwnProperty('contractId');

const getResult = (transactionState: TransactionState) => {
  if (typeof transactionState.value === 'string') {
    return <span>{transactionState.value}</span>;
  } else if (isAddress(transactionState)) {
    const value = transactionState.value as TransactionAddressValue;
    return (
      <span>
        {`Address is ${value.address} `}
        <a type="button" onClick={() => copyToClipboard(value.address)}>
          {t('copy address')}
        </a>
      </span>
    );
  } else if (isDeployBox(transactionState)) {
    const value = transactionState.value as RChainTokenDeployBoxPayload;
    return (
      <span>
        {`Box address is ${value.boxId} `}
        <a type="button" onClick={() => copyToClipboard(value.boxId)}>
          {t('copy box id')}
        </a>
      </span>
    );
  } else if (isRChainTokenDeploy(transactionState)) {
    const value = transactionState.value as RChainTokenDeployPayload;
    return (
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
  } else if (isRChainTokenTip(transactionState)) {
    const value = transactionState.value as RChainTokenDeployPayload;
    return (
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
    return <span>{JSON.stringify(transactionState.value)}</span>;
  }
};

const getOrigin = (origin: TransactionOrigin) => {
  switch (origin.origin) {
    case 'transfer':
    case 'deploy':
    case 'rholang':
      return origin.origin;
    case 'rchain-token':
      return `rchain-token ${origin.operation}`;
    case 'dapp':
      return `dapp ${(origin as TransactionOriginDapp).dappTitle}`;
    case 'record':
      return `record ${(origin as TransactionOriginRecord).recordName}`;
  }
};
interface TransactionListItemProps {
  transactionState: TransactionState;
  blockchains: {
    [chainId: string]: Blockchain;
  };
  id: string;
}

export const TransactionsListItem = (props: TransactionListItemProps) => {
  const blockchain: undefined | Blockchain = props.blockchains[props.transactionState.blockchainId];

  return (
    <tr>
      <td>{DateTime.fromISO(props.transactionState.sentAt).toLocaleString(DateTime.DATETIME_SHORT)}</td>
      <td>{props.id}</td>
      <td>{blockchain ? blockchain.chainName : props.transactionState.blockchainId}</td>
      <td className="origin">{getOrigin(props.transactionState.origin)}</td>
      <td className="value">{getResult(props.transactionState)}</td>
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
