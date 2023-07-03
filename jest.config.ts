export default {
  preset: 'ts-jest',
  testRegex: '.*\\/__tests__\\/.*\\.(acceptance-)?test\\.ts$',
  modulePathIgnorePatterns: ['/scripts/', 'main.ts'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!(src/scripts/*)', '!(src/io/gpio-wrapper.ts)'],
};
