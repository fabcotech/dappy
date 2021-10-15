import React from 'react';
import { render, screen, waitFor  } from '@testing-library/react';
import {
  getFakeAccount,
} from '/fakeData';

import { AccountSelectComponent, AccountSelectProps } from './AccountSelect';

const getFakeAccountSelectProps = (props: Partial<AccountSelectProps> = {}) => {
  const account = getFakeAccount();
  return {
    accounts: { [account.name]: account },
    ...props
  } as AccountSelectProps;
};

describe('AccountSelect', () => {
  it('should display first box of selected account when form is loaded', async () => {
    const props = getFakeAccountSelectProps({
      chooseBox: true
    });
    render(<AccountSelectComponent {...props} />);
    await waitFor(() => {
      screen.getByText('box');
    });

    expect(screen.queryAllByText('box1')).toBeTruthy();
  });
  it('should display nothing ', async () => {
    const accountWithoutBoxes = getFakeAccount({
      boxes: []
    });
    const props = getFakeAccountSelectProps({
      chooseBox: true,
      accounts: { [accountWithoutBoxes.name]: accountWithoutBoxes }
    });
    const { debug } = render(<AccountSelectComponent {...props} />);
    await waitFor(() => {
      screen.getByText('box not found');
    });

    debug();
  })
});