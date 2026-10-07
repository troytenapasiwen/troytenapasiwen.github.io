import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",              // generate static HTML into /out
  images: { unoptimized: true }, // GitHub Pages has no image-optimization server
  trailingSlash: true,           // /projects/x/ resolves reliably on Pages
};

export default nextConfig;