import React from 'react';
import { render, screen, waitFor  } from '@testing-library/react';
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
import { RequestResult } from '/utils/wsUtils';

const getFakePurchaseRecordProps = (props: Partial<PurchaseRecordProps> = {}): PurchaseRecordProps => {
  const fakeAccount = getFakeAccount();

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
      id: '0'
    });
    const props = getFakePurchaseRecordProps({
      getPursesAndContractConfig: () =>
        Promise.resolve([
          {
            result: { [purse0.id]: purse0 },
          } as RequestResult<Record<string, RChainTokenPurse>>,
          {
            result: getFakeRChainContractConfig(),
          } as RequestResult<RChainContractConfig>,
        ]),
    });

    render(<PurchaseRecordComponent {...props} />);

    const nameInput = screen.getByLabelText('name / id');
    userEvent.type(nameInput, 'foo');
    userEvent.click(screen.getByRole('button', { name: 'lookup name' }));
    
    await waitFor(() => {
      screen.getByText('name is available');
    });

    expect(screen.getByText('not locked')).toHaveClass('has-text-danger');
    expect(screen.getByText('not locked')).toHaveAttribute('title', 'not locked title');
    expect(screen.queryByText('d network')).toBeFalsy();
  });

  it('should display name is for sale, contract infos and d network displayed', async () => {
    const purse0 = getFakePurse({
      id: '0'
    });
    const purseFoo = getFakePurse({
      id: 'foo'
    });
    const props = getFakePurchaseRecordProps({
      namesBlockchain: getFakeBlockChain({
        chainId: 'd'
      }),
      getPursesAndContractConfig: () =>
        Promise.resolve([
          {
            result: { [purse0.id]: purse0, [purseFoo.id]: purseFoo },
          } as RequestResult<Record<string, RChainTokenPurse>>,
          {
            result: getFakeRChainContractConfig(),
          } as RequestResult<RChainContractConfig>,
        ]),
    });

    render(<PurchaseRecordComponent {...props} />);

    const nameInput = screen.getByLabelText('name / id');
    userEvent.type(nameInput, 'foo');
    userEvent.click(screen.getByRole('button', { name: 'lookup name' }));
    
    await waitFor(() => {
      screen.getByText('name is for sale');
    });

    expect(screen.getByText('not locked')).toHaveClass('has-text-danger');
    expect(screen.getByText('not locked')).toHaveAttribute('title', 'not locked title');
    expect(screen.queryByText('d network')).toBeTruthy();
  });
});