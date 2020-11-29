import * as React from 'react';

import * as fromMain from '../../../store/main';
import * as fromBlockchain from '../../../store/blockchain';
import { Blockchain, TransactionState, Account, TransactionStatus, Variables, RChainInfos } from '../../../models';
import './Deploy.scss';
import { TransactionForm } from '../../utils';
import { account as accountUtils } from '../../../utils/account';
import { manifest as manifestUtils } from '../../../utils';
import { ManifestForm, VariablesForm } from '.';

interface DeployProps {
  transactions: { [id: string]: TransactionState };
  namesBlockchain: undefined | Blockchain;
  accounts: { [accountName: string]: Account };
  rchainInfos: { [chainId: string]: RChainInfos };
  sendRChainTransactionWithFile: (t: fromBlockchain.SendRChainTransactionWithFilePayload) => void;
  openModal: (t: fromMain.OpenModalPayload) => void;
}

export interface PartialManifest {
  js: string;
  css: string;
  html: string;
}

export class Deploy extends React.Component<DeployProps, {}> {
  transactionId = '';

  state: {
    manifest: undefined | PartialManifest; // step 1
    manifestWithVariables: undefined | PartialManifest; // step 2
    variables: undefined | Variables; // step 2
    privatekey: string; // step 3
    publickey: string; // step 3
    phloLimit: number; // step 3
    step: number;
  } = {
    manifest: undefined,
    manifestWithVariables: undefined,
    variables: undefined,
    privatekey: '',
    publickey: '',
    phloLimit: 0,
    step: 1,
  };

  onBackToStep1 = () => {
    this.setState({
      step: 1,
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

  onFilledTransactionData = (t: { privatekey: string; publickey: string; phloLimit: number }) => {
    this.setState(t);
  };

  onDeploy = () => {
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
        title: 'Dapp successfully deployed',
        text:
          'The transaction has been successfully sent to the network, you will be notified when the dapp has been added to the blockchain and is ready to be used',
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      });
    }

    if (this.state.step === 3) {
      return (
        <div>
          <h3 className="subtitle is-4">{t('deploy (step 3)')}</h3>
          <TransactionForm accounts={this.props.accounts} filledTransactionData={this.onFilledTransactionData} />
          <button type="button" className="button is-light" onClick={this.onBackToStep2}>
            {t('back')}
          </button>{' '}
          <button type="button" onClick={this.onDeploy} className="button is-link" disabled={!this.state.privatekey}>
            {t('deploy dapp')}
          </button>
        </div>
      );
    }

    if (this.state.step === 2) {
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
    }

    return (
      <div>
        <h3 className="subtitle is-4">{t('deploy (step 1)')}</h3>
        <div dangerouslySetInnerHTML={{ __html: t('deploy dapp note') }}></div>
        <br />
        <br />
        <ManifestForm
          openModal={this.props.openModal}
          manifest={this.state.manifest}
          filledManifestData={this.onFilledManifestData}
        />
      </div>
    );
  }
}
