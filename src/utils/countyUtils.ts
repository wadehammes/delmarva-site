import { MAX_COUNTIES_PER_REQUEST } from "src/utils/countyBoundaryLimits";
import type { GeoJSONFeature, GeoJSONFeatureCollection } from "./mapUtils";

async function fetchCountyBatch(counties: string[]): Promise<GeoJSONFeature[]> {
  const response = await fetch("/api/boundaries/counties", {
    body: JSON.stringify({ counties }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    console.warn(`[CountyUtils] Batch request failed: ${response.statusText}`);
    return [];
  }

  const data = (await response.json()) as GeoJSONFeatureCollection;
  return data.features ?? [];
}

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
    const allFeatures: GeoJSONFeature[] = [];

    for (let i = 0; i < counties.length; i += MAX_COUNTIES_PER_REQUEST) {
      const batch = counties.slice(i, i + MAX_COUNTIES_PER_REQUEST);
      const features = await fetchCountyBatch(batch);
      allFeatures.push(...features);
    }

    return {
      features: allFeatures,
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
