/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: './jestEnvironment.js',
  moduleNameMapper: {
    '.+\\.(jpg|png|scss)$': '<rootDir>/jest/mockNonJsFiles.js',
    '^/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  transform: {
    'node_modules/beesjs/.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!beesjs/.*)'],
  modulePathIgnorePatterns: ['tests'],
};
