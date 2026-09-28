import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tekhaybio-dev.vercel.app",
        pathname: "/api/media/file/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
    ],
  },
};

export default withPayload(nextConfig);
