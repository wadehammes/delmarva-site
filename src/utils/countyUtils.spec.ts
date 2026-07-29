import { beforeEach, describe, expect, it } from "@jest/globals";
import { MAX_COUNTIES_PER_REQUEST } from "src/utils/countyBoundaryLimits";
import { countiesToBoundaryLines } from "src/utils/countyUtils";

describe("countiesToBoundaryLines", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns an empty collection when no counties are provided", async () => {
    const result = await countiesToBoundaryLines([]);

    expect(result).toEqual({ features: [], type: "FeatureCollection" });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("chunks county requests to stay within the API limit", async () => {
    const counties = Array.from(
      { length: MAX_COUNTIES_PER_REQUEST + 25 },
      (_, index) => `County ${index}, MD`,
    );

    mockFetch.mockResolvedValue({
      json: async () => ({
        features: [{ geometry: {}, properties: {}, type: "Feature" }],
        type: "FeatureCollection",
      }),
      ok: true,
    } as Response);

    const result = await countiesToBoundaryLines(counties);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[0]?.[1]?.body).toBe(
      JSON.stringify({ counties: counties.slice(0, MAX_COUNTIES_PER_REQUEST) }),
    );
    expect(mockFetch.mock.calls[1]?.[1]?.body).toBe(
      JSON.stringify({ counties: counties.slice(MAX_COUNTIES_PER_REQUEST) }),
    );
    expect(result.features).toHaveLength(2);
  });

  it("merges features from successful batches and skips failed batches", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({
          features: [
            {
              geometry: {},
              properties: { county: "Anne Arundel County, MD" },
              type: "Feature",
            },
          ],
          type: "FeatureCollection",
        }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      } as Response);

    const counties = Array.from(
      { length: MAX_COUNTIES_PER_REQUEST + 1 },
      (_, index) => `County ${index}, MD`,
    );

    const result = await countiesToBoundaryLines(counties);

    expect(result.features).toHaveLength(1);
  });
});
