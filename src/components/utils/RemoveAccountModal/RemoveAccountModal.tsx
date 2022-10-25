import React, { useState } from 'react';
import { Account } from '/models';
import { closeModalAction } from '/store/main';
import { deleteAccountAction } from '/store/settings';
import { AccountPassword } from '../AccountPassword';

export interface RemoveAccontModalProps {
  onClose: () => void;
  dispatchModalAction: (actions: { type: string; payload?: any }[]) => void;
  account: Account;
}

export const RemoveAccountModal = ({
  onClose,
  dispatchModalAction,
  account,
}: RemoveAccontModalProps) => {
  const [decrypted, setDecrypted] = useState(false);
  return (
    <div className="modal fc">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{t('remove account')}</p>
          <i onClick={onClose} className="fa fa-times" />
        </header>
        <section className="modal-card-body">
          {t('remove account warning')}
          {account.platform !== 'certificate' && (
            <div style={{ width: '50%' }}>
              <AccountPassword
                encrypted={account.encrypted}
                decryptedPrivateKey={(privateKey: undefined | string) => {
                  setDecrypted(!!privateKey);
                }}
              />
            </div>
          )}
        </section>
        <footer className="modal-card-foot">
          <button
            type="button"
            className="button is-light"
            onClick={() => dispatchModalAction([closeModalAction()])}
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            className="button is-link"
            disabled={account.platform !== 'certificate' && !decrypted}
            onClick={() =>
              dispatchModalAction([deleteAccountAction({ account }), closeModalAction()])
            }
          >
            {t('delete account confirmation')}
          </button>
        </footer>
      </div>
    </div>
  );
};
