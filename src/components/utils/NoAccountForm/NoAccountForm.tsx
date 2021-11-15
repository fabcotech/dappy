import React from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form } from 'formik';

import { updateShowAccountCreationAtStartup } from '/store/ui/actions';
import './NoAccountForm.scss';

interface Values {
  dontAskAgain: boolean;
}

const submit = (values: Values) => {
  alert(values.dontAskAgain);
};

const cancel = (updateShowAccount: typeof updateShowAccountCreationAtStartup, onClose: () => void, values: Values) => {
  updateShowAccount({ show: !values.dontAskAgain });
  onClose();
};

interface NoAccountFormComponentProps {
  updateShowAccount: typeof updateShowAccountCreationAtStartup;
  onClose: () => void;
}

export const NoAccountFormComponent = ({ updateShowAccount, onClose }: NoAccountFormComponentProps) => {
  return (
    <div className="naf p-6">
      <div className="naf-popin p-5">
        <div className="naf-content">
          <i className="fa fa-user fa-8x"></i>
          <div>
            <div className="title">{t("Don't have a Dappy account ?")}</div>
            <div className="container pb-4">{t('Dappy account description')}</div>
            <Formik
              initialValues={{
                dontAskAgain: false,
              }}
              onSubmit={submit}>
              {({ values }) => (
                <Form>
                  <div className="field">
                    <div className="control">
                      <label className="checkbox">
                        <Field type="checkbox" name="dontAskAgain" />
                        {t("Don't ask again")}
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
                        className="button is-link">
                        {t('Cancel')}
                      </button>
                    </div>
                    <div className="control">
                      <button className="button is-link is-light">{t('Create account')}</button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NoAccountForm = connect(undefined, {
  updateShowAccount: updateShowAccountCreationAtStartup,
})(NoAccountFormComponent);
