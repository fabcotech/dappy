import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form } from 'formik';

import { Account } from '/models';
import { updateShowAccountCreationAtStartup } from '/store/ui/actions';
import { createAccountAction as createAccount } from '/store/settings';
import { AccountForm } from '../AccountForm';
import './NoAccountForm.scss';

interface Values {
  dontAskAgain: boolean;
}

const cancel = (updateShowAccount: typeof updateShowAccountCreationAtStartup, onClose: () => void, values: Values) => {
  updateShowAccount({ show: !values.dontAskAgain });
  onClose();
};

interface NoAccountFormComponentProps {
  updateShowAccount: typeof updateShowAccountCreationAtStartup;
  onClose: () => void;
  showAccountCreationForm: () => void;
}

export const AskingAccountCreationComponent = ({
  updateShowAccount,
  onClose,
  showAccountCreationForm,
}: NoAccountFormComponentProps) => {
  return (
    <div className="theme-default naf-popin p-5">
      <div className="naf-content">
        <div>
          <div className="title">{t('no accounts configured')}</div>
          <div className="container pb-4">
            <p>{t('dappy account description')}</p>
          </div>
          <Formik
            initialValues={{
              dontAskAgain: false,
            }}
            onSubmit={showAccountCreationForm}>
            {({ values }) => (
              <Form>
                <div className="field">
                  <div className="control">
                    <Field type="checkbox" name="dontAskAgain" id="dontAskAgain" className="is-checkradio" />
                    <label className="checkbox" htmlFor="dontAskAgain">
                      {t("don't ask again")}
                    </label>
                  </div>
                </div>
                <div className="field is-grouped is-grouped-right">
                  <div className="control">
                    <button
                      onClick={(e) => {
                        cancel(updateShowAccount, onClose, values);
                        e.preventDefault();
                      }}
                      className="button is-light is-medium">
                      {t('skip')}
                    </button>
                  </div>
                  <div className="control">
                    <button className="button is-link is-medium">{t('create account')}</button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export const AskingAccountCreation = connect(undefined, {
  updateShowAccount: updateShowAccountCreationAtStartup,
})(AskingAccountCreationComponent);

interface NoAccountFormProps {
  onClose: () => void;
  createAccount: (p: { account: Account }) => void;
}

export const NoAccountFormComponent = ({ onClose, createAccount }: NoAccountFormProps) => {
  const [showAccountCreationForm, setShowAccountCreationForm] = useState(false);
  const [account, setAccount] = useState<Account | undefined>(undefined);

  return (
    <div className="theme-default naf p-6">
      {showAccountCreationForm ? (
        <div>
          <div className="field">
            <AccountForm names={[]} filledAccount={setAccount} />
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button
                onClick={(e) => {
                  onClose();
                  e.preventDefault();
                }}
                className="button is-light">
                {t('skip')}
              </button>
            </div>
            <div className="control">
              <button
                disabled={!account}
                className="button is-link"
                onClick={() => {
                  if (account) {
                    createAccount({ account });
                    onClose();
                  }
                }}>
                {t('create account')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <AskingAccountCreation onClose={onClose} showAccountCreationForm={() => setShowAccountCreationForm(true)} />
      )}
    </div>
  );
};

export const NoAccountForm = connect(undefined, {
  createAccount,
})(NoAccountFormComponent);
