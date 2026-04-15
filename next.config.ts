import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  logging: {
    browserToTerminal: "error",
  },
};

export default nextConfig;
