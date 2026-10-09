import { describe, expect, it } from "@jest/globals";
import {
  collectHandbookTestViolations,
  formatHandbookTestViolations,
  isFeatureTestFile,
  isHandbookTestRulesAllowlisted,
  validateFeatureTestSource,
} from "src/tests/utils/handbookTestRules";

describe("handbookTestRules", () => {
  it("identifies feature test files and handbook rules spec allowlist paths", () => {
    expect(
      isFeatureTestFile(
        "src/components/GeneralInquiryForm/GeneralInquiryForm.test.tsx",
      ),
    ).toBe(true);
    expect(
      isFeatureTestFile(
        "src/components/GeneralInquiryForm/GeneralInquiryForm.po.tsx",
      ),
    ).toBe(true);
    expect(isFeatureTestFile("src/tests/utils/handbookTestRules.ts")).toBe(
      false,
    );

    expect(
      isHandbookTestRulesAllowlisted(
        "src/tests/utils/handbookTestRules.spec.ts",
      ),
    ).toBe(true);
    expect(
      isHandbookTestRulesAllowlisted(
        "src/components/GeneralInquiryForm/GeneralInquiryForm.test.tsx",
      ),
    ).toBe(false);
  });

  it("flags specs under src/hooks/mutations or src/hooks/queries", () => {
    const violations = validateFeatureTestSource(
      "src/hooks/mutations/useTriggerDeploy.mutation.test.ts",
      `describe("useTriggerDeployMutation", () => {});\n`,
    );

    expect(violations).toEqual([
      expect.objectContaining({
        line: 1,
        rule: "forbidden-hook-layer-spec",
      }),
    ]);
  });

  it("flags jest.mock on src/hooks/mutations in feature tests", () => {
    const violations = validateFeatureTestSource(
      "src/components/DeployButton/DeployButton.test.tsx",
      `jest.mock("src/hooks/mutations/useTriggerDeploy.mutation");\n`,
    );

    expect(violations).toEqual([
      expect.objectContaining({
        line: 1,
        rule: "jest-mock-mutation-hook",
      }),
    ]);
  });

  it("flags jest.mock on src/hooks/queries in feature tests", () => {
    const violations = validateFeatureTestSource(
      "src/components/DeployButton/DeployButton.test.tsx",
      `jest.mock("src/hooks/queries/useDeployBuildStats.query");\n`,
    );

    expect(violations).toEqual([
      expect.objectContaining({
        line: 1,
        rule: "jest-mock-query-hook",
      }),
    ]);
  });

  it("keeps feature tests free of handbook testing violations", () => {
    const violations = collectHandbookTestViolations(process.cwd());

    expect(violations).toEqual([]);
  });

  it("formats violations for hook and CI output", () => {
    const formatted = formatHandbookTestViolations([
      {
        excerpt: 'jest.mock("src/hooks/queries/useDeployBuildStats.query");',
        filePath: "src/components/DeployButton/DeployButton.test.tsx",
        line: 12,
        message: "Do not jest.mock query hooks.",
        rule: "jest-mock-query-hook",
      },
    ]);

    expect(formatted).toContain("[jest-mock-query-hook]");
    expect(formatted).toContain("DeployButton.test.tsx:12");
  });
});
