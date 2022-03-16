
export enum RecordType {
  A = 'A',
  AAAA = 'AAAA',
  CERT = 'CERT',
  TXT = 'TXT',
}

export const recordTypeRegExp = /^(A|AAAA|CERT|TXT)$/;

export type ResourceRecord = {
  name: string;
  ttl?: number;
};

// Simplified version of A RR from RFC 1035
export type RRA = ResourceRecord & {
  ip: string;
};

export type RRAAAA = ResourceRecord & {
  ip: string;
};

export type RRTXT = ResourceRecord & {
  value: string;
};


export const isRRAAAA = (data: any): data is RRAAAA => false

export type RRCERT = ResourceRecord & {
  cert: string;
};

export const isRRCERT = (data: any): data is RRCERT => false

export type RR = RRA | RRAAAA | RRCERT | RRTXT;

export type RRAData = string;
export type RRAAAAData = string;
export type RRCERTData = string;

export type RRData = RRAData | RRAAAAData | RRCERTData;









// NamePacket.ts

export type NameClass = 'IN';

export type NameQuestion = {
  type: RecordType;
  class: NameClass;
  name: string;
};

export type NameAnswer = {
  type: RecordType;
  class: NameClass;
  name: string;
  ttl: number;
  data: RRData;
};

// DNS RCODEs in https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml
export enum ReturnCode {
  NOERROR, // DNS Query completed successfully
  FORMERR, //  DNS Query Format Error
  SERVFAIL, // Server failed to complete the DNS request
  NXDOMAIN, //  Domain name does not exist.
  NOTIMP, //  Function not implemented
  REFUSED, // The server refused to answer for the query
  YXDOMAIN, //  Name that should not exist, does exist
  XRRSET, //  RRset that should not exist, does exist
  NOTAUTH, //  Server not authoritative for the zone
  NOTZONE, //  Name not in zone
}
export enum PacketType {
  QUERY = 'query',
  RESPONSE = 'response',
}

// As described in https://datatracker.ietf.org/doc/html/rfc1035#section-4.1
export type NamePacket = {
  version: string;
  type: PacketType;
  rcode: ReturnCode;
  id?: number;
  flags: number;
  questions: NameQuestion[];
  answers: NameAnswer[];
  additionals: [];
  authorities: [];
};
