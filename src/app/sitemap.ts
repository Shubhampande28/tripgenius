import { MetadataRoute } from 'next';
import { allCities, cities } from '@/lib/cities';

const BASE = 'https://www.tripgenius.in';
const NOW  = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  // Exclude stub cities (auto-generated, thin content) from sitemap
  const indexableCities = allCities.filter((c) => !c.stub);

  // Full guide cities get highest priority
  const fullGuideSlugs = new Set(cities.map((c) => c.slug));

  const cityPages = indexableCities.map((city) => ({
    url: `${BASE}/cities/${city.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly' as const,
    priority: fullGuideSlugs.has(city.slug) ? 0.9 : 0.7,
  }));

  return [
    // Core pages
    { url: BASE,               lastModified: NOW, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/cities`,   lastModified: NOW, changeFrequency: 'weekly',  priority: 0.95 },

    // All city guides
    ...cityPages,
  ];
}
