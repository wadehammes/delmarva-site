import { kebabCase, replaceNbsp } from "./string.helpers";

describe("string.helpers", () => {
  describe("kebabCase", () => {
    it("should convert camelCase to kebab-case", () => {
      expect(kebabCase("camelCase")).toBe("camel-case");
      expect(kebabCase("thisIsACamelCaseString")).toBe(
        "this-is-acamel-case-string",
      );
    });

    it("should convert PascalCase to kebab-case", () => {
      expect(kebabCase("PascalCase")).toBe("pascal-case");
      expect(kebabCase("ThisIsAPascalCaseString")).toBe(
        "this-is-apascal-case-string",
      );
    });

    it("should convert spaces to hyphens", () => {
      expect(kebabCase("space separated")).toBe("space-separated");
      expect(kebabCase("multiple   spaces")).toBe("multiple-spaces");
    });

    it("should convert underscores to hyphens", () => {
      expect(kebabCase("underscore_separated")).toBe("underscore-separated");
      expect(kebabCase("multiple___underscores")).toBe("multiple-underscores");
    });

    it("should convert mixed separators", () => {
      expect(kebabCase("mixed separators_andCamelCase")).toBe(
        "mixed-separators-and-camel-case",
      );
      expect(kebabCase("PascalCase with spaces_and_underscores")).toBe(
        "pascal-case-with-spaces-and-underscores",
      );
    });

    it("should handle empty string", () => {
      expect(kebabCase("")).toBe("");
    });

    it("should handle single word", () => {
      expect(kebabCase("word")).toBe("word");
      expect(kebabCase("Word")).toBe("word");
    });

    it("should handle numbers", () => {
      expect(kebabCase("test123")).toBe("test123");
      expect(kebabCase("123test")).toBe("123test");
      expect(kebabCase("test123Case")).toBe("test123case");
    });
  });

  describe("replaceNbsp", () => {
    it("should replace non-breaking spaces with regular spaces", () => {
      expect(replaceNbsp("Hello\u00a0World")).toBe("Hello World");
      expect(replaceNbsp("Multiple\u00a0\u00a0spaces")).toBe(
        "Multiple  spaces",
      );
    });

    it("should replace line separators", () => {
      expect(replaceNbsp("Line1\u2028Line2")).toBe("Line1Line2");
      expect(replaceNbsp("Text\u2028with\u2028separators")).toBe(
        "Textwithseparators",
      );
    });

    it("should handle both nbsp and line separators", () => {
      expect(replaceNbsp("Hello\u00a0World\u2028Test")).toBe("Hello WorldTest");
    });

    it("should return empty string for empty input", () => {
      expect(replaceNbsp("")).toBe("");
      expect(replaceNbsp(null as unknown as string)).toBe("");
      expect(replaceNbsp(undefined as unknown as string)).toBe("");
    });

    it("should return string unchanged if no special characters", () => {
      expect(replaceNbsp("Normal text")).toBe("Normal text");
      expect(replaceNbsp("123")).toBe("123");
    });
  });
});
