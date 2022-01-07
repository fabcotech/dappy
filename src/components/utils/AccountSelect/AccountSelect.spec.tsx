import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { getFakeRChainAccount } from '/fakeData';

import { AccountSelectComponent, AccountSelectProps } from './AccountSelect';

const getFakeRChainAccountSelectProps = (props: Partial<AccountSelectProps> = {}) => {
  const account = getFakeRChainAccount();
  return {
    accounts: { [account.name]: account },
    ...props,
  } as AccountSelectProps;
};

describe('AccountSelect', () => {
  it('should display first box of selected account when form is loaded', async () => {
    const props = getFakeRChainAccountSelectProps({
      chooseBox: true,
    });
    render(<AccountSelectComponent {...props} />);
    await waitFor(() => {
      screen.getByText('box');
    });

    expect(screen.queryAllByText('box1')).toBeTruthy();
  });
  it('should display nothing ', async () => {
    const accountWithoutBoxes = getFakeRChainAccount({
      boxes: [],
    });
    const props = getFakeRChainAccountSelectProps({
      chooseBox: true,
      accounts: { [accountWithoutBoxes.name]: accountWithoutBoxes },
    });
    render(<AccountSelectComponent {...props} />);
    await waitFor(() => {
      screen.getByText('box not found');
    });
  });
});
