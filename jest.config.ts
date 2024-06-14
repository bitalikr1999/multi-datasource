// jest.config.ts
import type { Config } from '@jest/types';
import { defaults } from 'jest-config';

// Sync object
const config: ProjectConfig = {
  preset: 'ts-jest',
  rootDir: '.',
  moduleNameMapper: {
    '^~(.*)': '<rootDir>/product_pricing_graph/$1'
  },
  moduleFileExtensions: ['ts', 'json', ...defaults.moduleFileExtensions],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended'],
  testMatch: [
    '<rootDir>/__tests__/*.test.ts',
    '<rootDir>/__tests__/**/*.test.ts'
  ],
  testPathIgnorePatterns: ['.build/.*', '.generated/.*'],
  coverageDirectory: '<rootDir>/../coverage',
  collectCoverageFrom: ['**/*.ts', '!main.ts', '!**/fixtures/**/*', '!*.d.ts'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      lines: 100,
      functions: 100
    }
  },
  coveragePathIgnorePatterns: [
    './e2e',
    'jest-e2e.config.ts',
    'jest-e2e.setup.ts',
    'jest.config.ts'
  ]
};

export default config;

type CoverageThresholdValue = {
  branches?: number;
  functions?: number;
  lines?: number;
  statements?: number;
};
type CoverageThreshold = {
  [path: string]: CoverageThresholdValue;
  global: CoverageThresholdValue;
};
type ProjectConfig = Partial<
  | Config.ProjectConfig
  | Config.InitialOptions
  | {
      coverageThreshold: CoverageThreshold;
    }
>;
