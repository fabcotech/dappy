import React from 'react';
import { UpdateBalancesButton, HideBalancesButton } from './Accounts';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Accounts', () => {
  it('<UpdateBalancesButton /> should trigger update balances on click', () => {
    const updateBalances = jest.fn();

    render(<UpdateBalancesButton disabled={true} updating={true} updateBalances={updateBalances} />);
    expect(screen.queryByTitle('update balances')).toHaveClass('disabled');
    userEvent.click(screen.getByTitle('update balances'));
    expect(updateBalances).not.toHaveBeenCalled();

    cleanup();
    updateBalances.mockClear();

    render(<UpdateBalancesButton disabled={false} updating={false} updateBalances={updateBalances} />);
    expect(screen.getByTitle('update balances')).not.toHaveClass('disabled');
    userEvent.click(screen.getByTitle('update balances'));
    expect(updateBalances).toHaveBeenCalled();
  });

  it('<HideBalancesButton /> hide balances on click', () => {
    const toggleVisibility = jest.fn();

    render(<HideBalancesButton isBalancesHidden={true} toggleBalancesVisibility={toggleVisibility} />);
    expect(screen.getByTestId('hbb-icon')).toHaveClass('fa-eye');
    userEvent.click(screen.getByTitle('show balances'));
    expect(toggleVisibility).toHaveBeenCalled();

    cleanup();
    toggleVisibility.mockClear();

    render(<HideBalancesButton isBalancesHidden={false} toggleBalancesVisibility={toggleVisibility} />);
    expect(screen.getByTestId('hbb-icon')).toHaveClass('fa-eye-slash');
    userEvent.click(screen.getByTitle('hide balances'));
    expect(toggleVisibility).toHaveBeenCalled();
  });
});
