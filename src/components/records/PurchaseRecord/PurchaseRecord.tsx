import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { creditAndSwapTerm } from 'rchain-token';
import { NameZone } from '@fabcotech/dappy-lookup';
import * as rc from 'rchain-toolkit';

import {
  Account as AccountModel,
  TransactionState,
  Account,
  PartialRecord,
  TransactionStatus,
  Blockchain,
  RChainTokenPurse,
  RChainContractConfig,
  RChainInfos,
} from '/models';
import * as fromMain from '/store/main';
import { getPurses } from '/api/rchain-token';
import { blockchain as blockchainUtils } from '/utils';
import { validateName } from '/utils/validateSearch';
import * as fromBlockchain from '/store/blockchain';

import { TransactionForm } from '../../utils';
import { rchainWallet } from '/utils/wallets';
import { RecordForm } from '..';
import { isPurchasable, PurseInfo } from './PurseInfo';
import { OpenModalPayload } from '/store/main';
import { dustToRev, perMillage } from '/utils/unit';

export interface PurchaseRecordProps {
  accounts: Record<string, Account>;
  namesBlockchain: Blockchain;
  transactions: { [id: string]: TransactionState };
  defaultContractId: string | undefined;
  namesBlockchainInfos: RChainInfos;
  contractConfigs: Record<string, RChainContractConfig>;
  getPurses: typeof getPurses;
  queryAndCacheContractConfig: (contractId: string) => void;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
  confirmPurchase: (lines: [label: string, values: string][], buttons: OpenModalPayload['buttons']) => void;
}

const defaultState = {
  privatekey: '',
  publickey: '',
  box: '',
  accountName: '',
  phloLimit: 0,
  settingUpIpServers: false,
  partialRecord: undefined,

  contractId: '',
  name: '',
  loadNameError: undefined,
  loadedPurse: undefined,
  loadingPurse: false,
  contractConfig: undefined,
};

export class PurchaseRecordComponent extends React.Component<PurchaseRecordProps, {}> {
  constructor(props: PurchaseRecordProps) {
    super(props);
    this.setTouched = undefined;
  }

  setTouched: undefined | (() => void);

  componentDidMount() {
    if (this.props.defaultContractId) {
      this.setState({
        contractId: this.props.defaultContractId,
      });
      this.props.queryAndCacheContractConfig(this.props.defaultContractId);
    }
  }

  state: {
    privatekey: string;
    publickey: string;
    box: string | undefined;
    accountName: string | undefined;
    phloLimit: number;
    settingUpIpServers: boolean;
    partialRecord: PartialRecord | undefined;
    contractId: string;
    name: string;
    loadNameError: undefined | string;
    loadedPurse: undefined | RChainTokenPurse;
    loadingPurse: boolean;
  } = defaultState;

  transactionId = '';

  onFilledTransactionData = (t: {
    privatekey: string;
    publickey: string;
    phloLimit: number;
    box: string | undefined;
    accountName: string | undefined;
  }) => {
    this.setState(t);
    if (this.setTouched) this.setTouched();
  };

  onLookup = async () => {
    this.setState({
      loadingPurse: true,
      loadedPurse: undefined,
    });

    const [pursesRequest] = await this.props.getPurses({
      masterRegistryUri: this.props.namesBlockchainInfos.info.rchainNamesMasterRegistryUri,
      contractId: this.state.contractId,
      pursesIds: [this.state.name, '0'],
      blockchain: this.props.namesBlockchain,
      version: this.props.contractConfigs[this.state.contractId].version,
    });

    if (pursesRequest.validationErrors.length) {
      const errorMsg = pursesRequest.validationErrors
        .map((e) => `${t('error')} ${e.dataPath}: ${e.message}`)
        .join(', ');
      this.setState({
        loadedPurse: undefined,
        loadingPurse: false,
        loadNameError: errorMsg,
      });
      return;
    }

    const records = pursesRequest.result;
    const recordOnChain = records[this.state.name];
    const recordZero = records['0'];

    this.setState({
      loadingPurse: false,
      loadedPurse: recordOnChain || recordZero,
      loadNameError: undefined,
    });
  };

  onFilledRecords = (t: PartialRecord | undefined) => {
    this.setState({ partialRecord: t });
  };

  onSubmit = () => {
    const partialRecord = this.state.partialRecord as PartialRecord;

    const id = blockchainUtils.getUniqueTransactionId();
    this.transactionId = id;

    // IP app
    let zone: NameZone = {
      "origin": partialRecord.id,
      "ttl": 3600,
      "records": []
    }

    // dapp
    if (partialRecord.address) {
      zone.records.push({
        name: '@',
        type: 'TXT',
        data: `DAPP=${partialRecord.address}`
      })
    }
    // CONTRACT.PURSE

    /* todo CSP max size is 255 characters */
    if (partialRecord.csp) {
      zone.records.push({
        name: '@',
        type: 'TXT',
        data: `CSP=${partialRecord.csp}`
      })
    }

    if (partialRecord.email) {
      zone.records.push({
        name: '@',
        type: 'TXT',
        data: `EMAIL=${partialRecord.email}`
      })
    }

    const term = creditAndSwapTerm({
        revAddress: rc.utils.revAddressFromPublicKey(this.state.publickey),
        quantity: this.state.loadedPurse?.price![1],
        masterRegistryUri: this.props.namesBlockchainInfos.info.rchainNamesMasterRegistryUri,
        boxId: this.state.box
      }, {
        masterRegistryUri: this.props.namesBlockchainInfos.info.rchainNamesMasterRegistryUri,
        purseId: this.state.loadedPurse?.id,
        contractId: this.state.contractId,
        boxId: this.state.box,
        quantity: 1,
        data: Buffer.from(JSON.stringify(zone), 'utf8').toString('hex'),
        newId: this.state.name,
        merge: false,
      }
    );

    let validAfterBlockNumber = 0;
    if (this.props.namesBlockchainInfos.info) {
      validAfterBlockNumber = this.props.namesBlockchainInfos.info.lastFinalizedBlockNumber;
    }

    const phloPrice = 1;
    const deployOptions = rchainWallet.signTransaction(
      {
        term: term,
        timestamp: new Date().valueOf(),
        phloPrice: phloPrice,
        phloLimit: this.state.phloLimit,
        validAfterBlockNumber: validAfterBlockNumber,
      },
      this.state.privatekey
    );

    const maxGasCost = phloPrice * this.state.phloLimit;

    this.props.confirmPurchase(
      [
        [t('token quantity'), '1'],
        [t('price (REV)'), `${perMillage(dustToRev(this.state.loadedPurse?.price![1] as number))}`],
        [t('price (dust)'), `${this.state.loadedPurse?.price![1]}`],
        [t('max gas fees (REV)'), `${perMillage(dustToRev(maxGasCost))}`],
        [t('account'), this.state.accountName!],
        [t('address'), `${this.props.accounts[this.state.accountName!].address}`],
      ],
      [
        {
          text: t('cancel'),
          classNames: 'is-light',
          action: [fromMain.closeModalAction()],
        },
        {
          text: t('confirm purchase'),
          classNames: '',
          action: [
            fromBlockchain.sendRChainTransactionAction({
              transaction: deployOptions,
              origin: { origin: 'record', recordName: partialRecord.id, accountName: this.state.accountName as string },
              platform: 'rchain',
              blockchainId: this.props.namesBlockchainInfos.chainId,
              id: id,
              alert: false,
              sentAt: new Date().toISOString(),
            }),
            fromMain.closeModalAction(),
          ],
        },
      ]
    );
  };

  render() {
    const info = this.props.namesBlockchainInfos.info;

    if (
      this.transactionId &&
      this.props.transactions[this.transactionId] &&
      this.props.transactions[this.transactionId].status === TransactionStatus.Aired
    ) {
      return (
        <Fragment>
          <h3 className="subtitle is-4">{t('purchase a name')}</h3>
          <p className="limited-width">
            {t('operation on name successful')}
            {t('warning wait for update')}
          </p>
          <br />
          <br />
          <button
            type="button"
            className="button is-light"
            onClick={() => {
              this.transactionId = '';
              this.setState(defaultState);
            }}>
            {t('ok go back')}
          </button>
        </Fragment>
      );
    }

    const dNetwork = this.props.namesBlockchain.chainId === 'd';
    return (
      <Fragment>
        <h3 className="subtitle is-4">{t('purchase a name')}</h3>
        <p className="limited-width">{t('purchase a name 2')} </p>
        <br />
        <TransactionForm
          chooseBox
          accounts={this.props.accounts}
          filledTransactionData={this.onFilledTransactionData}
        />
        {this.state.privatekey && !this.state.box && <p className="text-danger pt10">{t('you need box')}</p>}
        <br />
        <div className="field is-horizontal">
          <label className="label" htmlFor="contract id">
            {t('contract id')}
          </label>
          <div className="control">
            <input
              id="contract id"
              disabled={true}
              placeholder={'dappynamesystem'}
              value={this.state.contractId}
              className="input name-input"
              onChange={(e) => {
                if (e.target.value) {
                  this.setState({
                    partialRecord: undefined,
                    loadNameError: undefined,
                    loadedPurse: undefined,
                    contractId: e.target.value,
                  });
                } else {
                  this.setState({
                    partialRecord: undefined,
                    loadNameError: undefined,
                    loadedPurse: undefined,
                    contractId: undefined,
                  });
                }
              }}
            />
          </div>
        </div>
        <div className="field is-horizontal">
          <label className="label" htmlFor="name-input">
            {t('name / id')}
          </label>
          <div className="control">
            <input
              id="name-input"
              disabled={this.state.loadingPurse}
              className="input name-input"
              onChange={(e) => {
                if (validateName(e.target.value)) {
                  this.setState({
                    partialRecord: undefined,
                    loadNameError: undefined,
                    name: e.target.value,
                    loadedPurse: undefined,
                  });
                } else {
                  this.setState({
                    partialRecord: undefined,
                    loadNameError: `Invalid name, must start with a-z and contain only 0-9a-z characters`,
                    name: '',
                    loadedPurse: undefined,
                  });
                }
              }}
              placeholder={t(`name lookup placeholder`)}
            />
          </div>
        </div>
        {this.state.loadNameError && <p className="text-danger name-error">{this.state.loadNameError}</p>}
        <div className="field is-horizontal is-grouped">
          <label className="label"></label>
          <div className="control">
            <button
              type="button"
              className="button is-link"
              name="lookup"
              disabled={
                !!this.state.loadedPurse ||
                !this.state.name ||
                this.state.name === '0' ||
                this.state.loadingPurse ||
                !this.props.contractConfigs[this.state.contractId]
              }
              onClick={(a) => {
                this.onLookup();
              }}>
              {this.state.loadingPurse && <i className="fa fa-before fa-redo rotating"></i>}
              {t('lookup name')}
            </button>
            {
              !this.props.contractConfigs[this.state.contractId] &&
              <p className="text-danger name-error">
                {t('could not retrieve contract config')}
              </p>
            }
          </div>
        </div>
        {this.state.loadedPurse && (
          <Fragment>
            <PurseInfo
              purse={this.state.loadedPurse}
              domainName={this.state.name}
              contractConfig={this.props.contractConfigs[this.state.contractId]}
              dNetwork={dNetwork}
            />
            {isPurchasable(this.state.loadedPurse, this.state.name) && (
              <RecordForm
                validateName
                nameDisabledAndForced={this.state.name}
                filledRecord={this.onFilledRecords}
                partialRecord={this.state.partialRecord}
              />
            )}
          </Fragment>
        )}
        <form>
          <div className="field is-horizontal is-grouped pt20">
            <div className="control">
              <button
                type="button"
                className="button is-link"
                disabled={
                  !this.state.partialRecord || !this.state.privatekey || !this.state.box || !this.state.loadedPurse
                }
                onClick={(a) => {
                  this.onSubmit();
                }}>
                {t('purchase name')}
              </button>
            </div>
          </div>
        </form>
      </Fragment>
    );
  }
}

export const PurchaseRecord = connect(null, (dispatch) => ({
  getPurses,
  confirmPurchase: (lines: [label: string, values: string][], buttons: OpenModalPayload['buttons'] = []) =>
    dispatch(
      fromMain.openModalAction({
        title: t('Confirm purchase'),
        parameters: {
          lines,
        },
        text: t('You are about to send a transaction and purchase NFT on the blockchain'),
        buttons,
      })
    ),
}))(PurchaseRecordComponent);
