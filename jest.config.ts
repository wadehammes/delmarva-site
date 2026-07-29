import type { Config } from "@jest/types";
import nextJest from "next/jest.js";

const customJestConfig: Config.InitialOptions = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  preset: "ts-jest",
  setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
  setupFilesAfterEnv: ["<rootDir>/.jest/setupTests.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(isbot|jest-dom|next-intl|@faker-js)/)",
  ],
  verbose: true,
};

const createJestConfig = nextJest({ dir: "./" })(customJestConfig);

export default async () => {
  const jestConfig = await createJestConfig();

  const moduleNameMapper = {
    "^.+\\.(svg)$": "<rootDir>/src/tests/mocks/svgMock.tsx",
    ...jestConfig.moduleNameMapper,
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@faker-js/faker$": "<rootDir>/src/tests/mocks/faker.ts",
    "^next-intl/navigation$":
      "<rootDir>/src/tests/mocks/nextIntlNavigation.mock.ts",
    "^next/dynamic$": "<rootDir>/src/tests/mocks/nextDynamic.mock.ts",
    "^react-google-recaptcha$":
      "<rootDir>/src/tests/mocks/reactGoogleRecaptcha.mock.ts",
  };

  return { ...jestConfig, moduleNameMapper, testTimeout: 20000 };
};
