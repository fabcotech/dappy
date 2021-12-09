import * as React from 'react';
import { Formik, Field, FieldArray } from 'formik';

import './Blockchains.scss';
import { getIpAddressAndCert } from '/interProcess';

const REGEXP_HOST = /^(?!\.)^[a-z0-9.]*$/;

interface AddNodeProps {
  formNodes: { ip: string; host: string; cert: undefined | string }[];
  addNode: (values: { ip: string; host: string; cert: undefined | string }) => void;
  cancel: () => void;
}

interface AddNodeState {
  retrieveError: string;
}

export class AddNode extends React.Component<AddNodeProps, {}> {
  state: AddNodeState = {
    retrieveError: '',
  };

  retrieveIpAddressAndCert = (host: string, setFieldValue: (a: string, b: string) => void) => {
    if (typeof host === 'string') {
      getIpAddressAndCert({ host: host })
        .then((a: { ip: string; cert: string }) => {
          if (a.ip && a.cert && typeof a.ip === 'string' && typeof a.cert === 'string') {
            setFieldValue(`cert`, a.cert);
            setFieldValue(`ip`, a.ip);
          }
          this.setState({
            retrieveError: '',
          });
        })
        .catch((err: Error) => {
          this.setState({
            retrieveError: err.message || err,
          });
        });
    }
  };

  render() {
    return (
      <Formik
        initialValues={{ ip: '', host: '', cert: '' }}
        validate={(values: { ip?: string; cert?: string; host?: string }) => {
          const errors: { ip?: string; cert?: string; host?: string } = {};

          if (this.props.formNodes.find((no) => no.ip === values.ip)) {
            errors.ip = 'A node with this IP address already exists';
          } else if (!values.ip) {
            errors.ip = t('must set ip');
          }

          if (!values.host) {
            errors.host = t('host must be set');
          } else if (!REGEXP_HOST.test(values.host)) {
            errors.host = t('host must be valid');
          }

          return errors;
        }}
        onSubmit={() => {}}
        render={({ values, touched, errors, setFieldValue }) => (
          <div className="ip-servers-form">
            <div className="ip-server">
              <div className="field is-horizontal">
                <label className="label">{t('host name')}*</label>
                <div className="control">
                  <Field className="input" type="text" name={`host`} placeholder="a1.dappy.tech" />
                </div>
              </div>
              {this.state.retrieveError && <p className="text-danger">{this.state.retrieveError}</p>}
              {touched && touched.host && errors.host && <p className="text-danger">{errors.host}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('ip address')}*</label>
                <div className="control">
                  <Field className="input" type="text" name={`ip`} placeholder="12.12.12.12" />
                </div>
              </div>
              {touched && touched.ip && errors.ip && <p className="text-danger">{errors.ip}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('certificate')}*</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    component="textarea"
                    name={`cert`}
                    placeholder="-----BEGIN CERTIFICATE-----"
                  />
                </div>
              </div>
              {touched && touched.cert && errors.cert && <p className="text-danger">{errors.cert}</p>}

              <div className="field is-horizontal is-grouped pt20">
                <div className="control">
                  <button
                    type="button"
                    onClick={() => {
                      this.props.cancel();
                    }}
                    className="button is-light">
                    Cancel
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      this.props.addNode({
                        ip: values.ip,
                        host: values.host,
                        cert: values.cert ? encodeURI(values.cert) : undefined,
                      });
                    }}
                    className="button is-black"
                    disabled={!!(errors.host || errors.ip || errors.cert)}>
                    Add node
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    );
  }
}
