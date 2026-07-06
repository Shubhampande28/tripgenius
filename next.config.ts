import type { NextConfig } from "next";
import { RETIRED_POST_REDIRECTS } from "./src/lib/postRedirects";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Canonical direction for compare pairs (reverse pairs were removed)
      { source: '/compare/rishikesh-vs-manali',  destination: '/compare/manali-vs-rishikesh', permanent: true },
      { source: '/compare/jaipur-vs-udaipur',    destination: '/compare/udaipur-vs-jaipur',   permanent: true },
      // Broken pairs that used country/region slugs → send to best city page
      { source: '/compare/bali-vs-thailand',     destination: '/cities/bali',                 permanent: true },
      { source: '/compare/goa-vs-kerala',        destination: '/cities/goa',                  permanent: true },
      // Retired thin blog posts → folded into their canonical destination hub.
      // Single source of truth: src/lib/postRedirects.ts (also drives blog SSG).
      ...Object.entries(RETIRED_POST_REDIRECTS).map(([slug, destination]) => ({
        source: `/blog/${slug}`,
        destination,
        permanent: true,
      })),
    ];
  },
  images: {
    // AVIF first (smallest), WebP fallback — smaller bytes = faster LCP.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
