import * as React from 'react';

import * as fromMain from '../../store/main';
import { LoadState } from '../dapps/';
import { connect } from 'react-redux';
import { TransactionModal, AccountModal, IdentificationModal } from '.';
import { PaymentRequestModal } from './PaymentRequestModal';
import { LoadInfo } from '../dapp';

interface ModalComponentProps {
  modal: undefined | fromMain.Modal;
  dispatchModalAction: (
    action: undefined | { type: string; payload?: any } | { type: string; payload?: any }[]
  ) => void;
}

class ModalComponent extends React.Component<ModalComponentProps, {}> {
  onCloseModal = () => {
    if (this.props.modal) {
      if (this.props.modal.dappId) {
        this.props.dispatchModalAction(fromMain.closeDappModalAction({ dappId: this.props.modal.dappId }));
      } else {
        this.props.dispatchModalAction(fromMain.closeModalAction());
      }
    }
  };

  render() {
    if (!this.props.modal) {
      return undefined;
    }

    /*
      The three following modal are rendered in the DOM aside from the DappSandboxed component
      because they are dapp modals
    */
    if (this.props.modal.title === 'TRANSACTION_MODAL') {
      return <TransactionModal modal={this.props.modal} />;
    }

    if (this.props.modal.title === 'PAYMENT_REQUEST_MODAL') {
      return <PaymentRequestModal modal={this.props.modal} />;
    }

    if (this.props.modal.title === 'IDENTIFICATION_MODAL') {
      return <IdentificationModal modal={this.props.modal} />;
    }

    if (this.props.modal.title === 'ACCOUNT_MODAL') {
      return <AccountModal modal={this.props.modal} />;
    }

    if (this.props.modal.title === 'LOAD_INFO_MODAL') {
      return (
        <LoadInfo
          appType={this.props.modal.parameters.appType}
          address={this.props.modal.parameters.address}
          tabId={this.props.modal.parameters.tabId}
          badges={this.props.modal.parameters.badges}
          loadState={this.props.modal.parameters.loadState}
          resourceId={this.props.modal.parameters.resourceId}
          servers={this.props.modal.parameters.servers}
        />
      );
    }

    return (
      <div className="modal fc">
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.modal.title}</p>
            <i onClick={this.onCloseModal} className="fa fa-times" />
          </header>
          <section className="modal-card-body">
            {this.props.modal.title === 'Load report' && <LoadState dappId={this.props.modal.text} />}
            {this.props.modal.title !== 'Load report' && this.props.modal.text}
          </section>
          <footer className="modal-card-foot">
            {this.props.modal.buttons &&
              this.props.modal.buttons.map((b) => (
                <button
                  key={b.text}
                  type="button"
                  className={`button ${b.classNames}`}
                  onClick={() => this.props.dispatchModalAction(b.action)}>
                  {b.text}
                </button>
              ))}
          </footer>
        </div>
      </div>
    );
  }
}

export const Modal = connect(
  (state, ownProps: any) => {
    if (ownProps.dappId) {
      const dappModals = fromMain.getDappModals(state)[ownProps.dappId];
      return {
        modal: dappModals ? dappModals[0] : undefined,
      };
    }

    return {
      modal: fromMain.getModal(state),
    };
  },
  (dispatch) => ({
    dispatchModalAction: (action: undefined | { type: string; payload?: any } | { type: string; payload?: any }[]) => {
      if (action) {
        if (Array.isArray(action)) {
          action.forEach((a) => {
            dispatch(a);
          });
        } else {
          dispatch(action);
        }
      }
    },
  })
)(ModalComponent);
