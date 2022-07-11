#!/bin/bash

npm ci
npm run build:all:prod
npm run electron-builder:dist:mac