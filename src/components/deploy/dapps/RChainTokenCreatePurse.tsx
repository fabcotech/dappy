import * as React from 'react';
import { createPursesTerm } from 'rchain-token';

import { rchainTokenValidators } from '/store/decoders';
import { RCHAIN_TOKEN_SUPPORTED_VERSIONS } from '/CONSTANTS';

interface RChainTokenCreatePurseProps {
  selected: undefined | 'nft' | 'ft' | 'tips' | 'create-purses';
  masterRegistryUri: string;
  boxId: string;
  onChoseTerm: (a: string, b: 'nft' | 'ft' | 'tips' | 'create-purses') => void;
}

export class RChainTokenCreatePurseComponent extends React.Component<RChainTokenCreatePurseProps, {}> {
  state = {
    errors: undefined,
    contractId: '',
    value: '',
  };

  onParse = (e: undefined) => {
    let purses: {
      [tmpId: string]: {
        id: string;
        boxId: string;
        quantity: number;
        price: number | null;
      };
    } = {};
    try {
      let lines = this.state.value.split('\n');
      lines.forEach((l: string, i: number) => {
        if (l) {
          const elements = l.split(',');
          const id = elements[3] || `${i}`;
          purses[id] = {
            boxId: elements[2],
            quantity: parseInt(elements[0], 10),
            price: parseInt(elements[1], 10) || null,
            id: id,
          };
        }
      });
    } catch (e) {
      this.setState({
        error: 'Could not parse',
      });
    }
    if (!RCHAIN_TOKEN_SUPPORTED_VERSIONS[0] || !rchainTokenValidators[RCHAIN_TOKEN_SUPPORTED_VERSIONS[0]]) {
      this.setState({
        error: 'Could not validate',
      });
    }
    console.log(purses);
    const payload = {
      contractId: this.state.contractId,
      boxId: this.props.boxId,
      masterRegistryUri: this.props.masterRegistryUri,
      data: {},
      purses: purses,
    };
    const va = rchainTokenValidators[RCHAIN_TOKEN_SUPPORTED_VERSIONS[0]].createPursePayload(payload);
    if (va === undefined || va.length === 0) {
      const term = createPursesTerm(payload);
      this.props.onChoseTerm(term, 'create-purses');
      this.setState({
        errors: undefined,
      });
    } else {
      this.props.onChoseTerm('', 'create-purses');
      this.setState({
        errors: va.map((a) => `${a.dataPath} ${a.message}`).join('\n'),
      });
    }
  };

  render() {
    return (
      <div
        className={`term rchain-token-create-purses ${this.props.selected === 'create-purses' ? 'selected' : ''}`}
        onClick={() => {
          this.props.onChoseTerm('', 'create-purses');
        }}>
        <span className="term-title">{t('rchain token create-purses')}</span>
        <p className="pt5">{t('deploy create-purses')}</p>

        {this.props.selected === 'create-purses' && (<>
          <div className="field">
            <label className="label">{t('contract id')}</label>
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="mycontract"
                onChange={(e) => {
                  console.log('e.target.value', e.target.value)
                  this.setState({
                    contractId:
                      e.target.value,
                  }, () => {
                    this.onParse(undefined);
                  });
                }}></input>
            </div>
          </div>
          <div className="field">
            <label className="label">{t('rchain-token master')}</label>
            <div className="control">
              <input
                type="text"
                disabled
                value={this.props.masterRegistryUri}
                className="input"
                placeholder="mycontract"
              ></input>
            </div>
          </div>
          <p>
            {t('only rchain-token version')} {RCHAIN_TOKEN_SUPPORTED_VERSIONS[0]}
            <br />
            {('structure for nft')}: 1, price (dust), recipient box ID, NFT ID
            <br />
            {('structure for ft')}: quantity, price (dust), recipient box ID
            <br />
            {t('price 0 not for sale')}
          </p>
          <div className="mb-2 mt-2">
            <button
              className="button is-small"
              title="Generate an example for NFT contract"
              onClick={() => {
                this.setState({ value: `1,100000000,sambox,pandanft\n1,0,sambox,cobranft` }, () => {
                  this.onParse(undefined)
                });
              }}>
              {('nft example')}
            </button>
            &nbsp;
            <button
              className="button is-small"
              title="Generate an example for FT contract"
              onClick={() => {
                this.setState({ value: `100,10000,sambox\n200,0,sambox` }, () => {
                  this.onParse(undefined);
                });
              }}>
              {('ft example')}
            </button>
          </div>
          <textarea
            spellCheck="false"
            className="textarea"
            value={this.state.value}
            rows={16}
            onChange={(e) => {
              this.setState({ value: e.target.value }, () => {
                this.onParse(undefined)
              })

            }}></textarea>
          {this.state.errors && <p className="text-danger">{this.state.errors}</p>}
        </>)}
      </div>
    );
  }
}

export const RChainTokenCreatePurse = RChainTokenCreatePurseComponent;
