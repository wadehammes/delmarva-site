import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const county = searchParams.get("county");

  if (!county) {
    return NextResponse.json({ error: "County is required" }, { status: 400 });
  }

  const mapboxToken = process.env.MAPBOX_API_TOKEN;

  if (!mapboxToken) {
    return NextResponse.json(
      { error: "Mapbox API token not configured" },
      { status: 500 },
    );
  }

  try {
    // Normalize county name for better API matching
    let normalizedCounty = county.trim();
    const originalCounty = normalizedCounty;

    // Handle special cases first
    if (
      normalizedCounty.includes("District of Columbia") ||
      normalizedCounty.includes("(DC)")
    ) {
      normalizedCounty = "Washington, DC";
    } else if (normalizedCounty.includes("Baltimore City, DC")) {
      // Baltimore City is in MD, not DC
      normalizedCounty = "Baltimore, MD";
    } else {
      // Most counties are already in "County Name, State" format from CSV
      // Just ensure they're properly formatted for Mapbox

      // Remove state abbreviation in parentheses if present (e.g., "County Name (VA)")
      const parenMatch = normalizedCounty.match(/^(.+?)\s*\(([A-Z]{2})\)$/);
      if (parenMatch) {
        const [, countyName, stateAbbr] = parenMatch;
        normalizedCounty = countyName.trim();
        // Add state if we don't already have it
        if (!normalizedCounty.includes(",")) {
          normalizedCounty = `${normalizedCounty}, ${stateAbbr}`;
        }
      }

      // If county already has state (comma present), preserve it
      if (normalizedCounty.includes(",")) {
        const parts = normalizedCounty.split(",");
        const countyPart = parts[0].trim();
        const statePart = parts.slice(1).join(",").trim(); // Handle cases with multiple commas

        // Ensure state is preserved
        if (!statePart) {
          console.warn(
            `[API] County "${originalCounty}" appears to have comma but no state part`,
          );
        }

        // Check if we need to add "County" suffix
        const countyLower = countyPart.toLowerCase();
        if (
          !countyLower.includes("county") &&
          !countyLower.includes("city") &&
          !countyLower.includes("parish")
        ) {
          // Add County suffix if it's not a city or parish
          normalizedCounty = statePart
            ? `${countyPart} County, ${statePart}`
            : `${countyPart} County`;
        } else {
          // Already has County, City, or Parish - preserve with state
          normalizedCounty = statePart
            ? `${countyPart}, ${statePart}`
            : countyPart;
        }
      } else {
        // No state info - add County suffix
        if (!normalizedCounty.toLowerCase().includes("county")) {
          normalizedCounty = `${normalizedCounty} County`;
        }
      }
    }

    console.log(
      `[API] Querying Mapbox for county: "${originalCounty}" -> normalized: "${normalizedCounty}"`,
    );

    // Use Mapbox Geocoding API - try without type restriction first for better results
    const encodedCounty = encodeURIComponent(normalizedCounty);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedCounty}.json?access_token=${mapboxToken}`,
      {
        headers: {
          "User-Agent": "Delmarva-Site/1.0",
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch boundary data: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      // Filter for county-level results (check if place_name contains "County")
      const countyFeatures = data.features.filter(
        (feature: {
          place_name?: string;
          properties?: {
            place_type?: string[];
          };
        }) => {
          const placeName = feature.place_name?.toLowerCase() || "";
          const placeTypes = feature.properties?.place_type || [];

          // Check if it's a county-level place
          return (
            placeName.includes("county") ||
            (placeTypes.includes("place") &&
              placeName.includes(county.toLowerCase()))
          );
        },
      );

      // Prefer county matches, but fall back to first result if none found
      const feature =
        countyFeatures.length > 0 ? countyFeatures[0] : data.features[0];

      console.log(
        `[API] Processing county "${county}": geometry type=${feature.geometry.type}, hasBbox=${!!feature.bbox}, place_name=${feature.place_name}`,
      );

      return formatCountyFeature(feature, county);
    }

    console.warn(`[API] No features found for county: ${county}`);

    return NextResponse.json({
      features: [],
      type: "FeatureCollection",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
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
) {
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
    // If we only have a bbox, create a polygon from it
    const [west, south, east, north] = feature.bbox;
    const bboxWidth = east - west;
    const bboxHeight = north - south;

    console.log(
      `[API] Creating polygon from bbox: ${west},${south} to ${east},${north} (width: ${bboxWidth}, height: ${bboxHeight})`,
    );

    polygon = {
      coordinates: [
        [
          [west, south], // southwest
          [east, south], // southeast
          [east, north], // northeast
          [west, north], // northwest
          [west, south], // close the polygon
        ],
      ],
      type: "Polygon",
    };
  } else if (feature.center) {
    // Fallback: create a simple bounding box around center point
    // Use larger offsets for counties (they're bigger than zip codes)
    const center = feature.center;
    const latOffset = 0.2; // ~12-15 miles
    const lngOffset = 0.25; // ~15-18 miles (adjusted for latitude)

    console.log(
      `[API] Creating polygon from center point: ${center[0]},${center[1]} with offsets lat=${latOffset}, lng=${lngOffset}`,
    );

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
    // Last resort: use default Delmarva area
    console.warn(
      `[API] No geometry, bbox, or center for county ${county}, using default area`,
    );
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

  return NextResponse.json({
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
  });
}
