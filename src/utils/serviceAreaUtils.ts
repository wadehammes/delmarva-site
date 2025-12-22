import type { ServiceType } from "src/contentful/getServices";
import { mapServiceColorToCss } from "src/utils/colorMapper";
import { parseCountiesFromCsv } from "src/utils/csvParser";

export interface ServiceArea {
  color: string;
  counties: string[];
  serviceName: string;
  serviceSlug: string;
}

/**
 * Converts a ServiceType to a ServiceArea if it has valid CSV data
 * Returns null if service should be excluded (no CSV or invalid file type)
 */
export async function parseServiceToServiceArea(
  service: ServiceType,
): Promise<ServiceArea | null> {
  // Validate CSV file exists and is actually a CSV
  const counties = await parseCountiesFromCsv(service.serviceCountiesCsv);

  if (!counties || counties.length === 0) {
    return null;
  }

  // Get color (default to red if missing)
  const color = mapServiceColorToCss(
    service.serviceCountiesMapColor ?? undefined,
  );

  return {
    color,
    counties,
    serviceName: service.serviceName,
    serviceSlug: service.slug,
  };
}

/**
 * Filters and converts multiple services to service areas
 * Only includes services with valid CSV files
 */
export async function parseServicesToServiceAreas(
  services: ServiceType[],
): Promise<ServiceArea[]> {
  const serviceAreaPromises = services.map(parseServiceToServiceArea);
  const serviceAreas = await Promise.all(serviceAreaPromises);

  // Filter out null values (services without valid CSV)
  return serviceAreas.filter((area): area is ServiceArea => area !== null);
}
