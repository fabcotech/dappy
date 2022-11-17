# Developer guide

This document is about introducing the stack and structure of the project. It is mainly built on javascript technologies and javascript frameworks.

## Stack and major components

If you don't understand some terms, please refer first to the [glossary](https://dappy.tech/glossary).

**⚫ Main process**, 1 process, permanent :

- Entry point: `main/main.ts`, compile (rollup) `npm run build:main`.
- Main electron JS process (Node JS + Typescript).
- Node JS + typescript.
- Includes a redux store, mainly replicated/synced with browser process's store.
- Handles all multi-requests / blockchain requests, see `main/performMultiRequest.ts` and `main/performSingleRequest.ts`.
- Handles the HTTPS traffic coming from tab processes and browser process, see `main/overrideHttpProtocols.ts`.

**🐶 Browser process**, 1 process, permanent :

- Entry point `src/index.tsx`, compile (parcel) `npm run build`.
- Main browser layout process (React JS + Redux JS + Redux saga + HTML/CSS + Typescript).
- Includes a redux store divided in 7/8 parts (`dapps`, `ui`, `main` etc).

**🌍 Tab processes** n processes, 1 per website, ephemeral :

- Tab (or processes or windows) are created in `main/store/sagas/loadOrReloadBrowserView.ts`.
- Each tab is identified by a randomId in user agent, see `main/overrideHttpsProtocols.ts`.

**Name system, IP addresses and cert retreival**

Dappy is no-DNS and an alternative web PKI. It uses co-resolution to get certificates or IP addresses from the blockchain (independent agents maintain the nodes). `dappy-lookup` is the component responsible for co-resolution not dappy browser.

## Quick start

```
npm install

# Parcel server on localhost:3033, live reload of css and js
npm run start:renderer

# Electron process (compile)
npm run build:main:dev
# Electron process (run)
npm run start:main
```

Please join us anytime [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV) if you have question(s)/issue(s).

## Global dependencies

Install global dependencies (sudo)

```
# Add --unsafe-perm=true --allow-root if you have an error

npm install typescript -g
# sentry-cli
curl -sL https://sentry.io/get-cli/ | bash
```

Please join us anytime [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV) if you have question(s)/issue(s).

## Sentry

At each releases, js and js.map files must be uploaded, add the following lines to /home/YOURNAME/.sentryclirc :

```
[auth]
token=TOKEN
[defaults]
org=fabco
project=dappy-alpha / dappy-beta etc...
```

## Translations

The service used for translations is [poeditor.com](https://poeditor.com).

See `./translations/README.MD`.

## Dev upgrade the version of dappy

This is the process you must respect to upgrade Dappy.

- upgrade version number in `package.json`

## Build for production

```
# On linux (have fpm installed)
sudo apt-get install --no-install-recommends -y rpm
sudo apt-get install ruby-dev build-essential
sudo gem install fpm
fpm --version

npm run build:all:prod
```

## Register new release to sentry

Important : do this after you have built and tested on all platforms, the file names for this release should not change.

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

## Packaging / create installers

Check the version in package.json, it will be the app version

### On every OS

```
npm ci
```

### Package for Windows (on Windows)

#### Sign app

2 choices:

- By modifing electron-builder.yml file:
  - Fill the certificateFile entry: C:\Users\joe\path\to\certificate.p12
  - Fill the certificatePassword entry: password_for_certificate
- By adding the two following environment variables to your system:
  - CSC_LINK: base 64 encoded pfx/p12 file (`base64 <certificate_file>`) (windows env variables must be less than 8192 characters, otherwise they will be truncated)
  - CSC_KEY_PASSWORD: password_for_certificate

If your certificate p12/pfx file is longer than 8192 characters (`wc -c <certificate_file>`), obviously it contains certificates that are not needed to sign electron app. You can prune them using openssl cli using this procedure:

- Converting certificate p12/pfx file to pem: `openssl pkcs12 -info -in <certificate_file> -nodes -out <certificate_file>.pem`
- Prune unecessary certificates using a text editor
- Converting certifcate pem file to pfx: `openssl pkcs12 -in <certificate_file>.pem -export -out <certificate_file>.pfx`

#### 64 bits

```bat
npm run package:windows:64
```

#### 32 bits

```
npm run package:windows:32
```

### Package for linux (on linux)

```
npm run package:linux:deb
npm run package:linux:rpm
```

### On mac (on macOS)

```
# Install XCode
npm run package:mac
```

See https://www.electron.build/code-signing.html for signing on macOS

Please join us anytime [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV) if you have question(s)/issue(s).
