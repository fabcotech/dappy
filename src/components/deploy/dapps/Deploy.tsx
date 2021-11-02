import * as React from 'react';
import { deployTerm } from 'rchain-token';

import * as fromUi from '/store/ui';
import * as fromMain from '/store/main';
import * as fromBlockchain from '/store/blockchain';
import { Blockchain, TransactionState, Account, TransactionStatus, Variables, RChainInfos } from '/models';
import './Deploy.scss';
import { blockchain as blockchainUtils } from '/utils/blockchain';
import { TransactionForm } from '../../utils';
import { RCHAIN_TOKEN_OPERATION_PHLO_LIMIT } from '/CONSTANTS';
import { DeployTips } from './';

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
    selected: undefined | 'nft' | 'ft' | 'tips';
    privatekey: string; // step 3
    box: string | undefined; // step 3
    accountName: string | undefined; // step 3
    publickey: string; // step 3
    phloLimit: number; // step 3
    step: number;
  } = {
    term: undefined,
    selected: undefined,
    privatekey: '',
    box: undefined,
    accountName: undefined,
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

  onChoseTerm = (term: string, selected: 'nft' | 'ft' | 'tips') => {
    this.setState({ term: term, selected: selected });
  };

  onFilledTransactionData = (t: {
    box: string | undefined;
    accountName: string | undefined;
    privatekey: string;
    publickey: string;
    phloLimit: number;
  }) => {
    this.setState(t);
  };

  onDeployContract = () => {
    const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
    this.transactionId = id;
    const timestamp = new Date().valueOf();

    let validAfterBlockNumber = 0;
    if (this.props.rchainInfos && this.props.rchainInfos[(this.props.namesBlockchain as Blockchain).chainId]) {
      validAfterBlockNumber =
        this.props.rchainInfos[(this.props.namesBlockchain as Blockchain).chainId].info.lastFinalizedBlockNumber;
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
      origin: {
        origin: 'rchain-token',
        operation: this.state.selected === 'tips' ? 'tips' : 'deploy',
        accountName: this.state.accountName,
      },
      platform: 'rchain',
      blockchainId: (this.props.namesBlockchain as Blockchain).chainId,
      id: id,
      alert: false,
      sentAt: new Date().toISOString(),
    });
  };

  render() {
    if (!this.props.namesBlockchain) {
      return (
        <div>
          <h3 className="subtitle is-4">Deploy</h3>
          <p>{t('no networks')}</p>
        </div>
      );
    }

    if (!this.props.rchainInfos[this.props.namesBlockchain.chainId]) {
      return (
        <div>
          <h3 className="subtitle is-4">Deploy</h3>
          <p>
            {t('infos not retrieved')} {this.props.namesBlockchain.chainId} {t('wait for synchronization')}
          </p>
        </div>
      );
    }

    if (this.state.privatekey && !this.state.box) {
      return (
        <div>
          <h3 className="subtitle is-4">Deploy</h3>
          <p>{t('no boxes')}</p>
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
        step: 1,
      });
      this.props.openModal({
        title: 'Contract successfully deployed',
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
              this.onChoseTerm(
                deployTerm({
                  masterRegistryUri:
                    this.props.rchainInfos[(this.props.namesBlockchain as Blockchain).chainId].info
                      .rchainNamesMasterRegistryUri,
                  boxId: this.state.box,
                  fungible: true,
                  contractId: 'contract' + new Date().getTime().toString().slice(7),
                  fee: null,
                }),
                'ft'
              );
            }}>
            <span className="term-title">{t('rchain token ft')}</span>
            <p className="pt5">{t('deploy ft contract')}</p>
          </div>
          <div
            className={`term rchain-token-non-fungible ${this.state.selected === 'nft' ? 'selected' : ''}`}
            onClick={() => {
              this.onChoseTerm(
                deployTerm({
                  masterRegistryUri:
                    this.props.rchainInfos[(this.props.namesBlockchain as Blockchain).chainId].info
                      .rchainNamesMasterRegistryUri,
                  boxId: this.state.box,
                  fungible: false,
                  contractId: 'contract' + new Date().getTime().toString().slice(7),
                  fee: null,
                }),
                'nft'
              );
            }}>
            <span className="term-title">{t('rchain token nft')}</span>
            <p className="pt5">{t('deploy nft contract')}</p>
          </div>
          <DeployTips
            rchainNamesMasterRegistryUri={
              this.props.rchainInfos[this.props.namesBlockchain.chainId].info.rchainNamesMasterRegistryUri
            }
            box={this.state.box as string}
            onChoseTerm={this.onChoseTerm}
            selected={this.state.selected}
          />
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
