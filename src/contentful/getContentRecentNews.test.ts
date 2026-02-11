import type { ContentRecentNewsEntry } from "src/contentful/getContentRecentNews";
import {
  hasRecentNews,
  parseContentRecentNews,
} from "src/contentful/getContentRecentNews";

const mockGetEntries = jest.fn();

jest.mock("src/contentful/client", () => ({
  contentfulClient: () => ({
    withoutUnresolvableLinks: {
      getEntries: mockGetEntries,
    },
  }),
}));

describe("hasRecentNews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when at least one recent news entry exists", async () => {
    mockGetEntries.mockResolvedValue({
      items: [{ fields: { date: "2025-05-01" }, sys: { id: "1" } }],
      total: 1,
    });
    const result = await hasRecentNews({ locale: "en", preview: false });
    expect(result).toBe(true);
    expect(mockGetEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        content_type: "contentRecentNews",
        "fields.date[gt]": expect.any(String),
        limit: 1,
        locale: "en",
      }),
    );
  });

  it("returns false when no recent news entries exist", async () => {
    mockGetEntries.mockResolvedValue({ items: [], total: 0 });
    const result = await hasRecentNews({ locale: "en", preview: false });
    expect(result).toBe(false);
  });

  it("passes locale and uses default en when omitted", async () => {
    mockGetEntries.mockResolvedValue({ items: [], total: 0 });
    await hasRecentNews({ preview: false });
    expect(mockGetEntries).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "en" }),
    );
    await hasRecentNews({ locale: "es", preview: true });
    expect(mockGetEntries).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "es" }),
    );
  });
});

describe("parseContentRecentNews", () => {
  it("returns null for undefined or null entry", () => {
    expect(parseContentRecentNews(undefined)).toBe(null);
    expect(parseContentRecentNews(null as unknown as undefined)).toBe(null);
  });

  it("returns null when entry is not contentRecentNews type", () => {
    const entry = {
      fields: {},
      sys: { contentType: { sys: { id: "otherType" } }, id: "1" },
    } as unknown as ContentRecentNewsEntry;
    expect(parseContentRecentNews(entry)).toBe(null);
  });

  it("returns parsed object for valid contentRecentNews entry", () => {
    const entry = {
      fields: {
        date: "2025-05-15",
        linkDescription: "Desc",
        linkTitle: "Title",
        linkUrl: "/news/1",
      },
      sys: { contentType: { sys: { id: "contentRecentNews" } }, id: "news-1" },
    } as unknown as ContentRecentNewsEntry;
    const result = parseContentRecentNews(entry);
    expect(result).toEqual({
      date: "2025-05-15",
      id: "news-1",
      linkDescription: "Desc",
      linkTitle: "Title",
      linkUrl: "/news/1",
    });
  });
});
