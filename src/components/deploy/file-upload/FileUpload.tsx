import React, { Fragment } from 'react';
import zlib from 'zlib';
import { connect } from 'react-redux';

import { DappyFile, Account, Blockchain, RChainInfos, TransactionState, TransactionStatus } from '../../../models';
import * as fromBlockchain from '../../../store/blockchain';
import * as fromMain from '../../../store/main';
import * as fromSettings from '../../../store/settings';
import { account as accountUtils } from '../../../utils/account';
import { TransactionForm } from '../../utils';
import { blockchain as blockchainUtils } from '../../../utils';
import './FileUpload.scss';

interface FileUploadProps {
  accounts: { [accountName: string]: Account };
  blockchains: {
    [chainId: string]: Blockchain;
  };
  rchainInfos: { [chainId: string]: RChainInfos };
  transactions: { [id: string]: TransactionState };
  sendRChainTransactionWithFile: (t: fromBlockchain.SendRChainTransactionWithFilePayload) => void;
  openModal: (t: fromMain.OpenModalPayload) => void;
}

interface FileUploadState {
  dropErrors: string[];
  step: number;
  file: undefined | DappyFile; // step 1
  privatekey: string; // step 2
  publickey: string; // step 2
  phloLimit: number; // step 2
}

export class FileUploadComponent extends React.Component<FileUploadProps, {}> {
  state: FileUploadState = {
    dropErrors: [],
    file: undefined,
    step: 1,
    privatekey: '',
    publickey: '',
    phloLimit: 0,
  };
  dropEl: HTMLTextAreaElement | undefined = undefined;
  transactionId = '';

  saveRef = (el: HTMLTextAreaElement) => {
    this.dropEl = el;
    if (this.dropEl) {
      this.dropEl.addEventListener('drop', (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.onDrop(e);
        return false;
      });
    }
  };

  onDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    const that = this;
    e.preventDefault();
    var files = e.dataTransfer.files;
    if (!files[0]) {
      this.setState({
        dropErrors: ['Please drop a file'],
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

        that.setState({
          file: {
            name: file.name,
            mimeType: file.type,
            data: r.result.split(',')[1],
          },
          step: 2,
        });
      };
    } catch (e) {
      this.setState({ dropErrors: ['Error parsing file'] });
    }

    r.readAsDataURL(file);
  };

  onFilledTransactionData = (t: { privatekey: string; publickey: string; phloLimit: number }) => {
    if (!t.privatekey) {
      this.setState({
        file: {
          ...this.state.file,
          signature: undefined,
        },
      });
    }

    if (!this.state.file) {
      return;
    }
    try {
      const signature = blockchainUtils.createSignature(
        this.state.file.data,
        this.state.file.mimeType,
        this.state.file.name,
        t.privatekey
      );
      this.setState({
        file: {
          ...this.state.file,
          signature: signature,
        },
        privatekey: t.privatekey,
        phloLimit: t.phloLimit,
        publickey: t.publickey,
      });
    } catch (err) {}
  };

  onBackToStep1 = () => {
    this.setState({
      step: 1,
      file: undefined,
    });
  };

  onDeploy = () => {
    const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
    this.transactionId = id;

    try {
      const previewUnforgeable = async () => {
        if (!this.state.file) {
          this.props.openModal({
            title: 'Failed to deploy file',
            text: `Unknwon error occured`,
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
        const chainId = Object.keys(this.props.blockchains)[0];
        if (!chainId) {
          this.props.openModal({
            title: 'Failed to deploy file',
            text: `You need to be connected to a blockchain with at least one endpoint available`,
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

        const dappyFileAsString = blockchainUtils.createDpy(
          this.state.file.data,
          this.state.file.mimeType,
          this.state.file.name,
          this.state.file.signature as string
        );
        const dappyFileAsBase64 = zlib.gzipSync(dappyFileAsString).toString('base64');

        /*
          Avoid sending private key in clear through redux logs
          Encrypting it with window.uniqueEphemeralToken
        */
        const passwordBytes = accountUtils.passwordFromStringToBytes(
          (window.uniqueEphemeralToken as string).substr(0, 32)
        );
        this.props.sendRChainTransactionWithFile({
          fileAsBase64: dappyFileAsBase64,
          encrypted: accountUtils.encrypt(this.state.privatekey, passwordBytes),
          publicKey: this.state.publickey,
          phloLimit: this.state.phloLimit,
          origin: { origin: 'deploy' },
          platform: 'rchain',
          blockchainId: chainId,
          id: id,
          alert: true,
          sentAt: new Date().toISOString(),
        });
      };

      previewUnforgeable();
    } catch (err) {
      this.props.openModal({
        title: 'Failed to create manifest',
        text: 'Unable to create the manifest signature, the private key might be invalid',
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
    if (
      this.transactionId &&
      this.props.transactions[this.transactionId] &&
      this.props.transactions[this.transactionId].status === TransactionStatus.Aired
    ) {
      this.transactionId = '';
      this.setState({
        file: undefined,
        step: 1,
        privatekey: '',
        publickey: '',
        phloLimit: 0,
      });
      this.props.openModal({
        title: 'File successfully uploaded',
        text: t('transaction successful'),
        buttons: [
          {
            classNames: 'is-link',
            text: 'Ok',
            action: fromMain.closeModalAction(),
          },
        ],
      });
    }

    return (
      <div className="pb20 settings-file-upload">
        <p>Temporarily disabled</p>
      </div>
    );
    return (
      <div className="pb20 settings-file-upload">
        <div>
          <h3 className="subtitle is-4">File upload (step {this.state.step})</h3>
          {this.state.step === 1 ? (
            <Fragment>
              {' '}
              <b>Note: </b> file upload and block creation on mainnet takes time. Dappy does try do get the address for
              15 minutes. You can use dappy-cli JS library to upload any file or web application to the blockchain.
              <br />
              <br />
            </Fragment>
          ) : undefined}
          {this.state.step === 1 ? (
            <div className="drop-area">
              {/* todo: JSON only and cert */}
              <p>Drop any file you wish to upload to the blockchain (max 256kB)</p>
              {this.state.dropErrors.map((err) => (
                <span key={err} className="text-danger">
                  {err}
                </span>
              ))}
              <textarea ref={this.saveRef} />
            </div>
          ) : undefined}
          {this.state.step === 2 && this.state.file ? (
            <div className="file-properties">
              <div>
                <b>Name :</b> <span>{this.state.file.name}</span>
              </div>
              <div>
                <b>Type :</b> <span>{this.state.file.mimeType}</span>
              </div>
              <div>
                {' '}
                <b>Data :</b>
                <span className="data">
                  {this.state.file.data.length > 110
                    ? this.state.file.data.substr(0, 110) + '...'
                    : this.state.file.data}
                </span>
                <br />
              </div>
              {this.state.file.signature ? (
                <div>
                  <b>Signature :</b> <span className="signature">{this.state.file.signature}</span>
                  <br />
                </div>
              ) : undefined}
              <br />
              <TransactionForm accounts={this.props.accounts} filledTransactionData={this.onFilledTransactionData} />
              <button type="button" className="button is-light" onClick={this.onBackToStep1}>
                Back
              </button>{' '}
              <button
                type="button"
                onClick={this.onDeploy}
                className="button is-link"
                disabled={!this.state.file || !this.state.privatekey}>
                Deploy
              </button>
            </div>
          ) : undefined}
        </div>
      </div>
    );
  }
}

export const FileUpload = connect(
  (state) => {
    return {
      accounts: fromSettings.getAccounts(state),
      blockchains: fromSettings.getOkBlockchains(state),
      rchainInfos: fromBlockchain.getRChainInfos(state),
      transactions: fromBlockchain.getTransactions(state),
    };
  },
  (dispatch) => ({
    sendRChainTransactionWithFile: (t: fromBlockchain.SendRChainTransactionWithFilePayload) => {
      dispatch(
        fromBlockchain.sendRChainTransactionWithFileAction({
          ...t,
          alert: false,
        })
      );
    },
    openModal: (t: fromMain.OpenModalPayload) => {
      dispatch(fromMain.openModalAction(t));
    },
  })
)(FileUploadComponent);
