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

  if (partialRecord && partialRecord.id && partialRecord.id !== resetForm && props.records[partialRecord.id]) {
    setResetForm(partialRecord.id);
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
      />
      <div className="field is-horizontal is-grouped pt20">
        <div className="control">
          <button
            type="button"
            onClick={() => {
              const r: RecordFromNetwork = {
                id: (partialRecord as PartialRecord).id,
                boxId: 'box',
                publicKey: 'abc',
                price: 1,
                expires: undefined,
                data: {
                  badges: partialRecord && partialRecord.badges ? partialRecord.badges : {},
                },
              };
              if (partialRecord && partialRecord.address) {
                r.data.address = partialRecord.address;
              }
              if (partialRecord && partialRecord.csp) {
                r.data.csp = partialRecord.csp;
              }
              if (partialRecord && partialRecord.servers) {
                r.data.servers = partialRecord.servers;
              }
              props.addRecord(r);
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
