import React from 'react';
import { Formik, Field } from 'formik';
import { ec as Ec } from 'elliptic';

import { Account } from '/models';
import { encrypt, decrypt, passwordFromStringToBytes } from '/utils/crypto';
import './AccountForm.scss';
import { rchainWallet, evmWallet } from '/utils/wallets';

const ec = new Ec('secp256k1');

interface AccountFormProps {
  names: string[];
  fillAccount: (a: undefined | Account) => void;
}

const PASSWORD_REGEXP_UPPER = /^(?=.*?[A-Z])/;
const PASSWORD_REGEXP_LOWER = /^(?=.*?[a-z])/;
const PASSWORD_REGEXP_NUMBER = /^(?=.*?[0-9])/;
const PASSWORD_REGEXP_SPECIAL = /^(?=.*?[#?!@$%^&*-])/;

const onGeneratePrivateKey = (setFieldValue: (a: string, b: string) => void) => {
  const key = ec.genKeyPair();
  const privateKey = key.getPrivate().toString(16);
  setFieldValue('privatekey', privateKey);
};
export class AccountForm extends React.Component<AccountFormProps> {
  publicKey = '';

  address = '';

  passwordWarnings: string[] = [];

  error: string | undefined = undefined;

  render() {
    return (
      <Formik
        onSubmit={() => undefined}
        initialValues={
          {
            privatekey: '',
            password: '',
            name: '',
            platform: 'evm',
          } as Record<string, string> & {
            platform?: Account['platform'];
          }
        }
        validate={(values) => {
          const errors: {
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
          console.log('PLATFORM', values.platform);

          if (!values.privatekey) {
            errors.privatekey = t('field required');
          } else {
            try {
              const keyPair = ec.keyFromPrivate(values.privatekey);
              this.publicKey = keyPair.getPublic().encode('hex', false) as string;
              switch (values.platform!) {
                case 'rchain':
                  this.address = rchainWallet.addressFromPublicKey(this.publicKey);
                  break;
                case 'evm':
                default:
                  this.address = evmWallet.addressFromPublicKey(this.publicKey);
                  break;
              }
            } catch (err) {
              console.log(err);
              errors.privatekey = t('private key invalid');
            }
          }

          const passwordWarnings = [];
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

          if (Object.keys(errors).length) {
            this.props.fillAccount(undefined);
          } else {
            try {
              const passwordBytes = passwordFromStringToBytes(values.password);
              const encrypted = encrypt(values.privatekey, passwordBytes);
              const decrypted = decrypt(encrypted, passwordBytes);

              if (decrypted !== values.privatekey) {
                throw new Error('unable to create a valid encrypted string');
              }

              this.props.fillAccount({
                platform: values.platform!,
                name: values.name,
                publicKey: this.publicKey,
                address: this.address,
                encrypted,
                main: false,
                balance: 0,
                boxes: [],
                whitelist: [{ host: '*', blitz: true, transactions: true }],
              });
              this.error = undefined;
            } catch (err) {
              console.error(err);
              this.error = `Something went wrong when encrypting private key : ${err}`;
            }
          }

          return errors;
        }}
        render={({ errors, touched, handleSubmit, setFieldValue }) => {
          return (
            <form className="account-form" onSubmit={handleSubmit}>
              <div className="field is-horizontal">
                <label className="label">Name*</label>
                <div className="control is-medium">
                  <Field className="input is-medium" type="text" name="name" placeholder="Account name" />
                </div>
              </div>
              {touched.name && errors.name && <p className="text-danger">{(errors as any).name}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('blockchain type')}*</label>
                <div className="control is-medium">
                  <div className="select is-medium">
                    <Field as="select" name="platform">
                      <option value="evm">Ethereum / EVM</option>
                      <option value="rchain">Rchain</option>
                    </Field>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <label className="label">{t('public key')}*</label>
                <div className="control is-medium">
                  <span className="public-key ">{this.publicKey || t('public key derived')}</span>
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
                  <Field className="input is-medium" type="password" name="privatekey" placeholder={t('private key')} />
                  <button
                    type="button"
                    className="button is-link is-small generate-private-key"
                    onClick={() => onGeneratePrivateKey(setFieldValue)}>
                    {t('generate private key')}
                  </button>
                </div>
              </div>
              {touched.privatekey && errors.privatekey && <p className="text-danger">{(errors as any).privatekey}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('password')}*</label>
                <div className="control">
                  <Field className="input is-medium" type="password" name="password" placeholder={t('password')} />
                </div>
              </div>
              {touched.password && errors.password && <p className="text-danger">{(errors as any).password}</p>}
              {touched.password && this.passwordWarnings.length
                ? this.passwordWarnings.map((p) => (
                    <p key={p} className="text-danger">
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
