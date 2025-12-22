import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Document } from "@contentful/rich-text-types";
import { BLOCKS } from "@contentful/rich-text-types";
import type { Page } from "src/contentful/getPages";
import type { ServiceType } from "src/contentful/getServices";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import {
  createBreadcrumbSchema,
  createOrganizationSchema,
  createServiceSchema,
  createWebPageSchema,
  generateSchemaGraph,
} from "./schema";

jest.mock("@contentful/rich-text-plain-text-renderer");
jest.mock("src/utils/areasServed");
jest.mock("src/utils/breadcrumbs");
jest.mock("src/utils/helpers");

const mockDocumentToPlainTextString =
  documentToPlainTextString as jest.MockedFunction<
    typeof documentToPlainTextString
  >;
const { getServiceAreasServed } = require("src/utils/areasServed");
const { generateBreadcrumbs } = require("src/utils/breadcrumbs");
const { createMediaUrl, envUrl } = require("src/utils/helpers");

const mockGetServiceAreasServed = getServiceAreasServed as jest.MockedFunction<
  typeof getServiceAreasServed
>;
const mockGenerateBreadcrumbs = generateBreadcrumbs as jest.MockedFunction<
  typeof generateBreadcrumbs
>;
const mockCreateMediaUrl = createMediaUrl as jest.MockedFunction<
  typeof createMediaUrl
>;
const mockEnvUrl = envUrl as jest.MockedFunction<typeof envUrl>;

const mockRichTextDocument: Document = {
  content: [
    {
      content: [
        {
          data: {},
          marks: [],
          nodeType: "text",
          value: "Test description",
        },
      ],
      data: {},
      nodeType: BLOCKS.PARAGRAPH,
    },
  ],
  data: {},
  nodeType: BLOCKS.DOCUMENT,
};

const mockContentfulAsset: ContentfulAsset = {
  alt: "Test Image",
  height: 100,
  id: "test-asset-id",
  src: "https://example.com/image.jpg",
  width: 200,
};

const mockPage: Page = {
  enableIndexing: true,
  id: "test-page-id",
  metaDescription: "Test page description",
  metaImage: mockContentfulAsset,
  metaKeywords: ["test", "page"],
  metaTitle: "Test Page",
  publishDate: "2024-01-01T00:00:00Z",
  sections: [],
  slug: "test-page",
  title: "Test Page",
  updatedAt: "2024-01-02T00:00:00Z",
};

const mockService: ServiceType = {
  description: mockRichTextDocument,
  enableIndexing: true,
  id: "test-service-id",
  metaDescription: "Test service description",
  metaImage: mockContentfulAsset,
  metaTitle: "Test Service",
  publishDate: "2024-01-01T00:00:00Z",
  serviceName: "Test Service",
  slug: "test-service",
  updatedAt: "2024-01-02T00:00:00Z",
};

describe("schema", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnvUrl.mockReturnValue("https://www.delmarvasite.com");
    mockCreateMediaUrl.mockImplementation((url: string) => url || "");
    mockDocumentToPlainTextString.mockReturnValue("Test description");
    mockGetServiceAreasServed.mockResolvedValue(null);
    mockGenerateBreadcrumbs.mockReturnValue([
      {
        "@type": "ListItem",
        item: "https://www.delmarvasite.com",
        name: "Home",
        position: 0,
      },
    ]);
  });

  describe("createOrganizationSchema", () => {
    it("should create organization schema with required fields", () => {
      const baseUrl = "https://www.delmarvasite.com";
      const schema = createOrganizationSchema(baseUrl);

      expect(schema).toEqual({
        "@context": "https://schema.org",
        "@id": `${baseUrl}#organization`,
        "@type": "Organization",
        address: {
          "@type": "PostalAddress",
          addressCountry: "US",
          addressLocality: "Crofton",
          addressRegion: "MD",
          postalCode: "21114",
          streetAddress: "2200 Defense Highway, Suite 107",
        },
        faxNumber: "+1-443-292-8090",
        name: "Delmarva Site Development",
        telephone: "+1-443-292-8083",
        url: baseUrl,
      });
    });

    it("should include areasServed when provided", () => {
      const baseUrl = "https://www.delmarvasite.com";
      const areasServed = ["Accomack County, VA", "Worcester County, MD"];

      const schema = createOrganizationSchema(baseUrl, areasServed);

      expect("areaServed" in schema && schema.areaServed).toEqual([
        {
          "@type": "Place",
          name: "Accomack County, VA",
        },
        {
          "@type": "Place",
          name: "Worcester County, MD",
        },
      ]);
    });

    it("should not include areasServed when empty array provided", () => {
      const baseUrl = "https://www.delmarvasite.com";
      const schema = createOrganizationSchema(baseUrl, []);

      expect(
        "areaServed" in schema ? schema.areaServed : undefined,
      ).toBeUndefined();
    });

    it("should not include areasServed when undefined", () => {
      const baseUrl = "https://www.delmarvasite.com";
      const schema = createOrganizationSchema(baseUrl);

      expect(
        "areaServed" in schema ? schema.areaServed : undefined,
      ).toBeUndefined();
    });
  });

  describe("createWebPageSchema", () => {
    it("should create webpage schema with all required fields", () => {
      const canonicalUrl = "https://www.delmarvasite.com/test-page";
      const organizationId = "https://www.delmarvasite.com#organization";

      const schema = createWebPageSchema(
        mockPage,
        canonicalUrl,
        organizationId,
      );

      expect(schema).toEqual({
        "@context": "https://schema.org",
        "@id": `${canonicalUrl}#webpage`,
        "@type": "WebPage",
        dateModified: mockPage.updatedAt,
        datePublished: mockPage.publishDate,
        description: mockPage.metaDescription,
        image: mockPage.metaImage?.src,
        name: mockPage.metaTitle,
        publisher: {
          "@id": organizationId,
        },
        url: canonicalUrl,
      });
    });

    it("should include image when metaImage is present", () => {
      const canonicalUrl = "https://www.delmarvasite.com/test-page";
      const organizationId = "https://www.delmarvasite.com#organization";

      const schema = createWebPageSchema(
        mockPage,
        canonicalUrl,
        organizationId,
      );

      expect(schema.image).toBe(mockPage.metaImage?.src);
      if (mockPage.metaImage) {
        expect(mockCreateMediaUrl).toHaveBeenCalledWith(mockPage.metaImage.src);
      }
    });

    it("should not include image when metaImage is not present", () => {
      const pageWithoutImage: Page = {
        ...mockPage,
        metaImage: null,
      };
      const canonicalUrl = "https://www.delmarvasite.com/test-page";
      const organizationId = "https://www.delmarvasite.com#organization";

      const schema = createWebPageSchema(
        pageWithoutImage,
        canonicalUrl,
        organizationId,
      );

      expect(schema.image).toBeUndefined();
    });
  });

  describe("createBreadcrumbSchema", () => {
    it("should create breadcrumb schema with items", () => {
      const breadcrumbs = [
        {
          "@type": "ListItem" as const,
          item: "https://www.delmarvasite.com",
          name: "Home",
          position: 0,
        },
        {
          "@type": "ListItem" as const,
          item: "https://www.delmarvasite.com/test-page",
          name: "Test Page",
          position: 1,
        },
      ];
      const canonicalUrl = "https://www.delmarvasite.com/test-page";

      const schema = createBreadcrumbSchema(breadcrumbs, canonicalUrl);

      expect(schema).toEqual({
        "@context": "https://schema.org",
        "@id": `${canonicalUrl}#breadcrumb`,
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            item: "https://www.delmarvasite.com",
            name: "Home",
            position: 0,
          },
          {
            "@type": "ListItem",
            item: "https://www.delmarvasite.com/test-page",
            name: "Test Page",
            position: 1,
          },
        ],
      });
    });

    it("should handle breadcrumbs without item URLs", () => {
      const breadcrumbs = [
        {
          "@type": "ListItem" as const,
          name: "Home",
          position: 0,
        },
      ];
      const canonicalUrl = "https://www.delmarvasite.com";

      const schema = createBreadcrumbSchema(breadcrumbs, canonicalUrl);

      const itemListElement = Array.isArray(schema.itemListElement)
        ? schema.itemListElement
        : [];
      expect(itemListElement[0]).toEqual({
        "@type": "ListItem",
        name: "Home",
        position: 0,
      });
      expect(itemListElement[0]?.item).toBeUndefined();
    });
  });

  describe("createServiceSchema", () => {
    it("should create service schema with all required fields", async () => {
      const baseUrl = "https://www.delmarvasite.com";
      mockGetServiceAreasServed.mockResolvedValue(null);

      const schema = await createServiceSchema(mockService, baseUrl);

      expect(schema).toEqual({
        "@context": "https://schema.org",
        "@id": `${baseUrl}/what-we-deliver/${mockService.slug}#service`,
        "@type": "Service",
        description: "Test description",
        image: mockService.metaImage.src,
        name: mockService.serviceName,
        url: `${baseUrl}/what-we-deliver/${mockService.slug}`,
      });
      expect(mockDocumentToPlainTextString).toHaveBeenCalledWith(
        mockService.description,
      );
      expect(mockGetServiceAreasServed).toHaveBeenCalledWith(mockService);
    });

    it("should truncate description if longer than 500 characters", async () => {
      const baseUrl = "https://www.delmarvasite.com";
      const longDescription = "a".repeat(600);
      mockDocumentToPlainTextString.mockReturnValue(longDescription);
      mockGetServiceAreasServed.mockResolvedValue(null);

      const schema = await createServiceSchema(mockService, baseUrl);

      expect(schema?.description).toBe(`${"a".repeat(497)}...`);
    });

    it("should use metaDescription as fallback when RichText parsing fails", async () => {
      const baseUrl = "https://www.delmarvasite.com";
      mockDocumentToPlainTextString.mockImplementation(() => {
        throw new Error("Parse error");
      });
      mockGetServiceAreasServed.mockResolvedValue(null);

      const schema = await createServiceSchema(mockService, baseUrl);

      expect(schema?.description).toBe(mockService.metaDescription);
    });

    it("should use metaDescription when description is undefined", async () => {
      const baseUrl = "https://www.delmarvasite.com";
      mockDocumentToPlainTextString.mockReturnValue("");
      mockGetServiceAreasServed.mockResolvedValue(null);

      const schema = await createServiceSchema(mockService, baseUrl);

      expect(schema?.description).toBe(mockService.metaDescription);
    });

    it("should include areasServed when CSV data is available", async () => {
      const baseUrl = "https://www.delmarvasite.com";
      const areasServed = ["Accomack County, VA", "Worcester County, MD"];
      mockGetServiceAreasServed.mockResolvedValue(areasServed);

      const schema = await createServiceSchema(mockService, baseUrl);

      expect(schema?.areaServed).toEqual([
        {
          "@type": "Place",
          name: "Accomack County, VA",
        },
        {
          "@type": "Place",
          name: "Worcester County, MD",
        },
      ]);
    });

    it("should include image when metaImage is present", async () => {
      const baseUrl = "https://www.delmarvasite.com";
      mockGetServiceAreasServed.mockResolvedValue(null);

      const schema = await createServiceSchema(mockService, baseUrl);

      expect(schema?.image).toBe(mockService.metaImage.src);
      expect(mockCreateMediaUrl).toHaveBeenCalledWith(
        mockService.metaImage.src,
      );
    });

    it("should not include image when metaImage is not present", async () => {
      const serviceWithoutImage: ServiceType = {
        ...mockService,
        metaImage: null as unknown as ContentfulAsset,
      };
      const baseUrl = "https://www.delmarvasite.com";
      mockGetServiceAreasServed.mockResolvedValue(null);

      const schema = await createServiceSchema(serviceWithoutImage, baseUrl);

      expect(schema?.image).toBeUndefined();
    });
  });

  describe("generateSchemaGraph", () => {
    it("should generate schema graph with organization, webpage, and breadcrumb", async () => {
      const options = {
        locale: "en" as const,
        page: mockPage,
        preview: false,
        slug: "test-page",
      };

      const graph = await generateSchemaGraph(options);

      expect(graph).toEqual({
        "@context": "https://schema.org",
        "@graph": expect.arrayContaining([
          expect.objectContaining({
            "@type": "Organization",
          }),
          expect.objectContaining({
            "@type": "WebPage",
          }),
          expect.objectContaining({
            "@type": "BreadcrumbList",
          }),
        ]),
      });
      expect(graph["@graph"]).toHaveLength(3);
    });

    it("should generate schema graph without webpage when page is null", async () => {
      const options = {
        locale: "en" as const,
        page: null,
        preview: false,
        slug: "test-page",
      };

      const graph = await generateSchemaGraph(options);

      expect(graph["@graph"]).toHaveLength(2);
      expect(graph["@graph"]).not.toContainEqual(
        expect.objectContaining({
          "@type": "WebPage",
        }),
      );
    });

    it("should generate schema graph with service schemas when services provided", async () => {
      const options = {
        locale: "en" as const,
        page: mockPage,
        preview: false,
        services: [mockService],
        slug: "test-page",
      };
      mockGetServiceAreasServed.mockResolvedValue(null);

      const graph = await generateSchemaGraph(options);

      expect(graph["@graph"]).toHaveLength(4);
      expect(graph["@graph"]).toContainEqual(
        expect.objectContaining({
          "@type": "Service",
          name: mockService.serviceName,
        }),
      );
    });

    it("should filter out null service schemas", async () => {
      const serviceThatFails: ServiceType = {
        ...mockService,
        id: "failing-service",
        slug: "failing-service",
      };
      const options = {
        locale: "en" as const,
        page: mockPage,
        preview: false,
        services: [mockService, serviceThatFails],
        slug: "test-page",
      };
      mockGetServiceAreasServed
        .mockResolvedValueOnce(null)
        .mockRejectedValueOnce(new Error("Service creation failed"));
      mockDocumentToPlainTextString
        .mockReturnValueOnce("Valid service")
        .mockReturnValueOnce("Test service description");

      const graph = await generateSchemaGraph(options);

      const serviceSchemas = graph["@graph"].filter((item): boolean => {
        if (typeof item === "object" && item !== null && "@type" in item) {
          return item["@type"] === "Service";
        }
        return false;
      });
      expect(serviceSchemas).toHaveLength(1);
    });

    it("should include organization areasServed when provided", async () => {
      const areasServed = ["Accomack County, VA", "Worcester County, MD"];
      const options = {
        locale: "en" as const,
        organizationAreasServed: areasServed,
        page: mockPage,
        preview: false,
        slug: "test-page",
      };

      const graph = await generateSchemaGraph(options);

      const organization = graph["@graph"].find((item): boolean => {
        if (typeof item === "object" && item !== null && "@type" in item) {
          return item["@type"] === "Organization";
        }
        return false;
      }) as
        | { areaServed?: Array<{ "@type": string; name: string }> }
        | undefined;

      expect(organization?.areaServed).toEqual([
        {
          "@type": "Place",
          name: "Accomack County, VA",
        },
        {
          "@type": "Place",
          name: "Worcester County, MD",
        },
      ]);
    });

    it("should handle home page slug correctly", async () => {
      const options = {
        locale: "en" as const,
        page: mockPage,
        preview: false,
        slug: "home",
      };

      const graph = await generateSchemaGraph(options);

      const webpage = graph["@graph"].find((item): boolean => {
        if (typeof item === "object" && item !== null && "@type" in item) {
          return item["@type"] === "WebPage";
        }
        return false;
      }) as { url?: string } | undefined;

      expect(webpage?.url).toBe("https://www.delmarvasite.com");
    });

    it("should handle empty slug correctly", async () => {
      const options = {
        locale: "en" as const,
        page: mockPage,
        preview: false,
        slug: "",
      };

      const graph = await generateSchemaGraph(options);

      const webpage = graph["@graph"].find((item): boolean => {
        if (typeof item === "object" && item !== null && "@type" in item) {
          return item["@type"] === "WebPage";
        }
        return false;
      }) as { url?: string } | undefined;

      expect(webpage?.url).toBe("https://www.delmarvasite.com");
    });

    it("should use generateBreadcrumbs with correct parameters", async () => {
      const additionalItems = [{ name: "Extra", url: "/extra" }];
      const options = {
        additionalBreadcrumbItems: additionalItems,
        locale: "en" as const,
        page: mockPage,
        preview: false,
        slug: "test-page",
      };

      await generateSchemaGraph(options);

      expect(mockGenerateBreadcrumbs).toHaveBeenCalledWith(
        mockPage,
        "test-page",
        "en",
        additionalItems,
      );
    });

    it("should not include breadcrumb when breadcrumbs array is empty", async () => {
      mockGenerateBreadcrumbs.mockReturnValue([]);
      const options = {
        locale: "en" as const,
        page: mockPage,
        preview: false,
        slug: "test-page",
      };

      const graph = await generateSchemaGraph(options);

      expect(graph["@graph"]).not.toContainEqual(
        expect.objectContaining({
          "@type": "BreadcrumbList",
        }),
      );
    });

    it("should handle multiple services", async () => {
      const service2: ServiceType = {
        ...mockService,
        id: "service-2",
        serviceName: "Service 2",
        slug: "service-2",
      };
      const options = {
        locale: "en" as const,
        page: mockPage,
        preview: false,
        services: [mockService, service2],
        slug: "test-page",
      };
      mockGetServiceAreasServed.mockResolvedValue(null);

      const graph = await generateSchemaGraph(options);

      const serviceSchemas = graph["@graph"].filter((item): boolean => {
        if (typeof item === "object" && item !== null && "@type" in item) {
          return item["@type"] === "Service";
        }
        return false;
      });
      expect(serviceSchemas).toHaveLength(2);
    });
  });
});
