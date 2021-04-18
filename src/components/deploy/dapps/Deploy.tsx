import * as React from 'react';
import { mainTerm } from 'rchain-token';

import * as fromUi from '../../../store/ui';
import * as fromMain from '../../../store/main';
import * as fromBlockchain from '../../../store/blockchain';
import { Blockchain, TransactionState, Account, TransactionStatus, Variables, RChainInfos } from '../../../models';
import './Deploy.scss';
import { blockchain as blockchainUtils } from '../../../utils/blockchain';
import { TransactionForm } from '../../utils';
import { account as accountUtils } from '../../../utils/account';
import { manifest as manifestUtils } from '../../../utils';
import { RCHAIN_TOKEN_OPERATION_PHLO_LIMIT } from '../../../CONSTANTS';

interface DeployProps {
  transactions: { [id: string]: TransactionState };
  namesBlockchain: undefined | Blockchain;
  accounts: { [accountName: string]: Account };
  rchainInfos: { [chainId: string]: RChainInfos };
  sendRChainTransactionWithFile: (t: fromBlockchain.SendRChainTransactionWithFilePayload) => void;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
  openModal: (t: fromMain.OpenModalPayload) => void;
  navigate: (t: fromUi.NavigatePayload) => void;
}

export interface PartialManifest {
  js: string;
  css: string;
  html: string;
}

export class Deploy extends React.Component<DeployProps, {}> {
  transactionId = '';

  state: {
    term: undefined | string;
    selected: undefined | 'nft' | 'ft';
    manifest: undefined | PartialManifest; // step 1
    manifestWithVariables: undefined | PartialManifest; // step 2
    variables: undefined | Variables; // step 2
    privatekey: string; // step 3
    box: string | undefined; // step 3
    publickey: string; // step 3
    phloLimit: number; // step 3
    step: number;
  } = {
    term: undefined,
    selected: undefined,
    manifest: undefined,
    manifestWithVariables: undefined,
    variables: undefined,
    privatekey: '',
    box: undefined,
    publickey: '',
    phloLimit: 0,
    step: 1,
  };

  onBackToStep1 = () => {
    this.setState({
      step: 1,
      term: undefined,
      privatekey: '',
      publickey: '',
      box: undefined,
    });
  };

  onBackToStep2 = () => {
    if (
      this.state.variables &&
      (this.state.variables.js.length || this.state.variables.css.length || this.state.variables.html.length)
    ) {
      this.setState({
        step: 2,
      });
    } else {
      this.setState({
        step: 1,
      });
    }
  };

  onChoseTerm = (term: string, selected: 'nft' | 'ft') => {
    this.setState({ term: term, selected: selected });
  };

  onFilledManifestData = (t: { js: string; css: string; html: string; publickey: string }) => {
    const variables: Variables = {
      js: manifestUtils.getMatchesInAssets(t.js || ''),
      css: manifestUtils.getMatchesInAssets(t.css || ''),
      html: manifestUtils.getMatchesInAssets(t.html || ''),
    };

    if (variables.js.length || variables.css.length || variables.html.length) {
      this.setState({
        manifest: { js: t.js, css: t.css, html: t.html },
        variables: variables,
        step: 2,
      });
    } else {
      this.setState({
        manifest: { js: t.js, css: t.css, html: t.html },
        manifestWithVariables: { js: t.js, css: t.css, html: t.html },
        step: 3,
      });
    }
  };

  onFilledVariablesData = (variablesWithValues: Variables) => {
    let js = (this.state.manifest as PartialManifest).js || '';
    let css = (this.state.manifest as PartialManifest).css || '';
    let html = (this.state.manifest as PartialManifest).html || '';
    variablesWithValues.js.forEach((v) => {
      js = js.replace(v.match, v.value);
    });
    variablesWithValues.css.forEach((v) => {
      css = css.replace(v.match, v.value);
    });
    variablesWithValues.html.forEach((v) => {
      html = html.replace(v.match, v.value);
    });
    const manifestWithVariables = {
      ...this.state.manifest,
      js: js,
      css: css,
      html: html,
    };
    this.setState({
      variables: variablesWithValues,
      step: 3,
      manifestWithVariables: manifestWithVariables,
    });
  };

  onFilledTransactionData = (t: {
    box: string | undefined;
    privatekey: string;
    publickey: string;
    phloLimit: number;
  }) => {
    console.log(t);
    this.setState(t);
  };

  onDeployContract = () => {
    const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
    this.transactionId = id;
    const timestamp = new Date().valueOf();

    let validAfterBlockNumber = 0;
    if (this.props.rchainInfos && this.props.rchainInfos[(this.props.namesBlockchain as Blockchain).chainId]) {
      validAfterBlockNumber = this.props.rchainInfos[(this.props.namesBlockchain as Blockchain).chainId].info
        .lastFinalizedBlockNumber;
    }

    const deployOptions = blockchainUtils.rchain.getDeployOptions(
      timestamp,
      this.state.term as string,
      this.state.privatekey,
      this.state.publickey,
      1,
      RCHAIN_TOKEN_OPERATION_PHLO_LIMIT,
      validAfterBlockNumber
    );

    this.props.sendRChainTransaction({
      transaction: deployOptions,
      origin: { origin: 'rchain-token', operation: 'deploy', accountName: undefined },
      platform: 'rchain',
      blockchainId: (this.props.namesBlockchain as Blockchain).chainId,
      id: id,
      alert: false,
      sentAt: new Date().toISOString(),
    });
  };

  onDeployDapp = () => {
    const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
    this.transactionId = id;

    const name = 'dapp.dpy';
    const mimeType = 'application/dappy';
    let dappHtml = (this.state.manifestWithVariables as PartialManifest).html;

    try {
      const css = (this.state.manifestWithVariables as PartialManifest).css;
      if (css) {
        const headClosesIndex = dappHtml.indexOf('</head>');
        let cssTag;
        if (css) {
          cssTag = `<style>${css}</style>`;
          dappHtml = dappHtml.substr(0, headClosesIndex) + cssTag + dappHtml.substr(headClosesIndex);
        }
      }

      const js = (this.state.manifestWithVariables as PartialManifest).js;
      if (js) {
        const headClosesIndex = dappHtml.indexOf('</head>');
        let jsTag;
        if (js) {
          jsTag = `<script type="text/javascript">${js}</script>`;
          dappHtml = dappHtml.substr(0, headClosesIndex) + jsTag + dappHtml.substr(headClosesIndex);
        }
      }

      if (!this.props.namesBlockchain) {
        this.props.openModal({
          title: 'Failed to deploy',
          text: 'No network found, cannot deploy',
          buttons: [
            {
              classNames: 'is-link',
              text: 'Ok',
              action: fromMain.closeModalAction(),
            },
          ],
        });
        return;
      }

      /*
        Avoid sending private key in clear through redux logs
        Encrypting it with window.uniqueEphemeralToken
      */
      const passwordBytes = accountUtils.passwordFromStringToBytes(
        (window.uniqueEphemeralToken as string).substr(0, 32)
      );

      this.props.sendRChainTransactionWithFile({
        data: {
          file: dappHtml,
          mimeType: mimeType,
          name: name,
        },
        encrypted: accountUtils.encrypt(this.state.privatekey, passwordBytes),
        publicKey: this.state.publickey,
        phloLimit: this.state.phloLimit,
        origin: { origin: 'deploy' },
        platform: 'rchain',
        blockchainId: this.props.namesBlockchain.chainId,
        id: id,
        alert: true,
        sentAt: new Date().toISOString(),
        fileAsBase64: undefined,
      });
    } catch (err) {
      console.log(err);
      this.props.openModal({
        title: 'Failed to build file',
        text: 'Unable to build the dpy file, the private key might be invalid',
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      });
    }
  };

  render() {
    if (!this.props.namesBlockchain) {
      return (
        <div>
          <h3 className="subtitle is-4">Deploy</h3>
          <p>
            No networks has been configured. A network must be configured, and have at least one active node to deploy
            dapps.
          </p>
        </div>
      );
    }

    if (this.state.privatekey && !this.state.box) {
      return (
        <div>
          <h3 className="subtitle is-4">Deploy</h3>
          <p>
            There is no token boxes linked to your account, please deploy or link an existing box contract to your
            account.
          </p>
          <a onClick={() => this.props.navigate({ navigationUrl: '/accounts' })}>Go to accounts</a>
        </div>
      );
    }

    if (
      this.transactionId &&
      this.props.transactions[this.transactionId] &&
      this.props.transactions[this.transactionId].status === TransactionStatus.Aired
    ) {
      this.transactionId = '';
      this.setState({
        manifest: undefined,
        step: 1,
      });
      this.props.openModal({
        title: 'Contract successfully deployed',
        text:
          'The transaction has been successfully sent to the network, check the transactions list, the address of the contract will be available soon.',
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      });
    }

    if (this.state.step === 1) {
      return (
        <div>
          <h3 className="subtitle is-4">{t('deploy (step 1)')}</h3>
          <TransactionForm
            chooseBox={true}
            accounts={this.props.accounts}
            filledTransactionData={this.onFilledTransactionData}
          />
          <button
            type="button"
            onClick={() => {
              this.setState({ step: 2 });
            }}
            className="button is-link"
            disabled={!this.state.privatekey || !this.state.box}>
            Choose contract
          </button>
        </div>
      );
    }

    /* if (this.state.step === 2) {
      return (
        <div>
          <h3 className="subtitle is-4">{t('deploy (step 2)')}</h3>
          <VariablesForm
            back={this.onBackToStep1}
            variables={this.state.variables as Variables}
            filledVariablesData={this.onFilledVariablesData}
          />
        </div>
      );
    } */

    return (
      <div className="deploy-contract-form">
        <h3 className="subtitle is-4">{t('deploy (step 2)')}</h3>
        <div dangerouslySetInnerHTML={{ __html: t('deploy dapp note') }}></div>
        <br />
        <br />
        <div className="terms">
          <div
            className={`term rchain-token-fungible ${this.state.selected === 'ft' ? 'selected' : ''}`}
            onClick={() => {
              this.onChoseTerm(mainTerm(this.state.box, { name: 'mytoken', fungible: true }), 'ft');
            }}>
            <span className="term-title">{t('rchain token ft')}</span>
            <p className="pt5">
              {t('deploy ft contract')}
              <br />
              <br />
              {t('ft contract for tipboard')}
            </p>
          </div>
          <div
            className={`term rchain-token-non-fungible ${this.state.selected === 'nft' ? 'selected' : ''}`}
            onClick={() => {
              this.onChoseTerm(mainTerm(this.state.box, { name: 'mytoken', fungible: false }), 'nft');
            }}>
            <span className="term-title">{t('rchain token nft')}</span>
            <p className="pt5">{t('deploy nft contract')}</p>
          </div>
        </div>
        <button type="button" className="button is-light" onClick={this.onBackToStep1}>
          {t('back')}
        </button>{' '}
        <button type="button" disabled={!this.state.term} onClick={this.onDeployContract} className="button is-link">
          {t('deploy contract')}
        </button>
      </div>
    );
  }
}
