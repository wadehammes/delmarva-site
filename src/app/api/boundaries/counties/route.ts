import { type NextRequest, NextResponse } from "next/server";

// URL for the counties GeoJSON data
const COUNTIES_GEOJSON_URL =
  "https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson";

// GeoJSON type definitions
interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon" | "Point";
    coordinates: number[][][] | number[][][][] | [number, number];
  };
  properties?: Record<string, unknown>;
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Shared state mappings for validation
const stateAbbreviations: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  DC: "DC",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

const stateFipsCodes: Record<string, string> = {
  AK: "02",
  AL: "01",
  AR: "05",
  AZ: "04",
  CA: "06",
  CO: "08",
  CT: "09",
  DC: "11",
  DE: "10",
  FL: "12",
  GA: "13",
  HI: "15",
  IA: "19",
  ID: "16",
  IL: "17",
  IN: "18",
  KS: "20",
  KY: "21",
  LA: "22",
  MA: "25",
  MD: "24",
  ME: "23",
  MI: "26",
  MN: "27",
  MO: "29",
  MS: "28",
  MT: "30",
  NC: "37",
  ND: "38",
  NE: "31",
  NH: "33",
  NJ: "34",
  NM: "35",
  NV: "32",
  NY: "36",
  OH: "39",
  OK: "40",
  OR: "41",
  PA: "42",
  RI: "44",
  SC: "45",
  SD: "46",
  TN: "47",
  TX: "48",
  UT: "49",
  VA: "51",
  VT: "50",
  WA: "53",
  WI: "55",
  WV: "54",
  WY: "56",
};

// Cache for GeoJSON data to avoid reading file on every request
let cachedUSFeatures: GeoJSONFeature[] | null = null;
let cachedCountyLookup: Map<string, GeoJSONFeature> | null = null;

/**
 * Loads and caches the GeoJSON data from the remote URL
 * Returns the filtered US features and a lookup map for fast county matching
 */
async function loadCountiesData(): Promise<{
  usFeatures: GeoJSONFeature[];
  lookup: Map<string, GeoJSONFeature>;
}> {
  // Return cached data if available
  if (cachedUSFeatures && cachedCountyLookup) {
    return {
      lookup: cachedCountyLookup,
      usFeatures: cachedUSFeatures,
    };
  }

  // Fetch and parse the GeoJSON data from URL
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

  // Filter to only US states
  const validUSFipsCodes = new Set(Object.values(stateFipsCodes));
  const usFeatures = countiesData.features.filter((feature) => {
    const props = (feature.properties || {}) as Record<string, unknown>;
    const featureStateFips = (props.STATEFP || "").toString();
    return validUSFipsCodes.has(featureStateFips);
  }) as GeoJSONFeature[];

  // Create a lookup map: "countyName,stateFips" -> feature
  const lookup = new Map<string, GeoJSONFeature>();
  usFeatures.forEach((feature) => {
    const props = (feature.properties || {}) as Record<string, unknown>;
    const featureName = (props.NAME || props.NAMELSAD || "").toString();
    const featureStateFips = (props.STATEFP || "").toString();

    // Normalize county name for lookup key
    const normalizedName = featureName
      .toLowerCase()
      .replace(/ county$/i, "")
      .replace(/['"]/g, "")
      .replace(/\./g, "")
      .trim();

    // Create lookup key: "countyname,statefips"
    const lookupKey = `${normalizedName},${featureStateFips}`;
    lookup.set(lookupKey, feature);

    // Also add variations for common name differences
    if (normalizedName.includes("prince george")) {
      lookup.set(`prince george,${featureStateFips}`, feature);
    }
    if (
      normalizedName.includes("st. mary") ||
      normalizedName.includes("st mary")
    ) {
      lookup.set(`st. mary's,${featureStateFips}`, feature);
      lookup.set(`st mary's,${featureStateFips}`, feature);
    }
    if (normalizedName.includes("queen anne")) {
      lookup.set(`queen anne's,${featureStateFips}`, feature);
    }
  });

  // Cache the results
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
    const { counties } = body;

    if (!counties || !Array.isArray(counties) || counties.length === 0) {
      return NextResponse.json(
        { error: "Counties array is required" },
        { status: 400 },
      );
    }

    // Process counties in parallel with a reasonable concurrency limit
    const BATCH_SIZE = 10;
    const allFeatures: GeoJSONFeature[] = [];

    for (let i = 0; i < counties.length; i += BATCH_SIZE) {
      const batch = counties.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (county: string) => {
        try {
          // Try local GeoJSON file first
          const localResult = await fetchCountyBoundaryFromLocalFile(county);
          if (localResult && localResult.features.length > 0) {
            return localResult;
          }
          // Only use Mapbox fallback if county has a valid US state
          const parts = county.split(",").map((s) => s.trim());
          if (parts.length >= 2) {
            const stateName = parts[1].trim();
            // Validate it's a US state before trying Mapbox
            const stateAbbr =
              stateName.length === 2
                ? stateName.toUpperCase()
                : stateAbbreviations[stateName] || stateName.toUpperCase();
            const stateFips = stateFipsCodes[stateAbbr];
            if (!stateFips) {
              console.warn(
                `[API] Skipping Mapbox fallback for "${county}": not a valid US state`,
              );
              return null;
            }
          }
          // Fallback to Mapbox if local file doesn't have the county
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

/**
 * Fetches county boundary from remote GeoJSON URL
 * Uses cached data for performance (fetches once, then uses in-memory cache)
 */
async function fetchCountyBoundaryFromLocalFile(
  county: string,
): Promise<GeoJSONFeatureCollection | null> {
  try {
    // Parse county name to extract state
    const parts = county.split(",").map((s) => s.trim());
    if (parts.length < 2) {
      return null;
    }

    let countyName = parts[0].replace(/ County$/, "").trim();
    const stateName = parts[1].trim();

    // Handle special cases
    if (countyName.includes("Prince George's")) {
      countyName = "Prince George";
    } else if (
      countyName.includes("St Mary's") ||
      countyName.includes("St. Mary's")
    ) {
      countyName = "St. Mary's";
    } else if (countyName.includes("Queen Anne's")) {
      countyName = "Queen Anne's";
    }

    // Use shared state mappings (defined at top of file)

    // Get state abbreviation
    const stateAbbr =
      stateName.length === 2
        ? stateName.toUpperCase()
        : stateAbbreviations[stateName] || stateName.toUpperCase();

    // Get state FIPS code for matching
    const stateFips = stateFipsCodes[stateAbbr] || "";

    // Validate: Only process US states (reject if stateFips is empty or not in our US list)
    if (!stateFips || !stateFipsCodes[stateAbbr]) {
      console.warn(
        `[API] Rejecting "${county}": "${stateName}" is not a valid US state`,
      );
      return null;
    }

    // Load cached GeoJSON data (reads file only once, then uses cache)
    const { lookup, usFeatures } = await loadCountiesData();

    // Normalize county name for lookup
    const normalizedCountyName = countyName
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/\./g, "")
      .trim();

    // Try direct lookup first (fastest: O(1))
    const lookupKey = `${normalizedCountyName},${stateFips}`;
    let matchingFeature = lookup.get(lookupKey);

    // If not found, try a more flexible search (fallback for edge cases)
    if (!matchingFeature) {
      matchingFeature = usFeatures.find((feature: GeoJSONFeature) => {
        const props = (feature.properties || {}) as Record<string, unknown>;
        const featureName = (props.NAME || props.NAMELSAD || "").toString();
        const featureStateFips = (props.STATEFP || "").toString();

        // Must match state FIPS exactly
        if (featureStateFips !== stateFips) {
          return false;
        }

        // Normalize feature name for comparison
        const normalizedFeatureName = featureName
          .toLowerCase()
          .replace(/ county$/i, "")
          .replace(/['"]/g, "")
          .replace(/\./g, "")
          .trim();

        // Check for name match
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
    // File might not exist yet, or parsing error
    console.warn(
      `[API] Error reading local counties file for ${county}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Fetches county boundary from Mapbox Geocoding API
 * Note: Mapbox often returns Point geometries or bboxes, which we convert to polygons
 * For actual detailed boundaries, a different data source would be needed
 */
async function fetchCountyBoundary(
  county: string,
  mapboxToken: string,
): Promise<GeoJSONFeatureCollection | null> {
  // Normalize county name (same logic as single county endpoint)
  let normalizedCounty = county.trim();
  const originalCounty = normalizedCounty;

  // Handle special cases
  if (
    normalizedCounty.includes("District of Columbia") ||
    normalizedCounty.includes("(DC)")
  ) {
    normalizedCounty = "Washington, DC";
  } else if (normalizedCounty.includes("Baltimore City, DC")) {
    normalizedCounty = "Baltimore, MD";
  } else {
    // Remove state abbreviation in parentheses if present
    const parenMatch = normalizedCounty.match(/^(.+?)\s*\(([A-Z]{2})\)$/);
    if (parenMatch) {
      const [, countyName, stateAbbr] = parenMatch;
      normalizedCounty = countyName.trim();
      if (!normalizedCounty.includes(",")) {
        normalizedCounty = `${normalizedCounty}, ${stateAbbr}`;
      }
    }

    // Ensure "County" suffix is present if needed
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
    } else {
      if (!normalizedCounty.toLowerCase().includes("county")) {
        normalizedCounty = `${normalizedCounty} County`;
      }
    }
  }

  try {
    const encodedCounty = encodeURIComponent(normalizedCounty);
    // Try with types=place first to get better boundary data
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedCounty}.json?types=place&access_token=${mapboxToken}`,
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
      // Filter for county-level features
      const countyFeatures = data.features.filter(
        (feature: {
          place_name?: string;
          properties?: {
            place_type?: string[];
          };
          geometry?: {
            type?: string;
          };
        }) => {
          const placeName = feature.place_name?.toLowerCase() || "";
          const placeTypes = feature.properties?.place_type || [];
          const geometryType = feature.geometry?.type;

          // Prefer features with actual polygon geometry
          const hasPolygonGeometry =
            geometryType === "Polygon" || geometryType === "MultiPolygon";

          return (
            (placeName.includes("county") || placeTypes.includes("place")) &&
            (hasPolygonGeometry || placeName.includes(county.toLowerCase()))
          );
        },
      );

      // Sort: prefer Polygon/MultiPolygon over Point/bbox
      const sortedFeatures = countyFeatures.sort(
        (
          a: {
            geometry?: {
              type?: string;
            };
          },
          b: {
            geometry?: {
              type?: string;
            };
          },
        ) => {
          const aType = a.geometry?.type;
          const bType = b.geometry?.type;
          const aHasPolygon = aType === "Polygon" || aType === "MultiPolygon";
          const bHasPolygon = bType === "Polygon" || bType === "MultiPolygon";

          if (aHasPolygon && !bHasPolygon) return -1;
          if (!aHasPolygon && bHasPolygon) return 1;
          return 0;
        },
      );

      const feature =
        sortedFeatures.length > 0 ? sortedFeatures[0] : data.features[0];

      // Validate that the result is in the US before returning
      const placeName = feature.place_name?.toLowerCase() || "";
      const context =
        (feature as { context?: Array<{ text?: string; short_code?: string }> })
          .context || [];

      // Explicitly reject Canadian locations
      const canadianProvinces = [
        "alberta",
        "british columbia",
        "manitoba",
        "new brunswick",
        "newfoundland",
        "northwest territories",
        "nova scotia",
        "nunavut",
        "ontario",
        "prince edward island",
        "quebec",
        "saskatchewan",
        "yukon",
      ];
      const isCanadian =
        placeName.includes(", canada") ||
        placeName.includes("canada,") ||
        context.some((ctx) =>
          canadianProvinces.some((province) =>
            ctx.text?.toLowerCase().includes(province),
          ),
        );

      if (isCanadian) {
        console.warn(
          `[API] Rejecting Mapbox result for "${originalCounty}": Canadian location (place_name: ${feature.place_name})`,
        );
        return null;
      }

      // Check if place_name or context contains a US state
      const hasUSState = Object.keys(stateFipsCodes).some((stateAbbr) => {
        const stateLower = stateAbbr.toLowerCase();
        return (
          placeName.includes(`, ${stateLower}`) ||
          placeName.includes(`, ${stateLower},`) ||
          placeName.includes(`, ${stateLower} `) ||
          context.some(
            (ctx) =>
              ctx.short_code?.toUpperCase() === stateAbbr ||
              ctx.text?.toLowerCase().includes(stateLower),
          )
        );
      });

      // Check if coordinates are in US bounds (strict check, excluding Canada)
      const coords =
        feature.geometry?.type === "Point"
          ? (feature.geometry.coordinates as [number, number])
          : feature.center;
      // US bounds: longitude -125 to -66, latitude 25 to 49
      // Exclude Canada which is north of 49°N and west of -66°W
      const isInUSBounds =
        coords &&
        coords[0] >= -125 &&
        coords[0] <= -66 && // Longitude: US west to east coast
        coords[1] >= 25 &&
        coords[1] <= 49; // Latitude: US southern to northern border

      if (!hasUSState && !isInUSBounds) {
        console.warn(
          `[API] Rejecting Mapbox result for "${originalCounty}": not in US (place_name: ${feature.place_name}, coords: ${coords})`,
        );
        return null;
      }

      return formatCountyFeature(feature, originalCounty);
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
