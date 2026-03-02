import type { ServiceCountiesMapColor } from "src/contentful/getServices";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import {
  isTypeContentAreasServicedMap,
  type TypeContentAreasServicedMapFields,
  type TypeContentAreasServicedMapWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeContentAreasServicedMap";
import {
  isTypeService,
  type TypeServiceWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeService";
import { isCsvFile } from "src/utils/csvParser";

export interface ServiceForMap {
  id: string;
  serviceCountiesCsv: ContentfulAsset | null;
  serviceCountiesMapColor?: ServiceCountiesMapColor | null;
  serviceName: string;
  slug: string;
}

export interface ContentAreasServicedMap {
  entryTitle?: string;
  services: ServiceForMap[];
}

const _validateContentAreasServicedMapCheck: ContentfulTypeCheck<
  ContentAreasServicedMap,
  TypeContentAreasServicedMapFields
> = true;

export type ContentAreasServicedMapEntry =
  | TypeContentAreasServicedMapWithoutUnresolvableLinksResponse
  | undefined;

function parseServiceForMap(
  serviceEntry: TypeServiceWithoutUnresolvableLinksResponse | undefined,
): ServiceForMap | null {
  if (
    !serviceEntry ||
    !("fields" in serviceEntry) ||
    !isTypeService(serviceEntry)
  ) {
    return null;
  }

  const { fields } = serviceEntry;

  return {
    id: serviceEntry.sys.id,
    serviceCountiesCsv: parseContentfulAsset(fields.serviceCountiesCsv),
    serviceCountiesMapColor: fields.serviceCountiesMapColor ?? null,
    serviceName: fields.serviceName,
    slug: fields.slug,
  };
}

export function parseContentAreasServicedMap(
  entry: ContentAreasServicedMapEntry,
): ContentAreasServicedMap | null {
  if (!entry || !("fields" in entry) || !isTypeContentAreasServicedMap(entry)) {
    return null;
  }

  const services = (entry.fields.services ?? [])
    .map((s) =>
      parseServiceForMap(s as TypeServiceWithoutUnresolvableLinksResponse),
    )
    .filter(
      (s): s is ServiceForMap => s !== null && isCsvFile(s.serviceCountiesCsv),
    );

  return {
    entryTitle: entry.fields.entryTitle,
    services,
  };
}
