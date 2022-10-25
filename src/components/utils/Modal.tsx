import * as React from 'react';

import * as fromMain from '/store/main';
import { connect } from 'react-redux';
import { RChainTransactionModal, AccountModal, IdentificationModal } from '.';
import { RemoveAccountModal } from './RemoveAccountModal';
import { PaymentRequestModal } from './PaymentRequestModal';
import { GenericModal } from './GenericModal';
import { LoadInfo } from '../resources';
import { EthereumSignTransactionModal } from './EthereumSignTransactionModal';

interface ModalComponentProps {
  tabId?: string;
  modal: undefined | fromMain.Modal;
  dispatchModalAction: (
    action: undefined | { type: string; payload?: any } | { type: string; payload?: any }[]
  ) => void;
}

class ModalComponent extends React.Component<ModalComponentProps> {
  onClose() {
    const { modal, dispatchModalAction } = this.props;
    if (modal) {
      if (modal.tabId) {
        dispatchModalAction(fromMain.closeDappModalAction({ tabId: modal.tabId }));
      } else {
        dispatchModalAction(fromMain.closeModalAction());
      }
    }
  }

  render() {
    if (!this.props.modal) {
      return <div></div>;
    }

    /*
      The following modals are rendered in the DOM aside from the DappSandboxed component
      because they are dapp modals
    */
    switch (this.props.modal.title) {
      case 'RCHAIN_TRANSACTION_MODAL':
        return <RChainTransactionModal modal={this.props.modal} />;
      case 'ETHEREUM_SIGN_TRANSACTION_MODAL':
        return <EthereumSignTransactionModal modal={this.props.modal} />;
      case 'PAYMENT_REQUEST_MODAL':
        return <PaymentRequestModal modal={this.props.modal} />;
      case 'IDENTIFICATION_MODAL':
        return <IdentificationModal modal={this.props.modal} />;
      case 'ACCOUNT_MODAL':
        return <AccountModal modal={this.props.modal} />;
      case 'LOAD_INFO_MODAL':
        return <LoadInfo tab={this.props.modal.parameters.tab} />;
      case 'REMOVE_ACCOUNT_MODAL':
        return (
          <RemoveAccountModal
            onClose={this.onClose}
            dispatchModalAction={this.props.dispatchModalAction}
            account={this.props.modal.parameters.account}
          />
        );
      default:
        break;
    }

    return (
      <GenericModal
        modal={this.props.modal}
        dispatchModalAction={this.props.dispatchModalAction}
        onClose={() => this.onClose()}
      />
    );
  }
}

export const Modal = connect(
  (state, ownProps: any) => {
    if (ownProps.tabId) {
      const dappModals = fromMain.getDappModals(state)[ownProps.tabId];
      return {
        modal: dappModals ? dappModals[0] : undefined,
      };
    }

    return {
      modal: fromMain.getModal(state),
    };
  },
  (dispatch) => ({
    dispatchModalAction: (
      action: undefined | { type: string; payload?: any } | { type: string; payload?: any }[]
    ) => {
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
