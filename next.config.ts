import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // allow any https image URL (for gallery links)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;