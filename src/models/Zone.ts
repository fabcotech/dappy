export interface ZoneRecord {
  type: 'AAAA' | 'A' | 'TXT' | 'PUBLICKEY:SECP256K1';
  value?: string;
  host?: string;
}

export interface Zone {
  host: string;
  records: ZoneRecord[];
}
