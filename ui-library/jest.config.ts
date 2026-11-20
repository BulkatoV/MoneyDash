import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: { module: 'CommonJS', moduleResolution: 'Node', jsx: 'react-jsx', isolatedModules: true }
    }]
  },
  moduleNameMapper: { '\\.css$': 'identity-obj-proxy' },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  collectCoverageFrom: ['src/{Chart,MetricCard}/*.tsx'],
  coverageThreshold: {
    './src/MetricCard/MetricCard.tsx': { statements: 70, branches: 70, functions: 70, lines: 70 }
  }
}

export default config
