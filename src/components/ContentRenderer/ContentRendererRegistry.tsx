import dynamic from "next/dynamic";

export const ContentCard = dynamic(
  () =>
    import("src/components/ContentCard/ContentCard.component").then((m) => ({
      default: m.ContentCard,
    })),
  { ssr: true },
);

export const ContentCarouselComponent = dynamic(
  () =>
    import("src/components/ContentCarousel/ContentCarousel.component").then(
      (m) => ({ default: m.ContentCarouselComponent }),
    ),
  { ssr: true },
);

export const ContentCopyBlock = dynamic(
  () =>
    import("src/components/ContentCopyBlock/ContentCopyBlock.component").then(
      (m) => ({ default: m.ContentCopyBlock }),
    ),
  { ssr: true },
);

export const ContentCopyMediaBlock = dynamic(
  () =>
    import(
      "src/components/ContentCopyMediaBlock/ContentCopyMediaBlock.component"
    ).then((m) => ({ default: m.ContentCopyMediaBlock })),
  { ssr: true },
);

export const ContentGrid = dynamic(
  () =>
    import("src/components/ContentGrid/ContentGrid.component").then((m) => ({
      default: m.ContentGrid,
    })),
  { ssr: true },
);

export const ContentHeroComponent = dynamic(
  () =>
    import("src/components/ContentHero/ContentHero.component").then((m) => ({
      default: m.ContentHeroComponent,
    })),
  { ssr: true },
);

export const ContentImageBlock = dynamic(
  () =>
    import("src/components/ContentImageBlock/ContentImageBlock.component").then(
      (m) => ({ default: m.ContentImageBlock }),
    ),
  { ssr: true },
);

export const ContentMarquee = dynamic(
  () =>
    import("src/components/ContentMarquee/ContentMarquee.component").then(
      (m) => ({ default: m.ContentMarquee }),
    ),
  { ssr: true },
);

export const ContentModules = dynamic(
  () =>
    import("src/components/ContentModules/ContentModules.component").then(
      (m) => ({ default: m.ContentModules }),
    ),
  { ssr: true },
);

export const ContentRecentNews = dynamic(
  () =>
    import("src/components/ContentRecentNews/ContentRecentNews.component").then(
      (m) => ({ default: m.ContentRecentNews }),
    ),
  { ssr: true },
);

export const ContentTestimonial = dynamic(
  () =>
    import(
      "src/components/ContentTestimonial/ContentTestimonial.component"
    ).then((m) => ({ default: m.ContentTestimonial })),
  { ssr: true },
);

export const JoinOurTeam = dynamic(
  () =>
    import("src/components/JoinOurTeamForm/JoinOurTeamForm.component").then(
      (m) => ({ default: m.JoinOurTeam }),
    ),
  { ssr: true },
);

export const Stat = dynamic(
  () =>
    import("src/components/Stat/Stat.component").then((m) => ({
      default: m.Stat,
    })),
  { ssr: true },
);

export const AllProjectsList = dynamic(
  () =>
    import("src/components/AllProjectsList/AllProjectsList.component").then(
      (m) => ({ default: m.AllProjectsList }),
    ),
  { ssr: true },
);

export const FormRenderer = dynamic(
  () =>
    import("src/components/FormRenderer/FormRenderer.component").then((m) => ({
      default: m.FormRenderer,
    })),
  { ssr: true },
);
