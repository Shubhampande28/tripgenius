export const COMPARISONS = [
  ['goa', 'bali'], ['bali', 'thailand'], ['manali', 'shimla'],
  ['rishikesh', 'haridwar'], ['udaipur', 'jaipur'], ['goa', 'kerala'],
  ['ooty', 'munnar'], ['bangkok', 'bali'], ['dubai', 'singapore'],
  ['paris', 'rome'], ['tokyo', 'seoul'], ['manali', 'rishikesh'],
  ['goa', 'andaman'], ['ladakh', 'spiti'], ['darjeeling', 'ooty'],
  ['kochi', 'goa'],
  ['mumbai', 'delhi'], ['bali', 'singapore'],
] as const;

export function comparisonSlug(cityA: string, cityB: string): string {
  return `${cityA}-vs-${cityB}`;
}

export function hasComparison(slug: string): boolean {
  return COMPARISONS.some(([a, b]) => comparisonSlug(a, b) === slug);
}
