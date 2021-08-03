import React, { Fragment } from 'react';

import * as fromBlockchain from '../../store/blockchain';
import { updatePursePriceTerm } from 'rchain-token';
import { Purse, Account, RChainInfos } from '../../models';
import { formatAmountNoDecimal, formatAmount } from '../../utils/formatAmount';
import { LOGREV_TO_REV_RATE, RCHAIN_TOKEN_OPERATION_PHLO_LIMIT } from '../../CONSTANTS';
import { blockchain as blockchainUtils } from '../../utils/blockchain';

import './ViewPurse.scss';
import { AccountPassword } from './AccountPassword';

interface ViewPursesProps {
  fungible: undefined | boolean;
  id: string;
  contractId: string;
  rchainInfos: RChainInfos;
  account: Account;
  purse: undefined | Purse;
  sendRChainTransaction: (t: fromBlockchain.SendRChainTransactionPayload) => void;
}

export class ViewPurseComponent extends React.Component<ViewPursesProps, ViewPursesState> {
  constructor(props: ViewPursesProps) {
    super(props);
    this.state = {
      updatePursePrice: false,
      newPrice: undefined,
      privateKey: undefined,
    };
  }

  render() {
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
            {
              <div className={`set-purse-price ${this.state.updatePursePrice && 'setting-purse-price'}`}>
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
                {this.state.updatePursePrice && (
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
                )}

                {typeof this.state.newPrice === 'number' && (
                  <div className="set-purse-price-send-button">
                    <AccountPassword
                      decryptedPrivateKey={(privateKey) => {
                        this.setState({
                          privateKey: privateKey,
                        });
                      }}
                      encrypted={this.props.account.encrypted}
                    />
                    <button
                      className="button is-link is-small"
                      disabled={this.state.newPrice === this.props.purse.price || !this.state.privateKey}
                      onClick={() => {
                        if (this.props.purse && this.state.newPrice !== this.props.purse.price) {
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
                            this.state.privateKey,
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
                            privateKey: undefined,
                            newPrice: undefined,
                            updatePursePrice: false,
                          });
                        }
                      }}>
                      {this.props.fungible ? t('update per token price') : t('update nft purse price')}
                    </button>
                  </div>
                )}
                <a
                  onClick={() => {
                    if (this.state.updatePursePrice) {
                      this.setState({ updatePursePrice: false, newPrice: undefined });
                    } else {
                      this.setState({ updatePursePrice: true, newPrice: (this.props.purse as Purse).price });
                    }
                  }}
                  className="underlined-link set-purse-price-toggle-button">
                  {this.state.updatePursePrice
                    ? t('cancel')
                    : this.props.fungible
                    ? t('update per token price')
                    : t('update nft purse price')}
                </a>
              </div>
            }
            {!this.state.updatePursePrice && this.props.purse && typeof this.props.purse.price === 'number' && (
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
