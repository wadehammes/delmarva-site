import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "src/i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Create our cookie middleware
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/sitemap-") ||
    // Only skip if it's a file with an extension (not a route)
    /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif|woff|woff2|ttf|eot|css|js|json|xml|txt|pdf|doc|docx|xls|xlsx|zip|rar|7z|mp4|webm|mp3|wav|ogg)$/i.test(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap files
     */
    "/((?!api|_next|_vercel|favicon.ico|robots.txt|sitemap).*)",
  ],
};
