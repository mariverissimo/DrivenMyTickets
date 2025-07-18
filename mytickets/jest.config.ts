import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  globalSetup: './tests/setup.ts',
  globalTeardown: './tests/teardown.ts',
  coverageDirectory: './coverage',
  collectCoverage: true,
};

export default config;
