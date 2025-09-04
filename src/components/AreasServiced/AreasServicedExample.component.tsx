"use client";

import { AreasServiced } from "./AreasServiced.component";

/**
 * Example component demonstrating how to use the AreasServiced component
 * This shows the component in action with sample zip codes
 */
export const AreasServicedExample = () => {
  // Sample zip codes for the Delmarva Peninsula area
  const zipCodes = ["19901", "19902", "19903", "19904"];

  // In a real application, this would come from environment variables
  const mapboxToken = process.env.MAPBOX_API_TOKEN || "";

  if (!mapboxToken) {
    return (
      <div
        style={{
          backgroundColor: "var(--colors-lightgray)",
          borderRadius: "8px",
          color: "var(--colors-gray)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <p>
          Please set MAPBOX_API_TOKEN in your environment variables to use the
          map.
        </p>
      </div>
    );
  }

  return (
    <div style={{ margin: "0 auto", maxWidth: "800px", width: "100%" }}>
      <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
        Areas We Service
      </h2>
      <p
        style={{
          color: "var(--colors-gray)",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Our service areas are highlighted in red on the map below.
      </p>

      <AreasServiced autoFitBounds={true} height="500px" zipCodes={zipCodes} />

      <div
        style={{
          color: "var(--colors-gray)",
          fontSize: "0.9rem",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        <p>Zip codes: {zipCodes.join(", ")}</p>
      </div>
    </div>
  );
};
