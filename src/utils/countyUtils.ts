import type { GeoJSONFeatureCollection } from "./mapUtils";

/**
 * Utility functions for working with counties and geographic data
 */
export const countiesToBoundaryLines = async (
  counties: string[],
): Promise<GeoJSONFeatureCollection> => {
  if (counties.length === 0) {
    return {
      features: [],
      type: "FeatureCollection",
    };
  }

  try {
    // Use batch endpoint to fetch all counties in one request
    const response = await fetch("/api/boundaries/counties", {
      body: JSON.stringify({ counties }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      console.warn(
        `[CountyUtils] Batch request failed: ${response.statusText}`,
      );
      return {
        features: [],
        type: "FeatureCollection",
      };
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return {
        features: data.features,
        type: "FeatureCollection",
      };
    }

    return {
      features: [],
      type: "FeatureCollection",
    };
  } catch (error) {
    console.error("[CountyUtils] Error in batch fetch:", error);
    return {
      features: [],
      type: "FeatureCollection",
    };
  }
};
