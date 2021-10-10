import * as React from 'react';

import { RChainTokenCreatePursePayload } from '/models';
import { rchainTokenValidators } from '/store/decoders';
import { RCHAIN_TOKEN_SUPPORTED_VERSIONS } from '/CONSTANTS';
import './Root.scss';

interface RChainTokenCreatePurseProps {
  masterRegistryUri: string;
  boxId: string;
  contractId: string;
  filledPayload: (payload: undefined | RChainTokenCreatePursePayload) => void;
}

export class RChainTokenCreatePurseComponent extends React.Component<RChainTokenCreatePurseProps, {}> {
  state = {
    errors: undefined,
  };
  value = '';

  onParse = (e: undefined | ChangeEventHandler<HTMLTextAreaElement>) => {
    const v = e ? e.target.value : this.value;
    this.value = v;
    let purses: {
      [tmpId: string]: {
        id: string;
        boxId: string;
        quantity: number;
        price: number | undefined;
      };
    } = {};
    try {
      let lines = v.split('\n');
      lines.forEach((l: string, i: number) => {
        if (l) {
          const elements = l.split(',');
          const id = elements[3] || `${i}`;
          purses[id] = {
            boxId: elements[2],
            quantity: parseInt(elements[0], 10),
            price: parseInt(elements[1], 10),
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
    const payload = {
      contractId: this.props.contractId,
      boxId: this.props.boxId,
      masterRegistryUri: this.props.masterRegistryUri,
      data: {},
      purses: purses,
    };
    const va = rchainTokenValidators[RCHAIN_TOKEN_SUPPORTED_VERSIONS[0]].createPursePayload(payload);
    if (va === undefined) {
      this.props.filledPayload(payload);
      this.setState({
        errors: undefined,
      });
    } else {
      this.props.filledPayload(undefined);
      this.setState({
        errors: va.map((a) => `${a.dataPath} ${a.message}`).join('\n'),
      });
    }
    console.log(payload);
    console.log(va);
    // 1,
  };

  render() {
    return (
      <div>
        <p>
          Considering only rchain token version {RCHAIN_TOKEN_SUPPORTED_VERSIONS[0]}
          <br />
          Structure for NFT: 1,price,boxId,id
          <br />
          Structure for FT: quantity,price,boxId
        </p>
        <div className="mb-2 mt-2">
          <button
            className="button is-small"
            title="Generate an example for NFT contract"
            onClick={() => {
              this.value = `1,100000000,sambox,pandanft\n1,200000000,sambox,cobranft`;
              this.onParse(undefined);
            }}>
            NFT example
          </button>
          &nbsp;
          <button
            className="button is-small"
            title="Generate an example for FT contract"
            onClick={() => {
              this.value = `100,10000,sambox\n200,200000,sambox`;
              this.onParse(undefined);
            }}>
            FT example
          </button>
        </div>
        <textarea
          spellCheck="false"
          className="textarea"
          value={this.value}
          rows={16}
          onChange={this.onParse}></textarea>
        {this.state.errors && <p className="text-danger">{this.state.errors}</p>}
      </div>
    );
  }
}

export const RChainTokenCreatePurse = RChainTokenCreatePurseComponent;
