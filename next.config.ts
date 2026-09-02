import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/inessogadzi",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
