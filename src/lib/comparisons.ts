export const COMPARISONS = [
  ['goa', 'bali'], ['manali', 'shimla'],
  ['rishikesh', 'haridwar'], ['udaipur', 'jaipur'],
  ['ooty', 'munnar'], ['bangkok', 'bali'], ['dubai', 'singapore'],
  ['paris', 'rome'], ['tokyo', 'seoul'], ['manali', 'rishikesh'],
  ['goa', 'andaman'], ['ladakh', 'spiti'], ['darjeeling', 'ooty'],
  ['kochi', 'goa'],
  ['mumbai', 'delhi'], ['bali', 'singapore'],
  // High-intent international pairs. Distinct, low-competition queries that
  // don't cannibalise the city/country hubs (a comparison is its own intent),
  // and comparison tables are highly citeable by AI engines. Every city here
  // is an indexable guide with full data, so each page is genuinely useful.
  ['dubai', 'abu-dhabi'], ['bangkok', 'phuket'], ['bali', 'phuket'],
  ['tokyo', 'kyoto'], ['tokyo', 'osaka'], ['kyoto', 'osaka'],
  ['bali', 'maldives'], ['singapore', 'kuala-lumpur'],
  ['hanoi', 'ho-chi-minh-city'], ['paris', 'london'],
  ['rome', 'athens'], ['dubai', 'doha'], ['barcelona', 'lisbon'],
] as const;

export function comparisonSlug(cityA: string, cityB: string): string {
  return `${cityA}-vs-${cityB}`;
}

export function hasComparison(slug: string): boolean {
  return COMPARISONS.some(([a, b]) => comparisonSlug(a, b) === slug);
}
