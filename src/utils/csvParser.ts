import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { getFileExtension } from "src/utils/emailHelpers";

/**
 * Validates that a Contentful asset is a CSV file
 */
export function isCsvFile(asset: ContentfulAsset | null | undefined): boolean {
  if (!asset || !asset.src) {
    return false;
  }

  // Extract file extension from URL
  try {
    const url = new URL(asset.src);
    const pathname = url.pathname;
    const extension = getFileExtension(pathname);

    return extension === "csv";
  } catch {
    // If URL parsing fails, try extracting from src directly
    const extension = getFileExtension(asset.src);
    return extension === "csv";
  }
}

/**
 * Fetches and parses a CSV file from a Contentful asset URL
 * Returns null if file is not a CSV or cannot be parsed
 */
export async function parseCountiesFromCsv(
  csvAsset: ContentfulAsset | null | undefined,
): Promise<string[] | null> {
  // Validate CSV file
  if (!isCsvFile(csvAsset)) {
    return null;
  }

  if (!csvAsset?.src) {
    return null;
  }

  try {
    // Fetch CSV content
    const response = await fetch(csvAsset.src);

    if (!response.ok) {
      console.warn(`Failed to fetch CSV file: ${csvAsset.src}`);
      return null;
    }

    const csvText = await response.text();

    // Parse CSV
    const lines = csvText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return null;
    }

    // Skip header if it looks like a header (contains "County" or "county")
    const startIndex = lines[0]?.toLowerCase().includes("county") ? 1 : 0;

    const counties = lines
      .slice(startIndex)
      .map((line) => {
        // Handle CSV with quotes - remove outer quotes first
        const cleaned = line.replace(/^"|"$/g, "").trim();

        // If the line has quotes, the entire value (including commas) is one field
        // If no quotes, it might be comma-separated, so take the first column
        if (line.startsWith('"') && line.endsWith('"')) {
          // Entire line is one quoted field (e.g., "Accomack County, VA")
          return cleaned;
        }

        // Not quoted, might be comma-separated - take first column
        const firstColumn = cleaned.split(",")[0].trim();
        return firstColumn;
      })
      .filter((county) => county.length > 0);

    return counties.length > 0 ? counties : null;
  } catch (error) {
    console.error("Error parsing CSV file:", error);
    return null;
  }
}
