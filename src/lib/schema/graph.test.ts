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

describe("buildPageSchemaGraph", () => {
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

  it("includes LocalBusiness, WebSite, Brand, and logo nodes", () => {
    const graph = buildPageSchemaGraph({
      locale: "en",
      page: mockPage,
      pageUrl: "https://www.delmarvasite.com/test-page",
      slug: "test-page",
    });

    expect(
      graph.find((node) => node["@type"] === "LocalBusiness")?.["@id"],
    ).toBe("https://www.delmarvasite.com/#organization");
    expect(graph.find((node) => node["@type"] === "WebSite")?.["@id"]).toBe(
      "https://www.delmarvasite.com/#website",
    );
    expect(graph.find((node) => node["@type"] === "Brand")?.["@id"]).toBe(
      "https://www.delmarvasite.com/#brand",
    );
    expect(graph.find((node) => node["@type"] === "ImageObject")?.["@id"]).toBe(
      "https://www.delmarvasite.com/#logo",
    );
  });

  it("emits exactly one page entity", () => {
    const graph = buildPageSchemaGraph({
      locale: "en",
      page: mockPage,
      pageUrl: "https://www.delmarvasite.com/test-page",
      slug: "test-page",
    });

    const pageEntities = graph.filter((node) =>
      ["WebPage", "AboutPage", "ContactPage", "CollectionPage"].includes(
        node["@type"] as string,
      ),
    );

    expect(pageEntities).toHaveLength(1);
    expect(pageEntities[0]?.["@id"]).toBe(
      "https://www.delmarvasite.com/test-page#webpage",
    );
  });

  it("does not emit Service entities on CMS pages", () => {
    const graph = buildPageSchemaGraph({
      locale: "en",
      page: mockPage,
      pageUrl: "https://www.delmarvasite.com/what-we-deliver",
      slug: "what-we-deliver",
    });

    expect(graph.find((node) => node["@type"] === "Service")).toBeUndefined();
  });

  it("uses ContactPage for contact-us slug", () => {
    const graph = buildPageSchemaGraph({
      locale: "en",
      page: { ...mockPage, slug: "contact-us" },
      pageUrl: "https://www.delmarvasite.com/contact-us",
      slug: "contact-us",
    });

    expect(graph.find((node) => node["@type"] === "ContactPage")).toBeDefined();
  });

  it("emits CollectionPage with ItemList for service collection pages", () => {
    const pageUrl = "https://www.delmarvasite.com/what-we-deliver";
    const graph = buildPageSchemaGraph({
      collectionItems: [
        {
          name: "Earthwork",
          url: "https://www.delmarvasite.com/what-we-deliver/earthwork",
        },
      ],
      locale: "en",
      page: mockPage,
      pageUrl,
      slug: "what-we-deliver",
    });

    expect(graph.find((node) => node["@type"] === "CollectionPage")).toEqual(
      expect.objectContaining({
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      }),
    );
    expect(graph.find((node) => node["@type"] === "ItemList")).toEqual(
      expect.objectContaining({
        itemListElement: [
          expect.objectContaining({
            name: "Earthwork",
            position: 1,
          }),
        ],
      }),
    );
    expect(graph.find((node) => node["@type"] === "Service")).toBeUndefined();
  });

  it("includes sameAs on LocalBusiness when linkedInUrl is provided", () => {
    const graph = buildPageSchemaGraph({
      locale: "en",
      organizationOptions: {
        linkedInUrl:
          "https://www.linkedin.com/company/delmarva-site-development",
      },
      page: mockPage,
      pageUrl: "https://www.delmarvasite.com/test-page",
      slug: "test-page",
    });

    expect(
      graph.find((node) => node["@type"] === "LocalBusiness")?.sameAs,
    ).toEqual(["https://www.linkedin.com/company/delmarva-site-development"]);
  });
});

describe("buildServicePageSchemaGraph", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnvUrl.mockReturnValue("https://www.delmarvasite.com");
    mockGetServiceAreasServed.mockResolvedValue(null);
  });

  it("emits exactly one Service entity linked from the page entity", async () => {
    const graph = await buildServicePageSchemaGraph({
      locale: "en",
      service: mockService,
    });

    const services = graph.filter((node) => node["@type"] === "Service");
    const pageEntity = graph.find((node) => node["@type"] === "WebPage");

    expect(services).toHaveLength(1);
    expect(services[0]?.["@id"]).toBe(
      "https://www.delmarvasite.com/what-we-deliver/earthwork#service",
    );
    expect(pageEntity?.mainEntity).toEqual({
      "@id": "https://www.delmarvasite.com/what-we-deliver/earthwork#service",
    });
  });
});
