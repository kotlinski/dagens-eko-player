import base_config from './jest.config';
export default {
  ...base_config,
  testRegex: '.*\\/__tests__\\/.*\\.test\\.ts$',
  collectCoverageFrom: ['src/**/*.ts', '!(src/scripts/*)', '!(src/**/*.acceptance-test.ts)'],
};
