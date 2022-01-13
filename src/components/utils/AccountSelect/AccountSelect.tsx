import React, { Fragment } from 'react';
import * as elliptic from 'elliptic';
import { Formik, Field } from 'formik';
import xs, { Stream } from 'xstream';
import debounce from 'xstream/extra/debounce';

import { Account } from '/models';
import { decrypt, passwordFromStringToBytes } from '/utils/crypto';

const ec = new elliptic.ec('secp256k1');

export interface AccountSelectProps {
  chooseBox: boolean | undefined;
  accounts: { [accountName: string]: Account };
  updatePrivateKey: (t: {
    privatekey: string | undefined;
    address: string | undefined;
    box: string | undefined;
    accountName: undefined | string;
  }) => void;
}
interface AccountSelectState {
  passwordError: string | undefined;
  boxFound: string | undefined;
  passwordSuccess: boolean;
}
export class AccountSelectComponent extends React.Component<AccountSelectProps, AccountSelectState> {
  constructor(props: AccountSelectProps) {
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
          const password = passwordFromStringToBytes(data.password);
          const decrypted = decrypt(data.account.encrypted, password);
          this.setState({
            boxFound: data.account.boxes[0],
            passwordSuccess: true,
            passwordError: undefined,
          });
          this.props.updatePrivateKey({
            privatekey: decrypted,
            address: data.account.address,
            box: data.account.boxes[0],
            accountName: data.account.name,
          });
        } catch (err) {
          this.setState({
            boxFound: undefined,
            passwordError: t('wrong password'),
            passwordSuccess: false,
          });
          this.props.updatePrivateKey({ privatekey: undefined, address: undefined, box: undefined, accountName: undefined });
        }
      },
    });
  }

  getCurrentBoxName = (selectAccountName: string) => this.props.accounts[selectAccountName]?.boxes[0];

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
            <div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">{t('account')}</label>
                </div>
                <div className="field-body">
                  <div className="field">
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
                </div>
              </div>
              {this.props.chooseBox ? (
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label">{t('box')}</label>
                  </div>

                  <div className="field-body is-align-self-flex-end">
                    <div className="field">
                      <div className="control">
                        {this.getCurrentBoxName(values.account) ? (
                          <span className="tag is-light">{this.getCurrentBoxName(values.account)}</span>
                        ) : (
                          <p>{t('box not found')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : undefined}
              {touched.account && errors.account && <p className="text-danger">{(errors as any).privatekey}</p>}

              {values.account ? (
                <Fragment>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Password*</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control has-icons-right">
                          <Field
                            className={`input ${this.state.passwordSuccess ? 'is-success' : ''} ${
                              this.state.passwordError ? 'is-danger' : ''
                            }`}
                            type="password"
                            name="password"
                            placeholder={`${t('password for')} ${values.account}`}
                          />
                          {touched.password && this.state.passwordError && (
                            <p className="text-danger mt-1">{this.state.passwordError}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ) : undefined}
            </div>
          );
        }}
      </Formik>
    );
  }
}

export const AccountSelect = AccountSelectComponent;
