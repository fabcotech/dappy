import React from 'react';
import { Formik, Field } from 'formik';
import * as elliptic from 'elliptic';
import * as rchainToolkit from 'rchain-toolkit';

import { Account } from '/models';
import { account as accountUtils } from '/utils/account';
import './AccountForm.scss';
import { PrivateKeyWarning } from '../';

const ec = new elliptic.ec('secp256k1');

interface AccountFormProps {
  names: string[];
  filledAccount: (a: Account) => void;
}

const PASSWORD_REGEXP_UPPER = /^(?=.*?[A-Z])/;
const PASSWORD_REGEXP_LOWER = /^(?=.*?[a-z])/;
const PASSWORD_REGEXP_NUMBER = /^(?=.*?[0-9])/;
const PASSWORD_REGEXP_SPECIAL = /^(?=.*?[#?!@$%^&*-])/;

export class AccountForm extends React.Component<AccountFormProps, {}> {
  constructor(props: AccountFormProps) {
    super(props);
  }

  publicKey = '';
  address = '';
  passwordWarnings: string[] = [];
  error: string | undefined = undefined;

  onGeneratePrivateKey = (setFieldValue: (a: string, b: string) => void) => {
    var key = ec.genKeyPair();
    const privateKey = key.getPrivate().toString(16);
    setFieldValue('privatekey', privateKey);
  };

  render() {
    return (
      <Formik
        onSubmit={() => undefined}
        initialValues={{
          privatekey: '',
          password: '',
          name: '',
        }}
        validate={(values) => {
          let errors: {
            name?: string;
            privatekey?: string;
            password?: string;
          } = {};

          if (!values.name) {
            errors.name = t('field required');
          } else if (this.props.names.find((n) => n === values.name)) {
            errors.name = t('name taken');
          }

          if (!values.password) {
            errors.password = t('field required');
          } else if (values.password.length < 8) {
            errors.password = t('password length');
          }

          if (!values.privatekey) {
            errors.privatekey = t('field required');
          } else {
            try {
              const keyPair = ec.keyFromPrivate(values.privatekey);
              this.publicKey = keyPair.getPublic().encode('hex', false) as string;
              this.address = rchainToolkit.utils.revAddressFromPublicKey(this.publicKey);
            } catch {
              errors.privatekey = t('private key invalid');
            }
          }

          let passwordWarnings = [];
          if (!PASSWORD_REGEXP_UPPER.test(values.password)) {
            passwordWarnings.push(t('at least one upper'));
          }
          if (!PASSWORD_REGEXP_LOWER.test(values.password)) {
            passwordWarnings.push(t('at least one lower'));
          }
          if (!PASSWORD_REGEXP_NUMBER.test(values.password)) {
            passwordWarnings.push(t('at least one number'));
          }
          if (!PASSWORD_REGEXP_SPECIAL.test(values.password)) {
            passwordWarnings.push(t('at least one special'));
          }
          this.passwordWarnings = ([] as string[]).concat(passwordWarnings);

          if (!Object.keys(errors).length) {
            try {
              const passwordBytes = accountUtils.passwordFromStringToBytes(values.password);
              const encrypted = accountUtils.encrypt(values.privatekey, passwordBytes);
              const decrypted = accountUtils.decrypt(encrypted, passwordBytes);

              if (decrypted !== values.privatekey) {
                throw new Error('unable to create a valid encrypted string');
              }

              this.props.filledAccount({
                platform: 'rchain',
                name: values.name,
                publicKey: this.publicKey,
                address: this.address,
                encrypted: encrypted,
                main: false,
                balance: 0,
                boxes: [],
              });
              this.error = undefined;
            } catch (err) {
              console.error(err);
              this.error = 'Something went wrong when encrypting private key : ' + err;
            }
          }

          return errors;
        }}
        render={({ values, errors, touched, handleSubmit, isSubmitting, setFieldValue }) => {
          return (
            <form className="account-form" onSubmit={handleSubmit}>
              <PrivateKeyWarning />
              <div className="field is-horizontal">
                <label className="label">Name*</label>
                <div className="control">
                  <Field className="input" type="text" name="name" placeholder="Account name" />
                </div>
              </div>
              {touched.name && errors.name && <p className="text-danger">{(errors as any).name}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('public key')}*</label>
                <div className="control">
                  <span className="public-key">{this.publicKey || t('public key derived')}</span>
                </div>
              </div>
              <div className="field is-horizontal">
                <label className="label">{t('address')}*</label>
                <div className="control">
                  <span className="address">{this.address || t('address derived')}</span>
                </div>
              </div>
              <div className="field is-horizontal">
                <label className="label">{t('private key')}*</label>
                <div className="control">
                  <Field className="input" type="password" name="privatekey" placeholder={t('private key')} />
                  <button
                    type="button"
                    className="button is-link is-small generate-private-key"
                    onClick={() => this.onGeneratePrivateKey(setFieldValue)}>
                    {t('generate private key')}
                  </button>
                </div>
              </div>
              {touched.privatekey && errors.privatekey && <p className="text-danger">{(errors as any).privatekey}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('password')}*</label>
                <div className="control">
                  <Field className="input" type="password" name="password" placeholder={t('password')} />
                </div>
              </div>
              {touched.password && errors.password && <p className="text-danger">{(errors as any).password}</p>}
              {touched.password && this.passwordWarnings.length
                ? this.passwordWarnings.map((p) => (
                    <p key={p} className="text-warning">
                      {p}
                    </p>
                  ))
                : undefined}
              {this.error && <p className="text-danger">{this.error}</p>}
            </form>
          );
        }}
      />
    );
  }
}
