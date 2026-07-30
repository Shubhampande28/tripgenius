// Same pattern as blogImages.ts's getPostCoverUrl — single source for
// building a NewsArticle's cover URL from its bare `coverPhoto` id, with
// passthrough for local paths / full URLs.

const UNSPLASH_BASE = 'https://images.unsplash.com';

export const COVER_W = {
  related: 400,
  card: 600,
  featured: 800,
  hero: 1400,
} as const;

export function getNewsCoverUrl(coverPhoto: string, width: number, quality = 80): string {
  if (coverPhoto.startsWith('/') || coverPhoto.startsWith('https://')) return coverPhoto;
  return `${UNSPLASH_BASE}/${coverPhoto}?auto=format&fit=crop&w=${width}&q=${quality}`;
}
