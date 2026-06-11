import { MetadataRoute } from 'next';
import { allCities, cities } from '@/lib/cities';
import { allPosts } from '@/lib/blog';
import { countries } from '@/data/countries';
import { COMPARISONS, comparisonSlug } from '@/lib/comparisons';
import { getAllItinerarySlugs } from '@/lib/itineraries';

const BASE = 'https://www.tripgenius.in';

// Bump this date manually when city/country/itinerary/listing content is
// meaningfully updated. Using new Date() here would mark every page as
// "modified today" on every deploy, making the lastModified signal
// meaningless to crawlers (and search engines may start ignoring it).
const CONTENT_UPDATED = new Date('2026-06-10');

export default function sitemap(): MetadataRoute.Sitemap {
  const indexableCities = allCities.filter((c) => !c.stub);
  const fullGuideSlugs = new Set(cities.map((c) => c.slug));

  const cityPages = indexableCities.map((city) => ({
    url: `${BASE}/cities/${city.slug}`,
    lastModified: CONTENT_UPDATED,
    // weekly = Google crawls more often = fresher rankings
    changeFrequency: 'weekly' as const,
    // Full guide cities get 0.9, stub cities get 0.6
    priority: fullGuideSlugs.has(city.slug) ? 0.9 : 0.6,
  }));

  const blogPages = allPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    // Core pages
    { url: BASE,                        lastModified: CONTENT_UPDATED, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/cities`,            lastModified: CONTENT_UPDATED, changeFrequency: 'weekly',  priority: 0.95 },
    // /destinations = static server-rendered list Google can crawl to discover ALL city links
    { url: `${BASE}/destinations`,      lastModified: CONTENT_UPDATED, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE}/countries`,         lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`,              lastModified: CONTENT_UPDATED, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/about`,             lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,           lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy-policy`,    lastModified: CONTENT_UPDATED, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,             lastModified: CONTENT_UPDATED, changeFrequency: 'yearly',  priority: 0.3 },

    // Blog articles
    ...blogPages,

    // City guides
    ...cityPages,

    // "Best time to visit X" pages — only submit pages with real month-by-month data
    ...indexableCities.filter(city => city.monthByMonth).map(city => ({
      url: `${BASE}/best-time-to-visit/${city.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // Comparison pages — "Goa vs Bali" etc.
    ...COMPARISONS.map(([a, b]) => ({
      url: `${BASE}/compare/${comparisonSlug(a, b)}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),

    // Country hub pages — rank for "X travel guide", "places to visit in X"
    ...countries.map((country) => ({
      url: `${BASE}/countries/${country.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    // Itinerary pages — rank for "X days in Y", "Y itinerary X days"
    ...getAllItinerarySlugs().map((slug) => ({
      url: `${BASE}/itinerary/${slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];
}
