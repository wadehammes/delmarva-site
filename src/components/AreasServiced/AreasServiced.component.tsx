"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import clsx from "clsx";
import {
  zipCodesToBoundaryLines,
  zipCodesToGeoJSONFeatures,
} from "src/utils/zipCodeUtils";
import styles from "./AreasServiced.module.css";

interface AreasServicedProps {
  zipCodes: string[];
  className?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  autoFitBounds?: boolean;
}

/**
 * AreasServiced component that displays a Mapbox map with service area tiles
 * for the provided zip codes using the Delmarva red brand color
 */
export const AreasServiced = (props: AreasServicedProps) => {
  const {
    zipCodes,
    className,
    height = "400px",
    center = [-75.5, 38.5],
    zoom = 5,
    autoFitBounds = true,
  } = props;

  const mapboxAccessToken = process.env.MAPBOX_API_TOKEN;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxAccessToken) return;

    mapboxgl.accessToken = mapboxAccessToken;

    map.current = new mapboxgl.Map({
      center,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      zoom,
    });

    map.current.on("idle", () => {
      setIsMapReady(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxAccessToken, center, zoom]);

  useEffect(() => {
    if (!map.current || !isMapReady || zipCodes.length === 0) return;

    const addBoundaryLines = async () => {
      try {
        let geojson = await zipCodesToBoundaryLines(zipCodes);

        if (geojson.features.length === 0) {
          geojson = await zipCodesToGeoJSONFeatures(zipCodes);
        }

        if (geojson.features.length === 0) {
          return;
        }

        if (map.current?.getSource("service-boundaries")) {
          map.current.removeLayer("service-boundaries-lines");
          map.current.removeSource("service-boundaries");
        }

        map.current?.addSource("service-boundaries", {
          data: geojson,
          type: "geojson",
        });

        map.current?.addLayer({
          id: "service-boundaries-lines",
          paint: {
            "line-color": "#e01e2d",
            "line-opacity": 0.8,
            "line-width": 3,
          },
          source: "service-boundaries",
          type: "line",
        });

        if (autoFitBounds && geojson.features.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          geojson.features.forEach((feature) => {
            if (feature.geometry.type === "Polygon") {
              const coords = feature.geometry.coordinates[0];
              coords.forEach((coord) => {
                bounds.extend([coord[0], coord[1]]);
              });
            } else if (feature.geometry.type === "MultiPolygon") {
              feature.geometry.coordinates.forEach((polygon) => {
                polygon[0].forEach((coord) => {
                  bounds.extend([coord[0], coord[1]]);
                });
              });
            }
          });
          map.current?.fitBounds(bounds, { padding: 50 });
        }
      } catch {
        // Silently handle errors
      }
    };

    addBoundaryLines();
  }, [isMapReady, zipCodes, autoFitBounds]);

  if (!mapboxAccessToken) {
    return (
      <div className={clsx(styles.container, className)}>
        <div
          style={{
            alignItems: "center",
            backgroundColor: "var(--colors-lightgray)",
            borderRadius: "8px",
            color: "var(--colors-gray)",
            display: "flex",
            height: height,
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <p>
            Please set MAPBOX_API_TOKEN in your environment variables to use the
            map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.map} ref={mapContainer} style={{ height }} />
    </div>
  );
};
