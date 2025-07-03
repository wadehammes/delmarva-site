import { draftMode } from "next/headers";
import { ServiceAccordion } from "src/components/ServiceAccordion/ServiceAccordion.component";
import { fetchFeaturedServices } from "src/contentful/getServices";
import { getLocale } from "src/i18n/getLocale";

const ourServicesTitle = {
  en: "Our Services",
  es: "Nuestros Servicios",
};

export const FeaturedServices = async () => {
  const draft = await draftMode();
  const locale = await getLocale();

  const services = await fetchFeaturedServices({
    locale,
    preview: draft.isEnabled,
  });

  return (
    <>
      <h2>{ourServicesTitle[locale]}</h2>
      {services.map((service) => (
        <ServiceAccordion key={service.id} service={service} />
      ))}
    </>
  );
};
