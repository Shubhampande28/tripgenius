// Central AdSense config.
// Publisher ID is public (appears in page HTML) — safe to hardcode.
// After AdSense approval, create ad units in adsense.google.com → Ads → By ad unit
// and replace the placeholder slot IDs below with your real ones.

export const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? 'ca-pub-9077452318851477';

// All 6 are real AdSense units (Display/Responsive), created 2026-09.
export const AD_SLOTS = {
  cityTopBanner:    '1446937824', // Horizontal — after AtAGlance on city pages
  citySidebar:      '7597413206', // Rectangle  — sidebar on city pages (desktop)
  cityMidContent:   '6587583863', // Rectangle  — between sections on city pages
  blogMidArticle:   '3322739235', // In-article — midway through blog posts
  blogBottom:       '7272400566', // Horizontal — bottom of blog posts
  visitMidContent:  '3154352301', // "Visit Page Mid-Content" — /visit/[city]/[month] only, after the "vs best time" context section, before Things to do (2026-09 Zone 4 scoped rollout)
} as const;
