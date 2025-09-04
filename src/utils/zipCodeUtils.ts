/**
 * Utility functions for working with zip codes and geographic data
 */
export const getZipCodeBoundaryLines = async (
  zipCode: string,
): Promise<GeoJSON.FeatureCollection | null> => {
  try {
    const response = await fetch(`/api/boundaries?zipCode=${zipCode}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.error) {
      return null;
    }

    let features: GeoJSON.Feature[] = [];

    if (data.features && data.features.length > 0) {
      features = data.features;
    } else if (data.geometry) {
      features = [
        {
          geometry: data.geometry,
          properties: data.properties || {},
          type: "Feature",
        },
      ];
    } else {
      return null;
    }

    const featuresWithZipCode = features.map((feature: GeoJSON.Feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        zipCode,
      },
    }));

    return {
      features: featuresWithZipCode,
      type: "FeatureCollection",
    };
  } catch (_error) {
    return null;
  }
};

export const zipCodesToBoundaryLines = async (
  zipCodes: string[],
): Promise<GeoJSON.FeatureCollection> => {
  const features: GeoJSON.Feature[] = [];

  for (const zipCode of zipCodes) {
    try {
      const boundaryData = await getZipCodeBoundaryLines(zipCode);

      if (boundaryData?.features) {
        boundaryData.features.forEach((feature) => {
          features.push({
            ...feature,
            properties: {
              ...feature.properties,
              zipCode,
            },
          });
        });
      }
    } catch (_error) {
      // Silently handle errors
    }
  }

  return {
    features,
    type: "FeatureCollection",
  };
};

export interface ZipCodeBoundary {
  zipCode: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center: [number, number];
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

interface MapboxGeocodingResponse {
  features: Array<{
    geometry: {
      type: "Polygon" | "MultiPolygon";
      coordinates: number[][][] | number[][][][];
    };
    bbox: [number, number, number, number]; // [west, south, east, north]
    center: [number, number];
    properties: {
      short_code: string;
      place_name: string;
    };
  }>;
}

/**
 * Fetches zip code boundary data from Mapbox Geocoding API
 */
export const getZipCodeBoundary = async (
  zipCode: string,
): Promise<ZipCodeBoundary | null> => {
  const mapboxToken = process.env.MAPBOX_API_TOKEN;

  if (!mapboxToken) {
    console.error("MAPBOX_API_TOKEN is not set");
    return null;
  }

  try {
    // Mapbox geocoding API often returns Point data for zip codes
    // We'll fetch the data and create appropriate boundaries
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?types=postcode&access_token=${mapboxToken}`,
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch zip code ${zipCode}:`,
        response.statusText,
      );
      return null;
    }

    const data: MapboxGeocodingResponse = await response.json();

    if (data.features.length === 0) {
      console.warn(`No boundary data found for zip code ${zipCode}`);
      return null;
    }

    const feature = data.features[0];
    const bbox = feature.bbox;

    // Log the geometry type for debugging
    console.log(`Zip code ${zipCode}: ${feature.geometry.type} geometry`);

    // Convert MultiPolygon to Polygon if needed
    let coordinates: number[][][];
    if (feature.geometry.type === "MultiPolygon") {
      // Take the first polygon from MultiPolygon
      coordinates = feature.geometry.coordinates[0] as number[][][];
    } else if (feature.geometry.type === "Polygon") {
      coordinates = feature.geometry.coordinates as number[][][];
    } else if (feature.geometry.type === "Point") {
      // For Point geometry, create a rectangular area around the point
      // This is more realistic for zip code service areas
      console.warn(
        `Zip code ${zipCode} returned Point geometry, creating service area`,
      );
      const coords = feature.geometry.coordinates as unknown as [
        number,
        number,
      ];
      const [lng, lat] = coords;

      // Create a rectangular service area around the point
      // Typical zip code service area is roughly 2-5 miles radius
      const latOffset = 0.02; // ~1.2 miles
      const lngOffset = 0.025; // ~1.5 miles (adjusted for latitude)

      coordinates = [
        [
          [lng - lngOffset, lat - latOffset], // southwest
          [lng + lngOffset, lat - latOffset], // southeast
          [lng + lngOffset, lat + latOffset], // northeast
          [lng - lngOffset, lat + latOffset], // northwest
          [lng - lngOffset, lat - latOffset], // close the rectangle
        ],
      ];
    } else {
      // Fallback: create a simple bounding box if we don't have polygon data
      console.warn(
        `Unexpected geometry type for zip code ${zipCode}: ${feature.geometry.type}`,
      );
      coordinates = [
        [
          [bbox[0], bbox[1]], // southwest
          [bbox[2], bbox[1]], // southeast
          [bbox[2], bbox[3]], // northeast
          [bbox[0], bbox[3]], // northwest
          [bbox[0], bbox[1]], // close the polygon
        ],
      ];
    }

    return {
      bounds: {
        east: bbox[2],
        north: bbox[3],
        south: bbox[1],
        west: bbox[0],
      },
      center: feature.center,
      geometry: {
        coordinates,
        type: "Polygon",
      },
      zipCode,
    };
  } catch (error) {
    console.error(`Error fetching zip code ${zipCode}:`, error);
    return null;
  }
};

/**
 * Converts zip code boundaries to GeoJSON Polygon coordinates
 */
export const zipCodeBoundaryToGeoJSON = (boundary: ZipCodeBoundary) => {
  return boundary.geometry;
};

/**
 * Gets all zip code boundaries and converts them to GeoJSON features
 */
export const zipCodesToGeoJSONFeatures = async (zipCodes: string[]) => {
  const boundaryPromises = zipCodes.map(getZipCodeBoundary);
  const boundaries = await Promise.all(boundaryPromises);

  const features = boundaries
    .filter((boundary): boundary is ZipCodeBoundary => boundary !== null)
    .map((boundary) => ({
      geometry: zipCodeBoundaryToGeoJSON(boundary),
      properties: {
        zipCode: boundary.zipCode,
      },
      type: "Feature" as const,
    }));

  return {
    features,
    type: "FeatureCollection" as const,
  };
};

/**
 * Calculates the bounding box for multiple zip codes
 */
export const calculateBounds = async (
  zipCodes: string[],
): Promise<{
  north: number;
  south: number;
  east: number;
  west: number;
} | null> => {
  const boundaryPromises = zipCodes.map(getZipCodeBoundary);
  const boundaries = await Promise.all(boundaryPromises);

  const validBoundaries = boundaries.filter(
    (boundary): boundary is ZipCodeBoundary => boundary !== null,
  );

  if (validBoundaries.length === 0) return null;

  return {
    east: Math.max(...validBoundaries.map((b) => b.bounds.east)),
    north: Math.max(...validBoundaries.map((b) => b.bounds.north)),
    south: Math.min(...validBoundaries.map((b) => b.bounds.south)),
    west: Math.min(...validBoundaries.map((b) => b.bounds.west)),
  };
};

/**
 * Calculates the center point for multiple zip codes
 */
export const calculateCenter = async (
  zipCodes: string[],
): Promise<[number, number] | null> => {
  const bounds = await calculateBounds(zipCodes);
  if (!bounds) return null;

  return [(bounds.west + bounds.east) / 2, (bounds.south + bounds.north) / 2];
};
