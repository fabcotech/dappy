import * as React from 'react';
import { connect } from 'react-redux';

import { State as StoreState } from '/store';
import * as fromMain from '/store/main';
import * as fromUi from '/store/ui';
import * as fromSettings from '/store/settings';
import * as fromDapps from '/store/dapps';
import * as fromCommon from '/common';
import { IdentificationForm } from '.';

import './IdentificationModal.scss';
import { Account, Identification } from '/models';

interface IdentificationModalComponentProps {
  modal: undefined | fromMain.Modal;
  isMobile: boolean;
  isTablet: boolean;
  accounts: { [accountName: string]: Account };
  saveIdentification: (a: fromDapps.SaveIdentificationPayload) => void;
}

export class IdentificationModalComponent extends React.Component<
  IdentificationModalComponentProps,
  {}
> {
  state: {
    identification?: Identification;
  } = {};

  onCloseModal = () => {
    const payload: fromCommon.IdentifyFromSandboxPayload =
      this.props.modal && this.props.modal.parameters;

    this.props.saveIdentification({
      tabId: payload.tabId,
      callId: payload.callId,
      identification: {
        publicKey: payload.parameters.publicKey,
        box: undefined,
        identified: false,
      },
    });
  };

  onIdentified = (t: Identification | undefined) => {
    this.setState({ identification: t });
  };

  render() {
    if (!this.props.modal) {
      return undefined;
    }

    const payload: fromCommon.IdentifyFromSandboxPayload = this.props.modal.parameters;
    if (!payload.parameters) {
      console.log('Error : there should be parameters in IdentificationModal');
    }

    let klasses = '';
    if (this.props.isMobile) {
      klasses += 'is-mobile';
    } else if (this.props.isTablet) {
      klasses += 'is-tablet';
    }

    return (
      <div className={`modal identification-modal fc ${klasses}`}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{t('dapp requires identification')}</p>
            <i onClick={this.onCloseModal} className="fas fa-times" />
          </header>
          <section className="modal-card-body">
            <IdentificationForm
              identification={payload.parameters}
              accounts={this.props.accounts}
              identified={this.onIdentified}
            />
          </section>
          <footer className="modal-card-foot">
            <button
              type="button"
              className={`button is-light`}
              onClick={() =>
                this.props.saveIdentification({
                  tabId: payload.tabId,
                  callId: payload.callId,
                  identification: {
                    publicKey: payload.parameters.publicKey,
                    box: undefined,
                    identified: false,
                  },
                })
              }
            >
              {t('discard identification')}
            </button>
            <button
              type="button"
              disabled={!this.state.identification}
              className={`button is-link`}
              onClick={() =>
                this.props.saveIdentification({
                  tabId: payload.tabId,
                  callId: payload.callId,
                  identification: this.state.identification as Identification,
                })
              }
            >
              {t('identify')}
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export const IdentificationModal = connect(
  (state: StoreState) => ({
    isMobile: fromUi.getIsMobile(state),
    isTablet: fromUi.getIsTablet(state),
    accounts: fromSettings.getAccounts(state),
  }),
  (dispatch) => ({
    saveIdentification: (a: fromDapps.SaveIdentificationPayload) => {
      dispatch(fromDapps.saveIdentificationAction(a));
      dispatch(fromMain.closeDappModalAction({ tabId: a.tabId }));
    },
  })
)(IdentificationModalComponent);
