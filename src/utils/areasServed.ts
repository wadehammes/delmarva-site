import type { ServiceType } from "src/contentful/getServices";
import { parseCountiesFromCsv } from "src/utils/csvParser";

/**
 * Aggregates unique counties from all services that have CSV data
 * @param services - Array of services to process
 * @returns Array of unique county names formatted for Schema.org areaServed
 */
export async function aggregateAreasServedFromServices(
  services: ServiceType[],
): Promise<string[]> {
  const countySet = new Set<string>();

  const countyPromises = services.map(async (service) => {
    if (!service.serviceCountiesCsv) {
      return null;
    }

    try {
      const counties = await parseCountiesFromCsv(service.serviceCountiesCsv);
      return counties;
    } catch (error) {
      console.warn(
        `Failed to parse CSV for service ${service.serviceName}:`,
        error,
      );
      return null;
    }
  });

  const countyArrays = await Promise.all(countyPromises);

  for (const counties of countyArrays) {
    if (counties && Array.isArray(counties)) {
      for (const county of counties) {
        if (county && typeof county === "string" && county.trim().length > 0) {
          countySet.add(county.trim());
        }
      }
    }
  }

  return Array.from(countySet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/**
 * Gets areas served for a single service from its CSV data
 * @param service - The service to process
 * @returns Array of county names or null if no CSV data
 */
export async function getServiceAreasServed(
  service: ServiceType,
): Promise<string[] | null> {
  if (!service.serviceCountiesCsv) {
    return null;
  }

  try {
    const counties = await parseCountiesFromCsv(service.serviceCountiesCsv);
    return counties;
  } catch (error) {
    console.warn(
      `Failed to parse CSV for service ${service.serviceName}:`,
      error,
    );
    return null;
  }
}
