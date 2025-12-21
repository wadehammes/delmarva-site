"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import clsx from "clsx";
import type { ServiceType } from "src/contentful/getServices";
import { countiesToBoundaryLines } from "src/utils/countyUtils";
import { mergeFeaturesToSingleBoundary } from "src/utils/geometryUtils";
import {
  areBoundsValid,
  extendBoundsFromFeature,
  type GeoJSONFeatureCollection,
  hexToRgba,
} from "src/utils/mapUtils";
import {
  parseServicesToServiceAreas,
  type ServiceArea,
} from "src/utils/serviceAreaUtils";
import styles from "./AreasServiced.module.css";

interface AreasServicedProps {
  services: ServiceType[];
  className?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  autoFitBounds?: boolean;
}

interface ServiceAreaWithGeoJSON extends ServiceArea {
  geojson: GeoJSONFeatureCollection;
}

/**
 * AreasServiced component that displays a Mapbox map with service area boundaries
 * for counties from CSV files stored in Contentful, with each service having its own color
 */
export const AreasServiced = (props: AreasServicedProps) => {
  const {
    services,
    className,
    height = "400px",
    center = [-78, 39.5], // Centered on mid-Atlantic region (PA, MD, VA, WV, DE)
    zoom = 8.6, // Zoomed in to show mid-Atlantic states clearly
    autoFitBounds = true,
  } = props;

  const mapboxAccessToken = process.env.MAPBOX_API_TOKEN;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceAreasWithGeoJSON, setServiceAreasWithGeoJSON] = useState<
    ServiceAreaWithGeoJSON[]
  >([]);

  // Parse services and fetch all county boundaries BEFORE initializing map
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);

      const serviceAreas = await parseServicesToServiceAreas(services);

      if (serviceAreas.length === 0) {
        setIsLoading(false);
        return;
      }

      const serviceAreasWithGeoJSON = await Promise.all(
        serviceAreas.map(async (serviceArea) => {
          const geojson = await countiesToBoundaryLines(serviceArea.counties);
          const mergedGeoJSON = mergeFeaturesToSingleBoundary(geojson.features);

          return {
            ...serviceArea,
            geojson: mergedGeoJSON,
          };
        }),
      );

      const validServiceAreas = serviceAreasWithGeoJSON.filter(
        (sa) => sa.geojson.features.length > 0,
      );

      setServiceAreasWithGeoJSON(validServiceAreas);
      setIsLoading(false);
    };

    loadAllData();
  }, [services]);

  // Initialize map only after all data is loaded
  useEffect(() => {
    if (
      !mapContainer.current ||
      map.current ||
      !mapboxAccessToken ||
      isLoading ||
      serviceAreasWithGeoJSON.length === 0
    ) {
      return;
    }

    mapboxgl.accessToken = mapboxAccessToken;

    map.current = new mapboxgl.Map({
      center,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      zoom,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      try {
        // Initialize bounds with a reasonable default (Mid-Atlantic region)
        const allBounds = new mapboxgl.LngLatBounds(
          [-85, 35], // Southwest (roughly western edge of service area)
          [-70, 42], // Northeast (roughly eastern edge of service area)
        );
        let hasBounds = false;

        // Add layers for each service area
        for (const serviceArea of serviceAreasWithGeoJSON) {
          const sourceId = `service-boundaries-${serviceArea.serviceSlug}`;
          const fillLayerId = `${sourceId}-fill`;
          const lineLayerId = `${sourceId}-lines`;

          try {
            // Type assertion: mapbox-gl accepts GeoJSON FeatureCollection
            // Our GeoJSONFeatureCollection is compatible but TypeScript needs explicit casting
            map.current.addSource(sourceId, {
              data: serviceArea.geojson as unknown as Parameters<
                mapboxgl.Map["addSource"]
              >[1] extends { data: infer D }
                ? D
                : never,
              type: "geojson",
            });

            map.current.addLayer({
              id: fillLayerId,
              paint: {
                "fill-color": serviceArea.color,
                "fill-opacity": 0.4,
              },
              source: sourceId,
              type: "fill",
            });

            map.current.addLayer({
              id: lineLayerId,
              paint: {
                "line-color": serviceArea.color,
                "line-opacity": 1,
                "line-width": 3,
              },
              source: sourceId,
              type: "line",
            });

            // Calculate bounds for this service area
            serviceArea.geojson.features.forEach((feature) => {
              if (extendBoundsFromFeature(feature, allBounds)) {
                hasBounds = true;
              }
            });
          } catch (layerError) {
            console.error(
              `[Map] Error adding layers for ${serviceArea.serviceName}:`,
              layerError,
            );
          }
        }

        if (autoFitBounds && hasBounds && areBoundsValid(allBounds)) {
          try {
            // Fit bounds with padding and max zoom to ensure we stay zoomed in
            map.current.fitBounds(allBounds, {
              maxZoom: 9.0, // Prevent zooming out too far
              padding: 20, // Reduced padding to allow more zoom in
            });
          } catch {
            // Silently ignore bounds fitting errors
          }
        }
      } catch (error) {
        console.error("[Map] Error adding boundary layers:", error);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [
    mapboxAccessToken,
    center,
    zoom,
    isLoading,
    serviceAreasWithGeoJSON.length,
    autoFitBounds,
  ]);

  if (!mapboxAccessToken) {
    return (
      <div className={clsx(styles.container, className)}>
        <div className={styles.map} style={{ height }}>
          <p>
            Please set MAPBOX_API_TOKEN in your environment variables to use the
            map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={clsx(styles.container, className)}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
            <p>Loading service areas...</p>
          </div>
        )}
        <div className={styles.map} ref={mapContainer} style={{ height }} />
      </div>
      {serviceAreasWithGeoJSON.length > 0 && (
        <div className={styles.mapLegend}>
          {serviceAreasWithGeoJSON.map((serviceArea) => (
            <div className={styles.mapLegendItem} key={serviceArea.serviceSlug}>
              <div
                className={styles.mapLegendBox}
                style={{
                  backgroundColor: hexToRgba(serviceArea.color, 0.4),
                  borderColor: serviceArea.color,
                }}
              />
              <span className={styles.mapLegendLabel}>
                {serviceArea.serviceName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
