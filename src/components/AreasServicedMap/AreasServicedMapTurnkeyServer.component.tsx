import { draftMode } from "next/headers";
import { fetchServices } from "src/contentful/getServices";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import { TURNKEY_SERVICE_SLUG } from "src/utils/constants";
import { AreasServicedMap } from "./AreasServicedMap.component";

interface AreasServicedMapTurnkeyServerProps {
  className?: string;
  contentLayout?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  autoFitBounds?: boolean;
  locale?: string;
}

export const AreasServicedMapTurnkeyServer = async (
  props?: AreasServicedMapTurnkeyServerProps,
) => {
  try {
    const draft = await draftMode();
    const locale = await getServerLocaleSafe(props?.locale);

    const services = await fetchServices({
      locale,
      preview: draft.isEnabled,
    });

    const turnkeyServices = services.filter(
      (service) => service.slug === TURNKEY_SERVICE_SLUG,
    );

    if (turnkeyServices.length === 0) {
      return null;
    }

    return (
      <AreasServicedMap
        autoFitBounds={props?.autoFitBounds}
        center={props?.center}
        className={props?.className}
        height={props?.height}
        services={turnkeyServices}
        zoom={props?.zoom}
      />
    );
  } catch (error) {
    console.error("[AreasServicedMapTurnkeyServer] Failed to load:", error);
    return null;
  }
};
