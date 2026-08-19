import { describe, expect, it } from "@jest/globals";
import { pruneEmpty } from "src/lib/schema/prune";

describe("pruneEmpty", () => {
  it("removes null, undefined, and empty strings", () => {
    expect(pruneEmpty({ a: null, b: "", c: "value" })).toEqual({ c: "value" });
  });

  it("removes empty arrays and nested empty objects", () => {
    expect(pruneEmpty({ items: [], nested: { empty: "" }, ok: [1] })).toEqual({
      ok: [1],
    });
  });

  it("preserves meaningful falsy values", () => {
    expect(pruneEmpty({ count: 0, enabled: false })).toEqual({
      count: 0,
      enabled: false,
    });
  });
});
