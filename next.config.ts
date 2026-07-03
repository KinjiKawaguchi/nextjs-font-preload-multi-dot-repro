import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The docs (https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions)
  // list this multi-dot pattern as a supported way to colocate non-page files.
  pageExtensions: ["page.tsx"],
};

export default nextConfig;
