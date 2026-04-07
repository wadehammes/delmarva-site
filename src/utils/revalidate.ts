/**
 * Shared Next.js cache window for `unstable_cache` and non-route code: indefinite in
 * production (until redeploy / on-demand invalidation), 1 day in other ENVIRONMENT
 * values (local, staging, preview, etc.).
 *
 * Route segment `export const revalidate` must **not** import this constant—Next.js
 * requires a statically analyzable expression in each page file. Duplicate the same
 * `process.env.ENVIRONMENT === "production" ? false : …` line there (see handbook).
 */
export const APP_REVALIDATE: number | false =
  process.env.ENVIRONMENT === "production" ? false : 60 * 60 * 24;
