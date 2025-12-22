"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { ServiceType } from "src/contentful/getServices";
import { countiesToBoundaryLines } from "src/utils/countyUtils";
import { mergeFeaturesToSingleBoundary } from "src/utils/geometryUtils";
import {
  addServiceAreaLayers,
  calculateBoundsFromServiceAreas,
} from "src/utils/mapLayerUtils";
import {
  areBoundsValid,
  type GeoJSONFeatureCollection,
  hexToRgba,
} from "src/utils/mapUtils";
import {
  parseServicesToServiceAreas,
  type ServiceArea,
} from "src/utils/serviceAreaUtils";
import styles from "./AreasServiced.module.css";

const DEFAULT_CENTER: [number, number] = [-78, 39.5];
const DEFAULT_ZOOM = 9.0;
const DEFAULT_HEIGHT = "500px";
const FIT_BOUNDS_OPTIONS = {
  maxZoom: 10,
  padding: 5,
} as const;

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

const LegendItem = ({
  serviceArea,
}: {
  serviceArea: ServiceAreaWithGeoJSON;
}) => {
  const boxStyle = useMemo(
    () => ({
      backgroundColor: hexToRgba(serviceArea.color, 0.4),
      borderColor: serviceArea.color,
    }),
    [serviceArea.color],
  );

  return (
    <div className={styles.mapLegendItem}>
      <div className={styles.mapLegendBox} style={boxStyle} />
      <span className={styles.mapLegendLabel}>{serviceArea.serviceName}</span>
    </div>
  );
};

export const AreasServiced = (props: AreasServicedProps) => {
  const {
    services,
    className,
    height = DEFAULT_HEIGHT,
    center = DEFAULT_CENTER,
    zoom = DEFAULT_ZOOM,
    autoFitBounds = true,
  } = props;

  const mapboxAccessToken = process.env.MAPBOX_API_TOKEN;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceAreasWithGeoJSON, setServiceAreasWithGeoJSON] = useState<
    ServiceAreaWithGeoJSON[]
  >([]);

  useEffect(() => {
    let isCancelled = false;

    const loadAllData = async () => {
      setIsLoading(true);

      const serviceAreas = await parseServicesToServiceAreas(services);

      if (isCancelled) return;

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

      if (isCancelled) return;

      const validServiceAreas = serviceAreasWithGeoJSON.filter(
        (sa) => sa.geojson.features.length > 0,
      );

      setServiceAreasWithGeoJSON(validServiceAreas);
      setIsLoading(false);
    };

    loadAllData();

    return () => {
      isCancelled = true;
    };
  }, [services]);

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
      antialias: false,
      center,
      container: mapContainer.current,
      fadeDuration: 0,
      preserveDrawingBuffer: false,
      scrollZoom: false,
      style: "mapbox://styles/mapbox/dark-v11",
      zoom,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      try {
        for (const serviceArea of serviceAreasWithGeoJSON) {
          try {
            addServiceAreaLayers(map.current, serviceArea);
          } catch (layerError) {
            console.error(
              `[Map] Error adding layers for ${serviceArea.serviceName}:`,
              layerError,
            );
          }
        }

        const bounds = calculateBoundsFromServiceAreas(serviceAreasWithGeoJSON);
        if (autoFitBounds && bounds && areBoundsValid(bounds)) {
          try {
            map.current.fitBounds(bounds, {
              ...FIT_BOUNDS_OPTIONS,
              duration: 0,
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
    serviceAreasWithGeoJSON,
    autoFitBounds,
  ]);

  if (!mapboxAccessToken) {
    return (
      <div className={className}>
        <div className={styles.container}>
          <div className={styles.map} style={{ height }}>
            <p>
              Please set MAPBOX_API_TOKEN in your environment variables to use
              the map.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={styles.container}>
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
            <LegendItem
              key={serviceArea.serviceSlug}
              serviceArea={serviceArea}
            />
          ))}
        </div>
      )}
    </div>
  );
};
