import React, { Fragment } from 'react';
import * as elliptic from 'elliptic';
import { Formik, Field } from 'formik';
import xs, { Stream } from 'xstream';
import debounce from 'xstream/extra/debounce';
import * as rchainToolkit from 'rchain-toolkit';

const ec = new elliptic.ec('secp256k1');

import { Account } from '/models';
import { account as accountUtils } from '/utils';
import './TransactionForm.scss';
import { DEFAULT_PHLO_LIMIT } from '/CONSTANTS';
import { PrivateKeyWarning } from '.';

// Account selection

interface AccountSelectComponentProps {
  chooseBox?: boolean;
  accounts: { [accountName: string]: Account };
  updatePrivateKey: (t: {
    privatekey: string | undefined;
    box: string | undefined;
    accountName: undefined | string;
  }) => void;
}
interface AccountSelectComponentState {
  passwordError: string | undefined;
  boxFound: string | undefined;
  passwordSuccess: boolean;
}
export class AccountSelectComponent extends React.Component<AccountSelectComponentProps, AccountSelectComponentState> {
  constructor(props: AccountSelectComponentProps) {
    super(props);
    this.state = {
      passwordError: undefined,
      passwordSuccess: false,
      boxFound: undefined,
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
            boxFound: data.account.boxes[0],
            passwordSuccess: true,
            passwordError: undefined,
          });
          this.props.updatePrivateKey({
            privatekey: decrypted,
            box: data.account.boxes[0],
            accountName: data.account.name,
          });
        } catch (err) {
          this.setState({
            boxFound: undefined,
            passwordError: t('wrong password'),
            passwordSuccess: false,
          });
          this.props.updatePrivateKey({ privatekey: undefined, box: undefined, accountName: undefined });
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
        }}>
        {({ values, errors, touched, setFieldValue }) => {
          return (
            <div className="account-form">
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
              {this.state.passwordSuccess && this.props.chooseBox ? (
                <div className="field is-horizontal">
                  <label className="label">Box</label>

                  {this.state.boxFound ? (
                    <div className="control">
                      <span className="tag is-light">{this.state.boxFound}</span>
                    </div>
                  ) : (
                    <p className="">Box not found</p>
                  )}
                </div>
              ) : undefined}
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
      </Formik>
    );
  }
}

// Transaction form

interface TransactionFormProps {
  accounts: { [accountName: string]: Account };
  chooseBox?: boolean;
  publicKey?: string;
  phloLimit?: number;
  address?: string;
  filledTransactionData: (t: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    box: string | undefined;
    accountName: string | undefined;
  }) => void;
}
interface TransactionFormState {}

export class TransactionForm extends React.Component<TransactionFormProps, TransactionFormState> {
  constructor(props: TransactionFormProps) {
    super(props);
    this.state = {};
  }

  publickey = '';

  render() {
    if (!this.props.accounts || Object.keys(this.props.accounts).length === 0) {
      return (
        <form className="transaction-form">
          <h5 className="is-6 title">{t('transaction')}</h5>
          <p className="pt10 pb10">
            You need at least one account, configure an account with your private key in the <b>{t('accounts')}</b>{' '}
            section
          </p>
        </form>
      );
    }

    return (
      <Formik
        onSubmit={() => undefined}
        initialValues={{
          privatekey: '',
          box: '',
          accountName: '',
          phloLimit: this.props.phloLimit || DEFAULT_PHLO_LIMIT,
        }}
        validate={(values) => {
          let errors: {
            name?: string;
            privatekey?: string;
            phloLimit?: string;
            box?: string;
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
              box: values.box,
              accountName: values.accountName,
            });
          } else {
            this.props.filledTransactionData({
              publickey: '',
              privatekey: '',
              phloLimit: 0,
              box: undefined,
              accountName: undefined,
            });
          }

          return errors;
        }}>
        {({ errors, touched, handleSubmit, setFieldValue }) => {
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
              <AccountSelectComponent
                chooseBox={this.props.chooseBox}
                updatePrivateKey={(a) => {
                  setFieldValue('accountName', a.accountName);
                  setFieldValue('box', a.box);
                  setFieldValue('privatekey', a.privatekey);
                }}
                accounts={this.props.accounts}
              />

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
      </Formik>
    );
  }
}
