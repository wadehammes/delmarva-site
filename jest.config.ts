// jest.config.ts
import type { Config } from "@jest/types";
import nextJest from "next/jest.js";

// Sync object
const customJestConfig: Config.InitialOptions = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  preset: "ts-jest",
  setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setupTests.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(isbot|jest-dom|next-intl)/)",
  ],
  verbose: true,
};

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: "./" })(customJestConfig);

export default async () => {
  // Create Next.js jest configuration presets
  const jestConfig = await createJestConfig();

  // Custom `moduleNameMapper` configuration
  const moduleNameMapper = {
    ...jestConfig.moduleNameMapper,
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  };

  return { ...jestConfig, moduleNameMapper, testTimeout: 20000 };
};
