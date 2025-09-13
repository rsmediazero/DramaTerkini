import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nchapter.dramaboxdb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sapi.dramaboxdb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nawsvideo.dramaboxdb.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
