import * as React from 'react';

import './Benchmark.scss';
import { Benchmark, BlockchainNode } from '../../../models';
import { node } from 'prop-types';

interface BenchmarkProps {
  node: undefined | BlockchainNode;
  benchmark: undefined | Benchmark;
  isTablet: boolean;
}

export class BenchmarkComponent extends React.Component<BenchmarkProps, {}> {
  constructor(props: BenchmarkProps) {
    super(props);
  }

  render() {
    const benchmark = this.props.benchmark;

    if (this.props.node && this.props.node.readyState === 1) {
      let mobileText = '';
      if (benchmark && benchmark.responseTime) {
        mobileText += benchmark.responseTime + 'ms ';
      }
      if (benchmark && benchmark.info.rnodeVersion) {
        mobileText += '- ' + benchmark.info.rnodeVersion;
      }

      return (
        <div className="benchmark-ok">
          {this.props.node && this.props.node.readyState === 1 ? (
            <span className="ready-state-container">
              <span className="ready-state ready-state-ok"></span>
            </span>
          ) : (
            <span className="ready-state-container">
              <span className="ready-state ready-state-not-ok"></span>
            </span>
          )}
          {this.props.node && this.props.node.ssl ? (
            <span title={t('ssl established')} className="lock-container">
              <i className="fa fa-lock" />
            </span>
          ) : (
            <span title={t('ssl not established')} className="lock-container">
              <i className="fa fa-lock-open" />
            </span>
          )}
          {!this.props.isTablet && (
            <span className="responseTime">{benchmark ? Math.ceil(benchmark.responseTime) + ' ms' : ''}</span>
          )}
          {!this.props.isTablet && benchmark && <span className="version">{benchmark.info.rnodeVersion}</span>}
          {this.props.isTablet ? (
            <div className="node-info-div">
              <button type="button" className="button node-info tooltip is-tooltip-left" data-tooltip={mobileText}>
                ?
              </button>
            </div>
          ) : (
            undefined
          )}
        </div>
      );
    }

    return (
      <div title={`Failed to call endpoint`} className="benchmark-not-ok">
        {this.props.node && this.props.node.readyState === 1 ? (
          <span className="ready-state-container">
            <span className="ready-state ready-state-ok"></span>
          </span>
        ) : (
          <span className="ready-state-container">
            <span className="ready-state ready-state-not-ok"></span>
          </span>
        )}
        {!this.props.isTablet && (
          <span title={benchmark ? benchmark.info.rnodeVersion : ''} className="statusText">
            {benchmark ? benchmark.info.rnodeVersion : ''}
          </span>
        )}
        {this.props.isTablet ? (
          <div className="node-info-div">
            {benchmark ? (
              <button
                type="button"
                className="button node-info tooltip is-tooltip-left"
                data-tooltip={benchmark ? benchmark.info.rnodeVersion : ''}>
                ?
              </button>
            ) : (
              ''
            )}
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }
}
