import { getPublicHtmlRoutes } from "./scripts/public-html-routes.mjs";

const { rewrites: publicHtmlRewrites, redirects: publicHtmlRedirects } = getPublicHtmlRoutes();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve /public images as-is. The Vercel image optimizer for this account returns
    // 402 (quota used up), which left every next/image on the live site blank.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return publicHtmlRedirects;
  },
  async rewrites() {
    return {
      // Serve public/*.html at clean URLs before App Router catch-all routes run.
      beforeFiles: publicHtmlRewrites,
    };
  },
};

export default nextConfig;
