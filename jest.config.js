/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  bail: true,
  clearMocks: true,
  rootDir: "src",
  testMatch: ["**/test/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/$1",
  },
};
