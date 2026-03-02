import { render } from "@testing-library/react";
import type { ServiceForMap } from "src/contentful/parseContentAreasServicedMap";
import { ContentAreasServicedMap } from "./ContentAreasServicedMap.component";

const mockServiceForMap: ServiceForMap = {
  id: "test-id",
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
};

describe("ContentAreasServicedMap", () => {
  it("returns null when services array is empty", () => {
    const { container } = render(
      <ContentAreasServicedMap fields={{ services: [] }} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders wrapper with services", () => {
    render(
      <ContentAreasServicedMap
        fields={{
          services: [mockServiceForMap],
        }}
      />,
    );
    const wrapper = document.querySelector('[class*="wrapper"]');
    expect(wrapper).toBeInTheDocument();
  });
});
