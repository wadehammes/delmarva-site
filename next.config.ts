import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = withNextIntl({
  // Performance optimizations
  compress: true,

  // Environment variables
  env: {
    CONTENTFUL_CMA_TOKEN: process.env.CONTENTFUL_CMA_TOKEN,
    CONTENTFUL_CONTENT_DELIVERY_API_KEY:
      process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY,
    CONTENTFUL_PREVIEW_API_KEY: process.env.CONTENTFUL_PREVIEW_API_KEY,
    CONTENTFUL_PREVIEW_SECRET: process.env.CONTENTFUL_PREVIEW_SECRET,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    ENVIRONMENT: process.env.ENVIRONMENT,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    MAPBOX_API_TOKEN: process.env.MAPBOX_API_TOKEN,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },

  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      "@contentful/rich-text-react-renderer",
      "swiper",
      "gsap",
      "react-intersection-observer",
      "react-player",
    ],
  },

  // Optimized headers with better caching
  async headers() {
    try {
      const isProduction = process.env.NODE_ENV === "production";

      return [
        {
          headers: [
            {
              key: "Cache-Control",
              value: isProduction
                ? "public, max-age=3600, stale-while-revalidate=86400"
                : "public, max-age=0, must-revalidate",
            },
            ...securityHeaders,
          ],
          source: "/",
        },
        {
          headers: [
            {
              key: "Cache-Control",
              value: isProduction
                ? "public, max-age=3600, stale-while-revalidate=86400"
                : "public, max-age=0, must-revalidate",
            },
            ...securityHeaders,
          ],
          source: "/:path*",
        },
        // Static assets caching
        {
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
          source: "/_next/static/(.*)",
        },
        {
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=3600, stale-while-revalidate=86400",
            },
          ],
          source: "/api/(.*)",
        },
      ];
    } catch (error) {
      console.error("Error in headers:", error);
      return [];
    }
  },

  // Optimized image configuration for Next.js 16.1
  images: {
    // Enable dangerous allow SVG for better optimization (if needed)
    dangerouslyAllowSVG: false,
    // Optimize device sizes for better performance and reduced bundle size
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ["image/webp", "image/avif"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        hostname: "images.ctfassets.net",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "downloads.ctfassets.net",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "videos.ctfassets.net",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "via.placeholder.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "api.mapbox.com",
        pathname: "/styles/v1/**",
        port: "",
        protocol: "https",
      },
    ],
  },
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
      "node_modules/@esbuild/linux-x64",
    ],
  },
  // Optimize output file tracing to reduce build size and improve cold starts
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/**/*.wasm"],
  },
  poweredByHeader: false,

  // Build optimizations
  productionBrowserSourceMaps: process.env.NODE_ENV === "development",
  reactStrictMode: true,

  // Optimized redirects
  async redirects() {
    try {
      if (process.env.ENVIRONMENT === "production") {
        return [...productionRedirects, ...sharedRedirects];
      }

      return sharedRedirects;
    } catch (error) {
      console.error("Error in redirects:", error);
      return [];
    }
  },

  trailingSlash: false,
  // Note: Turbopack file system caching is enabled by default in Next.js 16.1
  turbopack: {
    rules: {
      "*.svg": {
        as: "*.js",
        loaders: ["@svgr/webpack"],
      },
    },
  },
  webpack(config, { isServer }) {
    try {
      // Resolve symlinks properly for pnpm in serverless environments
      if (isServer) {
        config.resolve.symlinks = true;
      }

      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.(".svg"),
      );

      if (fileLoaderRule) {
        // SVG optimization - simplified
        config.module.rules.push({
          issuer: fileLoaderRule.issuer,
          test: /\.svg$/i,
          use: {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    active: false,
                    name: "removeViewBox",
                  },
                ],
              },
            },
          },
        });

        // Modify the file loader rule to ignore *.svg
        fileLoaderRule.exclude = /\.svg$/i;
      }

      return config;
    } catch (error) {
      console.error("Error in webpack configuration:", error);
      return config;
    }
  },
});

// Redirect test and home slug pages on Production
const sources = ["/:slug(test-page.*)", "/deployments"];

const productionRedirects = sources.map((source) => ({
  destination: "/",
  permanent: true,
  source,
}));

const sharedRedirects = [];

// Enhanced security headers
const scriptSrc = [
  "'self'",
  "'unsafe-eval'",
  "'unsafe-inline'",
  "*.youtube.com",
  "*.vimeo.com",
  "*.google.com",
  "*.google-analytics.com",
  "*.gstatic.com",
  "*.googletagmanager.com",
  "*.vercel-insights.com",
  "*.vercel.app",
  "vercel.live",
  "*.vercel-scripts.com",
  "*.facebook.net",
  "*.facebook.com",
];

const ContentSecurityPolicy = `
  default-src 'self';
  script-src ${scriptSrc.join(" ")};
  child-src *.youtube.com *.vimeo.com *.google.com *.twitter.com vercel.live *.googletagmanager.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com *.typekit.net vercel.live;
  img-src * blob: data: images.ctfassets.net placehold.co;
  media-src * 'self';
  connect-src * 'self' *.vimeocdn.com;
  font-src data: 'self' *.typekit.net vercel.live;
  worker-src 'self' blob: *.vercel.app;
  manifest-src 'self' *.vercel.app;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`;

const securityHeaders = [
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  // Referrer Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Frame Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Content Type Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // DNS Prefetch Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Strict Transport Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Permissions Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // XSS Protection
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

export default nextConfig;
