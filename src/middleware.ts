import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "src/i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Create our cookie middleware
export async function middleware(request: NextRequest) {
  // Skip middleware for static files and public assets
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/public") ||
    // Only skip if it's a file with an extension (not a route)
    /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif|woff|woff2|ttf|eot|css|js|json|xml|txt|pdf|doc|docx|xls|xlsx|zip|rar|7z|mp4|webm|mp3|wav|ogg)$/i.test(
      request.nextUrl.pathname,
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
     */
    "/((?!api|_next|_vercel).*)",
  ],
};
