import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Embedded Sanity Studio: transpile Sanity + styled-components for the App Router. */
  transpilePackages: ["sanity", "@sanity/vision", "styled-components"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [50, 65, 75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 31536000, // 1 year
  },
};

export default nextConfig;
