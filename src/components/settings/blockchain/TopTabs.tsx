import * as React from 'react';
import { Blockchain } from '/models';

interface TopTabsProps {
  blockchains: { [chainId: string]: Blockchain };
  addFormDisplayed: boolean;
  onSelectChain: (key: string) => void;
  onToggleAddForm: () => void;
}

export const TopTabs = (props: TopTabsProps) => {
  const keys = Object.keys(props.blockchains);

  return (
    <div className="tabs is-small">
      <ul>
        {keys.map((key) => (
          <li key={key}>
            <a className={key === 'd' ? 'tab-d-network' : ''} onClick={() => props.onSelectChain(key)}>
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
      </ul>
    </div>
  );
};
