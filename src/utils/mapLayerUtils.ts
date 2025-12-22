import mapboxgl from "mapbox-gl";
import type { GeoJSONFeatureCollection } from "./mapUtils";
import { asMapboxGeoJSON, extendBoundsFromFeature } from "./mapUtils";

export interface ServiceAreaLayer {
  serviceSlug: string;
  serviceName: string;
  color: string;
  geojson: GeoJSONFeatureCollection;
}

const FILL_OPACITY = 0.4;
const LINE_WIDTH = 3;
const LINE_OPACITY = 1;

/**
 * Adds map layers for a service area (source, fill layer, and line layer)
 */
export function addServiceAreaLayers(
  map: mapboxgl.Map,
  serviceArea: ServiceAreaLayer,
): void {
  const sourceId = `service-boundaries-${serviceArea.serviceSlug}`;
  const fillLayerId = `${sourceId}-fill`;
  const lineLayerId = `${sourceId}-lines`;

  map.addSource(sourceId, {
    data: asMapboxGeoJSON(serviceArea.geojson),
    type: "geojson",
  });

  map.addLayer({
    id: fillLayerId,
    paint: {
      "fill-color": serviceArea.color,
      "fill-opacity": FILL_OPACITY,
    },
    source: sourceId,
    type: "fill",
  });

  map.addLayer({
    id: lineLayerId,
    paint: {
      "line-color": serviceArea.color,
      "line-opacity": LINE_OPACITY,
      "line-width": LINE_WIDTH,
    },
    source: sourceId,
    type: "line",
  });
}

/**
 * Calculates bounds from service area features
 */
export function calculateBoundsFromServiceAreas(
  serviceAreas: ServiceAreaLayer[],
): mapboxgl.LngLatBounds | null {
  const bounds = new mapboxgl.LngLatBounds([-85, 35], [-70, 42]);
  let hasBounds = false;

  for (const serviceArea of serviceAreas) {
    serviceArea.geojson.features.forEach((feature) => {
      if (extendBoundsFromFeature(feature, bounds)) {
        hasBounds = true;
      }
    });
  }

  return hasBounds ? bounds : null;
}
