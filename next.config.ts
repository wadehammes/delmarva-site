import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = withNextIntl({
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
  },
  async headers() {
    return [
      {
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=1, stale-while-revalidate",
          },
          ...securityHeaders,
        ],
        source: "/",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=1, stale-while-revalidate",
          },
          ...securityHeaders,
        ],
        source: "/:path*",
      },
    ];
  },
  images: {
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
    ],
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  async redirects() {
    if (process.env.ENVIRONMENT === "production") {
      return [...productionRedirects, ...sharedRedirects];
    }

    return sharedRedirects;
  },
  trailingSlash: false,
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

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

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
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

// https://securityheaders.com
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
`;
const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

export default nextConfig;
