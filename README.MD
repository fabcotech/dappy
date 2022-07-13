# Dappy browser 💻🌍

Dappy is a no-DNS and no-CAs web browser, it works hand in hand with a blockchain platform. The dappy system is a decentralized alternative to the regular web, it allows for new kind of web applications being built and used by human beings and corporations.

The main features dappy includes are:
- Decentralized name system on the blockchain, independant of the DNS and certificate authorities.
- HTTPS only: HTTP + TLS encryption.
- Secure javascript execution without any network access by default.
- The dappy network as a source of authority, "à la place" of regular web centralized services.

Two types of applications exist on dappy, both of them also have extended micropayment, tipping and defi capabilities:
- Dapps: 100% blockchain hosted, no-server web applications.
- IP apps: HTTPS only websites that use the dappy name system instead of the DNS.

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

# Parcel server on localhost:3033, live reload of css and js
npm run start:parcel

# Electron
npm run start:electron
```

See [DEVELOPER.MD](https://github.com/fabcotech/dappy/blob/master/DEVELOPER.MD) if you want to understand the stack, run, compile, contribute, or play with dappy browser as a developer.

## Networks (deltanetwork, betanetwork etc...)

One or more networks can be included by default. Each of them may include many nodes/members, members of a same dappy network must be connected to the same blockchain platform, it is up to the members of a network to maintain proper infrastructure.

The code for running a node (dev or production) is [dappy-node](https://github.com/fabcotech/dappy-node), please check the [glossary](https://dappy.tech/glossary) if you are not familiar with the terminology around the dappy system.

Currently two networks are referenced in dappy browser, betanetwork (RChain mainnet) and deltanetwork (RChain testnet).

## License

Please read the license file. It is based on [Metatask extension license](https://github.com/MetaMask/metamask-extension/blob/develop/LICENSE) and limits commercial/for-profit usage to 5.000 users.
