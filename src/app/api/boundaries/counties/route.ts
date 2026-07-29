import { type NextRequest, NextResponse } from "next/server";
import {
  addCountyLookupAliases,
  normalizeApostrophes,
  normalizeCountyBatch,
  normalizeCountyNameForLookup,
  parseCountyInput,
  selectMapboxCountyFeature,
  stateFipsCodes,
} from "../countyBoundaryHelpers";
import type {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
} from "../countyBoundaryTypes";

const COUNTIES_GEOJSON_URL =
  "https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson";

let cachedUSFeatures: GeoJSONFeature[] | null = null;
let cachedCountyLookup: Map<string, GeoJSONFeature> | null = null;

async function loadCountiesData(): Promise<{
  usFeatures: GeoJSONFeature[];
  lookup: Map<string, GeoJSONFeature>;
}> {
  if (cachedUSFeatures && cachedCountyLookup) {
    return {
      lookup: cachedCountyLookup,
      usFeatures: cachedUSFeatures,
    };
  }

  const response = await fetch(COUNTIES_GEOJSON_URL, {
    headers: {
      "User-Agent": "Delmarva-Site/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch counties GeoJSON: ${response.status} ${response.statusText}`,
    );
  }

  const countiesData = (await response.json()) as GeoJSONFeatureCollection;

  if (!countiesData.features || !Array.isArray(countiesData.features)) {
    throw new Error("Invalid GeoJSON file structure");
  }

  const validUSFipsCodes = new Set(Object.values(stateFipsCodes));
  const usFeatures = countiesData.features.filter((feature) => {
    const props = (feature.properties || {}) as Record<string, unknown>;
    const featureStateFips = (props.STATEFP || "").toString();
    return validUSFipsCodes.has(featureStateFips);
  }) as GeoJSONFeature[];

  const lookup = new Map<string, GeoJSONFeature>();
  usFeatures.forEach((feature) => {
    const props = (feature.properties || {}) as Record<string, unknown>;
    const featureName = (props.NAME || props.NAMELSAD || "").toString();
    const featureStateFips = (props.STATEFP || "").toString();
    const normalizedName = normalizeCountyNameForLookup(featureName);
    const lookupKey = `${normalizedName},${featureStateFips}`;

    lookup.set(lookupKey, feature);
    addCountyLookupAliases(lookup, normalizedName, featureStateFips, feature);
  });

  cachedUSFeatures = usFeatures;
  cachedCountyLookup = lookup;

  console.log(
    `[API] Loaded and cached GeoJSON: ${countiesData.features.length} total features, ${usFeatures.length} US features, ${lookup.size} lookup entries`,
  );

  return { lookup, usFeatures };
}

export async function POST(request: NextRequest) {
  const mapboxToken = process.env.MAPBOX_API_TOKEN;

  if (!mapboxToken) {
    return NextResponse.json(
      { error: "Mapbox API token not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const counties = normalizeCountyBatch(body.counties);

    if (!counties) {
      return NextResponse.json(
        { error: "Counties array is required" },
        { status: 400 },
      );
    }

    const BATCH_SIZE = 10;
    const allFeatures: GeoJSONFeature[] = [];

    for (let i = 0; i < counties.length; i += BATCH_SIZE) {
      const batch = counties.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (county: string) => {
        try {
          const localResult = await fetchCountyBoundaryFromLocalFile(county);
          if (localResult && localResult.features.length > 0) {
            return localResult;
          }

          const parsedCounty = parseCountyInput(county);
          if (!parsedCounty) {
            console.warn(
              `[API] Skipping Mapbox fallback for "${county}": not a valid US state`,
            );
            return null;
          }

          return await fetchCountyBoundary(county, mapboxToken);
        } catch (error) {
          console.error(`Error fetching county ${county}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(
        (result: GeoJSONFeatureCollection | null, _index: number) => {
          if (result?.features) {
            allFeatures.push(...result.features);
          }
        },
      );
    }

    console.log(
      `[API] Batch endpoint: processed ${counties.length} counties, returning ${allFeatures.length} features`,
    );

    return NextResponse.json({
      features: allFeatures,
      type: "FeatureCollection",
    });
  } catch (error) {
    console.error("Error in batch counties endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function fetchCountyBoundaryFromLocalFile(
  county: string,
): Promise<GeoJSONFeatureCollection | null> {
  try {
    const parsedCounty = parseCountyInput(county);
    if (!parsedCounty) {
      return null;
    }

    const { countyName, stateFips } = parsedCounty;
    const { lookup, usFeatures } = await loadCountiesData();
    const normalizedCountyName = normalizeCountyNameForLookup(countyName);
    const lookupKey = `${normalizedCountyName},${stateFips}`;
    let matchingFeature = lookup.get(lookupKey);

    if (!matchingFeature) {
      matchingFeature = usFeatures.find((feature: GeoJSONFeature) => {
        const props = (feature.properties || {}) as Record<string, unknown>;
        const featureName = (props.NAME || props.NAMELSAD || "").toString();
        const featureStateFips = (props.STATEFP || "").toString();

        if (featureStateFips !== stateFips) {
          return false;
        }

        const normalizedFeatureName = normalizeCountyNameForLookup(featureName);

        return (
          normalizedFeatureName === normalizedCountyName ||
          (normalizedFeatureName.includes(normalizedCountyName) &&
            normalizedCountyName.length > 3) ||
          (normalizedCountyName.includes(normalizedFeatureName) &&
            normalizedFeatureName.length > 3)
        );
      });
    }

    if (matchingFeature) {
      return {
        features: [matchingFeature],
        type: "FeatureCollection",
      };
    }

    return null;
  } catch (error) {
    console.warn(
      `[API] Error reading local counties file for ${county}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

async function fetchCountyBoundary(
  county: string,
  mapboxToken: string,
): Promise<GeoJSONFeatureCollection | null> {
  let normalizedCounty = normalizeApostrophes(county.trim());
  const originalCounty = normalizedCounty;
  const parsedCounty = parseCountyInput(originalCounty);

  if (
    normalizedCounty.includes("District of Columbia") ||
    normalizedCounty.includes("(DC)")
  ) {
    normalizedCounty = "Washington, DC";
  } else if (normalizedCounty.includes("Baltimore City, DC")) {
    normalizedCounty = "Baltimore, MD";
  } else {
    const parenMatch = normalizedCounty.match(/^(.+?)\s*\(([A-Z]{2})\)$/);
    if (parenMatch) {
      const [, countyName, stateAbbr] = parenMatch;
      normalizedCounty = countyName.trim();
      if (!normalizedCounty.includes(",")) {
        normalizedCounty = `${normalizedCounty}, ${stateAbbr}`;
      }
    }

    if (normalizedCounty.includes(",")) {
      const parts = normalizedCounty.split(",");
      const countyPart = parts[0].trim();
      const statePart = parts.slice(1).join(",").trim();
      const countyLower = countyPart.toLowerCase();

      if (
        !countyLower.includes("county") &&
        !countyLower.includes("city") &&
        !countyLower.includes("parish")
      ) {
        normalizedCounty = statePart
          ? `${countyPart} County, ${statePart}`
          : `${countyPart} County`;
      } else {
        normalizedCounty = statePart
          ? `${countyPart}, ${statePart}`
          : countyPart;
      }
    } else if (!normalizedCounty.toLowerCase().includes("county")) {
      normalizedCounty = `${normalizedCounty} County`;
    }
  }

  try {
    const encodedCounty = encodeURIComponent(normalizedCounty);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedCounty}.json?types=place&country=US&access_token=${mapboxToken}`,
      {
        headers: {
          "User-Agent": "Delmarva-Site/1.0",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = selectMapboxCountyFeature(
        data.features,
        originalCounty,
        parsedCounty?.stateAbbr,
      );

      if (!feature) {
        console.warn(
          `[API] Rejecting Mapbox results for "${originalCounty}": no valid US match found`,
        );
        return null;
      }

      return formatCountyFeature(
        feature as Parameters<typeof formatCountyFeature>[0],
        originalCounty,
      );
    }

    return null;
  } catch {
    return null;
  }
}

function formatCountyFeature(
  feature: {
    geometry: {
      type: "Polygon" | "MultiPolygon" | "Point";
      coordinates: number[][][] | number[][][][] | [number, number];
    };
    bbox?: [number, number, number, number];
    center?: [number, number];
    place_name?: string;
  },
  county: string,
): GeoJSONFeatureCollection {
  let polygon: {
    type: "Polygon";
    coordinates: number[][][];
  };

  if (feature.geometry.type === "Polygon") {
    polygon = feature.geometry as {
      type: "Polygon";
      coordinates: number[][][];
    };
  } else if (feature.geometry.type === "MultiPolygon") {
    polygon = {
      coordinates: (feature.geometry.coordinates as number[][][][])[0],
      type: "Polygon",
    };
  } else if (feature.bbox) {
    const [west, south, east, north] = feature.bbox;
    polygon = {
      coordinates: [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south],
        ],
      ],
      type: "Polygon",
    };
  } else if (feature.center) {
    const center = feature.center;
    const latOffset = 0.2;
    const lngOffset = 0.25;

    polygon = {
      coordinates: [
        [
          [center[0] - lngOffset, center[1] - latOffset],
          [center[0] + lngOffset, center[1] - latOffset],
          [center[0] + lngOffset, center[1] + latOffset],
          [center[0] - lngOffset, center[1] + latOffset],
          [center[0] - lngOffset, center[1] - latOffset],
        ],
      ],
      type: "Polygon",
    };
  } else {
    const defaultCenter: [number, number] = [-75.5, 38.5];
    const latOffset = 0.2;
    const lngOffset = 0.25;

    polygon = {
      coordinates: [
        [
          [defaultCenter[0] - lngOffset, defaultCenter[1] - latOffset],
          [defaultCenter[0] + lngOffset, defaultCenter[1] - latOffset],
          [defaultCenter[0] + lngOffset, defaultCenter[1] + latOffset],
          [defaultCenter[0] - lngOffset, defaultCenter[1] + latOffset],
          [defaultCenter[0] - lngOffset, defaultCenter[1] - latOffset],
        ],
      ],
      type: "Polygon",
    };
  }

  return {
    features: [
      {
        geometry: polygon,
        properties: {
          county,
          name: feature.place_name || county,
        },
        type: "Feature",
      },
    ],
    type: "FeatureCollection",
  };
}
