import * as React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { connect } from 'react-redux';

import './Blockchains.scss';

import { browserUtils } from '../../../store/browser-utils';
import { Blockchain, Benchmark, RChainInfos, RChainInfo } from '../../../models';
import { AddBlockchain, BenchmarkComponent, Requests } from '.';
import * as fromSettings from '../../../store/settings';
import * as fromBlockchain from '../../../store/blockchain';
import * as fromMain from '../../../store/main';
import * as fromUi from '../../../store/ui';
import { PREDEFINED_BLOCKCHAINS } from '../../../BLOCKCHAINS';
import { getNodeIndex } from '../../../utils/getNodeIndex';
import { AddNode } from './AddNode';
import { TopTabs } from './TopTabs';
import { GlossaryHint } from '/components/utils/Hint';

const REGEXP_IP = /^(?!\.)^[a-z0-9.-]*(:\d{2,5})?$/;

interface BlockchainsProps {
  blockchains: { [chainId: string]: Blockchain };
  benchmarks: { [chainId: string]: undefined | Benchmark };
  benchmarkTransitoryStates: { [chainId: string]: undefined | 'loading' };
  rchainInfos: { [chainId: string]: RChainInfos };
  namesBlockchain: Blockchain | undefined;
  isTablet: boolean;
  updateNodes: (values: fromSettings.UpdateNodesPayload) => void;
  updateNodeActive: (values: fromSettings.UpdateNodeActivePayload) => void;
  createBlockchain: (values: fromSettings.CreateBlockchainPayload) => void;
  openModal: (modal: fromMain.Modal) => void;
}

interface BlockchainsState {
  selectedChainId: undefined | string;
  addFormDisplayed: boolean;
  addNodeFormDisplayed: boolean;
  requestsDisplayed: boolean;
  dropErrors: string[];
  formKey: number;
  selectedBlockchain: undefined | Blockchain;
  defaultNodes: { ip: string; host: string; cert: string }[];
}

export class BlockchainsComponent extends React.Component<BlockchainsProps, {}> {
  state: BlockchainsState = {
    selectedChainId: undefined,
    addFormDisplayed: false,
    addNodeFormDisplayed: false,
    requestsDisplayed: false,
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
      defaultNodes: { host: string; ip: string; cert: string }[];
    } = {
      selectedBlockchain: state.selectedBlockchain,
      formKey: state.formKey,
      defaultNodes: state.defaultNodes,
    };

    if (
      updates.selectedBlockchain &&
      props.blockchains &&
      props.blockchains[updates.selectedBlockchain.chainId] &&
      props.blockchains[updates.selectedBlockchain.chainId].nodes.length !== updates.selectedBlockchain.nodes.length
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

    const foundDefault = PREDEFINED_BLOCKCHAINS.find(
      (pb) => updates.selectedBlockchain && pb.chainId === updates.selectedBlockchain.chainId
    );
    if (updates.selectedBlockchain && foundDefault) {
      updates.defaultNodes = foundDefault.nodes
        .filter((n) => {
          return !(updates.selectedBlockchain as Blockchain).nodes.find((no) => no.ip === n.ip);
        })
        .map((d) => {
          return {
            ip: d.ip,
            host: d.host,
            cert: d.cert || '',
          };
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
      requestsDisplayed: false,
    });
  };

  onToggleAddForm = () => {
    this.setState({
      addFormDisplayed: !this.state.addFormDisplayed,
      requestsDisplayed: false,
    });
  };

  onToggleRequests = () => {
    this.setState({
      addFormDisplayed: false,
      requestsDisplayed: !this.state.requestsDisplayed,
    });
  };

  onAddBlockchain = (values: fromSettings.CreateBlockchainPayload) => {
    this.props.createBlockchain(values);
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

  saveRef = (el: HTMLTextAreaElement) => {
    /*     if (!this.dropEl) {
      this.dropEl = el;
      this.dropEl.addEventListener('drop', (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.onDrop(e);
        return false;
      });
    } */
  };

  /*   onDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    var that = this;
    e.preventDefault();
    var files = e.dataTransfer.files;
    if (!files[0]) {
      this.setState({
        dropErrors: ['Please drop a valid csv file'],
      });
      return;
    }
    if (files[1]) {
      this.setState({
        dropErrors: ['Please drop only one file'],
      });
      return;
    }

    this.setState({ dropErrors: [], loading: true });
    const file = files[0];

    var r = new FileReader();
    try {
      r.onloadend = function (e) {
        if (!e || !e.target || typeof r.result !== 'string') {
          return;
        }

        let nodeUrls: string[] = r.result
          .split(';')
          .map((url) => url.replace(' ', '').replace(/[\n\r]/g, ''))
          .filter((url) => !(that.state.selectedBlockchain as Blockchain).nodes.find((n) => n.url === url));

        if (nodeUrls.length) {
          if (!nodeUrls[nodeUrls.length - 1]) {
            nodeUrls = nodeUrls.slice(0, nodeUrls.length - 1);
          }
        }

        if (!nodeUrls.length) {
          that.props.openModal({
            title: t('import nodes'),
            text: t('did not find node'),
            buttons: [
              {
                classNames: 'is-link',
                text: t('ok'),
                action: fromMain.closeModalAction(),
              },
            ],
          });
          return;
        }
        that.onLoadNodes(nodeUrls);
      };
    } catch (e) {
      this.setState({ dropErrors: ['Error parsing file'] });
    }

    r.readAsText(file);
  }; */

  onLoadDefaultNodes = () => {
    this.onLoadNodes(this.state.defaultNodes);
  };

  onLoadNodes = (nodesToAdd: { ip: string; cert: string; host: string }[]) => {
    if (!this.state.selectedBlockchain || !nodesToAdd.length) {
      return;
    }
    this.props.openModal({
      title: t('import nodes'),
      text: `${t('do you want import nodes')} \n
      ${nodesToAdd.map((n) => n.ip).join('\n')}
      `,
      buttons: [
        {
          classNames: 'is-light',
          text: t('cancel'),
          action: fromMain.closeModalAction(),
        },
        {
          classNames: 'is-link',
          text: t('yes import'),
          action: [
            fromMain.closeModalAction(),
            fromSettings.updateNodesAction({
              chainId: (this.state.selectedBlockchain as Blockchain).chainId,
              nodes: nodesToAdd.map((n) => {
                const fn = (this.state.selectedBlockchain as Blockchain).nodes.find((no) => no.ip === n.ip);
                // cannot override network
                if (fn && fn.origin !== 'user') {
                  return fn;
                } else {
                  return {
                    ip: n.ip,
                    host: n.host,
                    cert: n.cert,
                    origin: 'user' as 'user',
                    active: true,
                    readyState: 3,
                    ssl: false,
                  };
                }
              }),
            }),
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
          requestsDisplayed={this.state.requestsDisplayed}
          onSelectChain={this.onSelectChain}
          onToggleAddForm={this.onToggleAddForm}
          onToggleRequests={this.onToggleRequests}
        />
        {this.displayContent()}
      </div>
    );
  }

  displayContent() {
    if (this.state.addFormDisplayed || !this.state.selectedBlockchain) {
      return <AddBlockchain add={this.onAddBlockchain} existingChainIds={Object.keys(this.props.blockchains)} />;
    }

    if (this.state.requestsDisplayed) {
      return <Requests />;
    }

    return (
      <div>
        <Formik
          key={this.state.selectedBlockchain.chainId + '-' + this.state.formKey}
          initialValues={{
            formNodes: this.state.selectedBlockchain.nodes.map((n) => {
              return {
                ip: n.ip,
                host: n.host,
                cert: n.cert,
              };
            }),
          }}
          onSubmit={(values, { setSubmitting }) => {
            const b = this.state.selectedBlockchain as Blockchain;
            this.setState({
              addNodeFormDisplayed: false,
            });
            this.props.updateNodes({
              chainId: b.chainId,
              nodes: values.formNodes.map((formNode) => {
                const fn = b.nodes.find((no) => no.ip === formNode.ip);
                // cannot override network
                if (fn && fn.origin !== 'user') {
                  return fn;
                } else {
                  return {
                    ip: formNode.ip,
                    host: formNode.host,
                    cert: formNode.cert,
                    origin: 'user' as 'user',
                    active: true,
                    readyState: 3,
                    ssl: false,
                  };
                }
              }),
            });
            setSubmitting(false);
          }}
          render={({ values, touched, submitForm, errors, setFieldValue }) => {
            const selectedBlockchain = this.state.selectedBlockchain as Blockchain;
            const rchainInfo: RChainInfo | undefined =
              this.props.rchainInfos &&
              this.props.rchainInfos[selectedBlockchain.chainId] &&
              this.props.rchainInfos[selectedBlockchain.chainId].info;

            return (
              <Form className="nodes-form limited-width">
                <h3 className="subtitle is-4 blockchain-title">
                  {t('network')}
                  {selectedBlockchain.platform === 'rchain' && <i className="rchain20 fa-after" />}
                  {selectedBlockchain.chainName}
                  <GlossaryHint term="what is a dappy network ?" />
                </h3>
                <table className="network-variables">
                  <tbody>
                    <tr>
                      <td>{t('rchain network')}</td>
                      <td>{rchainInfo ? rchainInfo.rchainNetwork : 'unknown'}</td>
                    </tr>
                    <tr>
                      <td>{t('last known block height')}</td>
                      <td>{rchainInfo ? rchainInfo.lastFinalizedBlockNumber : 'unknown'}</td>
                    </tr>
                    <tr>
                      <td>{t('name price')}</td>
                      <td>
                        {
                          rchainInfo.namePrice ?
                          `${rchainInfo.namePrice[1]} ${rchainInfo.namePrice[0]}`
                          : 'unknown'
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>{t('name system master registry uri')}</td>
                      <td>{rchainInfo ? rchainInfo.rchainNamesMasterRegistryUri : 'unknown'}</td>
                    </tr>
                    <tr>
                      <td>{t('name system contract id')}</td>
                      <td>{rchainInfo ? rchainInfo.rchainNamesContractId : 'unknown'}</td>
                    </tr>
                    <tr>
                      <td>{t('wrapped rev contract id')}</td>
                      <td>{rchainInfo ? rchainInfo.wrappedRevContractId : 'unknown'}</td>
                    </tr>
                  </tbody>
                </table>
                {this.props.namesBlockchain && this.props.namesBlockchain.chainId === selectedBlockchain.chainId ? (
                  <div>
                    <br />
                    <article className="message is-primary">
                      <div className="message-body">
                        This network <b>{selectedBlockchain.chainName}</b> will be used for deployments, name system,
                        debug and REV transfers.
                      </div>
                    </article>
                  </div>
                ) : undefined}
                <br />
                <p className="limited-width" dangerouslySetInnerHTML={{ __html: t('nodes paragraph') }}></p>
                <FieldArray
                  name="formNodes"
                  render={(arrayHelpers) => (
                    <div>
                      <br />
                      {values.formNodes && values.formNodes.length > 0
                        ? values.formNodes.map((formNode, index) => {
                            const bc = this.state.selectedBlockchain as Blockchain;
                            const node = bc.nodes.find((n) => n.ip === formNode.ip);
                            let benchmark: undefined | Benchmark = undefined;
                            if (this.state.selectedBlockchain && node) {
                              benchmark =
                                this.props.benchmarks[
                                  `${this.state.selectedBlockchain.chainId || ''}-${getNodeIndex(formNode)}`
                                ];
                            }

                            let ipIsDomainName = !REGEXP_IP.test(formNode.ip);
                            if (
                              (formNode.ip.match(new RegExp(/[.]/g)) || []).length !== 3 &&
                              (formNode.ip.match(new RegExp(/[:]/g)) || []).length !== 7
                            ) {
                              ipIsDomainName = true;
                            }

                            return (
                              <React.Fragment key={formNode.ip}>
                                <div className="node-field field has-addons">
                                  {!node ? <span className="active"></span> : undefined}
                                  {node && node.active ? (
                                    <span
                                      onClick={(e) =>
                                        this.props.updateNodeActive({
                                          chainId: bc.chainId,
                                          nodeIp: formNode.ip,
                                          active: false,
                                        })
                                      }
                                      className="active"
                                      title={t('this node is on')}>
                                      ON
                                    </span>
                                  ) : undefined}
                                  {node && !node.active ? (
                                    <span
                                      onClick={(e) =>
                                        this.props.updateNodeActive({
                                          chainId: bc.chainId,
                                          nodeIp: formNode.ip,
                                          active: true,
                                        })
                                      }
                                      className="inactive"
                                      title={t('this node is off')}>
                                      OFF
                                    </span>
                                  ) : undefined}
                                  {!node || node.origin === 'user' ? (
                                    <span className="origin" title={t('added by the user')}>
                                      U
                                    </span>
                                  ) : (
                                    <span className="origin" title={t('retreived from dappy network')}>
                                      N
                                    </span>
                                  )}
                                  {/* <div className="control">
                                <Field className="input input-url" name={`nodeUrls.${index}`} />
                              </div> */}

                                  <div className="node-box">
                                    <b className="ip">{formNode.ip}</b>
                                    <b className="host">{formNode.host}</b>
                                    {formNode.cert ? (
                                      <span className="cert">{formNode.cert.substr(100, 20)}</span>
                                    ) : undefined}
                                  </div>
                                  {ipIsDomainName ? (
                                    <span className="ip-warning text-warning ">
                                      This node seems to use URL instead of IP. This endpoint therefore relies on the
                                      DNS.
                                    </span>
                                  ) : undefined}
                                  {!node || node.origin === 'user' ? (
                                    <p className="control fc remove-node">
                                      <i
                                        title="Remove this node"
                                        onClick={() => arrayHelpers.remove(index)}
                                        className="fa fa-trash fa-after"></i>
                                    </p>
                                  ) : undefined}

                                  <BenchmarkComponent
                                    isTablet={this.props.isTablet}
                                    node={node}
                                    benchmark={benchmark}
                                  />
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
                          }>
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
                          addNode={(values: { ip: string; host: string; cert: undefined | string }) => {
                            arrayHelpers.push(values);
                            this.setState({ addNodeFormDisplayed: false });
                            if (!errors || Object.keys(errors).length === 0) {
                              submitForm();
                            }
                          }}></AddNode>
                      ) : undefined}
                      <br />
                      {this.state.addNodeFormDisplayed ? undefined : (
                        <div className="field is-horizontal is-grouped pt20">
                          <div className="control">
                            <button
                              type="button"
                              disabled={!touched || !touched.formNodes}
                              className="button is-light"
                              onClick={this.onReloadFormik}>
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
                                disabled={!touched || !touched.formNodes || (errors && !!Object.keys(errors).length)}>
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
        <h3 className="subtitle is-4">{t('change network')}</h3>
        <div className="connect-tos">
          {
            ['d', 'gamma', 'empty'].map(n => {
              return <button className="button is-greydark is-large mb-2" key={n}>
                <strong>{n} network</strong>
              </button>
            })
          }
        </div>
        {/* this.state.defaultNodes && this.state.defaultNodes.length ? (
          <div>
            <p className="limited-width">
              Found
              {` ${this.state.defaultNodes.length} `}
              default nodes to load (hardcoded in the application)
            </p>
            <button type="button" onClick={this.onLoadDefaultNodes} className="button is-link is-small">
              <i className="fa fa-download fa-before" />
              Import hard-coded nodes
            </button>
            <br />
            <br />
          </div>
        ) : undefined */}
        {/* <div className="drop-area">
          <p>Drop nodes .csv file to add nodes</p>
          {this.state.dropErrors.map(err => (
            <span key={err} className="text-danger">
              {err}
            </span>
          ))}
          <textarea ref={this.saveRef} />
        </div> */}

        <button
          title={`Delete blockchain ${(this.state.selectedBlockchain as Blockchain).chainName}`}
          type="button"
          onClick={this.onRemoveBlockchain}
          className="button is-danger is-small">
          <i className="fa fa-trash fa-before"></i>
          Remove network
        </button>
      </div>
    );
  }
}

export const Blockchains = connect(
  (state) => {
    return {
      namesBlockchain: fromSettings.getNamesBlockchain(state),
      blockchains: fromSettings.getBlockchains(state),
      benchmarks: fromBlockchain.getBenchmarks(state),
      benchmarkTransitoryStates: fromBlockchain.getBenchmarkTransitoryStates(state),
      isTablet: fromUi.getIsTablet(state),
      rchainInfos: fromBlockchain.getRChainInfos(state),
    };
  },
  (dispatch) => ({
    updateNodes: (values: fromSettings.UpdateNodesPayload) => {
      dispatch(fromSettings.updateNodesAction(values));
    },
    updateNodeActive: (values: fromSettings.UpdateNodeActivePayload) =>
      dispatch(fromSettings.updateNodeActiveAction(values)),
    createBlockchain: (values: fromSettings.CreateBlockchainPayload) =>
      dispatch(fromSettings.createBlockchainAction(values)),
    openModal: (modal: fromMain.Modal) => dispatch(fromMain.openModalAction(modal)),
  })
)(BlockchainsComponent);
