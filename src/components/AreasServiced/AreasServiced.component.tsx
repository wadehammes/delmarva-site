"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import clsx from "clsx";
import type { ServiceForMap } from "src/contentful/parseContentAreasServicedMap";
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
  services: ServiceForMap[];
  className?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  autoFitBounds?: boolean;
}

interface ServiceAreaWithGeoJSON extends ServiceArea {
  geojson: GeoJSONFeatureCollection;
}

function useServiceAreasData(services: ServiceForMap[]) {
  const [state, setState] = useState<{
    isLoading: boolean;
    serviceAreas: ServiceAreaWithGeoJSON[];
  }>({ isLoading: true, serviceAreas: [] });

  const servicesKey = useMemo(
    () =>
      services
        .map((s) => s.id)
        .sort()
        .join(","),
    [services],
  );

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      setState((s) => ({ ...s, isLoading: true }));

      const serviceAreas = await parseServicesToServiceAreas(services);
      if (isCancelled) return;

      if (serviceAreas.length === 0) {
        setState({ isLoading: false, serviceAreas: [] });
        return;
      }

      const withGeoJSON = await Promise.all(
        serviceAreas.map(async (sa) => {
          const geojson = await countiesToBoundaryLines(sa.counties);
          return {
            ...sa,
            geojson: mergeFeaturesToSingleBoundary(geojson.features),
          };
        }),
      );
      if (isCancelled) return;

      const valid = withGeoJSON.filter((sa) => sa.geojson.features.length > 0);
      setState({ isLoading: false, serviceAreas: valid });
    };

    load();
    return () => {
      isCancelled = true;
    };
  }, [servicesKey]);

  return state;
}

function setupMapNavigationAccessibility(map: mapboxgl.Map) {
  const navControl = new mapboxgl.NavigationControl();
  map.addControl(navControl, "top-right");
  const navEl = navControl._container;
  if (navEl) {
    const zoomIn = navEl.querySelector(".mapboxgl-ctrl-zoom-in");
    const zoomOut = navEl.querySelector(".mapboxgl-ctrl-zoom-out");
    const compass = navEl.querySelector(".mapboxgl-ctrl-compass");
    if (zoomIn) zoomIn.setAttribute("aria-label", "Zoom in");
    if (zoomOut) zoomOut.setAttribute("aria-label", "Zoom out");
    if (compass) compass.setAttribute("aria-label", "Reset north");
  }
}

function addLayersAndFitBounds(
  map: mapboxgl.Map,
  serviceAreas: ServiceAreaWithGeoJSON[],
  autoFitBounds: boolean,
) {
  for (const serviceArea of serviceAreas) {
    try {
      addServiceAreaLayers(map, serviceArea);
    } catch (layerError) {
      console.error(
        `[Map] Error adding layers for ${serviceArea.serviceName}:`,
        layerError,
      );
    }
  }

  const bounds = calculateBoundsFromServiceAreas(serviceAreas);
  if (autoFitBounds && bounds && areBoundsValid(bounds)) {
    try {
      map.fitBounds(bounds, { ...FIT_BOUNDS_OPTIONS, duration: 0 });
    } catch {
      // Silently ignore bounds fitting errors
    }
  }
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

  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { isLoading, serviceAreas } = useServiceAreasData(services);

  useEffect(() => {
    if (
      !mapContainer.current ||
      map.current ||
      !mapboxAccessToken ||
      isLoading ||
      serviceAreas.length === 0
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

      setupMapNavigationAccessibility(map.current);

      try {
        addLayersAndFitBounds(map.current, serviceAreas, autoFitBounds);
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
  }, [mapboxAccessToken, center, zoom, isLoading, serviceAreas, autoFitBounds]);

  if (!mapboxAccessToken) {
    return (
      <div className={clsx(styles.wrapper, className)}>
        <div className={styles.container}>
          <div className={styles.map} style={height ? { height } : undefined}>
            <p>
              Please set NEXT_PUBLIC_MAPBOX_API_TOKEN in your environment
              variables to use the map.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Service areas map"
      className={clsx(styles.wrapper, className)}
    >
      <div className={styles.container}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
            <p>Loading service areas...</p>
          </div>
        )}
        <div
          className={styles.map}
          ref={mapContainer}
          style={height ? { height } : undefined}
        />
      </div>
      {serviceAreas.length > 0 && (
        <div className={styles.mapLegend}>
          {serviceAreas.map((serviceArea) => (
            <LegendItem
              key={serviceArea.serviceSlug}
              serviceArea={serviceArea}
            />
          ))}
        </div>
      )}
    </section>
  );
};
