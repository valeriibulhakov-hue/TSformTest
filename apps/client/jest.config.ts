import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/_lib/(.*)$': '<rootDir>/src/_lib/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default config