module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['**/*.js', '!**/*.test.js'],
  coverageDirectory: 'test-output',
  coverageReporters: ['text-summary', 'lcov'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test-output/',
    '<rootDir>/test/',
    '<rootDir>/jest.config.cjs'
  ],
  modulePathIgnorePatterns: ['node_modules'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: 'test-output',
        outputName: 'junit.xml'
      }
    ]
  ],
  restoreMocks: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: [],
  verbose: true,
  // setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  globalSetup: './test/globalSetup.js',
  globalTeardown: './test/globalTeardown.js',
  transform: {
    '^.+\\.[j]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(ffc-ahwr-common-library|@defra/hapi-tracing|@defra/hapi-secure-context)/)'
  ]
}
