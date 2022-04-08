import React from 'react';
import * as elliptic from 'elliptic';
import { Formik, Field } from 'formik';
import * as rchainToolkit from 'rchain-toolkit';

import { Account } from '/models';
import { DEFAULT_PHLO_LIMIT } from '/CONSTANTS';
import { AccountSelect } from '../AccountSelect';

import './TransactionForm.scss';

const ec = new elliptic.ec('secp256k1');

export interface TransactionFormProps {
  accounts: Record<string, Account>;
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

export class TransactionFormComponent extends React.Component<TransactionFormProps, TransactionFormState> {
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
              {!this.props.publicKey && this.props.address ? (
                <div className="field is-horizontal">
                  <label className="label">{t('for address')}</label>
                  <div className="control">
                    <input disabled className="input" type="text" name="address" value={this.props.address} />
                  </div>
                </div>
              ) : undefined}
              <AccountSelect
                chooseBox={this.props.chooseBox}
                updatePrivateKey={(a) => {
                  setFieldValue('accountName', a.accountName);
                  setFieldValue('box', a.box);
                  setFieldValue('privatekey', a.privatekey);
                }}
                accounts={this.props.accounts}
              />

              <div className="field is-horizontal my-3">
                <div className="field-label is-normal">
                  <label className="label">{t('phlogiston limit')}*</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <Field className="input" type="number" name="phloLimit" placeholder={t('phlogiston limit')} />
                    </div>
                  </div>
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

export const TransactionForm = TransactionFormComponent;
