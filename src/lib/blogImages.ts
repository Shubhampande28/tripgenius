// Single source for building Unsplash cover-photo URLs from a BlogPost's
// bare `coverPhoto` id — replaces the same template string that used to be
// hand-built inline (with hand-varied width/quality) in multiple places
// across src/app/blog/page.tsx and src/app/blog/[slug]/page.tsx.

const UNSPLASH_BASE = 'https://images.unsplash.com';

export const COVER_W = {
  related: 400,
  card: 600,
  featured: 800,
  hero: 1200,
} as const;

export function getPostCoverUrl(coverPhoto: string, width: number, quality = 80): string {
  if (coverPhoto.startsWith('/') || coverPhoto.startsWith('https://')) return coverPhoto;
  return `${UNSPLASH_BASE}/${coverPhoto}?auto=format&fit=crop&w=${width}&q=${quality}`;
}
