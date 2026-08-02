import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * On Pages the site is served from https://<user>.github.io/<repo>/, so the
 * workflow sets NEXT_PUBLIC_BASE_PATH=/<repo>. Locally it stays empty and the
 * site runs at the root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
