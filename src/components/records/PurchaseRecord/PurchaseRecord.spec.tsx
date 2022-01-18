import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithStore } from '/testUtils';
import userEvent from '@testing-library/user-event';
import {
  getFakeRChainAccount,
  getFakeRChainInfos,
  getFakeBlockChain,
  getFakeRChainContractConfig,
  getFakePurse,
} from '/fakeData';
import { RChainTokenPurse } from '/models';
import { PurchaseRecordComponent, PurchaseRecordProps } from './PurchaseRecord';
import { RequestResult } from '/utils/wsUtils';
import { initialState as settingsInitialState } from '/store/settings';

const getFakePurchaseRecordProps = (props: Partial<PurchaseRecordProps> = {}): PurchaseRecordProps => {
  const fakeAccount = getFakeRChainAccount();

  return {
    accounts: { [fakeAccount.name]: fakeAccount },
    namesBlockchainInfos: getFakeRChainInfos(),
    namesBlockchain: getFakeBlockChain(),
    transactions: {},
    getPursesAndContractConfig: () => Promise.resolve([]),
    sendRChainTransaction: () => {},
    ...props,
  } as PurchaseRecordProps;
};

describe('PurchaseRecord', () => {
  it('should display name is available and contract infos', async () => {
    const purse0 = getFakePurse({
      id: '0',
    });
    const contract = getFakeRChainContractConfig();
    const props = getFakePurchaseRecordProps({
      defaultContractId: contract.contractId,
      queryAndCacheContractConfig: () => {},
      contractConfigs: {
        [contract.contractId]: contract,
      },
      getPurses: () =>
        Promise.resolve([
          {
            result: { [purse0.id]: purse0 },
            validationErrors: [],
          } as RequestResult<Record<string, RChainTokenPurse>>,
        ]),
    });

    renderWithStore(<PurchaseRecordComponent {...props} />, {
      settings: {
        ...settingsInitialState,
      },
    });

    const nameInput = screen.getByLabelText('name / id');
    userEvent.type(nameInput, 'foobar2');
    userEvent.click(screen.getByRole('button', { name: 'lookup name' }));

    await waitFor(() => {
      screen.getByText('name is available');
    });

    expect(screen.getByText('not locked')).toHaveClass('has-text-danger');
    expect(screen.getByText('not locked')).toHaveAttribute('title', 'not locked title');
    expect(screen.queryByText('d network')).toBeFalsy();
  });

  xit('should display name is for sale, contract infos and d network', async () => {
    const purse0 = getFakePurse({
      id: '0',
    });
    const purseFoo = getFakePurse({
      id: 'foo',
    });
    const contract = getFakeRChainContractConfig();
    const props = getFakePurchaseRecordProps({
      defaultContractId: contract.contractId,
      queryAndCacheContractConfig: () => {},
      contractConfigs: {
        [contract.contractId]: contract,
      },
      namesBlockchain: getFakeBlockChain({
        chainId: 'd',
      }),
      getPurses: () =>
        Promise.resolve([
          {
            result: { [purse0.id]: purse0, [purseFoo.id]: purseFoo },
            validationErrors: [],
          } as RequestResult<Record<string, RChainTokenPurse>>,
        ]),
    });

    renderWithStore(<PurchaseRecordComponent {...props} />, {
      settings: {
        ...settingsInitialState,
      },
    });

    const nameInput = screen.getByLabelText('name / id');
    userEvent.type(nameInput, 'foobar2');
    userEvent.click(screen.getByRole('button', { name: 'lookup name' }));

    await waitFor(() => {
      screen.getByText('name is for sale');
    });

    expect(screen.getByText('not locked')).toHaveClass('has-text-danger');
    expect(screen.getByText('not locked')).toHaveAttribute('title', 'not locked title');
    expect(screen.queryByText('d network')).toBeTruthy();
  });
});
