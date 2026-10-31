import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
};

export default nextConfig;
