import { MetadataRoute } from 'next';
import { getAllCitySlugs } from '@/lib/cities';

const BASE = 'https://www.tripgenius.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllCitySlugs();

  const cityPages = slugs.map((slug) => ({
    url: `${BASE}/cities/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const cheatsheetPages = slugs.map((slug) => ({
    url: `${BASE}/cheatsheet/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/cities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...cityPages,
    ...cheatsheetPages,
  ];
}
