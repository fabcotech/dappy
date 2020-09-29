import { Blockchain } from './models';

// To avoid confusion, never have more than one predefined blockchain
export const PREDEFINED_BLOCKCHAINS: Blockchain[] = [
  {
    platform: 'rchain',
    chainId: 'betanetwork',
    chainName: 'Beta network (mainnet)',
    /* no dns */
    nodes: [
      {
        name: 'Node 1',
        host: 'b1.dappy.tech',
        ip: '51.158.73.100',
        origin: 'default',
        active: true,
        readyState: 3,
        ssl: false,
        cert: encodeURI(`-----BEGIN CERTIFICATE-----
MIIDkzCCAnugAwIBAgIUKsmCdRcA7G6lfYXIaC03HO3BebEwDQYJKoZIhvcNAQEL
BQAwWTELMAkGA1UEBhMCRlIxDzANBgNVBAgMBkZyYW5jZTERMA8GA1UEBwwIVG91
bG91c2UxDjAMBgNVBAoMBUZBQkNPMRYwFAYDVQQDDA1iMS5kYXBweS50ZWNoMB4X
DTIwMDMwNDE3MzUxOVoXDTIxMDMwNDE3MzUxOVowWTELMAkGA1UEBhMCRlIxDzAN
BgNVBAgMBkZyYW5jZTERMA8GA1UEBwwIVG91bG91c2UxDjAMBgNVBAoMBUZBQkNP
MRYwFAYDVQQDDA1iMS5kYXBweS50ZWNoMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAzMgA4K1KOL5a9CFOhJ7w+K8vWcaVmRyphcysvhNXXb3WqorhG7i5
HoFztIlDjGvpQFViqQmZUs4KC/QBJ8NDnsHM66eqyamCuohWpXV8yQSyzjH+A67J
pltRauEU7qQWCj7NXigdfePF1OrkKm/XHnsvwaw1xoNGxKWW/bne/9zeKdwNyOXB
JGuLm6FgT/TmgRD4bmwvt+H9/07moLjqsimAi802dEQkTxyfTRcpv4x1rKflWyfe
ABuJrpIaBxAT/LdHMzcRKdGVRvxAV4+rLyQ022FS9X5W3/jZmD6RkKKMhrhXgGLH
6R6lz5So6B8MYMoOPHwqaGUpTfSv3CDpOQIDAQABo1MwUTAdBgNVHQ4EFgQUhKzA
v+kUx8S8xc9pC3sPcB9skh0wHwYDVR0jBBgwFoAUhKzAv+kUx8S8xc9pC3sPcB9s
kh0wDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEARQMsj7QRefXS
jB2cuPPAlcQnGfnJb239OubUC2k0CtazEhvyypwZkGu38KnUqD8sNw99ACJjXQ1N
Eu8XxP7NXAAKS7WlPfoxz49H7x26VIcTJRXszFxJ6IzpQb0rcqz3Jpy1iyANb9zz
ibnuP39ev1lzYfUNmS3k5fsvzl2Yzkwjz3jcr7zWoLxLeoznWC8e0v0eFIp9WwdE
Q8RJLrV/+OORtjjM8InWI1BhHrxC/BEiR9KGj86pohQ+DbK5xWlJJE5x0FC70jI3
hYC/xCXfAxQRUfkTmgL0LkTU1T8KqA8IWD1Xx1FZhJQcKfIY+STfgSeqJNoXJFxD
4/rQesitRw==
-----END CERTIFICATE-----`),
      },
    ],
  },
  {
    platform: 'rchain',
    chainId: 'deltanetwork',
    chainName: 'Delta network (testnet)',
    /* no dns */
    nodes: [
      {
        name: 'Node 1',
        host: 'd1.dappy.tech',
        ip: '51.158.73.100',
        origin: 'default',
        active: true,
        readyState: 3,
        ssl: false,
        cert: encodeURI(`-----BEGIN CERTIFICATE-----
MIID8zCCAtugAwIBAgIUC6AQP2oENtTJbHfpb4AV89hYlXMwDQYJKoZIhvcNAQEL
BQAwgYgxCzAJBgNVBAYTAkZSMQwwCgYDVQQIDANPY2MxETAPBgNVBAcMCFRvdWxv
dXNlMQ4wDAYDVQQKDAVGQUJDTzEUMBIGA1UECwwLZW5naW5lZXJpbmcxFjAUBgNV
BAMMDXQxLmRhcHB5LnRlY2gxGjAYBgkqhkiG9w0BCQEWC2hleUBqb2UuY29tMB4X
DTIwMDMxNTExMTEyMloXDTIxMDMxNTExMTEyMlowgYgxCzAJBgNVBAYTAkZSMQww
CgYDVQQIDANPY2MxETAPBgNVBAcMCFRvdWxvdXNlMQ4wDAYDVQQKDAVGQUJDTzEU
MBIGA1UECwwLZW5naW5lZXJpbmcxFjAUBgNVBAMMDXQxLmRhcHB5LnRlY2gxGjAY
BgkqhkiG9w0BCQEWC2hleUBqb2UuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
MIIBCgKCAQEAsnKQXT/g9+La279hxaH/Ywkwnt+aKttr6UJhRwiw0AqGy52ek1o1
QeljW1yF5szKqnsBcnVDi2JTvKeoVdOzQOjQwLtxsqzMojH0dO0FyMrBf1N4G/04
WcqGl48yZUolcN6nhLw+Bnt/xcxHemNhEhuJAn2t6l23OTnp1ycNll/wj4zcavBt
ezDuHTgX2uFHUwCtFpFqyy4Sc7CLjKBAnKyjOv6KaKfTCuDkshjBOn88R8Kqgiee
6Fqw3dKL9zb3Bl5NYqSror+m6sAHmszgUKGTtKMTx0n7DeP8pz5C6h1d+HStpcMK
XVxs7hGm9qpDbbDzpB1eMKIwe/SLCVXJNwIDAQABo1MwUTAdBgNVHQ4EFgQUFs+5
6JuGyMpisYN/a7gNzNt4jgQwHwYDVR0jBBgwFoAUFs+56JuGyMpisYN/a7gNzNt4
jgQwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEARvgYOzQCYZRN
/R3SVEFjwgS883RSDSV3SXQtwG8RF595yvYqGqK8jv8lv79Wv7QxvxfhjkXPmE+n
BqhHSQJArKxtQEqmWLe57h0H5I3rb2N5+/WGJ4EpA29lFP0nGRxwLWInfDNN6fxx
mzGiZfvOKmwW+jHeBr0aStZ06ej2OZWKvRG6peOMEpcjnIiUgo+8bhLjfNcievys
DcdLBddTXqcLcB7um+X6k6roNAGJQMqxoESH963ewstSmpA+j7P7rNOuVL9Arkuf
yVj1bXmbaPTTgoo2PR4hveMi8QFEz3BPw8mQM3oG4gI2CQfNwNFzQE5Cfjg+ckk8
v0Ls87R2JQ==
-----END CERTIFICATE-----`),
      },
    ],
  },
];
