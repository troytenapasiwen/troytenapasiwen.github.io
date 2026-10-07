import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // generate static HTML into /out
  images: { unoptimized: true }, // Pages has no image-optimization server
  trailingSlash: true,       // /projects/x/ works reliably on GitHub Pages
};

export default nextConfig;