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
    chainId: 'gammanetwork',
    chainName: 'Gamma network (testnet)',
    /* no dns */
    nodes: [
      {
        name: 'Node 1',
        host: 'gammanetwork',
        ip: '195.154.71.146',
        origin: 'default',
        active: true,
        readyState: 3,
        ssl: false,
        cert: encodeURI(`-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUP9lpeHkBOmp3ldUsrWB5fPKuvBAwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCVVMxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yMTA1MjkxMTA2NThaFw0yOTA4
MTUxMTA2NThaMEUxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQCjk/lCyuy1Q4JKbXL+9D6IN4fPi0uYV8pzciUYGpl8
7J9jb4lj/fFa1PocFJLj7FtGpZ3jcorZ/jgxDFliGuICOGb2sbIFNgoxVCKwKbmy
ApmjQAScSuDG7IRORjwUlE9GO8xtGfIUjmY/DH7vLYvCBXvDACIFmNbXhJkKE+Kp
NtWpcw5am8Nae8iR81CcmyIMaLCrz8zrzAUFWzpi7o9V3vx2S3URDRvaUmOKoWcZ
ttZ5z+Gg208uFEjfJiyGP2mQ75a2nVV5TzOPkOJgMJlnqZOyAyCA2qatvVuFGwRg
SDWE4EHttXvJjLR9WdDUIqtBOzQ7EWQbgcqK9aowriMDAgMBAAGjUzBRMB0GA1Ud
DgQWBBTPmWtYpJOgPDxiwV/paEmXbLbw7DAfBgNVHSMEGDAWgBTPmWtYpJOgPDxi
wV/paEmXbLbw7DAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAC
M1Jy1xdmU3c+5HjohoR7/pSzPVJ/N0znuB213Fc7efRlZ4NrOquT0nLFF+SR7xbo
7iEIkJZMsP6EyViUEJ0YWrkHPm0XorNxAEc4zsRg+5x1evlaU6OR5KfeBdngVtGC
q0/EvT6v9jHbW3xqTSnWcFEIfgM7ZvgAVuJRZOMqkNpewpLb8Q/umfWNqsNYNMKx
Tf5Ny1zHRCP7+k+WFzoyiIzDo+hluLfaKSWwg5tKd2N1bQzzhHTA71vOff7LIinK
sV4tfUh3rBP5BlEtFHqCeT8Bc8QkFTDm7uJeyTABcgfaYukIwXunp6+Wwge2eRns
lhrVzIug1mU/MZJNIlCO
-----END CERTIFICATE-----`),
      },
    ],
  },
];
