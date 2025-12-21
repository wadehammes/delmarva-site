"use client";

import type { ServiceType } from "src/contentful/getServices";
import { AreasServiced } from "./AreasServiced.component";

/**
 * Example component demonstrating how to use the AreasServiced component
 * This shows the component in action with sample services
 */
export const AreasServicedExample = () => {
  // In a real application, services would come from Contentful
  // This is just an example with mock data
  const mockServices: ServiceType[] = [];

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
        Our service areas are highlighted on the map below.
      </p>

      <AreasServiced
        autoFitBounds={true}
        height="500px"
        services={mockServices}
      />
    </div>
  );
};
