import React from 'react';

import { RChainInfos } from '/models';
import { openExternal, copyToClipboard } from '/interProcess';

export const UpdateBrowserLink = (props: {
  light: boolean;
  version: string;
  namesBlockchainInfos: RChainInfos | undefined;
  clickWarning: () => void;
}) => {
  if (!props.namesBlockchainInfos || !props.namesBlockchainInfos.info.dappyBrowserMinVersion) {
    return <p></p>;
  }

  const currentStr = props.version.replace(/\./g, '');
  const current = parseInt(currentStr, 10);
  const proposedStr = props.namesBlockchainInfos.info.dappyBrowserMinVersion.replace(/\./g, '');
  const proposed = parseInt(proposedStr, 10);

  if (current === proposed || current > proposed) {
    if (props.light) {
      return <></>;
    } else {
      return <span>Browser up to date</span>;
    }
  }

  const downloadLink = (props.namesBlockchainInfos as RChainInfos).info.dappyBrowserDownloadLink;
  if (props.light) {
    return (
      <a
        title={t('update available')}
        onClick={props.clickWarning}
        className={downloadLink.includes('?warning') ? 'menu-icon warning' : 'menu-icon'}>
        <i className="fa fa-exclamation-triangle"></i>
      </a>
    );
  }
  return (
    <>
      <span className={downloadLink.includes('?warning') ? 'warning' : ''}>
        <i className="fa fa-exclamation-triangle"></i>
        {t('update available')}
      </span>
      <br />
      <div>
        <a className="pt-1 pb-1 underlined-link" onClick={() => openExternal(downloadLink)}>
          {t('download page')}
        </a>
        <a className="pt-1 pb-1 underlined-link" onClick={() => copyToClipboard(downloadLink)}>{t('copy url')}</a>
      </div>
    </>
  );
};
