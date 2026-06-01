import { MetadataRoute } from 'next';
import { allCities, cities } from '@/lib/cities';
import { allPosts } from '@/lib/blog';

const BASE = 'https://www.tripgenius.in';
const NOW  = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const indexableCities = allCities.filter((c) => !c.stub);
  const fullGuideSlugs = new Set(cities.map((c) => c.slug));

  const cityPages = indexableCities.map((city) => ({
    url: `${BASE}/cities/${city.slug}`,
    lastModified: NOW,
    // weekly = Google crawls more often = fresher rankings
    changeFrequency: 'weekly' as const,
    // Full guide cities get 0.9, stub cities get 0.6
    priority: fullGuideSlugs.has(city.slug) ? 0.9 : 0.6,
  }));

  const blogPages = allPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    // Core pages
    { url: BASE,                       lastModified: NOW, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/cities`,           lastModified: NOW, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE}/blog`,             lastModified: NOW, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/about`,            lastModified: NOW, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,          lastModified: NOW, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy-policy`,   lastModified: NOW, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,            lastModified: NOW, changeFrequency: 'yearly',  priority: 0.3 },

    // Blog articles
    ...blogPages,

    // City guides
    ...cityPages,
  ];
}
