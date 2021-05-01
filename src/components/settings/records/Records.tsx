import React, { useState } from 'react';

import './Records.scss';
import { Record, Account, IPServer } from '../../../models';
import { Pagination } from '../../utils';

interface RecordsProps {
  records: { [name: string]: Record };
  recordNamesInAlphaOrder: string[];
  accounts: { [accountName: string]: Account };
  setTab: (a: string) => void;
}

const PER_PAGE = 50;

export const Records = (props: RecordsProps) => {
  const [name, setName] = useState('');
  const [showOnlyOwnNames, setShowOnlyOwnNames] = useState(false); // todo persist this value ?
  const [page, setPage] = useState<number>(1);
  const [serversEl, setServersEl] = useState<string>('');

  const accountsPublickeys = Object.keys(props.accounts).map((k) => props.accounts[k].publicKey);

  let recordsNamesFiltered: string[] = props.recordNamesInAlphaOrder;
  if (showOnlyOwnNames) {
    recordsNamesFiltered = recordsNamesFiltered.filter((n) => {
      return accountsPublickeys.includes(props.records[n].publicKey);
    });
  }

  if (name.length) {
    recordsNamesFiltered = recordsNamesFiltered.filter((n) => {
      return n.includes(name);
    });
  }

  const pages = Math.ceil(recordsNamesFiltered.length / PER_PAGE);

  recordsNamesFiltered = recordsNamesFiltered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <h3 className="subtitle is-4">{t('name', true)}</h3>
      <p className="smaller-text">
        {t('purchase a name 2')}
        <br />
        <br /> <a onClick={() => props.setTab('add-name')}>{t('add one locally 2')}</a>
        <br />
        <br />
      </p>

      <p className="smaller-text"></p>
      <div className="field show-only">
        <input className="is-checkradio is-link" type="checkbox" checked={showOnlyOwnNames} onChange={() => {}} />
        <label
          onClick={() => {
            setShowOnlyOwnNames(!showOnlyOwnNames);
          }}>
          {t('show only names my accounts')}
        </label>
      </div>
      <table className="table is-fullwidth is-striped is-bordered is-hoverable">
        <thead>
          <tr>
            <th>
              <input className="input" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
            </th>
            <th>{t('type')}</th>
            <th>{t('owner')}</th>
            <th>{t('blockchain address')}</th>
            <th>{t('server', true)}</th>
            <th>{t('origin')}</th>
            <th>
              <span title="Date at which it has been last loaded in dappy">{t('loaded at')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {recordsNamesFiltered.map((n) => {
            const record = props.records[n];
            let foundAccount;
            if (accountsPublickeys.includes(record.publicKey)) {
              foundAccount = Object.values(props.accounts).find((a) => a.publicKey === record.publicKey);
            }

            let RecordType = () => <span>?</span>;
            if (record.address) {
              RecordType = () => <span className="tag is-dark">{t('dapp')}</span>;
            } else if (!record.address && record.servers && record.servers.length) {
              RecordType = () => <span className="tag is-dark">{t('ip app')}</span>;
            }

            let ServersLabel = () => <span style={{ display: 'none' }}></span>;
            let ServersEl = () => <div style={{ display: 'none' }}></div>;
            if (record.servers && record.servers.length) {
              ServersLabel = () => (
                <span
                  onClick={() => setServersEl(serversEl === record.name ? '' : record.name)}
                  className="server-label tag is-dark ">
                  <i className="fa fa-lock fa-before"></i>
                  {`${record.servers && record.servers.length} ${t(
                    'server',
                    record.servers && record.servers.length > 1
                  )}`}
                </span>
              );
              const p = `${record.servers.length} ${t('server', record.servers.length > 1)}${
                record.servers.length === 1 ? ' is' : ' are'
              } linked to this name`;
              if (serversEl === record.name) {
                ServersEl = () => {
                  return (
                    <div className="server-el">
                      <h5>{p}</h5>
                      {record.servers &&
                        record.servers.map((s: IPServer) => (
                          <div className="server-ro" key={s.ip}>
                            <span className="ip">
                              {t('ip')} : {s.ip}
                            </span>
                            <span className="host">
                              {t('host name')} : {s.host}
                            </span>
                            <span className="cert">
                              {t('certificate')} : {s.cert.substr(0, 40) + '...'}
                            </span>
                          </div>
                        ))}
                    </div>
                  );
                };
              }
            }

            return (
              <tr
                key={record.name}
                className={`${accountsPublickeys.includes(record.publicKey) ? 'belongs-to-an-account' : ''}`}>
                <th>
                  {!!foundAccount ? <span className="tag is-light">{foundAccount.name}</span> : undefined}
                  {record.name}
                </th>
                <th>
                  <RecordType />
                </th>
                <th>
                  <span className="publicKey">{record.publicKey}</span>
                </th>
                <th>
                  <span className="address">{record.address}</span>
                </th>
                <th className="servers">
                  <ServersLabel /> <ServersEl />
                </th>

                <th>{record.origin}</th>
                <th>{new Date(record.loadedAt).toISOString()}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
      {pages > 1 ? <Pagination changePage={(i) => setPage(i)} pages={pages} currentPage={page} /> : undefined}
    </div>
  );
};
