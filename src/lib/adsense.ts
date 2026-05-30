// Central AdSense config.
// After AdSense approval, add to .env.local on the VM:
//   NEXT_PUBLIC_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXXXXXXXXX
//
// Then create ad units in the AdSense dashboard and paste the slot IDs below.

export const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? '';

// Replace these slot IDs after creating ad units in adsense.google.com → Ads → By ad unit
export const AD_SLOTS = {
  cityTopBanner:    '1111111111', // Horizontal — after AtAGlance on city pages
  citySidebar:      '2222222222', // Rectangle  — sidebar on city pages (desktop)
  cityMidContent:   '3333333333', // Rectangle  — between sections on city pages
  blogMidArticle:   '4444444444', // In-article — midway through blog posts
  blogBottom:       '5555555555', // Horizontal — bottom of blog posts
} as const;
