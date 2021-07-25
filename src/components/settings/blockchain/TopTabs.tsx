import * as React from 'react';

interface TopTabsProps {
  blockchains: { [chainId: string]: Blockchain };
  addFormDisplayed: boolean;
  requestsDisplayed: boolean;
  onSelectChain: (key: string) => void;
  onToggleAddForm: () => void;
  onToggleRequests: () => void;
}

export const TopTabs = (props: TopTabsProps) => {
  const keys = Object.keys(props.blockchains);

  return (
    <div className="tabs is-small">
      <ul>
        {keys.map((key) => (
          <li key={key}>
            <a className={key === 'd' ? 'tab-d-network' : ''} onClick={() => props.onSelectChain(key)}>
              {props.blockchains[key].platform === 'rchain' && <i className="rchain20 fa-before" />}
              {props.blockchains[key].chainName}
            </a>
          </li>
        ))}
        {keys.length === 0 && (
          <li className={`${props.addFormDisplayed ? 'is-active' : ''}`}>
            <a
              onClick={() => {
                props.onToggleAddForm();
              }}>
              {t('add network')}
              <i className="fa fa-plus fa-after" />
            </a>
          </li>
        )}
        <li className={`${props.requestsDisplayed ? 'is-active' : ''}`}>
          <a onClick={() => props.onToggleRequests()}>{t('request', true)}</a>
        </li>
      </ul>
    </div>
  );
};
