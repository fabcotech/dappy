# Dappy browser 💻🌍

Dappy is a no-DNS and no-CAs web browser, it works hand in hand with a blockchain platform. The dappy system is a decentralized alternative to the regular web, it allows for new kind of web applications being built and used by human beings and corporations.

The main features dappy includes are:
- Decentralized name system on the blockchain, independant of the DNS and certificate authorities.
- HTTPS only: HTTP + TLS encryption.
- Secure javascript execution without any network access by default.
- The dappy network as a source of authority, "à la place" of regular web centralized services.

Two types of applications exist on dappy :
- IP apps: HTTPS only websites that use the dappy name system instead of the DNS and Certificate Authorities.
- Dapps: 100% blockchain hosted, no-server web applications (not actively developed currently).

Read more on [https://dappy.tech](https://dappy.tech).

## Installation

### On Linux

1. Install [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher) for desktop integration: ([release page](https://github.com/TheAssassin/AppImageLauncher#installation))
2. Download and execute latest dappy-X.X.X-linux-x86_64.AppImage file on [dappy release page](https://github.com/fabcotech/dappy/releases)
3. AppImageLauncher will prompt you to integrate dappy, confirm it and voilà !

### On MacOS

Download and install latest dappy-X.X.X-mac-x64.dmg file on [dappy release page](https://github.com/fabcotech/dappy/releases)

### On Windows

Download and install latest dappy-X.X.X-win-x64.exe file on [dappy release page](https://github.com/fabcotech/dappy/releases)

## Run dappy browser from source

Please [install](https://nodejs.dev/) NodeJS >= version 16

```sh
npm install

# Generate electron main app
npm run build:main:dev

# Parcel server on localhost:3033, live reload of css and js
npm run start:renderer

# Electron
npm run start:main
```

See [DEVELOPER.MD](https://github.com/fabcotech/dappy/blob/master/DEVELOPER.MD) if you want to understand the stack, run, compile, contribute, or play with dappy browser as a developer.

## Networks (d, gamma etc...)

The reference of the dappy network(s) that may be included in a given adppy browser (white label or regular) release are loaded from another library, **dappy-lookup** which is the library responsible for co-resolution of records (A, AAAA, TXT, CERT) in the dappy name system.

## Node / name system resolver

**dappy-node** is the web server responsible for exposing a DoH (DNS over HTTPS) interface and that each member of the dappy network must run.

[dappy-node](https://github.com/fabcotech/dappy-tools/tree/master/packages/dappy-node)

## License

Please read the license file. It is based on [Metatask extension license](https://github.com/MetaMask/metamask-extension/blob/develop/LICENSE) and limits commercial/for-profit usage to 5.000 users.
