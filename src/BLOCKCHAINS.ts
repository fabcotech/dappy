import { Blockchain } from './models';

// To avoid confusion, never have more than one predefined blockchain
export const PREDEFINED_BLOCKCHAINS: Blockchain[] = [
  {
    platform: 'rchain',
    chainId: 'gammanetwork',
    chainName: 'Gamma network (testnet)',
    /* no dns */
    nodes: [
      {
        name: 'Node 1',
        host: 'dappygammanetwork',
        ip: '195.154.71.146',
        origin: 'default',
        active: true,
        readyState: 3,
        ssl: true,
        cert: encodeURI(`-----BEGIN CERTIFICATE-----
MIIC8TCCAdmgAwIBAgIJALu8Bm6yTRhWMA0GCSqGSIb3DQEBCwUAMBwxGjAYBgNV
BAMMEWRhcHB5Z2FtbWFuZXR3b3JrMB4XDTIxMTExODA5MjgxNFoXDTMwMDIwNDA5
MjgxNFowHDEaMBgGA1UEAwwRZGFwcHlnYW1tYW5ldHdvcmswggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQDamMuBdZtWLjtQsjZhMjpz+ue7/t3J/1d6t1qx
CPBRd5xTP5+seBWbd1SXZM2eT/+hGwcDON8Edm1/5ybBx+3M7YIY20BI7L15VsYK
imbROSb5XR7UTBAL0uGohgwWxXUpNDrDKWJTi2icivrXsZR54uhOtQ2bR6ITirox
iPXYOsoXxdr14OFLla3gB5DT9USSen8N3Ej9wuWg4hlhe5rJ/kcrH9Uvf4dTuXe7
GnqIRHPpqoB323fyQ7r//s2NnNzXoR0WpO1QnahxW5yMRLWRX/n+I8H0xJLkO4Mh
b8SN4aowrEfX0BonQunO6O6FCuIQ+0pf9bu2//e3l69NtfhLAgMBAAGjNjA0MDIG
A1UdEQQrMCmCCWxvY2FsaG9zdIIJZGFwcHlub2RlghFkYXBweWdhbW1hbmV0d29y
azANBgkqhkiG9w0BAQsFAAOCAQEAVy1MAyfJsLCClEwMKqhMa4jUPP8aUH34n1Os
ewyaI2NFTtKSnL4Tg3nBTcU4Kdkskk4S0YhheLMNx4AktLgyw3c6v/LGo771/9qF
dGGXGFJRDaITr4/x30XMj7iNLOz0nRybegE4ykxgKsReHSURxfSj13gjYsC3s4xz
Yjg7bjCfL0F7u4ZTBh462e3jhpOTy43j6SCGp0wHsCQ5J00OerVEA3jGFG16cxCx
L+7ohgaZy3cpogHOkDXFmz87uPwvtGGEzK451vSI40n7rVxDdJaZlXGAumX7Jr08
zruDFpDU1/kBrPP/lX/ito1T2IGqUAE3+TXTD3chACkSSVYH+A==
-----END CERTIFICATE-----`),
      },
    ],
  },
  {
    platform: 'rchain',
    chainId: 'betanetwork',
    chainName: 'Beta network (mainnet)',
    /* no dns */
    nodes: [
      {
        name: 'Node 1',
        host: 'dappybetanetwork',
        ip: '195.154.70.253',
        origin: 'default',
        active: true,
        readyState: 3,
        ssl: true,
        cert: encodeURI(`-----BEGIN CERTIFICATE-----
MIIC7jCCAdagAwIBAgIJANpjduSnANQKMA0GCSqGSIb3DQEBCwUAMBsxGTAXBgNV
BAMMEGRhcHB5YmV0YW5ldHdvcmswHhcNMjExMTE4MDkzMzMyWhcNMzAwMjA0MDkz
MzMyWjAbMRkwFwYDVQQDDBBkYXBweWJldGFuZXR3b3JrMIIBIjANBgkqhkiG9w0B
AQEFAAOCAQ8AMIIBCgKCAQEAmabi+uIZwG6RDNqErN6HI4fmPCmY1TSurznc6Y7X
rePLBd92QbTfGFNmAEEa/SPAfxs/fsxxvWtcubCK+ukvbQ9ClXFrFdjmzgtzyHq4
rsS/ia24bcFSDcqi9eg+f8kUOQJ5NyifKT+4YugAkeD0hUhC7M2afYSMpkj6oEnz
1f6UidE5hicohqjiV9IyorJCDEZEu5dAI2XkJVKVXpglnMdtKqdu6EJvqdTjhmMj
058VAJDraic+0xrBZ5AlIZQQ/meiymoW9/6g3X1RBeEcNv5pMj4Qdnox28zmBYGG
RuAhMgyS0Lmipqc4knkuQxsSJggoWUP/I0kedFULi7eqLwIDAQABozUwMzAxBgNV
HREEKjAogglsb2NhbGhvc3SCCWRhcHB5bm9kZYIQZGFwcHliZXRhbmV0d29yazAN
BgkqhkiG9w0BAQsFAAOCAQEAJhvF9Y6nD8Kdj69YVt18EilsFN//STn3bl+gYV7w
pqLBM2X43BydgKgf5awslFlKa6/BZNJ58aqy94pWE+/HC2LsJ4ku4rNe8OmF9V/Z
76yyDfOfcPa+BBDZa8j9UFACUWKDUcltP6xuaQfuVOBCX0aTKBFh21LABE3SBDlI
/Z0rJajtDiWw34/W7LmZYO2eHNdA4VV7uqsoQVB7k5jKQeN1cD9CovQ6uT4pbkXV
bILn3tVnBjuW1j0/megRsdVRdE2PqsIkPHxsEgIA4cU97H3qXiT2qHkrx65eY4fE
oOuysz7xmb+VElqaKTWGJXKKC+3IEv8qo3CY1Gdc9UaB9Q==
-----END CERTIFICATE-----`),
      },
    ],
  },
];
