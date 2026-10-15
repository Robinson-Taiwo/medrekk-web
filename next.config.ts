import type { NextConfig } from "next";

const noReferrer = [{ key: "Referrer-Policy", value: "no-referrer" }];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.46.186.135"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/referral/:path*", headers: noReferrer },
      { source: "/access/:path*", headers: noReferrer },
    ];
  },
};

export default nextConfig;
