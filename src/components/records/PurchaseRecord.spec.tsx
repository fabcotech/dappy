import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    const { debug } = render(<PurchaseRecordComponent {...props} />);

    const nameInput = screen.getByLabelText('name / id');
    userEvent.type(nameInput, "foo");
    // userEvent.click(screen.getByRole('button', { name: 'lookup name' }));

    // console.log(q);
    // debug();
  });
});
