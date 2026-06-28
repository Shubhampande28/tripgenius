import { MetadataRoute } from 'next';
import { allCities, cities, authoredMonthCitySlugs, isIndexableCity, isIndexableMonthPage, getCityBySlug } from '@/lib/cities';
import { allPosts, isIndexablePost } from '@/lib/blog';
import { countries } from '@/data/countries';
import { COMPARISONS, comparisonSlug } from '@/lib/comparisons';
import { getAllItinerarySlugs } from '@/lib/itineraries';
import { getCityImageUrl } from '@/lib/cityImages';

const BASE = 'https://www.tripgenius.in';

// Next.js interpolates image/loc URLs straight into the sitemap XML without
// escaping, so any raw "&" (e.g. Unsplash query params) produces an invalid
// document ("Sitemap can be read, but has errors"). Escape XML-significant
// characters ourselves. "&" must be replaced first to avoid double-encoding.
function xmlEscape(url: string): string {
  return url
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Google Images is a major discovery surface for a visual travel site.
// Declaring each page's primary image in the sitemap helps those photos get
// indexed and attributed to the right guide. URLs must be absolute.
function cityImageUrls(slug: string): string[] {
  const hero = getCityImageUrl(slug, 'hero');
  if (!hero) return [];
  return [xmlEscape(hero.startsWith('http') ? hero : `${BASE}${hero}`)];
}

// Bump this date manually when city/country/itinerary/listing content is
// meaningfully updated. Using new Date() here would mark every page as
// "modified today" on every deploy, making the lastModified signal
// meaningless to crawlers (and search engines may start ignoring it).
const CONTENT_UPDATED = new Date('2026-06-10');

export default function sitemap(): MetadataRoute.Sitemap {
  // Only list pages we actually allow to be indexed. Cities without authored
  // month data are noindex (template-generated, low-value), so they must not
  // appear in the sitemap — submitting noindex URLs wastes crawl budget and
  // sends conflicting signals during an AdSense / Search quality review.
  const indexableCities = allCities.filter(isIndexableCity);
  const fullGuideSlugs = new Set(cities.map((c) => c.slug));

  const cityPages = indexableCities.map((city) => ({
    url: `${BASE}/cities/${city.slug}`,
    lastModified: CONTENT_UPDATED,
    // weekly = Google crawls more often = fresher rankings
    changeFrequency: 'weekly' as const,
    // Full guide cities get 0.9, stub cities get 0.6
    priority: fullGuideSlugs.has(city.slug) ? 0.9 : 0.6,
    images: cityImageUrls(city.slug),
  }));

  const blogPages = allPosts.filter(isIndexablePost).map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    images: [xmlEscape(`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=1200&q=80`)],
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

    // "Best time to visit X" pages — indexableCities already requires authored
    // month-by-month data, so every entry here has real seasonal content.
    ...indexableCities.map(city => ({
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

    // "[City] in [Month]" pages — high-intent seasonal queries ("Bali in December").
    // Only authored-month cities, and only months we actually index (flagship
    // cities keep all 12; others drop lukewarm "average" months — see
    // isIndexableMonthPage), so the sitemap never lists noindex URLs.
    ...authoredMonthCitySlugs.flatMap((slug) => {
      const city = getCityBySlug(slug);
      if (!city) return [];
      return ['january','february','march','april','may','june','july','august','september','october','november','december']
        .map((month, idx) => ({ month, idx }))
        .filter(({ idx }) => isIndexableMonthPage(city, idx))
        .map(({ month }) => ({
          url: `${BASE}/visit/${slug}/${month}`,
          lastModified: CONTENT_UPDATED,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
    }),
  ];
}
