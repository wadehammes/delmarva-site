jest.mock("src/utils/env.helpers", () => ({
  envUrl: () => "https://www.delmarvasite.com",
}));

import {
  createPageMetadata,
  createUtilityPageMetadata,
} from "src/utils/metadata.helpers";

describe("metadata.helpers", () => {
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

  it("normalizes a Contentful metaTitle that already includes the site name", () => {
    const metadata = createPageMetadata(
      {
        ...page,
        metaTitle:
          "Soil Stabilization & Pavement Reclamation in Maryland | Delmarva Site Development",
      },
      "en",
      { path: "what-we-deliver/soil-stabilization" },
    );

    expect(metadata.title).toEqual({
      absolute:
        "Soil Stabilization & Pavement Reclamation in Maryland | Delmarva Site Development",
    });
    expect(metadata.openGraph?.title).toBe(
      "Soil Stabilization & Pavement Reclamation in Maryland | Delmarva Site Development",
    );
  });

  it("adds the site name when Contentful metaTitle omits it", () => {
    const metadata = createPageMetadata(
      {
        ...page,
        metaTitle: "Contact Us",
      },
      "en",
      { path: "contact-us" },
    );

    expect(metadata.title).toEqual({
      absolute: "Contact Us | Delmarva Site Development",
    });
  });

  it("uses the site name once when Contentful metaTitle is only the brand", () => {
    const metadata = createPageMetadata(
      {
        ...page,
        metaTitle: "Delmarva Site Development",
      },
      "en",
      { path: "" },
    );

    expect(metadata.title).toEqual({
      absolute: "Delmarva Site Development",
    });
  });

  it("builds locale-aware metadata for utility routes", () => {
    const metadata = createUtilityPageMetadata("es", {
      path: "refresh-content",
      title: "Refresh Site Content",
    });

    expect(metadata.alternates?.canonical?.toString()).toBe(
      "https://www.delmarvasite.com/es/refresh-content",
    );
    expect(metadata.robots).toBe("noindex, nofollow");
    expect(metadata.title).toEqual({
      absolute: "Refresh Site Content | Delmarva Site Development",
    });
  });
});
