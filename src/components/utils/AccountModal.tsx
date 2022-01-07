import * as React from 'react';
import { connect } from 'react-redux';
import xs, { Stream } from 'xstream';
import debounce from 'xstream/extra/debounce';
import { Field, Formik } from 'formik';

import { State as StoreState } from '/store';
import { copyToClipboard } from '/interProcess';
import * as fromMain from '/store/main';
import * as fromUi from '/store/ui';
import { decrypt, passwordFromStringToBytes } from '/utils/crypto';

import './AccountModal.scss';
import { Account } from '/models';

interface AccountModalComponentProps {
  modal: undefined | fromMain.Modal;
  isMobile: boolean;
  isTablet: boolean;
  closeModal: () => void;
}
interface AccountSelectComponentState {
  passwordError: string | undefined;
  passwordSuccess: boolean;
  privatekey: undefined | string;
}
export class AccountModalComponent extends React.Component<AccountModalComponentProps, AccountSelectComponentState> {
  constructor(props: AccountModalComponentProps) {
    super(props);
    this.state = {
      passwordError: undefined,
      passwordSuccess: false,
      privatekey: undefined,
    };
  }

  stream: undefined | Stream<{ account: Account; password: string }>;

  onCloseModal = () => {
    this.props.closeModal();
  };

  init() {
    this.stream = xs.create();
    this.stream.compose(debounce(800)).subscribe({
      next: (data) => {
        try {
          const password = passwordFromStringToBytes(data.password);
          const decrypted = decrypt(data.account.encrypted, password);
          this.setState({
            passwordSuccess: true,
            passwordError: undefined,
            privatekey: decrypted,
          });
        } catch (err) {
          this.setState({
            passwordError: t('wrong password'),
            passwordSuccess: false,
            privatekey: undefined,
          });
        }
      },
    });
  }

  render() {
    const account: Account = (this.props.modal as fromMain.Modal).parameters.account;
    if (!this.stream) {
      this.init();
    }

    let klasses = '';
    if (this.props.isMobile) {
      klasses += 'is-mobile';
    } else if (this.props.isTablet) {
      klasses += 'is-tablet';
    }
    return (
      <div className={`modal transaction-modal fc ${klasses}`}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{t('check account')}</p>
          </header>
          <section className="modal-card-body">
            <Formik
              onSubmit={() => undefined}
              initialValues={{
                password: '',
              }}
              validate={(values) => {
                let errors: {
                  password?: string;
                } = {};
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
                      <label className="label">{t('account')}</label>
                      <div className="control">
                        <span>{account.name}</span>
                      </div>
                    </div>
                    <div className="field is-horizontal">
                      <label className="label">{t('address')}</label>
                      <div className="control">
                        <p className="private-or-public-key">{account.address}</p>
                        <a type="button" className="underlined-link" onClick={() => copyToClipboard(account.address)}>
                          <i className="fa fa-copy fa-before"></i>
                          {t('copy address')}
                        </a>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <label className="label">{t('public key')}</label>
                      <div className="control">
                        <p className="private-or-public-key">{account.publicKey}</p>
                        <a type="button" className="underlined-link" onClick={() => copyToClipboard(account.publicKey)}>
                          <i className="fa fa-copy fa-before"></i>
                          copy public key
                        </a>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <label className="label">{t('private key')}</label>
                      <div className="control">
                        {this.state.privatekey ? (
                          <p className="private-or-public-key">{this.state.privatekey}</p>
                        ) : (
                          <p className="enter-password">Enter password to see private key</p>
                        )}
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <label className="label">
                        <i className="fa fa-before fa-key"></i>
                        {t('unlock account')}
                      </label>
                      <div className="control has-icons-right">
                        <Field
                          className={`input ${this.state.passwordSuccess ? 'is-success' : ''} ${
                            this.state.passwordError ? 'is-danger' : ''
                          }`}
                          type="password"
                          name="password"
                          placeholder={`${t('password for')} ${account.name}`}
                        />
                        <p className="help">{t('unlock account to see private key')}</p>
                      </div>
                    </div>
                    {touched.password && this.state.passwordError && (
                      <p className="text-danger">{this.state.passwordError}</p>
                    )}
                  </div>
                );
              }}
            />
          </section>
          <footer className="modal-card-foot">
            <span />
            <button type="button" className={`button is-link`} onClick={this.onCloseModal}>
              {t('ok')}
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export const AccountModal = connect(
  (state: StoreState) => ({
    isMobile: fromUi.getIsMobile(state),
    isTablet: fromUi.getIsTablet(state),
  }),
  (dispatch) => ({
    closeModal: () => dispatch(fromMain.closeModalAction()),
  })
)(AccountModalComponent);
