## Dappy

🔒 Dappy is a name system powered by blockchain and secured in real-time by multiple independent companies, each exposing a DoH endpoint (co-resolution). Its design removes industry-wide structural limitations and defects of current naming systems (mainly DNS) and TLS security services (mainly the Certificate Authorities system).

Dappy is being built since 2018 in an open source and iterative fashion. The main goal is to provide any kind of web service : 🎮 web3, 💻 web2, 🪙 finance, 🛻 supply chain, 🤝 B2B, 🌍 non-profits with :

- **Ultra-security** : protected against HTTPS man-in-the-middle, many phishing scenarios, DNS hack through registrar or registry.
- **Thin control over domain names and TLS identities**.
- **Extended capabilities and expressiveness** that are not achievable with legacy naming systems such as DNS.

### Dappy browser

This repository is the browser repository (built on chromium + electron), the tools and CLI are available in the [fabcotech/dappy-tools](https://github.com/fabcotech/dappy-tools) and [fabcotech/dappy-cli](https://github.com/fabcotech/dappy-cli) repositories.

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
