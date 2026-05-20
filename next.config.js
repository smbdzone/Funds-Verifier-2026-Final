const bundleAnalyzer = require("@next/bundle-analyzer");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";

const apiConnectOrigins = [];
let isLocalApi = false;
try {
  const apiBase =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";
  const { origin, hostname } = new URL(apiBase.trim());
  apiConnectOrigins.push(origin);
  isLocalApi = hostname === "localhost" || hostname === "127.0.0.1";
  if (hostname === "localhost") {
    apiConnectOrigins.push(origin.replace("localhost", "127.0.0.1"));
  }
} catch {
  apiConnectOrigins.push("http://localhost:4000", "http://127.0.0.1:4000");
  isLocalApi = true;
}

// Allow http/ws when running against a local API, even if .env sets NODE_ENV=production
const allowInsecureLocal = isDev || isLocalApi;

const connectSrc = [
  "'self'",
  "https:",
  "wss:",
  ...apiConnectOrigins,
  ...(allowInsecureLocal ? ["http:", "ws:"] : []),
].join(" ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  ...(isDev
    ? []
    : [
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      },
    ]),
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  outputFileTracingRoot: path.join(__dirname),
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    // Serve images directly from the source instead of through Next.js's
    // /_next/image proxy. The proxy fetches from Node (no browser UA), which
    // CloudFront's WAF blocks with HTTP 403 "Request blocked", so optimized
    // requests for signed CloudFront URLs fail. Letting the browser fetch
    // signed URLs directly avoids the WAF block.
    unoptimized: true,
    domains: [
      "res.cloudinary.com",
      "dupgkyd9ugd07.cloudfront.net",
      "oddball-piglet.net",
      "localhost",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dupgkyd9ugd07.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oddball-piglet.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      // Allow S3 direct URLs for backward compatibility (if needed)
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.d\.ts$/,
        loader: "ignore-loader",
      },
      {
        test: /\.d\.ts\.map$/,
        loader: "ignore-loader",
      },
      {
        test: /\.map$/,
        loader: "ignore-loader",
      }
    );

    // Suppress punycode deprecation warning
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false,
    };

    return config;
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
