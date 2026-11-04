import { describe, expect, it } from "@jest/globals";
import { isBrowser } from "./browser.helpers";

describe("browser.helpers", () => {
  describe("isBrowser", () => {
    it("returns true when window is defined", () => {
      expect(isBrowser()).toBe(true);
    });
  });
});
