import React from 'react';
import { render } from '@testing-library/react';
import { CertificateAccountForm } from './CertificateAccountForm';

describe('Accounts', () => {
  it('<CertificateAccountForm /> should be visible', () => {
    const {
      container: { firstChild },
    } = render(<CertificateAccountForm fillAccount={() => undefined} />);
    expect(firstChild).toBeVisible();
  });
});
