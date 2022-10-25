import { ZoneRecord } from '/models';

/*
  Method that eventually adds a ZoneRecord into an array of ZoneRecords
  It handles the duplicate, so it will either refresh, or append
*/
export const refreshOrAppendRecord = (records: ZoneRecord[], record: ZoneRecord): ZoneRecord[] => {
  if (record.type === 'A') {
    const foundIndex = records.findIndex((r) => r.host === record.host && r.type === 'A' && r.value === record.value);
    if (foundIndex === -1) {
      return records.concat(record);
    }
      return records.splice(foundIndex, 1).concat(record);
  } if (record.type === 'AAAA') {
    const foundIndex = records.findIndex((r) => r.host === record.host && r.type === 'AAAA' && r.value === record.value);
    if (foundIndex === -1) {
      return records.concat(record);
    }
      return records.splice(foundIndex, 1).concat(record);
  } if (record.type === 'TXT') {
    const foundIndex = records.findIndex((r) => r.host === record.host && r.type === 'TXT' && r.value === record.value);
    if (foundIndex === -1) {
      return records.concat(record);
    }
      return records.splice(foundIndex, 1).concat(record);
  }
    throw new Error(`Unknown record type ${record.type}`);
};
