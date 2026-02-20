import type { ContentModuleEntry } from "src/contentful/parseContentModules";
import type { ContentEntries, SectionType } from "src/contentful/parseSections";
import {
  hasContentModule,
  sectionContainsRecentNewsList,
} from "src/utils/contentModules";

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
  backgroundColor: "Black",
  content: [recentNewsListModule()],
  contentLayout: "Single Column",
  id: "section-1",
  sectionPadding: "Regular Padding",
  slug: "section-1",
});

const sectionWithOtherModule = (): SectionType => ({
  backgroundColor: "Black",
  content: [otherModule()],
  contentLayout: "Single Column",
  id: "section-2",
  sectionPadding: "Regular Padding",
  slug: "section-2",
});

const sectionWithMultipleContent = (): SectionType => ({
  backgroundColor: "Black",
  content: [
    {
      fields: {},
      sys: { contentType: { sys: { id: "contentHero" } }, id: "hero-1" },
    } as ContentEntries,
    recentNewsListModule(),
  ],
  contentLayout: "Single Column",
  id: "section-3",
  sectionPadding: "Regular Padding",
  slug: "section-3",
});

describe("sectionContainsRecentNewsList", () => {
  it("returns true when section has a contentModules entry with Recent News List", () => {
    expect(sectionContainsRecentNewsList(sectionWithRecentNewsList())).toBe(
      true,
    );
    expect(sectionContainsRecentNewsList(sectionWithMultipleContent())).toBe(
      true,
    );
  });

  it("returns false when section has no Recent News List module", () => {
    expect(sectionContainsRecentNewsList(sectionWithOtherModule())).toBe(false);
  });

  it("returns false when section is null or has no content", () => {
    expect(sectionContainsRecentNewsList(null)).toBe(false);
    expect(
      sectionContainsRecentNewsList({
        backgroundColor: "Black",
        content: [],
        contentLayout: "Single Column",
        id: "empty",
        sectionPadding: "Regular Padding",
        slug: "empty",
      }),
    ).toBe(false);
    expect(
      sectionContainsRecentNewsList({
        backgroundColor: "Black",
        contentLayout: "Single Column",
        id: "no-content",
        sectionPadding: "Regular Padding",
        slug: "no-content",
      }),
    ).toBe(false);
  });

  it("returns false when section has content but no contentModules", () => {
    const section: SectionType = {
      backgroundColor: "Black",
      content: [
        {
          fields: {},
          sys: { contentType: { sys: { id: "contentHero" } }, id: "h1" },
        } as ContentEntries,
      ],
      contentLayout: "Single Column",
      id: "s1",
      sectionPadding: "Regular Padding",
      slug: "s1",
    };
    expect(sectionContainsRecentNewsList(section)).toBe(false);
  });
});

describe("hasContentModule", () => {
  it("returns true when page has a section containing Recent News List", () => {
    const page = {
      id: "p1",
      sections: [sectionWithRecentNewsList(), sectionWithOtherModule()],
    } as unknown as Parameters<typeof hasContentModule>[0];
    expect(hasContentModule(page, "Recent News List")).toBe(true);
  });

  it("returns true when page has a section containing Featured Services List", () => {
    const page = {
      id: "p2",
      sections: [sectionWithOtherModule()],
    } as unknown as Parameters<typeof hasContentModule>[0];
    expect(hasContentModule(page, "Featured Services List")).toBe(true);
  });

  it("returns false when page has no sections or no matching module", () => {
    const pageWithSections = {
      id: "p3",
      sections: [sectionWithOtherModule()],
    } as unknown as Parameters<typeof hasContentModule>[0];
    expect(hasContentModule(pageWithSections, "Recent News List")).toBe(false);
    expect(
      hasContentModule(
        { id: "p4", sections: [] } as unknown as Parameters<
          typeof hasContentModule
        >[0],
        "Recent News List",
      ),
    ).toBe(false);
    expect(
      hasContentModule(
        { id: "p5" } as unknown as Parameters<typeof hasContentModule>[0],
        "Recent News List",
      ),
    ).toBe(false);
  });
});
