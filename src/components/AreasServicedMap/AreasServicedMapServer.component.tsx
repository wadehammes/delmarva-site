import { draftMode } from "next/headers";
import { fetchServices } from "src/contentful/getServices";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import { AreasServicedMap } from "./AreasServicedMap.component";

interface AreasServicedMapServerProps {
  className?: string;
  contentLayout?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  autoFitBounds?: boolean;
  locale?: string;
}

/**
 * Server component that fetches services from Contentful and passes them to AreasServicedMap
 */
export const AreasServicedMapServer = async (
  props?: AreasServicedMapServerProps,
) => {
  try {
    const draft = await draftMode();
    const locale = await getServerLocaleSafe(props?.locale);

    const services = await fetchServices({
      locale,
      preview: draft.isEnabled,
    });

    return (
      <AreasServicedMap
        autoFitBounds={props?.autoFitBounds}
        center={props?.center}
        className={props?.className}
        height={props?.height}
        services={services}
        zoom={props?.zoom}
      />
    );
  } catch (error) {
    console.error("[AreasServicedMapServer] Failed to load:", error);
    return null;
  }
};
