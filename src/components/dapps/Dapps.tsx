import * as React from 'react';
import { connect } from 'react-redux';

import './Dapps.scss';
import * as fromDapps from '/store/dapps';
import * as fromUi from '/store/ui';
import { FetchContract, TabsList } from '.';
import { DappsSandboxed } from '../dapp';

interface DappsComponentProps {
  dappsListDisplay: number;
  isSearchFocused: boolean;
}

class DappsComponent extends React.Component<DappsComponentProps, {}> {
  state = {};

  render() {
    return (
      <div className={`dapps dapps-list-${this.props.dappsListDisplay}`}>
        {this.props.dappsListDisplay !== 1 ? (
          <div className="left">
            <TabsList />
          </div>
        ) : (
          undefined
        )}
        <DappsSandboxed key="dapps-sandboxed" />
        <div className={`right fc ${this.props.isSearchFocused ? 'search-focused' : ''}`}>
          <FetchContract />
        </div>
      </div>
    );
  }
}

export const Dapps = connect(
  state => {
    return {
      dappsListDisplay: fromUi.getDappsListDisplay(state),
      isSearchFocused: fromDapps.getIsSearchFocused(state),
    };
  },
  undefined
)(DappsComponent);
