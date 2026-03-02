import { draftMode } from "next/headers";
import { fetchMarkets, fetchProjectsByMarket } from "src/contentful/getMarkets";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import type { Locales } from "src/i18n/routing";
import { AllMarketsList } from "./AllMarketsList.component";

interface AllMarketsListServerProps {
  locale?: string;
}

export const AllMarketsListServer = async (
  props?: AllMarketsListServerProps,
) => {
  const draft = await draftMode();
  const locale = await getServerLocaleSafe(props?.locale);

  const markets = await fetchMarkets({
    locale: locale as Locales,
    preview: draft.isEnabled,
  });

  const marketsWithProjects = await Promise.all(
    markets.map(async (market) => {
      const projects = await fetchProjectsByMarket({
        locale: locale as Locales,
        marketId: market.id,
        preview: draft.isEnabled,
      });
      return { market, projects };
    }),
  );

  return (
    <AllMarketsList
      locale={locale as Locales}
      marketsWithProjects={marketsWithProjects}
    />
  );
};
