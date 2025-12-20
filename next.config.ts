import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagescf.dealercenter.net",
      },
    ],
  },
};

export default nextConfig;
