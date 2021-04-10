import { pathsToModuleNameMapper } from "ts-jest/utils";

export default {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/*.spec.ts"],
};
