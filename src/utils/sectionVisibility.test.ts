import type { ContentModuleEntry } from "src/contentful/parseContentModules";
import type { SectionType } from "src/contentful/parseSections";
import { filterSectionsByStaleRecentNews } from "src/utils/sectionVisibility";

jest.mock("src/contentful/getContentRecentNews", () => ({
  hasRecentNews: jest.fn(),
}));

const { hasRecentNews } = jest.requireMock<{
  hasRecentNews: jest.Mock<Promise<boolean>>;
}>("src/contentful/getContentRecentNews");

const recentNewsListModule = (): ContentModuleEntry =>
  ({
    fields: { module: "Recent News List" },
    sys: { contentType: { sys: { id: "contentModules" } }, id: "mod-1" },
  }) as ContentModuleEntry;

const otherModule = (): ContentModuleEntry =>
  ({
    fields: { module: "Featured Services List" },
    sys: { contentType: { sys: { id: "contentModules" } }, id: "mod-2" },
  }) as ContentModuleEntry;

const sectionWithRecentNewsList = (): SectionType => ({
  content: [recentNewsListModule()],
  id: "section-news",
});

const sectionWithoutRecentNewsList = (): SectionType => ({
  content: [otherModule()],
  id: "section-other",
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("filterSectionsByStaleRecentNews", () => {
  it("returns all sections unchanged when hasRecentNews is true", async () => {
    hasRecentNews.mockResolvedValue(true);
    const sections: (SectionType | null)[] = [
      sectionWithRecentNewsList(),
      sectionWithoutRecentNewsList(),
      null,
    ];
    const result = await filterSectionsByStaleRecentNews(sections, "en", false);
    expect(hasRecentNews).toHaveBeenCalledWith({
      locale: "en",
      preview: false,
    });
    expect(result).toEqual(sections);
  });

  it("filters out sections containing Recent News List when hasRecentNews is false", async () => {
    hasRecentNews.mockResolvedValue(false);
    const withNews = sectionWithRecentNewsList();
    const withoutNews = sectionWithoutRecentNewsList();
    const sections: (SectionType | null)[] = [withNews, withoutNews, null];
    const result = await filterSectionsByStaleRecentNews(sections, "en", false);
    expect(hasRecentNews).toHaveBeenCalledWith({
      locale: "en",
      preview: false,
    });
    expect(result).toHaveLength(2);
    expect(result).toEqual([withoutNews, null]);
  });

  it("passes locale and preview to hasRecentNews", async () => {
    hasRecentNews.mockResolvedValue(true);
    await filterSectionsByStaleRecentNews([], "es", true);
    expect(hasRecentNews).toHaveBeenCalledWith({
      locale: "es",
      preview: true,
    });
  });

  it("returns empty array when all sections contain Recent News List and hasRecentNews is false", async () => {
    hasRecentNews.mockResolvedValue(false);
    const sections = [sectionWithRecentNewsList(), sectionWithRecentNewsList()];
    const result = await filterSectionsByStaleRecentNews(sections, "en", false);
    expect(result).toHaveLength(0);
  });
});
