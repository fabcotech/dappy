import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  isHexaString,
  toGwei,
  toNumber,
  EthereumSignTransactionModalComponent,
  toHumanReadableEthUnit,
} from './EthereumSignTransactionModal';
import { getFakeEVMAccount } from '/fakeData';

describe('EthereumSignTransactionModal', () => {
  it('isHexaString', () => {
    expect(isHexaString('123')).toBeFalsy();
    expect(isHexaString('')).toBeFalsy();
    expect(isHexaString('0x123')).toBeTruthy();
    expect(isHexaString('0x123abcdefABCDEF')).toBeTruthy();
    expect(isHexaString('0x1230x123')).toBeFalsy();
  });
  it('toGwei', () => {
    expect(toGwei(`0x${Math.pow(10, 11).toString(16)}`)).toEqual('100 gwei');
    expect(toGwei(`1`)).toEqual(t('none'));
  });
  it('toNumber', () => {
    expect(toNumber('0x123')).toEqual(291);
    expect(toNumber('1')).toEqual(t('none'));
  });
  it('toHumanReadableEthUnit', () => {
    expect(toHumanReadableEthUnit('1')).toEqual('none');
    expect(toHumanReadableEthUnit(`0x${Math.pow(10, 11).toString(16)}`)).toEqual('100 gwei');
    expect(toHumanReadableEthUnit('0x1')).toEqual('1 wei');
    expect(toHumanReadableEthUnit(`0x${Math.pow(10, 5).toString(16)}`)).toEqual('100000 wei');
    expect(toHumanReadableEthUnit(`0x${Math.pow(10, 6).toString(16)}`)).toEqual('0.001 gwei');
    expect(toHumanReadableEthUnit(`0x${Math.pow(10, 14).toString(16)}`)).toEqual('100000 gwei');
    expect(toHumanReadableEthUnit(`0x${Math.pow(10, 15).toString(16)}`)).toEqual('0.001 ether');
  });
  it('should be able to sign transaction only if valid password is entered', async () => {
    const returnSignedTransaction = jest.fn();
    const modal = {
      resourceId: 'resourceId',
      title: 'title',
      text: 'text',
      buttons: [],
      parameters: {
        origin: '',
        parameters: {
          chainId: 123,
        },
      },
    };
    render(
      <EthereumSignTransactionModalComponent
        accounts={{
          account1: getFakeEVMAccount(),
        }}
        close={jest.fn()}
        returnSignedTransaction={returnSignedTransaction}
        modal={modal}
      />
    );
    const btn = screen.getByText(t('sign transaction'));
    expect(btn).toBeDisabled();

    const passwordInput = screen.getByLabelText('Password*');
    userEvent.type(passwordInput, 'Dappy00!');

    await waitFor(() => {
      expect(btn).toBeEnabled();
      userEvent.click(btn);
      expect(returnSignedTransaction).toBeCalled();
    });
  });
  it('should close modal', () => {
    const onClose = jest.fn();
    const modal = {
      resourceId: 'resourceId',
      title: 'title',
      text: 'text',
      buttons: [],
      parameters: {
        origin: '',
        parameters: {
          chainId: 123,
        },
      },
    };
    render(
      <EthereumSignTransactionModalComponent
        accounts={{
          account1: getFakeEVMAccount(),
        }}
        close={onClose}
        returnSignedTransaction={jest.fn()}
        modal={modal}
      />
    );
    const discardBtn = screen.getByText(t('discard transaction'));
    userEvent.click(discardBtn);
    expect(onClose).toBeCalled();
  });
});
