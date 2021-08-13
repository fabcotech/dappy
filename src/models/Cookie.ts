export interface Cookie {
  sameSite: 'strict' | 'lax';
  name: string;
  value: string;
  domain: string;
  expirationDate: number;
}
