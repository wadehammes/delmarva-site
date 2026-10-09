import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export type HandbookTestViolation = {
  filePath: string;
  line: number;
  rule: string;
  message: string;
  excerpt: string;
};

const FEATURE_TEST_SUFFIXES = [
  ".spec.ts",
  ".spec.tsx",
  ".test.ts",
  ".test.tsx",
  ".po.tsx",
] as const;

const HANDBOOK_TEST_RULES_ALLOWLIST = [
  /^src\/tests\/utils\/handbookTestRules\.spec\.ts$/,
] as const;

const QUERY_HOOK_IMPORT_PATTERN =
  /from\s+["']src\/hooks\/queries\/use[A-Za-z0-9]+["']/;

const MUTATION_HOOK_IMPORT_PATTERN =
  /from\s+["']src\/hooks\/mutations\/use[A-Za-z0-9]+["']/;

const FORBIDDEN_HOOK_LAYER_SPEC_PATH =
  /^src\/hooks\/(mutations|queries)\/.+\.(spec|test|po)\.(ts|tsx)$/;

const FORBIDDEN_HOOK_LAYER_SPEC_MESSAGE =
  "Do not add specs under src/hooks/queries/ or src/hooks/mutations/. Cover read/write behavior at call sites (components, feature hooks) with mocked api.*. See docs/handbook/conventions.md (Do not test React Query).";

const QUERY_HOOK_MOCK_LINE_RULES = [
  {
    message:
      "Do not jest.mock query hooks under src/hooks/queries/. Mock src/api/urls and let the real query hook run in TestProviders. See docs/handbook/conventions.md (Do not test React Query).",
    pattern: /jest\.mock\s*\(\s*["']src\/hooks\/queries\//,
    rule: "jest-mock-query-hook",
  },
] as const;

const MUTATION_HOOK_MOCK_LINE_RULES = [
  {
    message:
      "Do not jest.mock mutation hooks under src/hooks/mutations/. Mock src/api/urls and assert outcomes in components or feature hooks. See docs/handbook/conventions.md (Do not test React Query).",
    pattern: /jest\.mock\s*\(\s*["']src\/hooks\/mutations\//,
    rule: "jest-mock-mutation-hook",
  },
] as const;

const jestMockedQueryHookPattern =
  /jest\.mocked\s*\(\s*use[A-Z][a-zA-Z0-9]*Query\s*\)/;

const jestMockedMutationHookPattern =
  /jest\.mocked\s*\(\s*use[A-Z][a-zA-Z0-9]*Mutation\s*\)/;

export const isFeatureTestFile = (relativePath: string): boolean =>
  FEATURE_TEST_SUFFIXES.some((suffix) => relativePath.endsWith(suffix));

export const isHandbookTestRulesAllowlisted = (relativePath: string): boolean =>
  HANDBOOK_TEST_RULES_ALLOWLIST.some((pattern) => pattern.test(relativePath));

const listFeatureTestFiles = (rootDir: string): string[] => {
  const files: string[] = [];

  const walk = (directory: string) => {
    for (const entry of readdirSync(directory)) {
      const absolutePath = join(directory, entry);
      const stats = statSync(absolutePath);

      if (stats.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      const relativePath = relative(rootDir, absolutePath).replace(/\\/g, "/");

      if (isFeatureTestFile(relativePath)) {
        files.push(relativePath);
      }
    }
  };

  walk(join(rootDir, "src"));
  return files.sort();
};

const validateFeatureTestPath = (filePath: string): HandbookTestViolation[] => {
  if (isHandbookTestRulesAllowlisted(filePath)) {
    return [];
  }

  if (!FORBIDDEN_HOOK_LAYER_SPEC_PATH.test(filePath)) {
    return [];
  }

  return [
    {
      excerpt: filePath,
      filePath,
      line: 1,
      message: FORBIDDEN_HOOK_LAYER_SPEC_MESSAGE,
      rule: "forbidden-hook-layer-spec",
    },
  ];
};

export const validateFeatureTestSource = (
  filePath: string,
  source: string,
): HandbookTestViolation[] => {
  const pathViolations = validateFeatureTestPath(filePath);

  if (isHandbookTestRulesAllowlisted(filePath)) {
    return pathViolations;
  }

  const importsQueryHook = QUERY_HOOK_IMPORT_PATTERN.test(source);
  const importsMutationHook = MUTATION_HOOK_IMPORT_PATTERN.test(source);
  const violations: HandbookTestViolation[] = [...pathViolations];

  for (const [index, line] of source.split("\n").entries()) {
    for (const { rule, pattern, message } of QUERY_HOOK_MOCK_LINE_RULES) {
      if (pattern.test(line)) {
        violations.push({
          excerpt: line.trim(),
          filePath,
          line: index + 1,
          message,
          rule,
        });
      }
    }

    for (const { rule, pattern, message } of MUTATION_HOOK_MOCK_LINE_RULES) {
      if (pattern.test(line)) {
        violations.push({
          excerpt: line.trim(),
          filePath,
          line: index + 1,
          message,
          rule,
        });
      }
    }

    if (importsQueryHook && jestMockedQueryHookPattern.test(line)) {
      violations.push({
        excerpt: line.trim(),
        filePath,
        line: index + 1,
        message:
          "Do not jest.mocked() query hooks from src/hooks/queries/. Mock src/api/urls instead. See docs/handbook/conventions.md (Do not test React Query).",
        rule: "jest-mocked-query-hook",
      });
    }

    if (importsMutationHook && jestMockedMutationHookPattern.test(line)) {
      violations.push({
        excerpt: line.trim(),
        filePath,
        line: index + 1,
        message:
          "Do not jest.mocked() mutation hooks from src/hooks/mutations/. Mock src/api/urls instead. See docs/handbook/conventions.md (Do not test React Query).",
        rule: "jest-mocked-mutation-hook",
      });
    }
  }

  return violations;
};

export const collectHandbookTestViolations = (
  rootDir: string,
): HandbookTestViolation[] =>
  listFeatureTestFiles(rootDir).flatMap((filePath) => {
    const source = readFileSync(join(rootDir, filePath), "utf8");
    return validateFeatureTestSource(filePath, source);
  });

export const formatHandbookTestViolations = (
  violations: HandbookTestViolation[],
): string =>
  violations
    .map(
      (violation) =>
        `${violation.filePath}:${violation.line} [${violation.rule}] ${violation.message}\n  ${violation.excerpt}`,
    )
    .join("\n\n");
