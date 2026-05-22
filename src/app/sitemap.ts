import { MetadataRoute } from 'next';
import { getAllCitySlugs, cities } from '@/lib/cities';

const BASE = 'https://www.tripgenius.in';
const NOW  = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const allSlugs = getAllCitySlugs();

  // Full guide cities get highest priority
  const fullGuideSlugs = new Set(cities.map((c) => c.slug));

  const cityPages = allSlugs.map((slug) => ({
    url: `${BASE}/cities/${slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: fullGuideSlugs.has(slug) ? 0.9 : 0.7,
  }));

  return [
    // Core pages
    { url: BASE,               lastModified: NOW, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/cities`,   lastModified: NOW, changeFrequency: 'weekly',  priority: 0.95 },

    // All city guides
    ...cityPages,
  ];
}
