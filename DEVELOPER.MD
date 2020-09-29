### Developer guide

This document is about introducing the stack and structure of the project. It is mainly built on javascript technologies and javascript frameworks.

#### Stack and major components

If you don't understand some terms, please refer first to the [glossary](https://dappy.tech/glossary).

**⚫ Main process**, 1 process, permanent :
- Entry point: `main/main.ts`.
- Main electron JS process (Node JS + Typescript).
- Node JS + typescript.
- Includes a redux store, mainly replicated/synced with browser-s process store.
- Compiled with rollup `npm run build:main`.
- Handles all multi-requests / blockchain requests, see `main/performMultiRequest.ts` and `main/performSingleRequest.ts`.
- Handles the HTTPS traffic coming from tabs and browser process, see `main/overrideHttpProtocols.ts`.

**🐶 Browser process**, 1 process, permanent :
- Entry point `src/index.tsx`.
- Main browser layout process (React JS + Redux JS + Redux saga + HTML/CSS + Typescript).
- Includes a redux store divided in 7/8 parts (`dapps`, `ui`, `main` etc).
- Compiled with parcel `npm run build`.

**🌍 Tab processes** n processes, 1 per dapp or IP app, ephemeral :
- If dapp, entry point is `src/dapp-sandboxed.ts` `npm run build:dapp-sandboxed`.
- If IP app, no entry point, website loaded through HTTP + TLS.
- Tab processes/windows are created in `main/store/sagas/loadOrReloadBrowserView.ts`.
- Sandboxed environment with controlled internet access, each tab is identified by a randomId in user agent, see `main/overrideHttpProtocols.ts`.

#### Quick start
```
npm install
npm run create-fake-ws-deps

# Parcel server on localhost:3033, live reload of css and js
npm run parcel:dev

# Electron
npm run start:electron
```

Please join us anytime [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV) if you have question(s)/issue(s).

#### Global dependencies

Install global dependencies (sudo)
```
# Add --unsafe-perm=true --allow-root if you have an error

npm install typescript -g
npm install parcel@1.12.4 -g
npm install rollup@1.26.0 -g
# sentry-cli
curl -sL https://sentry.io/get-cli/ | bash
```

Please join us anytime [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV) if you have question(s)/issue(s).

#### Sentry

At each releases, js and js.map files must be uploaded, add the following lines to /home/YOURNAME/.sentryclirc :
```
[auth]
token=TOKEN
[defaults]
org=fabco
project=dappy-alpha / dappy-beta etc...
```
#### Translations

The service used for translations is [poeditor.com](https://poeditor.com).

See `./translations/README.MD`.

#### Tags

Dappy browser interact with two kind of entities: a dappy network, or a private/final server. Private/final server is only for IP applications navigation, all other networks requests follow the multi-request paradigm.

![Dappy browser connections](https://dappy.tech/images/dappy_browser_connections.jpg)

Tags have been added to the code so you can quickly find where those connections / requests are made.
- **no dns**: Dappy browser does not use the Domain Name System, and does raw IP requests, check this tag to see where it occurs.
- **browser to server**: See how IP apps and no-DNS navigation is done.
- **browser to network**: See how Dappy browsers queries the Dappy network.
- **browser to node**: In case of a deploy (not a read query), multi-request is inadequat, a single browser to node query is performed.
- **tab process - main process**: Inter-process secure communication between a tab and the main process.
- **browser process - main process**: Inter-process secure communication between the browser process and the main process.

#### Add dappy local js/css libraries

- Add the library in dapp-libs/js or dapp-libs/js
- Add the type in src/models/DappManifest.ts
- Add the corresponding entry in src/RESSOURCES.ts

#### Dev upgrade the version of dappy

This is the process you must respect to upgrade Dappy.

- upgrade version number in `package.json`
- upgrade version number in `src/CONSTANTS`

#### Build for production

```
# On linux (have fpm installed)
sudo apt-get install ruby-dev build-essential
sudo gem install fpm
fpm --version

rm -rf dist/ && git rm -rf dist/

npm run build
npm run build:main
npm run build:dapp-sandboxed

git add dist/*
git add main.js
```

#### Register new release to sentry

Important : do this after you have built, the file names for this release should not change.

Each new release must be registered to sentry, and .js and .js.map files uploaded.

Create a ~/.sentryclirc` file with the right values :
```
[auth]
token=TOKEN
[defaults]
org=ORG
project=PROJECT
```


See https://docs.sentry.io/platforms/javascript/sourcemaps/
```
sentry-cli releases new RELEASE
sentry-cli releases files RELEASE upload-sourcemaps ./dist/ --validate
sentry-cli releases finalize RELEASE
```

#### Packaging / create installers

Check the version in package.json, it will be the app version

On every OS
```
npm i -g electron-builder
```

Package for windows (on windows)
```
# ENV variables, add the two following environment variables to your system
Fill the certificateFile entry in the build.yml file:         C:\Users\joe\path\to\certificate.p12
Fill the certificatePassword entry in the build.yml:          password_for_certificate

# 64 bits
npm run electron-builder:dist:windows:64
# rename the .exe created in output/ or it will be overwritten (by 32 bits)

# 32 bits
npm run electron-builder:dist:windows:32
```

Package for linux (on linux)
```
npm run electron-builder:dist:linux
```

On mac (on macOS)
```
npm run electron-builder:dist:mac
```

See https://support.comodo.com/index.php?/Knowledgebase/Article/View/1232/7/codesign-digital-signatures-in-mac-os for signing on macOS


Please join us anytime [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV) if you have question(s)/issue(s).
