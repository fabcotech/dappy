import { ZoneRecord } from '../models';
import { refreshOrAppendRecord } from './zone';

const ZoneRecords: ZoneRecord[] = [
  { type: 'A', host: 'hello.dappy', value: '12.13.14.15' },
  { type: 'AAAA', host: 'hello.dappy', value: '12.13.14.15' },
];

describe('utils/zone', () => {
    it('should concat A record ', () => {
      expect(refreshOrAppendRecord(
        ZoneRecords,
        { type: 'A', host: 'hello.dappy', value: '16.17.18.19'}
      ).length).toEqual(3)
    });
    it('should concat TXT record ', () => {
      expect(refreshOrAppendRecord(
        ZoneRecords,
        { type: 'TXT', host: 'hello.dappy', value: 'heythisismyvalue'}
      ).length).toEqual(3)
    });

    it('should not concat A record ', () => {
      expect(refreshOrAppendRecord(
        ZoneRecords,
        { type: 'A', host: 'hello.dappy', value: '12.13.14.15'}
      ).length).toEqual(2)
    });
});