import React, { useState } from 'react';

import './Records.scss';
import { Record, Account, IPServer } from '/models';
import { Pagination } from '../utils';

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

  const accountsBoxes = Object.keys(props.accounts).map((k) => props.accounts[k].boxes[0]);

  let recordsNamesFiltered: string[] = props.recordNamesInAlphaOrder;
  if (showOnlyOwnNames) {
    recordsNamesFiltered = recordsNamesFiltered.filter((n) => {
      return accountsBoxes.includes(props.records[n].boxId);
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
      <p className="limited-width">
        {t('purchase a name 2')}
        <br />
        <br /> <a onClick={() => props.setTab('add-name')}>{t('add one locally 2')}</a>
        <br />
        <br />
      </p>

      <p className="limited-width"></p>
      <div className="field show-only">
        <input className="is-checkradio is-link" type="checkbox" checked={showOnlyOwnNames} onChange={() => { }} />
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
            if (accountsBoxes.includes(record.boxId)) {
              foundAccount = Object.values(props.accounts).find((a) => a.boxes[0] === record.boxId);
            }

            let RecordType = () => <span>?</span>;
            if (record.data.address) {
              RecordType = () => <span className="tag is-dark">{t('dapp')}</span>;
            } else if (!record.data.address && record.data.servers && record.data.servers.length) {
              RecordType = () => <span className="tag is-dark">{t('ip app')}</span>;
            }

            let ServersLabel = () => <span style={{ display: 'none' }}></span>;
            let ServersEl = () => <div style={{ display: 'none' }}></div>;
            if (record.data.servers && record.data.servers.length) {
              ServersLabel = () => (
                <span
                  onClick={() => setServersEl(serversEl === record.id ? '' : record.id)}
                  className="server-label tag is-dark ">
                  <i className="fa fa-lock fa-before"></i>
                  {`${record.data.servers && record.data.servers.length} ${t(
                    'server',
                    record.data.servers && record.data.servers.length > 1
                  )}`}
                </span>
              );
              const p = `${record.data.servers.length} ${t('server', record.data.servers.length > 1)}${record.data.servers.length === 1 ? ' is' : ' are'
                } linked to this name`;
              if (serversEl === record.id) {
                ServersEl = () => {
                  return (
                    <div className="server-el">
                      <h5>{p}</h5>
                      {record.data.servers &&
                        record.data.servers.map((s: IPServer) => (
                          <div className="server-ro" key={s.ip}>
                            <span className="ip">
                              {t('ip')} : {s.ip}
                            </span>
                            <span className="host">
                              {t('host name')} : {s.host}
                            </span>
                            {
                              s.cert &&
                              <span className="cert">
                                {t('certificate')} : {s.cert.substr(0, 40) + '...'}
                              </span>
                            }
                            {
                              s.cert &&
                              <span className="cert">{t('record uses public ca')}</span>
                            }
                          </div>
                        ))}
                    </div>
                  );
                };
              }
            }

            return (
              <tr key={record.id} className={`${accountsBoxes.includes(record.boxId) ? 'belongs-to-an-account' : ''}`}>
                <th>
                  {!!foundAccount ? <span className="tag is-light">{foundAccount.name}</span> : undefined}
                  {record.id}
                </th>
                <th>
                  <RecordType />
                </th>
                <th>
                  <span className="publicKey">{record.publicKey}</span>
                </th>
                <th>
                  <span className="address">{record.data.address}</span>
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
