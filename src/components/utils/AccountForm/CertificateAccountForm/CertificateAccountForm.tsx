import React from 'react';
import { Formik } from 'formik';
import { Account, CertificateAccount } from '/models';

interface CertificateAccountFormProps {
  fillAccount: (account: Account) => void;
}
export function CertificateAccountForm({ fillAccount }: CertificateAccountFormProps) {
  return (
    <Formik
      initialValues={{}}
      onSubmit={(account: Partial<CertificateAccount>) => {
        fillAccount(account as Account);
      }}>
      <div>CertificateAccountForm</div>
    </Formik>
  );
}
