import React from 'react';

import { Settings } from 'luxon';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RemoveAccountModal } from './RemoveAccountModal';

import { getFakeRChainAccount } from '/fakeData';
import { encrypt, passwordFromStringToBytes } from '/utils/crypto';

describe('RemoveContractModal', () => {
  it('should only enable submit button if password is correct', () => {
    const password = 'foobarbaz';
    const fakeAccount = getFakeRChainAccount({
      encrypted: encrypt(
        'privatekey',
        passwordFromStringToBytes(password),
        new Uint8Array(
          JSON.parse(
            `{ "a": [227,248,121,177,84,240,192,100,204,112,65,150,94,241,40,162,24,71,92,105,104,232,253,1]}`
          ).a
        )
      ),
    });

    render(<RemoveAccountModal account={fakeAccount} dispatchModalAction={() => {}} onClose={() => {}} />);
    expect(screen.getByText('delete account confirmation')).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('password for account'), { target: { value: 'wrong password' } });
    expect(screen.getByText('delete account confirmation')).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('password for account'), { target: { value: password } });
    expect(screen.getByText('delete account confirmation')).not.toBeDisabled();
  });
});
