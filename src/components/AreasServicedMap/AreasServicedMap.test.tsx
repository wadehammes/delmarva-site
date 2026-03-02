import { act, render, screen, waitFor } from "@testing-library/react";
import type { ServiceType } from "src/contentful/getServices";
import { AreasServicedMap } from "./AreasServicedMap.component";

// Mock mapbox-gl
jest.mock("mapbox-gl", () => ({
  accessToken: "",
  Map: jest.fn().mockImplementation(() => ({
    addLayer: jest.fn(),
    addSource: jest.fn(),
    fitBounds: jest.fn(),
    on: jest.fn((event, callback) => {
      if (event === "load") {
        setTimeout(callback, 0);
      }
    }),
    remove: jest.fn(),
  })),
}));

// Mock utility functions
jest.mock("src/utils/countyUtils", () => ({
  countiesToBoundaryLines: jest.fn().mockResolvedValue({
    features: [
      {
        geometry: {
          coordinates: [
            [
              [-78, 39],
              [-77, 39],
              [-77, 40],
              [-78, 40],
              [-78, 39],
            ],
          ],
          type: "Polygon",
        },
        properties: {},
        type: "Feature",
      },
    ],
    type: "FeatureCollection",
  }),
}));

jest.mock("src/utils/geometryUtils", () => ({
  mergeFeaturesToSingleBoundary: jest.fn((features) => ({
    features,
    type: "FeatureCollection",
  })),
}));

jest.mock("src/utils/serviceAreaUtils", () => ({
  parseServicesToServiceAreas: jest.fn().mockResolvedValue([
    {
      color: "#ff0000",
      counties: ["Test County, MD"],
      serviceName: "Test Service",
      serviceSlug: "test-service",
    },
  ]),
}));

jest.mock("src/utils/mapLayerUtils", () => ({
  addServiceAreaLayers: jest.fn(),
  calculateBoundsFromServiceAreas: jest.fn(() => {
    const bounds = {
      toArray: jest.fn(() => [
        [-79, 38],
        [-77, 40],
      ]),
    };
    return bounds;
  }),
}));

jest.mock("src/utils/mapUtils", () => ({
  areBoundsValid: jest.fn(() => true),
  hexToRgba: jest.fn((_hex, alpha) => `rgba(255, 0, 0, ${alpha})`),
}));

const mockService: ServiceType = {
  description: {} as never,
  enableIndexing: true,
  id: "test-id",
  metaDescription: "",
  metaImage: null,
  metaTitle: "",
  publishDate: "",
  serviceCountiesCsv: {
    alt: "",
    height: 0,
    id: "asset-1",
    src: "https://example.com/counties.csv",
    width: 0,
  },
  serviceCountiesMapColor: "Red",
  serviceName: "Test Service",
  slug: "test-service",
  updatedAt: "",
};

describe("AreasServicedMap", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_MAPBOX_API_TOKEN: "test-token",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    render(<AreasServicedMap services={[mockService]} />);
    expect(screen.getByText("Loading service areas...")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByText("Loading service areas..."),
      ).not.toBeInTheDocument();
    });
  });

  it("renders error message when NEXT_PUBLIC_MAPBOX_API_TOKEN is missing", async () => {
    process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN = "";
    render(<AreasServicedMap services={[mockService]} />);
    expect(
      screen.getByText(/Please set NEXT_PUBLIC_MAPBOX_API_TOKEN/i),
    ).toBeInTheDocument();
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  });

  it("renders map container", async () => {
    render(<AreasServicedMap services={[mockService]} />);
    await waitFor(() => {
      const mapContainer = document.querySelector('[class*="map"]');
      expect(mapContainer).toBeInTheDocument();
    });
  });

  it("renders legend when service areas are loaded", async () => {
    render(<AreasServicedMap services={[mockService]} />);
    await waitFor(() => {
      expect(screen.getByText("Test Service")).toBeInTheDocument();
    });
  });

  it("applies custom className", async () => {
    const { container } = render(
      <AreasServicedMap className="custom-class" services={[mockService]} />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
    await waitFor(() => {
      expect(
        screen.queryByText("Loading service areas..."),
      ).not.toBeInTheDocument();
    });
  });

  it("uses custom height prop", async () => {
    render(<AreasServicedMap height="500px" services={[mockService]} />);
    const mapContainer = document.querySelector(
      '[class*="map"]',
    ) as HTMLElement;
    expect(mapContainer).toHaveStyle({ height: "500px" });
    await waitFor(() => {
      expect(
        screen.queryByText("Loading service areas..."),
      ).not.toBeInTheDocument();
    });
  });

  it("handles empty services array", async () => {
    render(<AreasServicedMap services={[]} />);
    await waitFor(() => {
      const mapContainer = document.querySelector('[class*="map"]');
      expect(mapContainer).toBeInTheDocument();
    });
  });
});
