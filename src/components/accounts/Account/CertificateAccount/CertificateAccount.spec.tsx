import React from 'react';
import { CertificateAccount } from './CertificateAccount';
import { getFakeCertificateAccount } from '/fakeData';
import { renderWithStore } from '/testUtils';

describe('CertificateAccount', () => {
  it('should be visible', () => {
    const account = getFakeCertificateAccount();
    const {
      container: { firstChild },
    } = renderWithStore(<CertificateAccount account={account} />);
    expect(firstChild).toBeVisible();
  });
});
