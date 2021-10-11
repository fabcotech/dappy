/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '.+\\.(jpg|png|scss)$': '<rootDir>/jest/mockNonJsFiles.js',
    '^/(.*)': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest/setup.ts'
  ]
};