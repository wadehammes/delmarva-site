import { describe, expect, it } from "@jest/globals";
import {
  addCountyLookupAliases,
  isCanadianMapboxFeature,
  isUSMapboxFeature,
  normalizeCountyBatch,
  normalizeCountyNameForLookup,
  parseCountyInput,
  selectMapboxCountyFeature,
  stateFipsCodes,
} from "./countyBoundaryHelpers";

describe("countyBoundaryHelpers", () => {
  describe("normalizeCountyNameForLookup", () => {
    it("normalizes curly apostrophes in Prince George's County", () => {
      expect(normalizeCountyNameForLookup("Prince George\u2019s County")).toBe(
        "prince georges",
      );
    });

    it("normalizes straight apostrophes in Prince George's County", () => {
      expect(normalizeCountyNameForLookup("Prince George's County")).toBe(
        "prince georges",
      );
    });
  });

  describe("parseCountyInput", () => {
    it("parses Prince George's County, MD with a curly apostrophe", () => {
      expect(parseCountyInput("Prince George\u2019s County, MD")).toEqual({
        countyName: "Prince George's",
        stateAbbr: "MD",
        stateFips: "24",
      });
    });
  });

  describe("selectMapboxCountyFeature", () => {
    it("skips Canadian results when a US county is expected", () => {
      const feature = selectMapboxCountyFeature(
        [
          {
            center: [-122.749, 53.9171],
            context: [{ text: "British Columbia" }],
            geometry: { coordinates: [-122.749, 53.9171], type: "Point" },
            place_name: "Prince George, British Columbia, Canada",
          },
          {
            center: [-76.847, 38.829],
            context: [{ short_code: "US-MD", text: "Maryland" }],
            geometry: { coordinates: [-76.847, 38.829], type: "Point" },
            place_name: "Prince George's County, Maryland, United States",
          },
        ],
        "Prince George's County, MD",
        "MD",
      );

      expect(feature?.place_name).toContain("Maryland");
      expect(isCanadianMapboxFeature(feature ?? {})).toBe(false);
      expect(isUSMapboxFeature(feature ?? {}, "MD")).toBe(true);
    });
  });

  describe("addCountyLookupAliases", () => {
    it("adds a Prince George alias for Prince George's County", () => {
      const lookup = new Map();
      const feature = {
        geometry: {
          coordinates: [],
          type: "Polygon" as const,
        },
        type: "Feature" as const,
      };

      addCountyLookupAliases(lookup, "prince georges", "24", feature);

      expect(lookup.get("prince george,24")).toBe(feature);
    });
  });

  describe("stateFipsCodes", () => {
    it("maps MD to FIPS 24", () => {
      expect(stateFipsCodes.MD).toBe("24");
    });
  });

  describe("normalizeCountyBatch", () => {
    it("rejects batches over the limit", () => {
      const counties = Array.from(
        { length: 101 },
        (_, index) => `County ${index}, MD`,
      );

      expect(normalizeCountyBatch(counties)).toBeNull();
    });

    it("accepts valid county batches", () => {
      expect(
        normalizeCountyBatch([
          "Prince George's County, MD",
          "Anne Arundel County, MD",
        ]),
      ).toEqual(["Prince George's County, MD", "Anne Arundel County, MD"]);
    });
  });
});
