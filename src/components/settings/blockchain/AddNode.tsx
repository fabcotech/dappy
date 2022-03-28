import * as React from 'react';
import { Formik, Field } from 'formik';

import './Blockchains.scss';
import { getIpAddressAndCert } from '/interProcess';

const REGEXP_HOST = /^(?!\.)^[a-z0-9.]*$/;

interface AddNodeProps {
  formNodes: { ip: string; hostname: string; port: string; caCert: string }[];
  addNode: (values: { ip: string; port: string; hostname: string; caCert: string }) => void;
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
            setFieldValue(`caCert`, a.cert);
            setFieldValue(`ip`, a.ip);
            setFieldValue(`port`, "");
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
        initialValues={{ ip: '127.0.0.1', port: '3002', hostname: 'dappynode', caCert: '' }}
        validate={(values: { ip?: string; port?: string; caCert?: string; hostname?: string }) => {
          const errors: { ip?: string; port?: string; caCert?: string; hostname?: string } = {};

          if (this.props.formNodes.find((no) => no.ip === values.ip)) {
            errors.ip = 'A node with this IP address already exists';
          } else if (!values.ip) {
            errors.ip = t('must set ip');
          }

          if (!values.hostname) {
            errors.hostname = t('host must be set');
          } else if (!REGEXP_HOST.test(values.hostname)) {
            errors.hostname = t('host must be valid');
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
                  <Field className="input" type="text" name={`hostname`} placeholder="dappynode" />
                </div>
              </div>
              {this.state.retrieveError && <p className="text-danger">{this.state.retrieveError}</p>}
              {touched && touched.hostname && errors.hostname && <p className="text-danger">{errors.hostname}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('ip address')}*</label>
                <div className="control">
                  <Field className="input" type="text" name={`ip`} placeholder="12.12.12.12" />
                </div>
              </div>
              {touched && touched.ip && errors.ip && <p className="text-danger">{errors.ip}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('port')}*</label>
                <div className="control">
                  <Field className="input" type="text" name={`port`} placeholder="" />
                </div>
              </div>
              {touched && touched.port && errors.port && <p className="text-danger">{errors.port}</p>}
              <div className="field is-horizontal">
                <label className="label">{t('certificate')}*</label>
                <div className="control">
                  <Field
                    className="input"
                    type="text"
                    component="textarea"
                    name={`caCert`}
                    placeholder="-----BEGIN CERTIFICATE-----"
                  />
                </div>
              </div>
              {touched && touched.caCert && errors.caCert && <p className="text-danger">{errors.caCert}</p>}

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
                        port: values.port,
                        hostname: values.hostname,
                        caCert: values.caCert ? Buffer.from(values.caCert, 'utf8').toString('base64') : '',
                      });
                    }}
                    className="button is-black"
                    disabled={!!(errors.hostname || errors.ip || errors.caCert)}>
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
