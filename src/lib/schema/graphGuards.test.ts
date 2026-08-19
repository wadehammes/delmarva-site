import { describe, expect, it } from "@jest/globals";
import type { Page } from "src/contentful/getPages";
import type { ServiceType } from "src/contentful/getServices";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import {
  buildPageSchemaGraph,
  buildServicePageSchemaGraph,
} from "src/lib/schema/graph";

jest.mock("src/utils/areasServed");
jest.mock("src/utils/env.helpers");

const { getServiceAreasServed } = require("src/utils/areasServed");
const { envUrl } = require("src/utils/env.helpers");

const mockGetServiceAreasServed = getServiceAreasServed as jest.MockedFunction<
  typeof getServiceAreasServed
>;
const mockEnvUrl = envUrl as jest.MockedFunction<typeof envUrl>;

const mockAsset: ContentfulAsset = {
  alt: "Hero",
  height: 630,
  id: "asset-1",
  src: "https://images.example.com/hero.jpg",
  width: 1200,
};

const mockPage: Page = {
  enableIndexing: true,
  id: "page-1",
  metaDescription: "Test description",
  metaImage: mockAsset,
  metaKeywords: ["test"],
  metaTitle: "Test Page",
  publishDate: "2024-01-01T00:00:00.000Z",
  sections: [],
  slug: "test-page",
  title: "Test Page",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

const mockService: ServiceType = {
  description: mockPage.sections as unknown as ServiceType["description"],
  enableIndexing: true,
  id: "service-1",
  metaDescription: "Service description",
  metaImage: mockAsset,
  metaTitle: "Earthwork",
  publishDate: "2024-01-01T00:00:00.000Z",
  serviceName: "Earthwork",
  slug: "earthwork",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

const PAGE_URL = "https://www.delmarvasite.com/test-page";

describe("page schema graph acceptance criteria", () => {
  const originalEnv = process.env.ENVIRONMENT;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEnvUrl.mockReturnValue("https://www.delmarvasite.com");
    mockGetServiceAreasServed.mockResolvedValue(null);
    process.env.ENVIRONMENT = "production";
  });

  afterEach(() => {
    process.env.ENVIRONMENT = originalEnv;
  });

  const buildFullGraph = () =>
    buildPageSchemaGraph({
      locale: "en",
      page: mockPage,
      pageUrl: PAGE_URL,
      slug: "test-page",
    });

  it("uses stable global @ids", () => {
    const ids = buildFullGraph().map((entity) => entity["@id"]);

    expect(ids).toContain("https://www.delmarvasite.com/#organization");
    expect(ids).toContain("https://www.delmarvasite.com/#website");
    expect(ids).toContain("https://www.delmarvasite.com/#brand");
    expect(ids).toContain("https://www.delmarvasite.com/#logo");
  });

  it("emits no duplicate @ids", () => {
    const ids = buildFullGraph().map((entity) => entity["@id"]);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("emits no null, undefined, or empty-string values", () => {
    const serialized = JSON.stringify(buildFullGraph());

    expect(serialized).not.toContain(":null");
    expect(serialized).not.toContain(':""');
    expect(serialized).not.toContain(":[]");
    expect(serialized).not.toContain("undefined");
  });

  it("emits no Offer or price fields", () => {
    const serialized = JSON.stringify(buildFullGraph());

    expect(serialized).not.toContain('"Offer"');
    expect(serialized).not.toContain('"AggregateOffer"');
    expect(serialized).not.toContain("priceCurrency");
    expect(serialized).not.toContain("hasOfferCatalog");
  });

  it("emits no BreadcrumbList while visible breadcrumbs are not on the site", () => {
    const serialized = JSON.stringify(buildFullGraph());

    expect(serialized).not.toContain("BreadcrumbList");
  });

  it("omits Service on CMS pages", () => {
    expect(
      buildFullGraph().find((entity) => entity["@type"] === "Service"),
    ).toBeUndefined();
  });

  it("includes exactly one Service on service detail pages", async () => {
    const graph = await buildServicePageSchemaGraph({
      locale: "en",
      service: mockService,
    });

    expect(
      graph.filter((entity) => entity["@type"] === "Service"),
    ).toHaveLength(1);
  });

  it("links the page entity to its primary image", () => {
    const graph = buildFullGraph();
    const pageEntity = graph.find((entity) => entity["@type"] === "WebPage");

    expect(pageEntity?.primaryImageOfPage).toEqual({
      "@id": `${PAGE_URL}#primaryimage`,
    });
  });

  it("sets territory-qualified inLanguage on the page entity", () => {
    const pageEntity = buildPageSchemaGraph({
      locale: "es",
      page: mockPage,
      pageUrl: "https://www.delmarvasite.com/es/test-page",
      slug: "test-page",
    }).find((entity) => entity["@type"] === "WebPage");

    expect(pageEntity?.inLanguage).toBe("es-US");
  });
});
