jest.mock("next-intl/server", () => ({
  setRequestLocale: jest.fn(),
}));

jest.mock("src/contentful/getServices", () => ({
  fetchServices: jest.fn(),
}));

jest.mock("src/utils/schema", () => ({
  generateSchemaGraph: jest.fn(),
}));

jest.mock("src/utils/env.helpers", () => ({
  envUrl: () => "https://www.delmarvasite.com",
}));

import { createPageMetadata } from "src/utils/pageHelpers";

describe("pageHelpers", () => {
  const page = {
    enableIndexing: true,
    id: "page-id",
    metaDescription: "Description",
    metaImage: null,
    metaTitle: "Title",
    publishDate: "2026-01-01T00:00:00.000Z",
    sections: [],
    slug: "contact-us",
    updatedAt: "2026-02-01T00:00:00.000Z",
  };

  it("uses a self-referencing canonical and og locale for Spanish pages", () => {
    const metadata = createPageMetadata(page, "es", {
      path: "contact-us",
    });

    expect(metadata.alternates?.canonical?.toString()).toBe(
      "https://www.delmarvasite.com/es/contact-us",
    );
    expect(metadata.openGraph?.url).toBe(
      "https://www.delmarvasite.com/es/contact-us",
    );
    expect(metadata.openGraph?.locale).toBe("es_ES");
    expect(metadata.openGraph?.alternateLocale).toEqual(["en_US"]);
  });
});
