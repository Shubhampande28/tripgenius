// Central AdSense config.
// Publisher ID is public (appears in page HTML) — safe to hardcode.
// After AdSense approval, create ad units in adsense.google.com → Ads → By ad unit
// and replace the placeholder slot IDs below with your real ones.

export const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? 'ca-pub-9077452318851477';

// Replace these slot IDs after creating ad units in adsense.google.com → Ads → By ad unit
export const AD_SLOTS = {
  cityTopBanner:    '1111111111', // Horizontal — after AtAGlance on city pages
  citySidebar:      '2222222222', // Rectangle  — sidebar on city pages (desktop)
  cityMidContent:   '3333333333', // Rectangle  — between sections on city pages
  blogMidArticle:   '4444444444', // In-article — midway through blog posts
  blogBottom:       '5555555555', // Horizontal — bottom of blog posts
} as const;
