import * as React from 'react';
import { DateTime } from 'luxon';

import {
  TransactionState,
  TransactionOriginDapp,
  Blockchain,
  TransactionStatus,
  RChainTokenDeployPayload,
  TransactionOrigin,
  TransactionAddressValue,
} from '/models';

import { copyToClipboard } from '/interProcess';

const isAddress = (state: TransactionState) =>
  typeof state.value === 'object' && 'address' in state.value && 'status' in state.value;

const AddressResult = ({ value }: { value: TransactionAddressValue }) => (
  <span>
    {`Address is ${value.address} `}
    <a type="button" onClick={() => copyToClipboard(value.address)}>
      {t('copy address')}
    </a>
  </span>
);

const RChainTokenTipResult = ({ value }: { value: RChainTokenDeployPayload }) => (
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

const getResult = (transactionState: TransactionState) => {
  if (typeof transactionState.value === 'string') {
    return <span>{transactionState.value}</span>;
  } else if (isAddress(transactionState)) {
    return <AddressResult value={transactionState.value as TransactionAddressValue} />;
  } else {
    return <span>{JSON.stringify(transactionState.value)}</span>;
  }
};

const getOrigin = (origin: TransactionOrigin) => {
  switch (origin.origin) {
    case 'transfer':
      return origin.origin;
    case 'dapp':
      return `dapp ${(origin as TransactionOriginDapp).dappTitle}`;
  }
};
interface TransactionListItemProps {
  transactionState: TransactionState;
  blockchains: {
    [chainId: string]: Blockchain;
  };
}

// blockchain ? blockchain.chainName : props.transactionState.blockchainId;

export const TransactionsListItem = (props: TransactionListItemProps) => {
  const blockchain: undefined | Blockchain = props.blockchains[props.transactionState.blockchainId];

  return (
    <tr>
      <td>{DateTime.fromISO(props.transactionState.sentAt).toLocaleString(DateTime.DATETIME_SHORT)}</td>
      <td>{props.transactionState.id}</td>
      {/* <td>{blockchain ? blockchain.chainName : props.transactionState.blockchainId}</td> toto */}
      <td>{blockchain ? blockchain.chainName : props.transactionState.blockchainId}</td>
      <td className="origin">{getOrigin(props.transactionState.origin)}</td>
      <td className="value">{getResult(props.transactionState)}</td>
      <td>
        <span className={`tag ${props.transactionState.status}`}>
          {props.transactionState.status === TransactionStatus.Completed
            ? 'recorded in the blockchain'
            : props.transactionState.status}
        </span>
      </td>
    </tr>
  );
};
