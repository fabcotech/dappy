import { evmWallet } from './evmWallet';

describe('EVM Wallet', () => {
  it('should sign transaction with data', () => {
    const signedTx = evmWallet.signTransaction(
      {
        nonce: 0,
        gasLimit: '0x6d3e',
        maxFeePerGas: '0x77377318',
        maxPriorityFeePerGas: '0x77359400',
        to: '0x0000000000000000000000000000000000000000',
        value: 1,
        data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
        chainId: 1,
      },
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
    );

    // v, r, s are ECDSA signature parts
    expect(signedTx.v).toBeDefined();
    expect(signedTx.r).toBeDefined();
    expect(signedTx.s).toBeDefined();
  });

  it('should get public key from private key', () => {
    const publicKey = evmWallet.publicKeyFromPrivateKey(
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
    );
    expect(publicKey).toEqual(
      '046d9038945ff8f4669201ba1e806c9a46a5034a578e4d52c031521985380392944efd6c702504d9130573bb939f5c124af95d38168546cc7207a7e0baf14172ff'
    );
  });
  it('should get address from public key', () => {
    const address = evmWallet.addressFromPublicKey(
      '046d9038945ff8f4669201ba1e806c9a46a5034a578e4d52c031521985380392944efd6c702504d9130573bb939f5c124af95d38168546cc7207a7e0baf14172ff'
    );
    expect(address).toEqual('0xbe862ad9abfe6f22bcb087716c7d89a26051f74c');
  });
});
