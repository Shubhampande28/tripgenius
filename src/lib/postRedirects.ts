// Consolidation map: thin, mass-produced blog posts that have been retired and
// 301-redirected into the canonical hub that already owns that intent.
//
// Why: the /cities/[slug] and /countries/[country] hubs are strong, indexable,
// structured guides that already target "Dubai travel guide", "Thailand travel
// guide", etc. Keeping 30+ thin blog posts on the same topics split link equity
// and cannibalised those hubs. Folding the thin posts into the hub concentrates
// all relevance + authority on one strong page per destination — better for both
// Search ranking and AI-engine citation.
//
// Keys are blog slugs (served at /blog/<slug>); values are the canonical path.
// This is the single source of truth: next.config.ts builds redirects from it,
// and the blog route excludes these slugs from static generation.
//
// NOTE: substantial posts (>= MIN_INDEXABLE_WORDS) are intentionally NOT here —
// e.g. bangkok-budget-travel-guide, bali-vs-thailand-indian-travellers stay live.

export const RETIRED_POST_REDIRECTS: Record<string, string> = {
  // ── Dubai / UAE cluster → canonical Dubai city + best-time hubs ──
  'dubai-travel-guide-2025': '/cities/dubai',
  'dubai-5-day-itinerary': '/cities/dubai',
  'dubai-3-day-itinerary': '/cities/dubai',
  'dubai-budget-travel-guide': '/cities/dubai',
  'dubai-family-trip-guide': '/cities/dubai',
  'dubai-visa-guide-indians': '/cities/dubai',
  'where-to-stay-in-dubai': '/cities/dubai',
  'free-things-to-do-in-dubai': '/cities/dubai',
  'dubai-desert-safari-guide': '/cities/dubai',
  'dubai-shopping-guide': '/cities/dubai',
  'dubai-honeymoon-guide': '/cities/dubai',
  'dubai-food-guide': '/cities/dubai',
  'dubai-layover-guide': '/cities/dubai',
  'dubai-vs-abu-dhabi': '/cities/dubai',
  'hidden-gems-in-dubai': '/cities/dubai',
  'best-time-to-visit-dubai': '/best-time-to-visit/dubai',
  'abu-dhabi-day-trip-from-dubai': '/cities/abu-dhabi',

  // ── Thailand cluster → canonical Thailand country hub + city guides ──
  'thailand-travel-guide-2025': '/countries/thailand',
  'thailand-7-day-itinerary': '/countries/thailand',
  'best-time-to-visit-thailand': '/countries/thailand',
  'thailand-budget-travel-guide': '/countries/thailand',
  'thailand-visa-guide-indians': '/countries/thailand',
  'thailand-in-december': '/countries/thailand',
  'thailand-in-monsoon': '/countries/thailand',
  'thailand-honeymoon-guide': '/countries/thailand',
  'hidden-places-in-thailand': '/countries/thailand',
  'hidden-islands-in-thailand': '/countries/thailand',
  'phuket-vs-krabi': '/countries/thailand',
  'bangkok-vs-phuket': '/countries/thailand',
  'koh-samui-travel-guide': '/countries/thailand',
  'krabi-travel-guide': '/countries/thailand',
  'phi-phi-islands-guide': '/countries/thailand',
  'phuket-travel-guide': '/cities/phuket',
  'chiang-mai-travel-guide': '/cities/chiang-mai',
  'bangkok-3-day-itinerary': '/cities/bangkok',
  'bangkok-travel-guide-tips': '/cities/bangkok',
};

export const RETIRED_POST_SLUGS = new Set(Object.keys(RETIRED_POST_REDIRECTS));
