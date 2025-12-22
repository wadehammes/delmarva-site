import type { GeoJSONFeature, GeoJSONFeatureCollection } from "./mapUtils";

/**
 * Merges multiple GeoJSON features into a single boundary polygon
 * Uses the actual outer edges of the polygons to respect boundaries
 */
export function mergeFeaturesToSingleBoundary(
  features: GeoJSONFeature[],
): GeoJSONFeatureCollection {
  if (features.length === 0) {
    return {
      features: [],
      type: "FeatureCollection",
    };
  }

  // If only one feature, return it as-is (no merging needed)
  if (features.length === 1) {
    return {
      features: [features[0]],
      type: "FeatureCollection",
    };
  }

  // Instead of merging, return all features as a MultiPolygon
  // This preserves the actual county boundaries without extending beyond them
  // MultiPolygon structure: coordinates is array of polygons, each polygon is array of rings
  // Polygon: coordinates = [[[lng, lat], ...]] (array of rings)
  // MultiPolygon: coordinates = [[[[lng, lat], ...]], [[[lng, lat], ...]]] (array of polygons)
  const polygons: [number, number][][][] = [];

  features.forEach((feature) => {
    if (feature.geometry.type === "Polygon") {
      // Polygon coordinates is already [[[lng, lat], ...]] - perfect for MultiPolygon
      // Type assertion: GeoJSON Polygon coordinates are guaranteed to be [lng, lat] tuples
      polygons.push(feature.geometry.coordinates as [number, number][][]);
    } else if (feature.geometry.type === "MultiPolygon") {
      // MultiPolygon coordinates is [[[[lng, lat], ...]], ...] - add each polygon
      const multiPolygonCoords = feature.geometry.coordinates as number[][][][];
      multiPolygonCoords.forEach((polygon: number[][][]) => {
        // Type assertion: GeoJSON MultiPolygon coordinates are guaranteed to be [lng, lat] tuples
        polygons.push(polygon as [number, number][][]);
      });
    }
  });

  if (polygons.length === 0) {
    return {
      features: [],
      type: "FeatureCollection",
    };
  }

  // If only one polygon, return it as a single Polygon feature
  if (polygons.length === 1) {
    const mergedFeature: GeoJSONFeature = {
      geometry: {
        coordinates: polygons[0],
        type: "Polygon",
      },
      properties: {
        featureCount: features.length,
        merged: true,
      },
      type: "Feature",
    };
    return {
      features: [mergedFeature],
      type: "FeatureCollection",
    };
  }

  // For multiple polygons, create a MultiPolygon
  // MultiPolygon coordinates: [[[[lng, lat], ...]], [[[lng, lat], ...]], ...]
  const mergedFeature: GeoJSONFeature = {
    geometry: {
      coordinates: polygons,
      type: "MultiPolygon",
    },
    properties: {
      featureCount: features.length,
      merged: true,
    },
    type: "Feature",
  };

  return {
    features: [mergedFeature],
    type: "FeatureCollection",
  };
}
