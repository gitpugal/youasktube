import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"], // Add Google's image domain
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
