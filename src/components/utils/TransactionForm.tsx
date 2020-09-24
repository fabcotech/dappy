import React, { Fragment } from 'react';
import * as elliptic from 'elliptic';
import { Formik, Field } from 'formik';
import xs, { Stream } from 'xstream';
import debounce from 'xstream/extra/debounce';
import * as rchainToolkit from 'rchain-toolkit';

const ec = new elliptic.ec('secp256k1');

import { Account } from '../../models';
import { account as accountUtils } from '../../utils';
import './TransactionForm.scss';
import { DEFAULT_PHLO_LIMIT } from '../../CONSTANTS';
import { PrivateKeyWarning } from '.';

// Account selection

interface AccountSelectComponentProps {
  accounts: { [accountName: string]: Account };
  updatePrivateKey: (t: { privatekey: string | undefined }) => void;
  usePrivateKey: () => void;
}
interface AccountSelectComponentState {
  passwordError: string | undefined;
  passwordSuccess: boolean;
}
export class AccountSelectComponent extends React.Component<AccountSelectComponentProps, AccountSelectComponentState> {
  constructor(props: AccountSelectComponentProps) {
    super(props);
    this.state = {
      passwordError: undefined,
      passwordSuccess: false,
    };
  }

  stream: undefined | Stream<{ account: Account; password: string }>;

  componentWillUnmount() {
    if (this.stream) this.stream.shamefullySendComplete();
  }

  init() {
    this.stream = xs.create();
    this.stream.compose(debounce(800)).subscribe({
      next: (data) => {
        try {
          const password = accountUtils.passwordFromStringToBytes(data.password);
          const decrypted = accountUtils.decrypt(data.account.encrypted, password);
          this.setState({
            passwordSuccess: true,
            passwordError: undefined,
          });
          this.props.updatePrivateKey({ privatekey: decrypted });
        } catch (err) {
          this.setState({
            passwordError: t('wrong password'),
            passwordSuccess: false,
          });
          this.props.updatePrivateKey({ privatekey: undefined });
        }
      },
    });
  }

  render() {
    if (!this.stream) {
      this.init();
    }
    const mainAccount = Object.values(this.props.accounts).find((a) => a.main);
    return (
      <Formik
        onSubmit={() => undefined}
        initialValues={{
          account: mainAccount ? mainAccount.name : Object.keys(this.props.accounts)[0],
          password: '',
        }}
        validate={(values) => {
          let errors: {
            account?: string;
            password?: string;
          } = {};
          const account = this.props.accounts[values.account];
          // always true
          if (this.stream) {
            this.stream.shamefullySendNext({ account: account, password: values.password });
          }
          return errors;
        }}
        render={({ values, errors, touched, setFieldValue }) => {
          return (
            <div className="account-form">
              <div className="field is-horizontal">
                <label className="label" />
                <div className="control">
                  <button
                    type="button"
                    className="use-private-key is-light button"
                    onClick={() => {
                      this.props.usePrivateKey();
                    }}>
                    {t('use private key')}
                  </button>
                </div>
              </div>
              <div className="field is-horizontal">
                <label className="label">Account</label>
                <div className="control">
                  <div className="select">
                    <Field
                      component="select"
                      name="account"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const value = e.target.value;
                        this.setState({
                          passwordSuccess: false,
                          passwordError: undefined,
                        });
                        setFieldValue('account', value);
                        setFieldValue('password', '');
                      }}>
                      {Object.keys(this.props.accounts)
                        .sort((a, b) => (this.props.accounts[a].main ? -1 : 1))
                        .map((k) => (
                          <option key={this.props.accounts[k].name} value={this.props.accounts[k].name}>
                            {this.props.accounts[k].name}
                          </option>
                        ))}
                    </Field>
                  </div>
                </div>
              </div>
              {touched.account && errors.account && <p className="text-danger">{(errors as any).privatekey}</p>}

              {values.account ? (
                <Fragment>
                  <div className="field is-horizontal">
                    <label className="label">Password*</label>
                    <div className="control has-icons-right">
                      <Field
                        className={`input ${this.state.passwordSuccess ? 'is-success' : ''} ${
                          this.state.passwordError ? 'is-danger' : ''
                        }`}
                        type="password"
                        name="password"
                        placeholder={`${t('password for')} ${values.account}`}
                      />
                    </div>
                  </div>
                  {touched.password && this.state.passwordError && (
                    <p className="text-danger">{this.state.passwordError}</p>
                  )}
                </Fragment>
              ) : undefined}
            </div>
          );
        }}
      />
    );
  }
}

// Transaction form

interface TransactionFormProps {
  accounts?: { [accountName: string]: Account };
  publicKey?: string;
  phloLimit?: number;
  address?: string;
  filledTransactionData: (t: { privatekey: string; publickey: string; phloLimit: number }) => void;
}
interface TransactionFormState {
  atLeastOneAccount: boolean;
  usePrivateKey: boolean;
}

export class TransactionForm extends React.Component<TransactionFormProps, TransactionFormState> {
  constructor(props: TransactionFormProps) {
    super(props);
    this.state = {
      atLeastOneAccount: false,
      usePrivateKey: false,
    };
  }

  static getDerivedStateFromProps(nextProps: TransactionFormProps, prevState: {}) {
    if (nextProps.accounts && Object.keys(nextProps.accounts).length) {
      return { atLeastOneAccount: true };
    } else {
      return { atLeastOneAccount: false };
    }
  }

  publickey = '';

  render() {
    return (
      <Formik
        onSubmit={() => undefined}
        initialValues={{
          privatekey: '',
          phloLimit: this.props.phloLimit || DEFAULT_PHLO_LIMIT,
        }}
        validate={(values) => {
          let errors: {
            name?: string;
            privatekey?: string;
            phloLimit?: string;
          } = {};

          if (!values.privatekey) {
            errors.privatekey = t('field required');
            this.publickey = '';
          } else {
            try {
              const keyPair = ec.keyFromPrivate(values.privatekey);
              const publickeyFromPrivateKey = keyPair.getPublic().encode('hex', false) as string;
              if (this.props.publicKey && publickeyFromPrivateKey !== this.props.publicKey) {
                errors.privatekey = t('private key does not match');
                this.publickey = '';
              } else if (this.props.address) {
                const addressFromPublicKey = rchainToolkit.utils.revAddressFromPublicKey(publickeyFromPrivateKey);
                if (this.props.address !== addressFromPublicKey) {
                  errors.privatekey = t('private key does not match');
                  this.publickey = '';
                } else {
                  this.publickey = publickeyFromPrivateKey;
                }
              } else {
                this.publickey = publickeyFromPrivateKey;
              }
            } catch {
              errors.privatekey = t('private key invalid');
            }
          }

          if (!values.phloLimit) {
            errors.phloLimit = t('field required');
          } else if (values.phloLimit < 1) {
            errors.phloLimit = t('phlo limit superior to one');
          }

          if (!Object.keys(errors).length) {
            this.props.filledTransactionData({
              publickey: this.publickey,
              privatekey: values.privatekey,
              phloLimit: values.phloLimit,
            });
          } else {
            this.props.filledTransactionData({
              publickey: '',
              privatekey: '',
              phloLimit: 0,
            });
          }

          return errors;
        }}
        render={({ errors, touched, handleSubmit, setFieldValue }) => {
          return (
            <form className="transaction-form" onSubmit={handleSubmit}>
              <h5 className="is-6 title">{t('transaction')}</h5>
              <PrivateKeyWarning />
              {!this.props.publicKey && this.props.address ? (
                <div className="field is-horizontal">
                  <label className="label">{t('for address')}</label>
                  <div className="control">
                    <input disabled className="input" type="text" name="address" value={this.props.address} />
                  </div>
                </div>
              ) : undefined}
              {this.state.usePrivateKey && this.state.atLeastOneAccount ? (
                <div className="field is-horizontal">
                  <label className="label" />
                  <div className="control">
                    <button
                      type="button"
                      className="use-private-key is-light button"
                      onClick={() => {
                        setFieldValue('privatekey', '');
                        this.setState({ usePrivateKey: false });
                      }}>
                      Use account
                    </button>
                  </div>
                </div>
              ) : undefined}
              {this.state.atLeastOneAccount && !this.state.usePrivateKey ? (
                <AccountSelectComponent
                  usePrivateKey={() => {
                    setFieldValue('privatekey', '');
                    this.setState({
                      usePrivateKey: true,
                    });
                  }}
                  updatePrivateKey={(a) => setFieldValue('privatekey', a.privatekey)}
                  accounts={this.props.accounts as { [accountName: string]: Account }}
                />
              ) : undefined}

              {!this.state.atLeastOneAccount || this.state.usePrivateKey ? (
                <div className="field is-horizontal">
                  <label className="label">{t('public key')}*</label>
                  <div className="control">
                    <input
                      disabled
                      className="input"
                      type="text"
                      name="publickey"
                      value={this.props.publicKey || this.publickey}
                      placeholder={t('public key derived')}
                    />
                  </div>
                </div>
              ) : undefined}

              {!this.state.atLeastOneAccount || this.state.usePrivateKey ? (
                <Fragment>
                  <div className="field is-horizontal">
                    <label className="label">{t('private key')}*</label>
                    <div className="control">
                      <Field className="input" type="password" name="privatekey" placeholder="Private key" />
                    </div>
                  </div>
                  {touched.privatekey && errors.privatekey && (
                    <p className="text-danger">{(errors as any).privatekey}</p>
                  )}
                </Fragment>
              ) : undefined}
              <div className="field is-horizontal">
                <label className="label">{t('phlogiston limit')}*</label>
                <div className="control">
                  <Field className="input" type="number" name="phloLimit" placeholder={t('phlogiston limit')} />
                </div>
              </div>
              {touched.phloLimit && errors.phloLimit && <p className="text-danger">{(errors as any).phloLimit}</p>}
            </form>
          );
        }}
      />
    );
  }
}
