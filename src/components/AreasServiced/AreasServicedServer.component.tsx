import { draftMode } from "next/headers";
import { fetchServices } from "src/contentful/getServices";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import { AreasServiced } from "./AreasServiced.component";

interface AreasServicedServerProps {
  className?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  autoFitBounds?: boolean;
  locale?: string;
}

/**
 * Server component that fetches services from Contentful and passes them to AreasServiced
 */
export const AreasServicedServer = async (props?: AreasServicedServerProps) => {
  const draft = await draftMode();
  const locale = await getServerLocaleSafe(props?.locale);

  const services = await fetchServices({
    locale,
    preview: draft.isEnabled,
  });

  return (
    <AreasServiced
      autoFitBounds={props?.autoFitBounds}
      center={props?.center}
      className={props?.className}
      height={props?.height}
      services={services}
      zoom={props?.zoom}
    />
  );
};
