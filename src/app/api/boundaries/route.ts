import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get("zipCode");

  if (!zipCode) {
    return NextResponse.json(
      { error: "Zip code is required" },
      { status: 400 },
    );
  }

  const mapboxToken = process.env.MAPBOX_API_TOKEN;

  if (!mapboxToken) {
    return NextResponse.json(
      { error: "Mapbox API token not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?types=postcode&access_token=${mapboxToken}`,
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
      const feature = data.features[0];
      let polygon: {
        type: "Polygon";
        coordinates: number[][][];
      };

      if (feature.geometry.type === "Polygon") {
        polygon = feature.geometry;
      } else if (feature.geometry.type === "MultiPolygon") {
        polygon = {
          coordinates: feature.geometry.coordinates[0],
          type: "Polygon",
        };
      } else if (feature.bbox) {
        const [west, south, east, north] = feature.bbox;
        const latRange = north - south;
        const lngRange = east - west;
        const latOffset = latRange * 0.2;
        const lngOffset = lngRange * 0.2;
        const centerLat = (north + south) / 2;
        const centerLng = (east + west) / 2;
        const points = [];
        const numPoints = 12;

        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * 2 * Math.PI;
          const radiusLat = latOffset * (0.8 + 0.4 * Math.random());
          const radiusLng = lngOffset * (0.8 + 0.4 * Math.random());
          const lat = centerLat + radiusLat * Math.cos(angle);
          const lng = centerLng + radiusLng * Math.sin(angle);
          points.push([lng, lat]);
        }

        points.push(points[0]);

        polygon = {
          coordinates: [points],
          type: "Polygon",
        };
      } else {
        const center = feature.center || [-75.5, 38.5];
        const latOffset = 0.02;
        const lngOffset = 0.025;

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
      }

      return NextResponse.json({
        features: [
          {
            geometry: polygon,
            properties: {
              name: feature.place_name || `ZIP Code ${zipCode}`,
              zipCode: zipCode,
            },
            type: "Feature",
          },
        ],
        type: "FeatureCollection",
      });
    }

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
