import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        isolatedModules: true,
        esModuleInterop: true
      }
    }]
  },
  moduleNameMapper: {
    '^@moneydash/ui-library$': '<rootDir>/../ui-library/src/index.ts',
    '\\.css$': 'identity-obj-proxy'
  },
  setupFiles: ['<rootDir>/src/setupTests.ts'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  collectCoverageFrom: ['{src,server}/**/*.{ts,tsx}', '!src/setupTests.ts', '!**/*.test.{ts,tsx}']
}

export default config
