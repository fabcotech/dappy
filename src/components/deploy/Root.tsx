import * as React from 'react';

import { SettingsDapps } from './dapps/';
import { FileUpload } from './file-upload/FileUpload';
import { RholangDeploy } from './rholang/RholangDeploy';
import { NavigationUrl } from '../../models';
import './Root.scss';

interface RootProps {
  navigationUrl: NavigationUrl;
  navigate: (navigationUrl: NavigationUrl) => void;
}

export class RootComponent extends React.Component<RootProps, {}> {
  state = {};

  render() {
    return (
      <div className="p20 deploy">
        <h3 className="subtitle is-3">{t('deploy')}</h3>
        <div className="tabs">
          <ul>
            <li className={this.props.navigationUrl === '/deploy/dapp' ? 'is-active' : ''}>
              <a onClick={() => this.props.navigate('/deploy/dapp')}>contract FT/NFT</a>
            </li>
            <li className={this.props.navigationUrl === '/deploy/file-upload' ? 'is-active' : ''}>
              <a onClick={() => this.props.navigate('/deploy/file-upload')}>{t('file')}</a>
            </li>
            <li className={this.props.navigationUrl === '/deploy/rholang' ? 'is-active' : ''}>
              <a onClick={() => this.props.navigate('/deploy/rholang')}>{t('rholang')}</a>
            </li>
          </ul>
        </div>
        {this.props.navigationUrl === '/deploy/dapp' ? <SettingsDapps /> : undefined}
        {this.props.navigationUrl === '/deploy/file-upload' ? <FileUpload /> : undefined}
        {this.props.navigationUrl === '/deploy/rholang' ? <RholangDeploy /> : undefined}
      </div>
    );
  }
}

export const Root = RootComponent;
