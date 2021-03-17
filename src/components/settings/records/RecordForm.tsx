import React, { Fragment } from 'react';
import { Formik, Field } from 'formik';
import xs, { Stream } from 'xstream';
import debounce from 'xstream/extra/debounce';

import './RecordsForm.scss';
import { Record, IPServer, RChainInfo, PartialRecord, Blockchain } from '../../../models';
import { BadgeAppreciation } from '../../utils/BadgeAppreciation';
import { IPServersComponent } from './IPServers';
import * as fromBlockchain from '../../../store/blockchain';
import { multiCall } from '../../../utils/wsUtils';
import { getNodeIndex } from '../../../utils/getNodeIndex';

interface RecordFormProps {
  validateName?: boolean;
  nameDisabled: boolean;
  records: { [key: string]: Record };
  partialRecord: PartialRecord | undefined;
  special?: RChainInfo['special'];
  namesBlockchain?: Blockchain;
  filledRecord: (t: undefined | PartialRecord) => void;
}

const CheckRadio = (props: { humanName: string; value: string; field: any; form: any }) => {
  return (
    <Fragment>
      <input
        className="is-checkradio is-record"
        value={props.value}
        name="type"
        type="radio"
        checked={props.field.value === props.value}
        onChange={() => {}}
      />
      <label
        onClick={() => {
          props.form.setFieldValue(props.field.name, props.value);
        }}>
        {props.humanName}
      </label>
    </Fragment>
  );
};

export class RecordForm extends React.Component<RecordFormProps, {}> {
  constructor(props: RecordFormProps) {
    super(props);
  }

  badgeInput: undefined | HTMLInputElement = undefined;
  badgeAppreciationInput: undefined | HTMLInputElement = undefined;
  setFieldTouched: any;
  values: any;
  asyncErrors: any = {};
  stream: Stream<undefined> = xs.create();
  skipAsyncValidation = false;
  couldNotAsynValidate = false;

  state: {
    special: boolean;
    servers: IPServer[];
    settingUpIpServers: boolean;
    badge: string;
    badgeAppreciation: string;
    badgeAppreciationPrefix: 'BS' | 'BW' | 'BD';
    availables: { [key: string]: boolean };
  } = {
    special: false,
    servers: [],
    settingUpIpServers: false,
    badge: '',
    badgeAppreciation: '',
    badgeAppreciationPrefix: 'BS',
    availables: {},
  };

  componentDidMount() {
    if (this.props.partialRecord && this.props.partialRecord.servers) {
      this.setState({
        servers: this.props.partialRecord.servers,
      });
    }
    xs.merge(this.stream.compose(debounce(600))).subscribe({
      next: () => {
        this.validateAvailability();
      },
    });
  }

  onToggleSetupIpServers = () => {
    this.setState({
      settingUpIpServers: !this.state.settingUpIpServers,
    });
  };

  onSetIpServers = (a: IPServer[]) => {
    this.setState({
      servers: a,
    });
  };

  validateAvailability = async () => {
    let errors: {
      names: string[];
    } = {
      names: [],
    };

    if (
      this.props.namesBlockchain &&
      this.values.names.find((n: string) => n && !this.state.availables.hasOwnProperty(n))
    ) {
      const indexes = this.props.namesBlockchain.nodes.map(getNodeIndex);

      // todo only ask for names that are not in this.state.availables
      let a;
      try {
        a = await multiCall(
          { type: 'get-x-records', body: { names: this.values.names } },
          {
            chainId: this.props.namesBlockchain.chainId,
            urls: indexes,
            resolverMode: 'absolute',
            resolverAccuracy: 100,
            resolverAbsolute: indexes.length,
            multiCallId: fromBlockchain.GET_X_RECORDS,
          }
        );
      } catch (err) {
        console.log(err);
        this.couldNotAsynValidate = true;
        this.asyncErrors = {};
        this.setState({
          ...this.state,
        });
        return;
      }
      this.couldNotAsynValidate = false;
      console.log(new Date());
      const result = JSON.parse(a.result.data);
      this.values.names.forEach((n: string, i: number) => {
        this.setState({
          availables: {
            ...this.state.availables,
            [n]: result.records[i] === null,
          },
        });
      });
    }
    if (this.state.special) {
      [0, 1, 2, 3].forEach((i) => {
        if (this.state.availables[this.values.names[i]] === false) {
          errors.names[i] = t('record exists');
        }
      });
    } else {
      if (this.state.availables[this.values.names[0]] === false) {
        errors.names[0] = t('record exists');
      }
    }

    // only set errors if at least one
    if (Object.keys(errors).length == 1 && errors.names.length === 0) {
      this.asyncErrors = {};
    } else {
      this.asyncErrors = errors;
    }
    this.setState({
      ...this.state,
    });

    this.skipAsyncValidation = true;
    this.setFieldTouched('names[0]');
  };

  render() {
    return (
      <Formik
        initialValues={
          this.props.partialRecord
            ? {
                ...this.props.partialRecord,
                type: this.props.partialRecord.address ? 'dapp' : 'ip',
                badges: this.props.partialRecord.badges || ({} as { [key: string]: string }),
                names: [this.props.partialRecord.name],
              }
            : {
                names: [''],
                address: '',
                type: 'ip',
                servers: [],
                badges: {} as { [key: string]: string },
              }
        }
        validate={(values) => {
          let errors: {
            name?: string;
            names: string[];
            address?: string;
            servers?: string;
            tags?: string;
          } = {
            names: [],
          };

          this.values = values;
          if (this.skipAsyncValidation === false) {
            this.asyncErrors = {
              ...this.asyncErrors,
              ongoing: 'Name availability validation ongoing',
            };
            this.setState({
              ...this.state,
            });
            this.stream.shamefullySendNext(undefined);
          }
          this.skipAsyncValidation = false;

          if (this.state.special) {
            [0, 1, 2, 3].forEach((i) => {
              if (!values.names[i]) {
                errors.names[i] = t('field required');
              } else if (this.props.validateName && !/^[a-z][a-z0-9]*$/.test(values.names[i])) {
                errors.names[i] = t('record regexp');
              } else if ([0, 1, 2, 3].filter((j) => values.names[j] === values.names[i]).length > 1) {
                errors.names[i] = 'This name is duplicate';
              }
            });
          } else {
            if (!values.names[0]) {
              errors.names[0] = t('field required');
            } else if (this.props.validateName && !/^[a-z][a-z0-9]*$/.test(values.names[0])) {
              errors.names[0] = t('record regexp');
            }

            if (values.type === 'ip') {
              if (!this.state.servers.length) {
                errors.servers = t('at least on ip server');
              }
            } else {
              if (!values.address) {
                errors.address = t('field required');
              }
            }
          }

          if (
            Object.keys(this.asyncErrors).length === 0 &&
            Object.keys(errors).length === 1 &&
            errors.names.length === 0
          ) {
            if (this.state.special && this.props.special) {
              this.props.filledRecord({
                servers: this.state.servers,
                name: [this.props.special.name].concat(values.names).join(','),
                address: values.address,
                badges: values.badges,
              });
            } else {
              this.props.filledRecord({
                servers: this.state.servers,
                name: values.names[0],
                address: values.address,
                badges: values.badges,
              });
            }
          } else {
            this.props.filledRecord(undefined);
          }

          // will be used by the async function
          return errors;
        }}
        onSubmit={() => {}}
        render={({ values, setFieldValue, setFieldTouched, errors, touched }) => {
          if (!this.setFieldTouched) {
            this.setFieldTouched = setFieldTouched;
          }
          if (this.state.settingUpIpServers) {
            return (
              <div className="ip-servers-form">
                <button
                  type="button"
                  className="button back-button is-link is-small"
                  onClick={this.onToggleSetupIpServers}>
                  <i className="fa fa-arrow-left fa-before"></i>
                  {t('back')}
                </button>
                <h5 className="is-6 title">{t('setup ip servers')}</h5>
                <IPServersComponent
                  back={this.onToggleSetupIpServers}
                  setIpServers={(a: IPServer[]) => {
                    this.onSetIpServers(a);
                    setFieldTouched('servers');
                  }}
                  ipServers={this.state.servers}></IPServersComponent>
              </div>
            );
          }

          const SpecialComponent = (p: { special: RChainInfo['special']; setSpecial: (a: boolean) => void }) => {
            if (p.special) {
              return (
                <p className="special-offer text-blue">
                  <i className="fa fa-before fa-gifts"></i>
                  Special offer going on, get 4 names for the price of one{' '}
                  {this.state.special ? (
                    <span className="activate" onClick={() => p.setSpecial(false)}>
                      cancel
                    </span>
                  ) : (
                    <span className="activate" onClick={() => p.setSpecial(true)}>
                      activate offer
                    </span>
                  )}
                  <span className="small">
                    {p.special.max - p.special.current} names still available out of {p.special.max}
                  </span>
                </p>
              );
            }

            return <span></span>;
          };

          // special is available and activated
          if (this.state.special) {
            return (
              <form>
                <div className="record-form">
                  <h5 className="is-6 title">{t('record')}</h5>
                  {touched.names && (this.asyncErrors as any).ongoing && (
                    <p className="ongoing-async">
                      <i className={`rotating fa fa-redo fa-before`} />
                      {(this.asyncErrors as any).ongoing}
                    </p>
                  )}
                  {this.couldNotAsynValidate && (
                    <p className="text-warning ongoing-async-warning">Could not validate the availability of names</p>
                  )}
                  <div className="field is-horizontal">
                    <label className="label">{t('name')}*</label>

                    <div className="control">
                      {[0, 1, 2, 3].map((i) => {
                        return (
                          <Fragment key={i}>
                            <Field
                              className="input name-input"
                              type="text"
                              name={`names.${i}`}
                              placeholder={`name ${i}`}
                            />
                            {touched.names && touched.names[i] && errors.names && errors.names[i] && (
                              <p className="text-danger name-error no-padding">{(errors as any).names[i]}</p>
                            )}
                            {touched.names &&
                              touched.names[i] &&
                              this.asyncErrors.names &&
                              this.asyncErrors.names[i] && (
                                <p className="text-danger name-error no-padding">
                                  {(this.asyncErrors as any).names[i]}
                                </p>
                              )}
                            {touched.names &&
                              touched.names[i] &&
                              !this.asyncErrors.ongoing &&
                              (!this.asyncErrors || !this.asyncErrors.names || !this.asyncErrors.names[i]) && (
                                <p className="text-success no-padding">
                                  <i className="fa fa-check"></i> available
                                </p>
                              )}
                          </Fragment>
                        );
                      })}
                      <SpecialComponent
                        special={this.props.special}
                        setSpecial={(a) => this.setState({ special: a })}
                      />
                    </div>
                  </div>
                </div>
              </form>
            );
          }

          // special is not activated or not available
          return (
            <form>
              <div className="record-form">
                <h5 className="is-6 title">{t('record')}</h5>
                {(this.asyncErrors as any).ongoing && (
                  <p className="ongoing-async">
                    <i className={`rotating fa fa-redo fa-before`} />
                    {(this.asyncErrors as any).ongoing}
                  </p>
                )}
                {this.couldNotAsynValidate && (
                  <p className="text-warning ongoing-async-warning">Could not validate the availability of names</p>
                )}
                <div className="field is-horizontal">
                  <label className="label">{t('name')}*</label>
                  <div className="control">
                    <Field className="input" type="text" name={`names.0`} placeholder={`name`} />
                  </div>
                </div>
                {touched.names && touched.names[0] && errors.names && errors.names[0] && (
                  <p className="text-danger">{(errors as any).names[0]}</p>
                )}
                {touched.names && touched.names[0] && this.asyncErrors.names && this.asyncErrors.names[0] && (
                  <p className="text-danger">{(this.asyncErrors as any).names[0]}</p>
                )}
                {touched.names &&
                  touched.names[0] &&
                  !this.asyncErrors.ongoing &&
                  (!this.asyncErrors || !this.asyncErrors.names || !this.asyncErrors.names[0]) && (
                    <p className="text-success">
                      <i className="fa fa-check"></i> available
                    </p>
                  )}
                <div className="field is-horizontal">
                  <label className="label"></label>
                  <div className="control">
                    <SpecialComponent special={this.props.special} setSpecial={(a) => this.setState({ special: a })} />
                  </div>
                </div>
                <div className="field is-horizontal">
                  <label className="label">{t('application type')}*</label>
                  <div className="control">
                    <Field component={CheckRadio} humanName="IP" value="ip" name="type" />
                    <Field component={CheckRadio} humanName="Dapp" value="dapp" name="type" />
                  </div>
                </div>

                {values.type === 'ip' ? (
                  <Fragment>
                    <div className="field is-horizontal">
                      <label className="label">{t('ip server', true)}*</label>
                      <div className="control">
                        {this.state.servers.map((s) => {
                          return (
                            <div className="server-ro" key={s.ip}>
                              <span className="ip">
                                {t('ip')} : {s.ip}
                              </span>
                              <span className="host">
                                {t('host name')} : {s.host}
                              </span>
                              <span className="cert">
                                {t('certificate')} : {s.cert.substr(0, 40) + '...'}
                              </span>
                            </div>
                          );
                        })}
                        <button type="button" className="button is-link is-small" onClick={this.onToggleSetupIpServers}>
                          {t('setup ip servers')}
                        </button>
                      </div>
                    </div>
                    {errors.servers && <p className="text-danger">{(errors as any).servers}</p>}
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className="field is-horizontal">
                      <label className="label">{t('blockchain address')}*</label>
                      <div className="control">
                        <Field className="input" type="text" name="address" placeholder={t('blockchain address')} />
                      </div>
                    </div>
                    {touched.address && errors.address && <p className="text-danger">{(errors as any).address}</p>}
                  </Fragment>
                )}
                <div className="field is-horizontal badges-field">
                  <label className="label">{t('reputation badges')}*</label>
                  <div className="control">
                    <p className="smaller-text">
                      Badges allow you to attest, certify or discredit other websites on dappy. If you add the badge
                      "bob" to your record "mysite", users who visits "bob" website will see a certification or
                      discredit badge from "mysite".
                    </p>
                  </div>
                </div>
                <div className="field badges-field">
                  <label></label>
                  <div>
                    {Object.keys(values.badges).map((t) => (
                      <div key={t} className="badge-line">
                        <div>
                          <u>{t}</u>
                        </div>
                        <BadgeAppreciation appreciation={values.badges[t]} />
                        <u
                          className="remove-badge"
                          onClick={() => {
                            const newBadges = { ...values.badges };
                            delete newBadges[t];
                            setFieldValue('badges', newBadges);
                          }}>
                          remove
                        </u>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field is-horizontal badges-field">
                  <label className="label"></label>
                  <div className="control">
                    <input
                      className="input badge-input"
                      type="text"
                      placeholder={'dappy'}
                      onChange={(e) => {
                        this.badgeInput = e.target;
                        this.setState({ badge: e.target.value });
                      }}
                    />
                    <div
                      className="badge-appreciation fc"
                      onClick={() => {
                        this.setState({
                          badgeAppreciationPrefix: { BS: 'BW', BW: 'BD', BD: 'BS' }[this.state.badgeAppreciationPrefix],
                        });
                      }}>
                      {
                        {
                          BS: <i className="fa fa-check"></i>,
                          BW: <i className="fa fa-exclamation-triangle"></i>,
                          BD: <i className="fa fa-times"></i>,
                        }[this.state.badgeAppreciationPrefix]
                      }
                    </div>
                    <input
                      className="input badge-appreciation-input"
                      type="text"
                      placeholder={'recommended and endorsed'}
                      onChange={(e) => {
                        this.badgeAppreciationInput = e.target;
                        this.setState({ badgeAppreciation: e.target.value });
                      }}
                    />
                    <button
                      onClick={() => {
                        if (this.badgeInput) {
                          this.badgeInput.value = '';
                        }
                        if (this.badgeAppreciationInput) {
                          this.badgeAppreciationInput.value = '';
                        }
                        setFieldValue('badges', {
                          ...values.badges,
                          [this.state.badge]: this.state.badgeAppreciationPrefix + this.state.badgeAppreciation,
                        });
                      }}
                      type="button"
                      disabled={!this.state.badge}
                      className="button is-light">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </form>
          );
        }}
      />
    );
  }
}
