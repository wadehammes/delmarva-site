import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Service } from "schema-dts";
import type { ServiceType } from "src/contentful/getServices";
import { organizationId, serviceId } from "src/lib/schema/ids";
import type { SchemaObject } from "src/lib/schema/types";
import { getServiceAreasServed } from "src/utils/areasServed";
import { createMediaUrl } from "src/utils/urlHelpers";

export const buildServiceSchemaFromEntry = async (
  service: ServiceType,
  pageUrl: string,
): Promise<Omit<SchemaObject<Service>, "@context"> | null> => {
  try {
    let description: string | null = null;

    try {
      description = documentToPlainTextString(service.description);
      if (description.length > 500) {
        description = `${description.substring(0, 497)}...`;
      }
    } catch (error) {
      console.warn(
        `Failed to extract plain text from service ${service.serviceName}:`,
        error,
      );
      description = service.metaDescription;
    }

    const areasServed = await getServiceAreasServed(service);

    return {
      "@id": serviceId(pageUrl),
      "@type": "Service",
      areaServed:
        areasServed && areasServed.length > 0
          ? areasServed.map((area) => ({
              "@type": "Place" as const,
              name: area,
            }))
          : null,
      description: description || service.metaDescription,
      image: service.metaImage ? createMediaUrl(service.metaImage.src) : null,
      name: service.serviceName,
      provider: {
        "@id": organizationId(),
      },
      url: pageUrl,
    };
  } catch (error) {
    console.error(
      `Failed to create service schema for ${service.serviceName}:`,
      error,
    );
    return null;
  }
};
