import "server-only";
import dynamic from "next/dynamic";

export const AllMarketsListServer = dynamic(
  () =>
    import("src/components/AllMarketsList/AllMarketsListServer.component").then(
      (m) => ({ default: m.AllMarketsListServer }),
    ),
  { ssr: true },
);

export const AllServicesListServer = dynamic(
  () =>
    import(
      "src/components/AllServicesList/AllServicesListServer.component"
    ).then((m) => ({ default: m.AllServicesListServer })),
  { ssr: true },
);

export const AreasServicedListServer = dynamic(
  () =>
    import(
      "src/components/AreasServicedList/AreasServicedListServer.component"
    ).then((m) => ({ default: m.AreasServicedListServer })),
  { ssr: true },
);

export const ContentRecentNewsList = dynamic(
  () =>
    import(
      "src/components/ContentRecentNewsList/ContentRecentNewsList.component"
    ).then((m) => ({ default: m.ContentRecentNewsList })),
  { ssr: true },
);

export const FeaturedServices = dynamic(
  () =>
    import("src/components/FeaturedServices/FeaturedServices.component").then(
      (m) => ({ default: m.FeaturedServices }),
    ),
  { ssr: true },
);
