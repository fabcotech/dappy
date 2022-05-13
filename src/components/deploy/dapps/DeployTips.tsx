import * as React from 'react';

import { deployTerm, createPursesTerm } from '@fabcotech/rchain-token';
import './DeployTips.scss';
import { formatAmount, formatAmountNoDecimal } from '/utils/formatAmount';

interface DeployTipsProps {
  selected: undefined | 'nft' | 'ft' | 'tips' | 'create-purses';
  rchainNamesMasterRegistryUri: string;
  boxId: string;
  onChoseTerm: (a: string, b: 'nft' | 'ft' | 'tips' | 'create-purses') => void;
}

export class DeployTips extends React.Component<DeployTipsProps, {}> {
  state: {
    title: undefined | string;
    description: undefined | string;
    price: undefined | number;
    quantity: undefined | number;
  } = {
      title: undefined,
      description: undefined,
      price: 100000000,
      quantity: 100,
    };

  onSomethingChanged = (a: { [key: string]: any }) => {
    this.setState(a);
    if (this.state && this.state.price && this.state.quantity && this.state.title) {
      const contractId = 'contract' + new Date().getTime().toString().slice(7);
      let term1 = deployTerm({
        masterRegistryUri: this.props.rchainNamesMasterRegistryUri,
        boxId: this.props.boxId,
        fungible: true,
        contractId: contractId,
        fee: null,
      });

      const payloadCreatePurse = {
        masterRegistryUri: this.props.rchainNamesMasterRegistryUri,
        contractId: contractId,
        boxId: this.props.boxId,
        purses: {
          ['1']: {
            id: '', // will be set by rholang
            boxId: this.props.boxId,
            quantity: this.state.quantity,
            price: this.state.price,
          },
          ['2']: {
            id: '', // will be set by rholang
            boxId: this.props.boxId,
            quantity: 1,
            price: null,
          },
        },
        data: {
          ['1']: null,
          ['2']: encodeURI(
            JSON.stringify({
              title: this.state.title,
              description: this.state.description,
              price: this.state.price,
              quantity: this.state.quantity,
            })
          ),
        },
      };

      const io1 = term1.indexOf('// OP_REGISTER_CONTRACT_COMPLETED_BEGIN');
      const io2 = term1.indexOf('// OP_REGISTER_CONTRACT_COMPLETED_END');
      term1 = term1.slice(0, io1) + term1.slice(io2);
      let term2 = term1.replace(
        '// OP_REGISTER_CONTRACT_COMPLETED_END',
        createPursesTerm(payloadCreatePurse).replace('basket,', '')
      );

      const io3 = term2.indexOf('// OP_CREATE_PURSES_COMPLETED_BEGIN');
      const io4 = term2.indexOf('// OP_CREATE_PURSES_COMPLETED_END');
      term2 = (term2.slice(0, io3) + term2.slice(io4)).replace(
        '// OP_CREATE_PURSES_COMPLETED_END',
        `basket!({
          "status": "completed",
          "masterRegistryUri": "${this.props.rchainNamesMasterRegistryUri}",
          "contractId": "${contractId}",
        })`
      );

      this.props.onChoseTerm(term2, 'tips');
    } else {
      this.props.onChoseTerm('', 'tips');
    }
  };

  render() {
    return (
      <div
        className={`term tips ${this.props.selected === 'tips' ? 'selected' : ''}`}
        onClick={() => {
          this.props.onChoseTerm('', 'tips');
        }}>
        <span className="term-title">{t('tips')}</span>
        <p className="pt5 pb5">{t('deploy ft and tips contract')}</p>
        {this.props.selected === 'tips' && (
          <React.Fragment>
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input
                  defaultValue={this.state.title}
                  onInput={(e) => this.onSomethingChanged({ title: e.target.value })}
                  className="input"
                  type="text"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  rows={16}
                  value={this.state.description}
                  onChange={(a) => {
                    this.onSomethingChanged({
                      description: a.target.value,
                    });
                  }}></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label">Price for each token (dust)</label>
              <div className="control">
                <input
                  defaultValue={this.state.price}
                  onInput={(e) => this.onSomethingChanged({ price: parseInt(e.target.value) })}
                  className="input"
                  type="number"
                  min={1}
                  step={1}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Quantity of tokens</label>
              <div className="control">
                <input
                  defaultValue={this.state.quantity}
                  onChange={(e) => this.onSomethingChanged({ quantity: parseInt(e.target.value) })}
                  className="input"
                  type="number"
                  min={1}
                  step={1}
                />
              </div>
              {this.state && this.state.price && this.state.quantity && this.state.title ? (
                <p>
                  Total REV : {formatAmount((this.state.price * this.state.quantity) / 100000000)} <br />
                  Total dust (1 REV equals 100.000.000 dust):{' '}
                  {formatAmountNoDecimal(this.state.price * this.state.quantity)}{' '}
                </p>
              ) : undefined}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
