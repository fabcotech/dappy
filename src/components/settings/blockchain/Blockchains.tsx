import * as React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { connect } from 'react-redux';
import { DappyNetworkId, DappyNetworkMember, dappyNetworks } from '@fabcotech/dappy-lookup';

import './Blockchains.scss';

import { Blockchain } from '../../../models';
import { AddBlockchain } from '.';
import * as fromSettings from '../../../store/settings';
import * as fromMain from '../../../store/main';
import * as fromUi from '../../../store/ui';
import { AddNode } from './AddNode';
import { TopTabs } from './TopTabs';
import { GlossaryHint } from '/components/utils/Hint';

const REGEXP_IP = /^(?!\.)^[a-z0-9.-]*(:\d{2,5})?$/;

const CheckBoxComponent = (props: any) => {
  return (
    <div className="field is-horizontal">
      <div className="control">
        <input
          className="is-checkradio is-link is-inverted"
          id="exampleCheckbox"
          type="checkbox"
          onChange={() => {}}
          checked={props.checked}
        />
        <label onClick={() => props.click()}>{props.label}</label>
      </div>
    </div>
  );
};

interface BlockchainsProps {
  blockchains: { [chainId: string]: Blockchain };
  namesBlockchain: Blockchain | undefined;
  isTablet: boolean;
  updateNodes: (values: fromSettings.UpdateNodesPayload) => void;
  createBlockchain: (values: fromSettings.CreateBlockchainPayload) => void;
  openModal: (modal: fromMain.Modal) => void;
}

interface BlockchainsState {
  selectedChainId: undefined | string;
  addFormDisplayed: boolean;
  addNodeFormDisplayed: boolean;
  dropErrors: string[];
  formKey: number;
  selectedBlockchain: undefined | Blockchain;
  defaultNodes: DappyNetworkMember[];
}

export class BlockchainsComponent extends React.Component<BlockchainsProps> {
  state: BlockchainsState = {
    selectedChainId: undefined,
    addFormDisplayed: false,
    addNodeFormDisplayed: false,
    dropErrors: [],
    formKey: 1,
    selectedBlockchain: undefined,
    defaultNodes: [],
  };

  selectedBlockchain: undefined | Blockchain;

  dropEl: HTMLTextAreaElement | undefined = undefined;

  static getDerivedStateFromProps(props: BlockchainsProps, state: BlockchainsState) {
    const updates: {
      formKey: number;
      selectedBlockchain: undefined | Blockchain;
      defaultNodes: DappyNetworkMember[];
    } = {
      selectedBlockchain: state.selectedBlockchain,
      formKey: state.formKey,
      defaultNodes: state.defaultNodes,
    };

    if (
      updates.selectedBlockchain &&
      props.blockchains &&
      props.blockchains[updates.selectedBlockchain.chainId] &&
      props.blockchains[updates.selectedBlockchain.chainId].nodes.length !==
        updates.selectedBlockchain.nodes.length
    ) {
      updates.formKey = state.formKey + 1;
    }

    if (state.selectedChainId && props.blockchains[state.selectedChainId]) {
      updates.selectedBlockchain = props.blockchains[state.selectedChainId];
    } else if (Object.keys(props.blockchains).length) {
      const keys = Object.keys(props.blockchains);
      updates.selectedBlockchain = props.blockchains[keys[0]];
    } else {
      updates.selectedBlockchain = undefined;
    }

    const foundDefaultId = Object.keys(dappyNetworks).find(
      (pb) => updates.selectedBlockchain && pb === updates.selectedBlockchain.chainId
    );

    const foundDefault = foundDefaultId && dappyNetworks[foundDefaultId as DappyNetworkId];
    if (updates.selectedBlockchain && foundDefault) {
      updates.defaultNodes = foundDefault.filter((n) => {
        return !(updates.selectedBlockchain as Blockchain).nodes.find((no) => no.ip === n.ip);
      });
    } else {
      updates.defaultNodes = [];
    }

    return updates;
  }

  onSelectChain = (chainId: string) => {
    this.setState({
      selectedChainId: chainId,
      addFormDisplayed: false,
    });
  };

  onToggleAddForm = () => {
    this.setState({
      addFormDisplayed: !this.state.addFormDisplayed,
    });
  };

  onAddBlockchain = (values: {
    platform: 'rchain';
    chainId: string;
    chainName: string;
    nodes: DappyNetworkMember[];
  }) => {
    this.props.createBlockchain({
      override: true,
      blockchain: {
        ...values,
        auto: !!dappyNetworks[values.chainId as DappyNetworkId],
      },
    });
  };

  onRemoveBlockchain = () => {
    this.props.openModal({
      title: t('remove network'),
      text: t('are you sure remove network').replace(
        'NETWORK',
        (this.state.selectedBlockchain as Blockchain).chainName
      ),
      buttons: [
        {
          text: t('cancel'),
          classNames: 'is-light',
          action: [fromMain.closeModalAction()],
        },
        {
          text: t('yes'),
          classNames: 'is-link',
          action: [
            fromSettings.removeBlockchainAction({
              chainId: (this.state.selectedBlockchain as Blockchain).chainId,
            }),
            fromMain.closeModalAction(),
          ],
        },
      ],
    });
  };

  onReloadFormik = () => {
    this.setState({
      formKey: this.state.formKey + 1,
      addNodeFormDisplayed: false,
    });
  };

  render() {
    return (
      <div className="pb20 settings-nodes">
        <TopTabs
          blockchains={this.props.blockchains}
          addFormDisplayed={this.state.addFormDisplayed}
          onSelectChain={this.onSelectChain}
          onToggleAddForm={this.onToggleAddForm}
        />
        {this.displayContent()}
      </div>
    );
  }

  displayContent() {
    if (this.state.addFormDisplayed || !this.state.selectedBlockchain) {
      return (
        <AddBlockchain
          add={this.onAddBlockchain}
          existingChainIds={Object.keys(this.props.blockchains)}
        />
      );
    }

    return (
      <div>
        <Formik
          key={`${this.state.selectedBlockchain.chainId}-${this.state.formKey}`}
          initialValues={{
            formNodes: this.state.selectedBlockchain.nodes,
          }}
          onSubmit={(values, { setSubmitting }) => {
            const b = this.state.selectedBlockchain as Blockchain;
            this.setState({
              addNodeFormDisplayed: false,
            });
            this.props.updateNodes({
              chainId: b.chainId,
              nodes: values.formNodes,
            });
            setSubmitting(false);
          }}
          render={({ values, touched, submitForm, errors }) => {
            const selectedBlockchain = this.state.selectedBlockchain as Blockchain;
            return (
              <Form className="nodes-form limited-width">
                <h3 className="subtitle is-4 blockchain-title">
                  {t('network')}
                  {selectedBlockchain.chainName}
                  <GlossaryHint term="what is a dappy network ?" />
                </h3>
                <table className="network-variables">
                  <tbody>
                    <tr>
                      <td>{t('network id')}</td>
                      <td>{selectedBlockchain.chainId}</td>
                    </tr>
                  </tbody>
                </table>
                {this.props.namesBlockchain &&
                this.props.namesBlockchain.chainId === selectedBlockchain.chainId ? (
                  <div>
                    <br />
                    <article className="message is-primary">
                      <div className="message-body">
                        This network <b>{selectedBlockchain.chainName}</b> will be used for
                        deployments, name system, debug and REV transfers.
                      </div>
                    </article>
                  </div>
                ) : undefined}
                <br />
                <p className="text-mid limited-width">{t('nodes paragraph')}</p>
                <FieldArray
                  name="formNodes"
                  render={(arrayHelpers) => (
                    <div>
                      {selectedBlockchain && (
                        <>
                          <br />
                          <CheckBoxComponent
                            checked={selectedBlockchain.auto}
                            label="Auto update nodes"
                            click={() => {
                              this.props.createBlockchain({
                                ...(this.state.selectedBlockchain as Blockchain),
                                auto: !selectedBlockchain.auto,
                              });
                            }}
                          />
                        </>
                      )}
                      <br />
                      {values.formNodes && values.formNodes.length > 0
                        ? values.formNodes.map((formNode) => {
                            let ipIsDomainName = !REGEXP_IP.test(formNode.ip || '');
                            if (
                              ((formNode.ip || '').match(/[.]/g) || []).length !== 3 &&
                              ((formNode.ip || '').match(/[:]/g) || []).length !== 7
                            ) {
                              ipIsDomainName = true;
                            }

                            return (
                              <React.Fragment key={`${formNode.ip || ''} ${formNode.port || ''}`}>
                                <div className="node-field field has-addons">
                                  <div className="node-box">
                                    <b className="ip">
                                      {formNode.ip}
                                      {formNode.port ? `:${formNode.port}` : ''}
                                    </b>
                                    <b className="host">{formNode.hostname}</b>
                                    {formNode.scheme === 'https' && formNode.caCert ? (
                                      <span className="cert">
                                        {Buffer.from(formNode.caCert, 'base64')
                                          .toString('utf8')
                                          .substr(100, 20)}
                                      </span>
                                    ) : undefined}
                                  </div>
                                  {ipIsDomainName ? (
                                    <span className="ip-warning text-warning ">
                                      This node seems to use URL instead of IP. This endpoint
                                      therefore relies on the DNS.
                                    </span>
                                  ) : undefined}
                                </div>
                              </React.Fragment>
                            );
                          })
                        : undefined}
                      {this.state.addNodeFormDisplayed ? undefined : (
                        <button
                          type="button"
                          className="button is-black is-small add-node-button"
                          onClick={() =>
                            this.setState({
                              addNodeFormDisplayed: !this.state.addNodeFormDisplayed,
                            })
                          }
                        >
                          {t('add a node')}
                          <i className="fa fa-plus fa-after"></i>
                        </button>
                      )}
                      {this.state.addNodeFormDisplayed ? (
                        <AddNode
                          formNodes={values.formNodes}
                          cancel={() => {
                            this.setState({ addNodeFormDisplayed: false });
                          }}
                          addNode={(values) => {
                            arrayHelpers.push(values);
                            this.setState({ addNodeFormDisplayed: false });
                            if (!errors || Object.keys(errors).length === 0) {
                              submitForm();
                            }
                          }}
                        ></AddNode>
                      ) : undefined}
                      <br />
                      {this.state.addNodeFormDisplayed ? undefined : (
                        <div className="field is-horizontal is-grouped pt20">
                          <div className="control">
                            <button
                              type="button"
                              disabled={!touched || !touched.formNodes}
                              className="button is-light"
                              onClick={this.onReloadFormik}
                            >
                              {t('cancel')}
                            </button>{' '}
                            {values.formNodes && Object.keys(values.formNodes).length === 0 ? (
                              <button type="submit" className="button is-black">
                                {t('save nodes')}
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="button is-black"
                                disabled={
                                  !touched ||
                                  !touched.formNodes ||
                                  (errors && !!Object.keys(errors).length)
                                }
                              >
                                {t('save nodes')}
                              </button>
                            )}
                            <br />
                            <br />
                            <br />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                />
              </Form>
            );
          }}
        />

        <button
          title={`Delete blockchain ${(this.state.selectedBlockchain as Blockchain).chainName}`}
          type="button"
          onClick={this.onRemoveBlockchain}
          className="button is-danger is-small"
        >
          <i className="fa fa-trash fa-before"></i>
          Remove network
        </button>
      </div>
    );
  }
}

export const Blockchains = connect(
  (state: any) => {
    return {
      namesBlockchain: fromSettings.getNamesBlockchain(state),
      blockchains: fromSettings.getBlockchains(state),
      isTablet: fromUi.getIsTablet(state),
    };
  },
  (dispatch) => ({
    updateNodes: (values: fromSettings.UpdateNodesPayload) => {
      dispatch(fromSettings.updateNodesAction(values));
    },
    createBlockchain: (values: fromSettings.CreateBlockchainPayload) =>
      dispatch(fromSettings.createBlockchainAction(values)),
    openModal: (modal: fromMain.Modal) => dispatch(fromMain.openModalAction(modal)),
  })
)(BlockchainsComponent);
