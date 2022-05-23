import { rchainWallet } from './rchainWallet';

describe('RChain Wallet', () => {
  it('should sign transaction with data', () => {
    const signedTx = rchainWallet.signTransaction(
      {
        timestamp: 1640991600000,
        phloLimit: 20000,
        phloPrice: 10,
        validAfterBlockNumber: 1,
        term: 'any',
        shardId: 'dev',
      },
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
    );

    expect(signedTx.signature).toEqual(
      '3044022077dbf1d3f1b048dc110d14365aea7aa252dcd0c5fa329ae8fa79c87c5701adcd0220304eb9d79736335bdcf9e405baa2e1a993ce83f965640e85f4db68e7da6e543b'
    );
    expect(signedTx.deployer).toEqual(
      rchainWallet.publicKeyFromPrivateKey('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')
    );
  });

  it('should get public key from private key', () => {
    const publicKey = rchainWallet.publicKeyFromPrivateKey(
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
    );
    expect(publicKey).toEqual(
      '046d9038945ff8f4669201ba1e806c9a46a5034a578e4d52c031521985380392944efd6c702504d9130573bb939f5c124af95d38168546cc7207a7e0baf14172ff'
    );
  });
  it('should get address from public key', () => {
    const address = rchainWallet.addressFromPublicKey(
      '046d9038945ff8f4669201ba1e806c9a46a5034a578e4d52c031521985380392944efd6c702504d9130573bb939f5c124af95d38168546cc7207a7e0baf14172ff'
    );
    expect(address).toEqual('1111LDg3SAHBiWkUpvXPrzKvwPWeWeBiNQdgKEqtpYp1Z5jGW4g9q');
  });
});
