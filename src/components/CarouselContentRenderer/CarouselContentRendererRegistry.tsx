import dynamic from "next/dynamic";

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

export const ContentTestimonial = dynamic(
  () =>
    import(
      "src/components/ContentTestimonial/ContentTestimonial.component"
    ).then((m) => ({ default: m.ContentTestimonial })),
  { ssr: true },
);

export const ContentVideoBlock = dynamic(
  () =>
    import("src/components/ContentVideoBlock/ContentVideoBlock.component").then(
      (m) => ({ default: m.ContentVideoBlock }),
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
