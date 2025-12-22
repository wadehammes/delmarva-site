import type { Page } from "src/contentful/getPages";
import { SERVICES_PAGE_SLUG } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export interface BreadcrumbItem {
  "@type": "ListItem";
  name: string;
  position: number;
  item?: string;
}

/**
 * Generates breadcrumb trail for Schema.org BreadcrumbList
 * @param page - The page data
 * @param slug - The page slug
 * @param locale - The locale
 * @param additionalItems - Additional breadcrumb items to append (e.g., service name)
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(
  page: Page | null,
  slug: string,
  _locale: string,
  additionalItems?: Array<{ name: string; url?: string }>,
): BreadcrumbItem[] {
  const baseUrl = envUrl();
  const breadcrumbs: BreadcrumbItem[] = [];

  breadcrumbs.push({
    "@type": "ListItem",
    item: baseUrl,
    name: "Home",
    position: 0,
  });

  if (slug === "home" || slug === "") {
    return breadcrumbs;
  }

  if (slug.startsWith(`${SERVICES_PAGE_SLUG}/`)) {
    breadcrumbs.push({
      "@type": "ListItem",
      item: `${baseUrl}/${SERVICES_PAGE_SLUG}`,
      name: "What We Deliver",
      position: 1,
    });

    if (additionalItems && additionalItems.length > 0) {
      const serviceItem = additionalItems[0];

      breadcrumbs.push({
        "@type": "ListItem",
        item: serviceItem.url || `${baseUrl}/${slug}`,
        name: serviceItem.name,
        position: 2,
      });
    }

    return breadcrumbs;
  }

  if (page?.title) {
    breadcrumbs.push({
      "@type": "ListItem",
      item: `${baseUrl}/${slug}`,
      name: page.title,
      position: 1,
    });
  } else if (slug) {
    const pageName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumbs.push({
      "@type": "ListItem",
      item: `${baseUrl}/${slug}`,
      name: pageName,
      position: 1,
    });
  }

  if (additionalItems && additionalItems.length > 0) {
    let position = breadcrumbs.length;
    for (const item of additionalItems) {
      breadcrumbs.push({
        "@type": "ListItem",
        item: item.url || `${baseUrl}/${slug}`,
        name: item.name,
        position,
      });
      position += 1;
    }
  }

  return breadcrumbs;
}
