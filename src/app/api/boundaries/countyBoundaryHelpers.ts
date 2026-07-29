import {
  MAX_COUNTIES_PER_REQUEST,
  MAX_COUNTY_NAME_LENGTH,
} from "src/utils/countyBoundaryLimits";
import type { GeoJSONFeature } from "./countyBoundaryTypes";

const stateAbbreviations: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  DC: "DC",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

export const stateFipsCodes: Record<string, string> = {
  AK: "02",
  AL: "01",
  AR: "05",
  AZ: "04",
  CA: "06",
  CO: "08",
  CT: "09",
  DC: "11",
  DE: "10",
  FL: "12",
  GA: "13",
  HI: "15",
  IA: "19",
  ID: "16",
  IL: "17",
  IN: "18",
  KS: "20",
  KY: "21",
  LA: "22",
  MA: "25",
  MD: "24",
  ME: "23",
  MI: "26",
  MN: "27",
  MO: "29",
  MS: "28",
  MT: "30",
  NC: "37",
  ND: "38",
  NE: "31",
  NH: "33",
  NJ: "34",
  NM: "35",
  NV: "32",
  NY: "36",
  OH: "39",
  OK: "40",
  OR: "41",
  PA: "42",
  RI: "44",
  SC: "45",
  SD: "46",
  TN: "47",
  TX: "48",
  UT: "49",
  VA: "51",
  VT: "50",
  WA: "53",
  WI: "55",
  WV: "54",
  WY: "56",
};

const canadianProvinces = [
  "alberta",
  "british columbia",
  "manitoba",
  "new brunswick",
  "newfoundland",
  "northwest territories",
  "nova scotia",
  "nunavut",
  "ontario",
  "prince edward island",
  "quebec",
  "saskatchewan",
  "yukon",
];

export type MapboxGeocodingFeature = {
  place_name?: string;
  center?: [number, number];
  context?: Array<{ text?: string; short_code?: string }>;
  geometry?: {
    type?: string;
    coordinates?: [number, number];
  };
  properties?: {
    place_type?: string[];
  };
};

export const normalizeCountyBatch = (counties: unknown): string[] | null => {
  if (!Array.isArray(counties) || counties.length === 0) {
    return null;
  }

  if (counties.length > MAX_COUNTIES_PER_REQUEST) {
    return null;
  }

  const normalized = counties
    .filter((county): county is string => typeof county === "string")
    .map((county) => county.trim())
    .filter(Boolean);

  if (normalized.length === 0) {
    return null;
  }

  if (normalized.some((county) => county.length > MAX_COUNTY_NAME_LENGTH)) {
    return null;
  }

  return normalized;
};

export const normalizeApostrophes = (value: string): string =>
  value.replace(/[\u2018\u2019\u201A\u2032`´]/g, "'");

export const normalizeCountyNameForLookup = (name: string): string =>
  normalizeApostrophes(name)
    .toLowerCase()
    .replace(/ county$/i, "")
    .replace(/['"]/g, "")
    .replace(/\./g, "")
    .trim();

export const parseCountyInput = (
  county: string,
): { countyName: string; stateAbbr: string; stateFips: string } | null => {
  const parts = normalizeApostrophes(county)
    .split(",")
    .map((part) => part.trim());
  if (parts.length < 2) {
    return null;
  }

  const countyName = parts[0].replace(/ County$/, "").trim();
  const stateName = parts[1].trim();
  const stateAbbr =
    stateName.length === 2
      ? stateName.toUpperCase()
      : stateAbbreviations[stateName] || stateName.toUpperCase();
  const stateFips = stateFipsCodes[stateAbbr] || "";

  if (!stateFips) {
    return null;
  }

  return { countyName, stateAbbr, stateFips };
};

export const addCountyLookupAliases = (
  lookup: Map<string, GeoJSONFeature>,
  normalizedName: string,
  featureStateFips: string,
  feature: GeoJSONFeature,
): void => {
  if (normalizedName.includes("prince george")) {
    lookup.set(`prince george,${featureStateFips}`, feature);
  }
  if (
    normalizedName.includes("st. mary") ||
    normalizedName.includes("st mary")
  ) {
    lookup.set(`st. mary's,${featureStateFips}`, feature);
    lookup.set(`st mary's,${featureStateFips}`, feature);
  }
  if (normalizedName.includes("queen anne")) {
    lookup.set(`queen anne's,${featureStateFips}`, feature);
  }
};

export const isCanadianMapboxFeature = (
  feature: MapboxGeocodingFeature,
): boolean => {
  const placeName = feature.place_name?.toLowerCase() || "";
  const context = feature.context || [];

  return (
    placeName.includes(", canada") ||
    placeName.includes("canada,") ||
    context.some((ctx) =>
      canadianProvinces.some((province) =>
        ctx.text?.toLowerCase().includes(province),
      ),
    )
  );
};

const featureMatchesState = (
  feature: MapboxGeocodingFeature,
  stateAbbr: string,
): boolean => {
  const placeName = feature.place_name?.toLowerCase() || "";
  const stateLower = stateAbbr.toLowerCase();
  const context = feature.context || [];

  return (
    placeName.includes(`, ${stateLower}`) ||
    placeName.includes(`, ${stateLower},`) ||
    placeName.includes(`, ${stateLower} `) ||
    context.some((ctx) => {
      const shortCode = ctx.short_code?.toUpperCase() ?? "";
      return (
        shortCode === stateAbbr ||
        shortCode === `US-${stateAbbr}` ||
        shortCode.endsWith(`-${stateAbbr}`) ||
        ctx.text?.toLowerCase().includes(stateLower)
      );
    })
  );
};

export const isUSMapboxFeature = (
  feature: MapboxGeocodingFeature,
  expectedStateAbbr?: string,
): boolean => {
  if (isCanadianMapboxFeature(feature)) {
    return false;
  }

  if (expectedStateAbbr && !featureMatchesState(feature, expectedStateAbbr)) {
    return false;
  }

  const hasUSState = Object.keys(stateFipsCodes).some((stateAbbr) => {
    return featureMatchesState(feature, stateAbbr);
  });

  const coords =
    feature.geometry?.type === "Point"
      ? feature.geometry.coordinates
      : feature.center;
  const isInUSBounds =
    coords &&
    coords[0] >= -125 &&
    coords[0] <= -66 &&
    coords[1] >= 25 &&
    coords[1] <= 49;

  return Boolean(hasUSState || isInUSBounds);
};

export const selectMapboxCountyFeature = (
  features: MapboxGeocodingFeature[],
  countyQuery: string,
  expectedStateAbbr?: string,
): MapboxGeocodingFeature | null => {
  const countyPart =
    normalizeApostrophes(countyQuery).split(",")[0]?.trim().toLowerCase() ??
    countyQuery.toLowerCase();

  const countyFeatures = features.filter((feature) => {
    const placeName = feature.place_name?.toLowerCase() || "";
    const placeTypes = feature.properties?.place_type || [];
    const geometryType = feature.geometry?.type;
    const hasPolygonGeometry =
      geometryType === "Polygon" || geometryType === "MultiPolygon";

    return (
      (placeName.includes("county") || placeTypes.includes("place")) &&
      (hasPolygonGeometry ||
        placeName.includes(countyPart) ||
        placeName.includes(countyQuery.toLowerCase()))
    );
  });

  const sortedFeatures = countyFeatures.sort((a, b) => {
    const aType = a.geometry?.type;
    const bType = b.geometry?.type;
    const aHasPolygon = aType === "Polygon" || aType === "MultiPolygon";
    const bHasPolygon = bType === "Polygon" || bType === "MultiPolygon";

    if (aHasPolygon && !bHasPolygon) {
      return -1;
    }
    if (!aHasPolygon && bHasPolygon) {
      return 1;
    }
    return 0;
  });

  const candidates = sortedFeatures.length > 0 ? sortedFeatures : features;

  return (
    candidates.find((feature) =>
      isUSMapboxFeature(feature, expectedStateAbbr),
    ) ?? null
  );
};
