import { isReactNodeEmptyArray } from "./react.helpers";

describe("react.helpers", () => {
  describe("isReactNodeEmptyArray", () => {
    it("should return true for empty array", () => {
      expect(isReactNodeEmptyArray([])).toBe(true);
    });

    it("should return false for non-empty array", () => {
      expect(isReactNodeEmptyArray([1, 2, 3])).toBe(false);
      expect(isReactNodeEmptyArray(["test"])).toBe(false);
      expect(isReactNodeEmptyArray([null])).toBe(false);
    });

    it("should return false for non-array values", () => {
      expect(isReactNodeEmptyArray("string")).toBe(false);
      expect(isReactNodeEmptyArray(123)).toBe(false);
      expect(isReactNodeEmptyArray(null)).toBe(false);
      expect(isReactNodeEmptyArray(undefined)).toBe(false);
      expect(isReactNodeEmptyArray("test")).toBe(false);
    });
  });
});
