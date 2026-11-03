import { getPublicHtmlRoutes } from "./scripts/public-html-routes.mjs";

const { rewrites: publicHtmlRewrites, redirects: publicHtmlRedirects } = getPublicHtmlRoutes();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid trailing-slash 301 → 404 chains (SEO recovery brief).
  trailingSlash: false,
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
    const seoRedirects = [
      // Broken schema/OG assets under /images (folder does not exist) → live webp.
      { source: "/images/:path*", destination: "/hero-day.webp", permanent: true },

      // Old single-engine codes → grouped engine pages.
      { source: "/engine/b47", destination: "/engine/b37-b47", permanent: true },
      { source: "/engine/b37", destination: "/engine/b37-b47", permanent: true },
      { source: "/engine/n54", destination: "/engine/n54-n55", permanent: true },
      { source: "/engine/n55", destination: "/engine/n54-n55", permanent: true },
      { source: "/engine/s63", destination: "/engine/s63-s65", permanent: true },
      { source: "/engine/s65", destination: "/engine/s63-s65", permanent: true },
      { source: "/engine/m52b20", destination: "/engine/m50-m52-m54", permanent: true },
      { source: "/engine/m52", destination: "/engine/m50-m52-m54", permanent: true },
      { source: "/engine/m50", destination: "/engine/m50-m52-m54", permanent: true },
      { source: "/engine/m54", destination: "/engine/m50-m52-m54", permanent: true },
      { source: "/engine/n55b30", destination: "/engine/n54-n55", permanent: true },

      // Legacy 3-level model paths → active 2-level routes.
      { source: "/models/:series/:chassis", destination: "/:series/:chassis", permanent: true },
      { source: "/models/:series", destination: "/:series", permanent: true },
      { source: "/4-series/f32/425d", destination: "/4-series/f32", permanent: true },
      { source: "/1-series/e88/125i", destination: "/1-series/e88", permanent: true },
      { source: "/6-series/g32/630i", destination: "/6-series/g32", permanent: true },

      // Legacy failure / quote paths.
      { source: "/failures", destination: "/", permanent: true },
      { source: "/failures/:slug*", destination: "/", permanent: true },
      { source: "/quotes", destination: "/quote", permanent: true },
      { source: "/fault-diagnostic-calculator", destination: "/", permanent: true },
      { source: "/common-faults", destination: "/", permanent: true },
    ];

    return [...seoRedirects, ...publicHtmlRedirects];
  },
  async rewrites() {
    return {
      // Serve public/*.html at clean URLs before App Router catch-all routes run.
      beforeFiles: publicHtmlRewrites,
    };
  },
};

export default nextConfig;
