import React, { useState } from 'react';

import { RecordFromNetwork, PartialRecord, Record } from '/models';
import { RecordForm } from '.';

interface AddRecordProps {
  records: { [key: string]: Record };
  addRecord: (a: RecordFromNetwork) => void;
}

export const AddRecord = (props: AddRecordProps) => {
  const [partialRecord, setPartialRecord] = useState<PartialRecord | undefined>(undefined);
  const [publicKey, setPublicKey] = useState<string>('');
  const [resetForm, setResetForm] = useState<string>('___');

  if (partialRecord && partialRecord.name && partialRecord.name !== resetForm && props.records[partialRecord.name]) {
    setResetForm(partialRecord.name);
    setPartialRecord(undefined);
  }

  return (
    <div>
      <h3 className="subtitle is-4">{t('add local name dev')}</h3>

      <p className="limited-width">{t('add local name paragraph')}</p>
      <br />
      <div className="field is-horizontal">
        <label className="label">{t('public key')}*</label>
        <div className="control">
          <input className="input" onChange={(e) => setPublicKey(e.target.value)}></input>
        </div>
      </div>
      <RecordForm
        nameDisabledAndForced={undefined}
        key={resetForm}
        filledRecord={(a: PartialRecord | undefined) => setPartialRecord(a)}
        partialRecord={partialRecord}
        validateName={undefined}
        special={undefined}
      />
      <div className="field is-horizontal is-grouped pt20">
        <div className="control">
          <button
            type="button"
            onClick={() => {
              const r: PartialRecord = {
                name: (partialRecord as PartialRecord).name,
              };
              if (partialRecord && partialRecord.badges) {
                r.badges = partialRecord.badges;
              }
              if (partialRecord && partialRecord.address) {
                r.address = partialRecord.address;
              }
              if (partialRecord && partialRecord.csp) {
                r.csp = partialRecord.csp;
              }
              if (partialRecord && partialRecord.servers) {
                r.servers = partialRecord.servers;
              }
              props.addRecord({
                ...r,
                box: 'box',
                badges: {},
                publicKey: 'abc',
                price: 1,
              });
            }}
            className="button is-link"
            disabled={!publicKey || !partialRecord}>
            {t('add local name dev')}
          </button>
        </div>
      </div>
    </div>
  );
};
