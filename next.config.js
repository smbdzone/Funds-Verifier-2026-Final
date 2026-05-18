const bundleAnalyzer = require("@next/bundle-analyzer");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
