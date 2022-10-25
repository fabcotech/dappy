import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Formik } from 'formik';
import { Account, CertificateAccount } from '/models';

function useGetCertificate() {
  const [key, setKey] = useState<string>('');
  const [cert, setCert] = useState<string>('');

  useEffect(() => {
    window.generateCertificateAndKey([]).then(({ key: pKey, certificate }) => {
      setKey(pKey);
      setCert(certificate);
    });
  });

  return [key, cert];
}

function containsNoError(
  account: Partial<CertificateAccount>,
  errors: Partial<CertificateAccount>
): account is CertificateAccount {
  return Object.keys(errors).length === 0;
}

interface CertificateAccountFormProps {
  fillAccount: (account: Account) => void;
}

export function CertificateAccountForm({ fillAccount }: CertificateAccountFormProps) {
  const [key, certificate] = useGetCertificate();

  return (
    <Formik
      initialValues={{
        platform: 'certificate',
        name: '',
        key,
        certificate,
      }}
      onSubmit={(account: Partial<CertificateAccount>) => {
        fillAccount(account as Account);
      }}
      validate={(values) => {
        const errors: Partial<CertificateAccount> = {};

        if (!values.name) {
          errors.name = 'required';
        }

        if (!key) {
          errors.key = 'required';
        }

        if (!certificate) {
          errors.certificate = 'required';
        }

        if (containsNoError(values, errors)) {
          fillAccount({
            platform: 'certificate',
            main: false,
            name: values.name,
            key,
            certificate,
            whitelist: [{ host: '*', blitz: true, transactions: true }],
          });
        }

        return errors;
      }}
    >
      <>
        <div className="field is-horizontal">
          <label className="label">Name*</label>
          <div className="control is-medium">
            <Field className="input is-medium" type="text" name="name" placeholder="Account name" />
          </div>
        </div>
        <ErrorMessage name="name" render={(msg) => <p className="text-danger">{msg}</p>} />
        <ErrorMessage name="certificate" render={(msg) => <p className="text-danger">{msg}</p>} />
        <ErrorMessage name="key" render={(msg) => <p className="text-danger">{msg}</p>} />
      </>
    </Formik>
  );
}
