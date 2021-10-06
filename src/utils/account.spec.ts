import { account as accountUtils } from './account';

describe('utils/account', () => {
  const password = 'password';
  let passwordBytes: Uint8Array;
  let encrypted: string;
  let decrypted: string;

  it('should right pad with zeros', () => {
    passwordBytes = new Uint8Array(
      JSON.parse(`{"a" : [112,97,115,115,119,111,114,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}`).a
    );
    expect(accountUtils.passwordFromStringToBytes(password)).toEqual(passwordBytes);
  });
  it('should encrypt', () => {
    encrypted = accountUtils.encrypt(
      'this is a secret key',
      passwordBytes,
      new Uint8Array(
        JSON.parse(`{ "a": [227,248,121,177,84,240,192,100,204,112,65,150,94,241,40,162,24,71,92,105,104,232,253,1]}`).a
      )
    );
    expect(encrypted).toEqual('4/h5sVTwwGTMcEGWXvEoohhHXGlo6P0B/BgM4dgvv3nNDkQFBvkLQ++ldYKwaJXwq4jnmRrkDF8TKT8e');
  });
  it('should decrypt', () => {
    decrypted = accountUtils.decrypt(encrypted, passwordBytes);
    expect(decrypted).toEqual('this is a secret key');
  });
});
