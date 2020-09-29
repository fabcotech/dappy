## Dappy browser 💻🌍

Dappy is a no-DNS and no-CAs web browser, it works hand in hand with a blockchain platform. The dappy system is a decentralized alternative to the regular web, it allows for new kind of web applications being built and used by anyone.

The main features dappy includes are:
- Decentralized name system on the blockchain, independant of the DNS and certificate authorities.
- HTTPS only: HTTP + TLS encryption.
- Secure javascript execution without any network access by default/
- The dappy network as a source of authority, "à la place" of regular web centralized services.
- Dapps: 100% blockchain, no-server remote web applications.
- Read more on [https://dappy.tech](https://dappy.tech).

### Quick start
```
npm install
npm run create-fake-ws-deps

# Parcel server on localhost:3033, live reload of css and js
npm run parcel:dev

# Electron
npm run start:electron
```

See [DEVELOPER.MD](https://github.com/fabcotech/dappy/blob/master/DEVELOPER.MD) if you want to understand the stack, run, compile, contribute, or play with dappy browser as a developer.

### Networks (deltanetwork, betanetwork etc...)

One or more networks can be included by default. Each of them may include many nodes/members, members of a same dappy network must be connected to the same blockchain platform, it is up to the members of a network to maintain proper infrastructure.

The code for running a node (dev or production) is [dappy-node](https://github.com/fabcotech/dappy-node), please check the [glossary](https://dappy.tech/glossary) if you are not familiar with the terminology around the dappy system.

Currently two networks are referenced in dappy browser, betanetwork (RChain mainnet) and deltanetwork (RChain testnet).

### License

Please read the license file. It is based on [Metatask extension license](https://github.com/MetaMask/metamask-extension/blob/develop/LICENSE) and limits commercial/for-profit usage to 5.000 users.
