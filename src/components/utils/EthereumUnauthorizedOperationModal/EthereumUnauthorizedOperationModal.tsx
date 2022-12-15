import React from 'react';
import { connect } from 'react-redux';

import { Modal, closeDappModalAction } from '/store/main';
import { navigateAction } from '/store/ui';

import './EthereumUnauthorizedOperationModal.scss';
import { copyToClipboard } from '/interProcess';

interface EthereumUnauthorizedOperationModalProps {
  modal: Modal;
  close: (tabId: string, a: boolean) => void;
}

export const EthereumUnauthorizedOperationModalComponent = ({
  modal,
  close,
}: EthereumUnauthorizedOperationModalProps) => {
  return (
    <div className="modal fc est">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('unauthorized ethereum operation modal')}</p>
          <i onClick={() => close(modal.tabId as string, false)} className="fas fa-times" />
        </header>
        <section className="modal-card-body">
          <p className="mt-2 mb-2 is-size-5">
            <b>🛑 {modal.parameters.host}</b>
            &nbsp;
            <a
              type="button"
              className="underlined-link"
              onClick={() => copyToClipboard(modal.parameters.host)}
            >
              <i className="fas fa-copy mr-1"></i>
              {t('copy host')}
            </a>
            <br />
          </p>
          <p style={{ wordBreak: 'break-word' }} className="text-mid">
            {modal.parameters.text}
          </p>
        </section>
        <footer className="modal-card-foot is-justify-content-end">
          <button
            type="button"
            className="button is-outlined"
            onClick={() => close(modal.tabId as string, true)}
          >
            {t('close and go to wallets whitelist')}
          </button>
          <button
            type="button"
            className="button is-outlined"
            onClick={() => close(modal.tabId as string, false)}
          >
            {t('close')}
          </button>
        </footer>
      </div>
    </div>
  );
};

export const EthereumUnauthorizedOperationModal = connect(
  (state) => ({}),
  (dispatch) => ({
    close: (tabId: string, alsoGoToAccountsSecurity: boolean) => {
      dispatch(
        closeDappModalAction({
          tabId,
        })
      );
      if (alsoGoToAccountsSecurity) {
        dispatch(
          navigateAction({
            navigationUrl: '/accounts',
          })
        );
      }
    },
  })
)(EthereumUnauthorizedOperationModalComponent);
