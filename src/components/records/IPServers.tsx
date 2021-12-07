import * as React from 'react';
import { Formik, Field, FieldArray } from 'formik';

import { IPServer } from '/models';
import { ServerConfig } from './ServerConfig';

import './IPServers.scss';
import { getIpAddressAndCert } from '/interProcess';

interface IPServersComponentProps {
  ipServers: IPServer[];
  back: () => void;
  setIpServers: (a: IPServer[]) => void;
}

const REGEXP_IP = /^(?!\.)^[a-z0-9.-]*$/;
const REGEXP_HOST = /^(?!\.)^[a-z0-9.-]*$/;

export class IPServersComponent extends React.Component<IPServersComponentProps> {
  state: { retrieveError: { [n: number]: string } } = {
    retrieveError: {},
  };

  generateCertificateAndKey = (
    index: number,
    altName: string,
    setFieldValue: (a: string, b: string) => void,
    setFieldTouched: (a: string, b: boolean) => void
  ) => {
    window
      .generateCertificateAndKey([altName])
      .then((a: { key: string; certificate: string }) => {
        if (a.key && a.certificate && typeof a.key === 'string' && typeof a.certificate === 'string') {
          setFieldValue(`servers.${index}.cert`, a.certificate);
          setFieldTouched(`servers.${index}.cert`, true);
          setFieldValue(`servers.${index}.key`, a.key);
          setFieldTouched(`servers.${index}.key`, true);
        }
        this.setState({
          retrieveError: {
            ...this.state.retrieveError,
            [index]: '',
          },
        });
      })
      .catch((err: Error) => {
        console.log(err);
        this.setState({
          retrieveError: {
            ...this.state.retrieveError,
            [index]: err.message || err,
          },
        });
      });
  };

  retrieveIpAddressAndCert = (
    index: number,
    host: string,
    setFieldValue: (a: string, b: string) => void,
    setFieldTouched: (a: string, b: boolean) => void
  ) => {
    if (typeof host === 'string') {
      getIpAddressAndCert({ host: host })
        .then((a: { ip: string; cert: string }) => {
          if (a.ip && a.cert && typeof a.ip === 'string' && typeof a.cert === 'string') {
            setFieldValue(`servers.${index}.key`, '');
            setFieldTouched(`servers.${index}.key`, true);
            setFieldValue(`servers.${index}.cert`, decodeURI(a.cert));
            setFieldTouched(`servers.${index}.cert`, true);
            setFieldValue(`servers.${index}.ip`, a.ip);
            setFieldTouched(`servers.${index}.ip`, true);
          }
          this.setState({
            retrieveError: {
              ...this.state.retrieveError,
              [index]: '',
            },
          });
        })
        .catch((err: Error) => {
          this.setState({
            retrieveError: {
              ...this.state.retrieveError,
              [index]: err.message || err,
            },
          });
        });
    }
  };

  render() {
    return (
      <Formik
        initialValues={{
          servers: this.props.ipServers.length
            ? this.props.ipServers.map((a) => ({ ...a, displayConfig: false, key: '', useCA: !a.cert }))
            : [{ ip: '', host: '', cert: '', primary: true, displayConfig: false, key: '', useCA: false }],
        }}
        validate={(values) => {
          const errors: { [key: string]: { [key: string]: { ip?: string; cert?: string; host?: string } } } = {};

          const ips: { [key: string]: boolean } = {};
          values.servers.forEach((s, index) => {
            let ipError;
            let hostError;
            let certError;
            if (s.ip) {
              // IP does not have to be unique
              /* if (ips[s.ip]) {
                ipError = t('ip must be unique');
              } */
              if (!REGEXP_IP.test(s.ip)) {
                ipError = t('ip must be valid');
              } else {
                ips[s.ip] = true;
              }
            } else {
              ipError = t('must set ip');
            }
            if (!s.host) {
              hostError = t('host must be set');
            } else if (!REGEXP_HOST.test(s.host)) {
              hostError = t('host must be valid');
            }

            if (!s.useCA && !s.cert) {
              certError = t('cert must be set');
            }

            if (ipError || hostError || certError) {
              if (!errors.servers) errors.servers = {};
              if (!errors.servers[index]) errors.servers[index] = {};

              if (ipError) {
                errors.servers[index].ip = ipError;
              }
              if (hostError) {
                errors.servers[index].host = hostError;
              }
              if (certError) {
                errors.servers[index].cert = certError;
              }
            }
          });

          return errors;
        }}
        onSubmit={() => { }}
        render={({ values, touched, errors, setFieldValue, setFieldTouched }) => (
          <div>
            <FieldArray
              name="servers"
              render={(arrayHelpers) => (
                <div>
                  {values.servers.map((s, index) => {
                    const touchedServer = touched.servers ? touched.servers[index] : {};
                    const errorsServer = errors.servers ? errors.servers[index] : {};
                    const retrieveError = this.state.retrieveError[index];
                    const Top = () => (
                      <React.Fragment>
                        <h5 className="is-6 title">
                          {s && s.ip
                            ? s.ip
                            : `${t('server')} ${index + 1}`}
                          {index === values.servers.length - 1 ? (
                            <i
                              className="fa fa-after fa-trash"
                              title={t('remove server')}
                              onClick={() => arrayHelpers.pop()}></i>
                          ) : undefined}
                        </h5>
                        {s && s && (
                          <a
                            type="button"
                            className="underlined-link"
                            onClick={() => {
                              setFieldValue(`servers.${index}.displayConfig`, !values.servers[index].displayConfig);
                            }}>
                            <i className="fa fa-before fa-server"></i>
                            {values.servers[index].displayConfig ? 'Hide config' : 'Check nginx and apache config'}
                            <br />
                            <br />
                          </a>
                        )}
                      </React.Fragment>
                    );

                    if (values.servers[index].displayConfig) {
                      return (
                        <div key={index} className="ip-server">
                          <Top />
                          <ServerConfig
                            host={values.servers[index].host}
                            certificate={values.servers[index].cert}
                            kkey={values.servers[index].key}
                          />
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="ip-server">
                        <Top />
                        <div className="field is-horizontal">
                          <label className="label">{t('host name')}*</label>
                          <div className="control">
                            <Field
                              className="input"
                              type="text"
                              name={`servers.${index}.host`}
                              placeholder="dappy.tech"
                            />
                          </div>
                        </div>
                        {retrieveError && <p className="text-danger">{retrieveError}</p>}
                        {touchedServer && touchedServer.host && errorsServer && typeof errorsServer !== 'string' && (
                          <p className="text-danger">{errorsServer.host}</p>
                        )}
                        <div className="field is-horizontal">
                          <label className="label">{t('ip address')}*</label>
                          <div className="control">
                            <Field
                              className="input"
                              type="text"
                              name={`servers.${index}.ip`}
                              placeholder="12.12.12.12"
                            />
                          </div>
                        </div>
                        {touchedServer && touchedServer.ip && errorsServer && typeof errorsServer !== 'string' && (
                          <p className="text-danger">{errorsServer.ip}</p>
                        )}
                        {!s.useCA && <div className="field is-horizontal">
                          <label className="label">{t('certificate')}*</label>
                          <div className="control">
                            <Field
                              className="input"
                              type="text"
                              component="textarea"
                              name={`servers.${index}.cert`}
                              placeholder="-----BEGIN CERTIFICATE-----"
                            />
                            <a
                              className={`underlined-link ${!s.host && 'disabled'}`}
                              onClick={() => {
                                if (s.host) {
                                  this.generateCertificateAndKey(
                                    index,
                                    s.host,
                                    setFieldValue,
                                    setFieldTouched
                                  );
                                }
                              }}>
                              <i className="fa fa-before fa-key"></i>
                              Generate TLS certificate and key
                            </a>
                          </div>
                        </div>}
                        {touchedServer && touchedServer.cert && errorsServer && typeof errorsServer !== 'string' && (
                          <p className="text-danger">{errorsServer.cert}</p>
                        )}
                        <div className="field is-horizontal">
                          <input
                            className="is-checkradio is-link is-inverted"
                            id="useCA"
                            type="checkbox"
                            onChange={() => { }}
                            checked={s.useCA}
                          />
                          <label
                            onClick={() => {
                              const newUseCA = !s.useCA;
                              if (newUseCA) {
                                setFieldValue(`servers.${index}.cert`, '');
                              }
                              setFieldValue(`servers.${index}.useCA`, newUseCA);
                            }}
                            className="label">
                            {t('use public ca')}*
                          </label>
                          <div className="primary-label-description label-description">
                            {t('use public ca paragraph')}
                          </div>
                        </div>

                        <div className="field is-horizontal">
                          <input
                            className="is-checkradio is-link is-inverted"
                            id="exampleCheckbox"
                            type="checkbox"
                            onChange={() => { }}
                            checked={s.primary}
                          />
                          <label
                            onClick={() => setFieldValue(`servers.${index}.primary`, !s.primary)}
                            className="label">
                            {t('primary server')}*
                          </label>
                          <div className="primary-label-description label-description">
                            {t('primary server paragraph')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    className="button is-link is-small"
                    onClick={() => arrayHelpers.push({ ip: '', host: '', cert: '', primary: false })}>
                    {t('add a server')}
                    <i className="fa fa-plus fa-after"></i>
                  </button>
                  <div className="field is-horizontal is-grouped pt20">
                    <div className="control">
                      <button
                        type="button"
                        onClick={() => {
                          this.props.setIpServers(
                            values.servers.map((s) => {
                              if (s.useCA) {
                                return {
                                  ip: s.ip,
                                  host: s.host,
                                  primary: s.primary,
                                };
                              } else {
                                return {
                                  ip: s.ip,
                                  host: s.host,
                                  primary: s.primary,
                                  cert: s.cert ? encodeURI(s.cert) : '',
                                };
                              }
                            })
                          );
                          this.props.back();
                        }}
                        className="button is-link"
                        disabled={Object.keys(errors).length > 0}>
                        {t('save ip servers')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        )}
      />
    );
  }
}
