import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // ✅ Keep or remove if not needed
  },
  images: {
    domains: ["localhost"],
  },
  eslint: {
    // Skip ESLint during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
