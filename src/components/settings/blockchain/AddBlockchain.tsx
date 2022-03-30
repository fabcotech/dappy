import React, { Fragment } from 'react';
import { Formik, Field } from 'formik';
import xs from 'xstream';

import './AddBlockchain.scss';
import { CHAIN_IDS } from '../../../CONSTANTS';
import { GlossaryHint } from '/components/utils/Hint';
import { DappyNetworkId, DappyNetworkMember, dappyNetworks } from '@fabcotech/dappy-lookup';

const ERRORS: { [key: string]: string } = {
  REQUIRED: 'This fileld is required',
  ONLY_ALPHANUMERIC: 'Only letters and numbers are accepted',
  ONLY_ALPHANUMERIC_AND_DOT: 'Only letters and numbers and ().  are accepted',
  ID_ALREADY_EXISTS: 'This network ID is already setup',
};

interface AddBlockchainProps {
  add: (values: { platform: 'rchain'; chainId: string; chainName: string; nodes: DappyNetworkMember[] }) => void;
  existingChainIds: string[];
}

const FormPlatformComponent = (props: any) => (
  <div className="field is-horizontal">
    <label className="label">Platform</label>
    <div className="control">
      <div className="select">
        <Field
          component="select"
          name="platform"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            if (props.value !== 'rchain' && value === 'rchain') {
              const chainIdKey = Object.keys(CHAIN_IDS).find((key) =>
                CHAIN_IDS[key] ? CHAIN_IDS[key].platform === 'rchain' : false
              );
              props.setFieldValue('platform', 'rchain');
              props.setFieldValue('chainId', chainIdKey as string);
            }
          }}>
          <option value="rchain">RChain</option>
        </Field>
      </div>
    </div>
  </div>
);

const FormChainIdComponent = (props: any) => (
  <div className="chainid-and-custom-chainid">
    <div className="field is-horizontal">
      <label className="label">Network ID</label>
      <div className="control">
        <Field
          className={`input ${
            props.touched && props.touched.chainId && props.errors && props.errors.chainId && 'is-danger'
          }`}
          type="text"
          name="chainId"
          placeholder="Network ID"
        />
      </div>
    </div>
    {props.touched && props.touched.chainId && props.errors && props.errors.chainId && (
      <p className="text-danger">{ERRORS[props.errors.chainId]}</p>
    )}
  </div>
);

export class AddBlockchain extends React.Component<AddBlockchainProps, {}> {
  state = {};

  defaultDappyNetwork = dappyNetworks[Object.keys(dappyNetworks)[0] as DappyNetworkId];

  render() {
    return (
      <React.Fragment>
        <Formik
          initialValues={
            {
              platform: 'rchain',
              chainId: Object.keys(dappyNetworks)[0],
              chainName: Object.keys(dappyNetworks)[0],
              nodes: [],
              defaultNodes: 'none',
            } as {
              platform: 'rchain';
              chainId: string;
              chainName: string;
              nodes: [];
              defaultNodes: string;
            }
          }
          validate={(values) => {
            let errors: {
              chainId?: string;
              platform?: string;
              chainName?: string;
            } = {};
            if (typeof values.platform !== 'string') {
              errors.platform = 'REQUIRED';
            }
            const chainId = values.chainId;
            if (this.props.existingChainIds.find((a) => a === chainId)) {
              errors.chainId = 'ID_ALREADY_EXISTS';
            }
            if (!values.chainId) {
              errors.chainId = 'REQUIRED';
            }
            if (values.chainId && !/^[a-z0-9]+$/i.test(values.chainId)) {
              errors.chainId = 'ONLY_ALPHANUMERIC';
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.props.add({
              platform: values.platform,
              chainId: values.chainId,
              chainName: values.chainId,
              nodes: values.nodes,
            });

            xs.periodic(500)
              .endWhen(xs.periodic(600).take(1))
              .subscribe({
                complete: () => setSubmitting(false),
              });
          }}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
            <form className="add-blockchain-form" onSubmit={handleSubmit}>
              <h3 className="subtitle is-4">
                Add network
                <GlossaryHint term="what is a dappy network ?" />
              </h3>
              <p className="limited-width">
                Dappy can handle dapps from multiple networks, currently only RChain platform is supported.
                <br />
                <br />
                You can also configure a custom local/dev chain by filling the <i>Custom chainID</i> field and giving it
                a name. If you use a local/dev network, don't forget to set your settings accordingly.
                <br />
                <br />
              </p>
              <FormPlatformComponent
                setFieldValue={setFieldValue}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
              />

              <FormChainIdComponent
                setFieldValue={setFieldValue}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
              />

              {/* <FormDefaultNodesComponent
                setFieldValue={setFieldValue}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
              /> */}

              <div className="field is-horizontal pt10 default-nodes-field">
                <label className="label">Default networks</label>
                <div className="control">
                  <input
                    className="radio is-checkradio is-link is-inverted"
                    onChange={() => {}}
                    type="radio"
                    checked={values.defaultNodes === 'none'}
                    name="defaultNodes"></input>
                  <label
                    onClick={() => {
                      setFieldValue('nodes', []);
                      setFieldValue('defaultNodes', 'none');
                    }}>
                    Do not add any nodes by default
                  </label>
                  {Object.keys(dappyNetworks).map((pb: string) => {
                    return (
                      <Fragment key={pb}>
                        <input
                          className="radio is-checkradio is-link is-inverted"
                          onChange={() => {}}
                          type="radio"
                          checked={values.defaultNodes === pb}
                          name="defaultNodes"></input>
                        <label
                          onClick={() => {
                            setFieldValue('chainId', pb);
                            setFieldTouched('chainId');
                            setFieldValue('chainName', pb);
                            setFieldTouched('chainName');
                            setFieldValue('nodes', dappyNetworks[pb as DappyNetworkId]);
                            setFieldValue('defaultNodes', pb);
                          }}>
                          Add nodes of network <b>{pb}</b>
                        </label>
                      </Fragment>
                    );
                  })}
                </div>
              </div>

              <div className="field is-horizontal is-grouped pt20">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-link"
                    disabled={isSubmitting || (errors && !!Object.keys(errors).length)}>
                    {!isSubmitting && 'Add network'}
                    {isSubmitting && 'Submitting'}
                    {isSubmitting && <i className="fa fa-spin fa-spinner fa-after" />}
                  </button>
                </div>
              </div>
            </form>
          )}
        />
      </React.Fragment>
    );
  }
}
