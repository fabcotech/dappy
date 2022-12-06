#!/bin/bash

TARGET="${TARGET:-dappy}"
PLATFORM="${PLATFORM:-linux:rpm}"

npm ci
npm run build:all:prod
npm run package:${TARGET}:${PLATFORM}