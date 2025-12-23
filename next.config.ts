import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagescf.dealercenter.net",
      },
    ],
    // Include larger sizes for high-resolution displays
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

export default nextConfig;
