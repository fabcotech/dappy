import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  getFakeAccount,
  getFakeRChainInfos,
  getFakeBlockChain,
  getFakeRChainContractConfig,
  getFakePurse,
} from '/fakeData';
import { RChainContractConfig, RChainTokenPurse } from '/models';
import { PurchaseRecordComponent, PurchaseRecordProps } from './PurchaseRecord';

const getFakePurchaseRecordProps = (): PurchaseRecordProps => {
  const fakeAccount = getFakeAccount();

  return {
    accounts: { [fakeAccount.name]: fakeAccount },
    namesBlockchainInfos: getFakeRChainInfos(),
    namesBlockchain: getFakeBlockChain(),
    transactions: {},
    sendRChainTransaction: () => {},
  };
};

describe('PurchaseRecord', () => {
  it('should render', () => {
    const props = getFakePurchaseRecordProps();

    render(<PurchaseRecordComponent {...props} />)
  });
});
