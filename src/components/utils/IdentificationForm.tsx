import React, { Fragment } from 'react';
import * as elliptic from 'elliptic';
import { Formik, Field } from 'formik';

import './TransactionForm/TransactionForm.scss'; // todo: extract style and create IdentificationForm.scss or use bulma css classes and remove import
import { Account, BlockchainAccount, Identification } from '/models';
import { AccountSelect } from './AccountSelect';

const ec = new elliptic.ec('secp256k1');

interface IdentificationFormProps {
  accounts?: { [accountName: string]: Account };
  identification: {
    publicKey: undefined | string;
  };
  identified: (t: Identification | undefined) => void;
}
interface IdentificationFormState {
  atLeastOneAccount: boolean;
  usePrivateKey: boolean;
  okAccounts?: { [accountName: string]: Account };
}

export class IdentificationForm extends React.Component<
  IdentificationFormProps,
  IdentificationFormState
> {
  constructor(props: IdentificationFormProps) {
    super(props);
    this.state = {
      atLeastOneAccount: false,
      usePrivateKey: false,
    };
  }

  static getDerivedStateFromProps(nextProps: IdentificationFormProps) {
    if (nextProps.accounts && Object.keys(nextProps.accounts).length) {
      if (nextProps.identification.publicKey && nextProps.accounts) {
        const okAccounts = Object.values(nextProps.accounts)
          .filter((v) => v.platform !== 'certificate')
          .filter((a) => (a as BlockchainAccount).publicKey === nextProps.identification.publicKey);

        return { atLeastOneAccount: okAccounts.length >= 1, okAccounts };
      }
      return { atLeastOneAccount: true, okAccounts: nextProps.accounts };
    }
    return { atLeastOneAccount: false };
  }

  publicKey = '';

  render() {
    return (
      <Formik
        onSubmit={() => undefined}
        initialValues={{
          privateKey: '',
          box: '',
        }}
        validate={(values) => {
          const errors: {
            name?: string;
            privateKey?: string;
          } = {};

          if (!values.privateKey) {
            errors.privateKey = t('field required');
            this.publicKey = '';
          } else {
            try {
              const keyPair = ec.keyFromPrivate(values.privateKey);
              this.publicKey = keyPair.getPublic().encode('hex', false) as string;
              if (
                this.props.identification.publicKey &&
                this.props.identification.publicKey !== this.publicKey
              ) {
                errors.privateKey = t('private key does not match');
              }
            } catch {
              errors.privateKey = t('private key invalid');
            }
          }

          if (!Object.keys(errors).length) {
            this.props.identified({
              publicKey: this.publicKey,
              box: values.box,
              identified: true,
            });
          } else {
            this.props.identified(undefined);
          }

          return errors;
        }}
        render={({ errors, touched, handleSubmit, setFieldValue }) => {
          return (
            <form className="transaction-form" onSubmit={handleSubmit}>
              {this.props.identification.publicKey ? (
                <div className="field is-horizontal">
                  <label className="label is-6 title">{t('public key to identify')}</label>
                  <div className="control">
                    <span className="identify-public-key">
                      {this.props.identification.publicKey}
                    </span>
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
                        setFieldValue('privateKey', '');
                        this.setState({ usePrivateKey: false });
                      }}
                    >
                      {t('use account')}
                    </button>
                  </div>
                </div>
              ) : undefined}
              {!this.props.identification.publicKey &&
              (!this.state.atLeastOneAccount || this.state.usePrivateKey) ? (
                <div className="field is-horizontal">
                  <label className="label">{t('public key')}*</label>
                  <div className="control">
                    <input
                      disabled
                      className="input"
                      type="text"
                      name="publickey"
                      value={this.publicKey}
                      placeholder={t('public key derived')}
                    />
                  </div>
                </div>
              ) : undefined}

              {this.state.atLeastOneAccount && !this.state.usePrivateKey ? (
                <AccountSelect
                  chooseBox={true}
                  updatePrivateKey={(a) => {
                    console.log(a);
                    setFieldValue('privateKey', a.privatekey);
                    setFieldValue('box', a.box);
                  }}
                  accounts={this.state.okAccounts as { [accountName: string]: Account }}
                />
              ) : undefined}

              {!this.state.atLeastOneAccount || this.state.usePrivateKey ? (
                <Fragment>
                  <div className="field is-horizontal">
                    <label className="label">{t('private key')}*</label>
                    <div className="control">
                      <Field
                        className="input"
                        type="password"
                        name="privateKey"
                        placeholder="Private key"
                      />
                    </div>
                  </div>
                </Fragment>
              ) : undefined}
              {errors.privateKey && <p className="text-danger">{(errors as any).privateKey}</p>}
            </form>
          );
        }}
      />
    );
  }
}
