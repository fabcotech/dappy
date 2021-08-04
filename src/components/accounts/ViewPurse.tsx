import React, { Fragment } from 'react';

import * as fromBlockchain from '../../store/blockchain';
import { updatePursePriceTerm, withdrawTerm } from 'rchain-token';
import { RChainTokenPurse, Account, RChainInfos } from '../../models';
import { formatAmountNoDecimal, formatAmount } from '../../utils/formatAmount';
import { LOGREV_TO_REV_RATE, RCHAIN_TOKEN_OPERATION_PHLO_LIMIT } from '../../CONSTANTS';
import { blockchain as blockchainUtils } from '../../utils/blockchain';

import './ViewPurse.scss';

interface ViewPursesProps {
  fungible: undefined | boolean;
  id: string;
  contractId: string;
  privateKey: undefined | string;
  rchainInfos: RChainInfos;
  account: Account;
  purse: undefined | RChainTokenPurse;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

export class ViewPurseComponent extends React.Component<ViewPursesProps, ViewPursesState> {
  constructor(props: ViewPursesProps) {
    super(props);
    this.state = {
      action: undefined,
      newPrice: undefined,
    };
  }

  render() {
    let Cancel = () => <Fragment></Fragment>;
    if (typeof this.state.action === 'string') {
      Cancel = () => (
        <a
          onClick={() => {
            this.setState({
              action: undefined,
              newPrice: undefined,
              boxWithdraw: undefined,
              quantityWithdraw: undefined,
            });
          }}
          className="underlined-link">
          {t('cancel')}
        </a>
      );
    }
    return (
      <div key={this.props.id} className="view-purse">
        {this.props.purse ? (
          <div>
            <span className="id">{this.props.purse.id}</span>
            <div className="values">
              <span>
                {t('type')}: {this.props.purse.type}
              </span>
              {this.props.fungible && (
                <span>
                  {t('quantity')}: {this.props.purse.quantity}
                </span>
              )}
            </div>

            {this.state.action === undefined && (
              <div className="operations-toggle-buttons">
                <a
                  onClick={() => {
                    this.setState({
                      action: 'withdraw',
                      boxWithdraw: undefined,
                      quantityWithdraw: 1,
                    });
                  }}
                  className="underlined-link">
                  <i className="fa fa-before fa-money-bill-wave"></i>
                  {this.props.fungible ? t('withdraw ft') : t('withdraw nft')}
                </a>
                <a
                  onClick={() => {
                    this.setState({
                      action: 'update-purse-price',
                      newPrice: (this.props.purse as RChainTokenPurse).price,
                    });
                  }}
                  className="underlined-link">
                  {this.props.fungible ? t('update per token price') : t('update nft purse price')}
                </a>
              </div>
            )}

            {/* UPDATE PURSE PRICE */}

            {this.state.action === 'update-purse-price' && (
              <div className={`update-purse-price full-square`}>
                {typeof this.state.newPrice === 'number' && (
                  <div className="prices">
                    {this.state.newPrice === 0 ? (
                      <span className="not-for-sale">{t('not for sale')}</span>
                    ) : (
                      <Fragment>
                        <span className="formated-amount-rev">
                          {formatAmount(this.state.newPrice / LOGREV_TO_REV_RATE)} REV
                        </span>
                        <span className="formated-amount-dust">{formatAmountNoDecimal(this.state.newPrice)} dust</span>
                        <span className="per-token">{this.props.fungible ? `(${t('per token')})` : undefined}</span>
                      </Fragment>
                    )}
                  </div>
                )}
                <div className="new-price-field field is-horizontal">
                  <div className="control">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      defaultValue={this.state.newPrice}
                      placeholder="dust price"
                      onChange={(e) => {
                        if (e.target.value == '' || e.target.value == '0') {
                          e.target.value = '0';
                          this.setState({
                            newPrice: 0,
                          });
                          return;
                        }
                        const a = parseInt(e.target.value);
                        if (Number.isInteger(a) && a > 0) {
                          this.setState({
                            newPrice: a,
                          });
                        }
                      }}
                      className="input"></input>
                  </div>
                </div>

                <h3 className="title is-5">
                  {this.props.fungible ? t('update per token price') : t('update nft purse price')}
                </h3>

                <div className="validate-operation-button">
                  <Cancel />
                  <button
                    className="button is-link is-small"
                    disabled={
                      typeof this.state.newPrice !== 'number' ||
                      this.state.newPrice === this.props.purse.price ||
                      !this.props.privateKey
                    }
                    onClick={() => {
                      if (
                        typeof this.state.newPrice === 'number' &&
                        this.props.purse &&
                        this.state.newPrice !== this.props.purse.price
                      ) {
                        const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                        const timestamp = new Date().valueOf();

                        let validAfterBlockNumber = 0;
                        if (this.props.rchainInfos && this.props.rchainInfos) {
                          validAfterBlockNumber = this.props.rchainInfos.info.lastFinalizedBlockNumber;
                        }
                        const term = updatePursePriceTerm({
                          masterRegistryUri: this.props.rchainInfos.info.rchainNamesMasterRegistryUri,
                          boxId: this.props.account.boxes[0],
                          contractId: this.props.contractId,
                          purseId: this.props.id,
                          price: this.state.newPrice,
                        });

                        const deployOptions = blockchainUtils.rchain.getDeployOptions(
                          timestamp,
                          term,
                          this.props.privateKey as string,
                          this.props.account.publicKey,
                          1,
                          RCHAIN_TOKEN_OPERATION_PHLO_LIMIT,
                          validAfterBlockNumber
                        );
                        this.props.sendRChainTransaction({
                          transaction: deployOptions,
                          origin: {
                            origin: 'rchain-token',
                            operation: 'update-purse-price',
                            accountName: this.props.account.name,
                          },
                          platform: 'rchain',
                          blockchainId: this.props.rchainInfos.chainId,
                          id: id,
                          alert: true,
                          sentAt: new Date().toISOString(),
                        });
                        this.setState({
                          newPrice: undefined,
                          action: undefined,
                        });
                      }
                    }}>
                    {typeof this.props.privateKey === 'string'
                      ? this.props.fungible
                        ? t('update per token price')
                        : t('update nft purse price')
                      : t('account locked')}
                  </button>
                </div>
              </div>
            )}

            {/* WITHDRAW */}

            {this.state.action === 'withdraw' && (
              <div className={`withdraw full-square`}>
                <h3 className="title is-5">{this.props.fungible ? t('withdraw ft') : t('withdraw nft')}</h3>

                <div className="box-withdraw-fields">
                  <div className="field">
                    <label className="label">{t('box to withdraw to')}</label>
                    <div className="control">
                      <input
                        type="text"
                        placeholder="Box id"
                        onChange={(e) => {
                          this.setState({
                            boxWithdraw:
                              e.target.value !== '' && typeof e.target.value === 'string' ? e.target.value : undefined,
                          });
                        }}
                        className="input"></input>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">
                      {t('quantity of tokens')}
                      {this.props.fungible && ` (max: ${this.props.purse.quantity})`}
                    </label>
                    <div className="control">
                      <input
                        disabled={!this.props.fungible}
                        type="number"
                        step="1"
                        min="1"
                        max={this.props.purse.quantity}
                        defaultValue={this.state.quantityWithdraw}
                        placeholder="Quantity of tokens"
                        onChange={(e) => {
                          const a = parseInt(e.target.value, 10);
                          if (this.props.fungible && a > 0 && Number.isInteger(a)) {
                            this.setState({
                              quantityWithdraw: a,
                            });
                          }
                        }}
                        className="input"></input>
                    </div>
                  </div>
                </div>

                <div className="validate-operation-button">
                  <Cancel />
                  <button
                    className="button is-link is-small"
                    disabled={
                      typeof this.state.boxWithdraw !== 'string' ||
                      typeof this.state.quantityWithdraw !== 'number' ||
                      !this.props.privateKey
                    }
                    onClick={() => {
                      if (
                        this.props.purse &&
                        typeof this.state.quantityWithdraw === 'number' &&
                        typeof this.state.boxWithdraw === 'string'
                      ) {
                        const id = new Date().getTime() + Math.round(Math.random() * 10000).toString();
                        const timestamp = new Date().valueOf();

                        let validAfterBlockNumber = 0;
                        if (this.props.rchainInfos && this.props.rchainInfos) {
                          validAfterBlockNumber = this.props.rchainInfos.info.lastFinalizedBlockNumber;
                        }
                        const term = withdrawTerm({
                          masterRegistryUri: this.props.rchainInfos.info.rchainNamesMasterRegistryUri,
                          boxId: this.props.account.boxes[0],
                          contractId: this.props.contractId,
                          withdrawQuantity: this.state.quantityWithdraw,
                          purseId: this.props.id,
                          toBoxId: this.state.boxWithdraw,
                          merge: true,
                        });
                        const deployOptions = blockchainUtils.rchain.getDeployOptions(
                          timestamp,
                          term,
                          this.props.privateKey as string,
                          this.props.account.publicKey,
                          1,
                          RCHAIN_TOKEN_OPERATION_PHLO_LIMIT,
                          validAfterBlockNumber
                        );
                        this.props.sendRChainTransaction({
                          transaction: deployOptions,
                          origin: {
                            origin: 'rchain-token',
                            operation: 'withdraw',
                            accountName: this.props.account.name,
                          },
                          platform: 'rchain',
                          blockchainId: this.props.rchainInfos.chainId,
                          id: id,
                          alert: true,
                          sentAt: new Date().toISOString(),
                        });
                        this.setState({
                          newPrice: undefined,
                          boxWithdraw: undefined,
                          quantityWithdraw: undefined,
                          action: undefined,
                        });
                      }
                    }}>
                    {typeof this.props.privateKey === 'string'
                      ? this.props.fungible
                        ? t('withdraw ft')
                        : t('withdraw nft')
                      : t('account locked')}
                  </button>
                </div>
              </div>
            )}

            {this.state.action === undefined && this.props.purse && typeof this.props.purse.price === 'number' && (
              <div className="big-price">
                <span className="big-price-title">
                  <i className="fa fa-before fa-money-bill-wave"></i>
                  {this.props.fungible ? t('for sale') : t('nft for sale')}
                </span>
                <div className="prices">
                  <span className="formated-amount-rev">
                    {formatAmount(this.props.purse.price / LOGREV_TO_REV_RATE)} REV
                  </span>
                  <span className="formated-amount-dust">{formatAmountNoDecimal(this.props.purse.price)} dust</span>
                  <span className="per-token">{this.props.fungible ? `(${t('per token')})` : undefined}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <span className="id">
              {this.props.id}
              <i className="fa fa-after fa-redo rotating"></i>
            </span>
          </div>
        )}
      </div>
    );
  }
}

export const ViewPurse = ViewPurseComponent;
