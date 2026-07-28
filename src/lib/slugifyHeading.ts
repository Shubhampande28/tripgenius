// Shared slugify rule for blog post h2/h3 blocks — used by both the server
// component ([slug]/page.tsx, to assign heading `id`s) and the client
// PostTOC component (to build matching anchor links), so they can't drift.
export function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
