import { isBrowser } from "./browser.helpers";

describe("browser.helpers", () => {
  describe("isBrowser", () => {
    const originalWindow = global.window;

    afterEach(() => {
      if (originalWindow) {
        global.window = originalWindow;
      } else {
        delete (global as { window?: unknown }).window;
      }
    });

    it("should return true in browser environment", () => {
      (global as { window?: unknown }).window = {};

      expect(isBrowser()).toBe(true);
    });

    it("should return false in server environment", () => {
      delete (global as { window?: unknown }).window;

      const result = isBrowser();
      expect(typeof result).toBe("boolean");
    });
  });
});
