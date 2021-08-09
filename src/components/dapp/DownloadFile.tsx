import * as React from 'react';

import { Tab, LoadedFile } from '../../models';
import './DownloadFile.scss';

const fileIconImg = require('../../images/file-icon.png');

interface DownloadFileComponentProps {
  loadedFile: undefined | LoadedFile;
  zIndex: number;
  tab: Tab;
  loadResource: (search: string, tabId: string) => void;
}

class DownloadFileComponent extends React.Component<DownloadFileComponentProps> {
  el: null | HTMLIFrameElement = null;

  state = {
    dataAsString: '',
    len: 0,
  };

  static getDerivedStateFromProps(nextProps: DownloadFileComponentProps) {
    if (nextProps.loadedFile) {
      const dataAsString = atob(nextProps.loadedFile.data);
      return {
        dataAsString: dataAsString,
        len: dataAsString.length,
      };
    }

    return {};
  }

  componentDidMount() {
    if (this.el) {
      this.el.style.zIndex = this.props.zIndex.toString();
    }
  }

  setMainEl = (el: null | HTMLIFrameElement) => {
    this.el = el;
  };

  // todo electron crashes when download (when executed from electron console only)
  onDownload = () => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none');

    const loadedFile = this.props.loadedFile as LoadedFile;
    const dataAsString = atob(loadedFile.data);
    const len = dataAsString.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = dataAsString.charCodeAt(i);
    }

    window.triggerCommand('download-file', {
      name: loadedFile.name,
      mimeType: loadedFile.mimeType,
      data: loadedFile.data,
    });
  };

  render() {
    return (
      <div
        ref={this.setMainEl}
        className={`loaded-file ${this.props.tab.id} ${this.props.lastLoadError ? 'with-error' : ''}`}>
        {!!this.props.loadedFile ? (
          <div className="download-file">
            <div>
              <div className="left">
                <img src={fileIconImg} />
              </div>
              <div className="right">
                <span className="name">{this.props.loadedFile.name}</span>
                <span className="mimeType">{this.props.loadedFile.mimeType}</span>
                <span className="size">{Math.round(this.state.len / 10) / 100} KB</span>
                <span className="data">
                  {this.props.loadedFile.blockTime} ({t('block')} {this.props.loadedFile.blockNumber})
                </span>
                <br />
                <button onClick={this.onDownload} type="button" className="button is-link">
                  {t('download file')}
                </button>
              </div>
            </div>
          </div>
        ) : undefined}
      </div>
    );
  }
}

export const DownloadFile = DownloadFileComponent;
