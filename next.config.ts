import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Canonical direction for compare pairs (reverse pairs were removed)
      { source: '/compare/rishikesh-vs-manali',  destination: '/compare/manali-vs-rishikesh', permanent: true },
      { source: '/compare/jaipur-vs-udaipur',    destination: '/compare/udaipur-vs-jaipur',   permanent: true },
      // Broken pairs that used country/region slugs → send to best city page
      { source: '/compare/bali-vs-thailand',     destination: '/cities/bali',                 permanent: true },
      { source: '/compare/goa-vs-kerala',        destination: '/cities/goa',                  permanent: true },
    ];
  },
  images: {
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
    ],
  },
};

export default nextConfig;
