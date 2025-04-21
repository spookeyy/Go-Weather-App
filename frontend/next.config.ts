import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <-- enable static export
  trailingSlash: true, // <-- needed for Netlify to serve sub-routes properly
};

export default nextConfig;
