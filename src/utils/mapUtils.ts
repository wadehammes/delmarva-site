import type mapboxgl from "mapbox-gl";

// GeoJSON type definitions
export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties?: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

/**
 * Validates if a coordinate is valid (within world bounds and not NaN)
 */
export function isValidCoordinate(coord: unknown[]): coord is [number, number] {
  return (
    Array.isArray(coord) &&
    coord.length >= 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number" &&
    !Number.isNaN(coord[0]) &&
    !Number.isNaN(coord[1]) &&
    coord[0] >= -180 &&
    coord[0] <= 180 &&
    coord[1] >= -90 &&
    coord[1] <= 90
  );
}

/**
 * Extracts coordinates from a GeoJSON feature and extends bounds
 */
export function extendBoundsFromFeature(
  feature: GeoJSONFeature,
  bounds: mapboxgl.LngLatBounds,
): boolean {
  let hasValidBounds = false;

  try {
    if (feature.geometry.type === "Polygon") {
      const coords = feature.geometry.coordinates[0];
      if (coords && Array.isArray(coords)) {
        coords.forEach((coord) => {
          if (isValidCoordinate(coord)) {
            bounds.extend([coord[0], coord[1]]);
            hasValidBounds = true;
          }
        });
      }
    } else if (feature.geometry.type === "MultiPolygon") {
      const multiPolygonCoords = feature.geometry.coordinates as number[][][][];
      multiPolygonCoords.forEach((polygon: number[][][]) => {
        if (polygon && Array.isArray(polygon) && polygon[0]) {
          const outerRing = polygon[0];
          if (Array.isArray(outerRing)) {
            outerRing.forEach((coord) => {
              if (isValidCoordinate(coord)) {
                bounds.extend([coord[0], coord[1]]);
                hasValidBounds = true;
              }
            });
          }
        }
      });
    }
  } catch {
    // Silently ignore bounds calculation errors
  }

  return hasValidBounds;
}

/**
 * Validates if bounds are reasonable (within expected US bounds)
 */
export function areBoundsValid(bounds: mapboxgl.LngLatBounds): boolean {
  try {
    const boundsArray = bounds.toArray();
    const sw = boundsArray[0];
    const ne = boundsArray[1];

    return !!(
      sw &&
      ne &&
      sw[0] > -180 &&
      sw[0] < 0 &&
      sw[1] > 18 &&
      sw[1] < 72 &&
      ne[0] > -180 &&
      ne[0] < 0 &&
      ne[1] > 18 &&
      ne[1] < 72 &&
      ne[0] > sw[0] &&
      ne[1] > sw[1]
    );
  } catch {
    return false;
  }
}

/**
 * Converts hex color to rgba string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Type assertion helper for GeoJSON data to work with mapbox-gl
 */
export function asMapboxGeoJSON(
  geojson: GeoJSONFeatureCollection,
): Parameters<mapboxgl.Map["addSource"]>[1] extends { data: infer D }
  ? D
  : never {
  return geojson as unknown as Parameters<
    mapboxgl.Map["addSource"]
  >[1] extends {
    data: infer D;
  }
    ? D
    : never;
}
