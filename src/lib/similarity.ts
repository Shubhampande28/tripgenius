import { allCities } from './cities';
import { City } from './types';

// ── Region mapping ──────────────────────────────────────────────────────────

const REGION_MAP: Record<string, string> = {
  // Asia
  Indonesia: 'Asia', India: 'Asia', Singapore: 'Asia',
  'South Korea': 'Asia', Japan: 'Asia', 'China SAR': 'Asia', China: 'Asia',
  Thailand: 'Asia', Vietnam: 'Asia', Malaysia: 'Asia', Cambodia: 'Asia',
  Philippines: 'Asia', Nepal: 'Asia', 'Sri Lanka': 'Asia', Maldives: 'Asia',
  UAE: 'Asia', Jordan: 'Asia', Georgia: 'Asia', Taiwan: 'Asia',
  Myanmar: 'Asia', Laos: 'Asia', Bangladesh: 'Asia', Pakistan: 'Asia',
  // Europe
  'United Kingdom': 'Europe', Spain: 'Europe', Italy: 'Europe',
  Netherlands: 'Europe', 'Czech Republic': 'Europe', Portugal: 'Europe',
  Turkey: 'Europe', Greece: 'Europe', Hungary: 'Europe', France: 'Europe',
  Germany: 'Europe', Austria: 'Europe', Switzerland: 'Europe', Croatia: 'Europe',
  Iceland: 'Europe', Norway: 'Europe', Sweden: 'Europe', Denmark: 'Europe',
  Finland: 'Europe', Poland: 'Europe', Ireland: 'Europe', Belgium: 'Europe',
  Romania: 'Europe', Bulgaria: 'Europe', Montenegro: 'Europe', Slovenia: 'Europe',
  Slovakia: 'Europe', Serbia: 'Europe', Malta: 'Europe',
  // Americas
  USA: 'Americas', 'United States': 'Americas', Mexico: 'Americas', Brazil: 'Americas', Argentina: 'Americas',
  Peru: 'Americas', Colombia: 'Americas', Chile: 'Americas', Ecuador: 'Americas',
  Bolivia: 'Americas', Uruguay: 'Americas', Canada: 'Americas',
  'Costa Rica': 'Americas', Cuba: 'Americas', Panama: 'Americas',
  Guatemala: 'Americas', Belize: 'Americas',
  // Africa
  Morocco: 'Africa', 'South Africa': 'Africa', Egypt: 'Africa',
  Tanzania: 'Africa', Kenya: 'Africa', Ethiopia: 'Africa',
  Ghana: 'Africa', Senegal: 'Africa', Tunisia: 'Africa',
  // Oceania
  Australia: 'Oceania', 'New Zealand': 'Oceania', Fiji: 'Oceania',
};

function getRegion(country: string): string {
  return REGION_MAP[country] ?? 'Unknown';
}

// ── Month parsing ──────────────────────────────────────────────────────────

const MONTH_ABBR: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseSingleRange(range: string): Set<number> {
  const m = range.match(/([a-z]{3})\s*[–\-]\s*([a-z]{3})/i);
  if (!m) return new Set();
  const start = MONTH_ABBR[m[1].toLowerCase().slice(0, 3)];
  const end   = MONTH_ABBR[m[2].toLowerCase().slice(0, 3)];
  if (start === undefined || end === undefined) return new Set();
  const months = new Set<number>();
  if (start <= end) {
    for (let i = start; i <= end; i++) months.add(i);
  } else {
    for (let i = start; i < 12; i++) months.add(i);
    for (let i = 0; i <= end; i++) months.add(i);
  }
  return months;
}

function parseMonthSet(bestTime: string | undefined): Set<number> {
  if (!bestTime) return new Set();
  if (/jan.*dec/i.test(bestTime)) {
    return new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  }
  const union = new Set<number>();
  bestTime.split(',').forEach((segment) => {
    parseSingleRange(segment.trim()).forEach((m) => union.add(m));
  });
  return union;
}

// ── Exported pure functions ────────────────────────────────────────────────

export function normalizeBudget(budget: string | undefined): 1 | 2 | 3 {
  if (!budget) return 2;
  const match = budget.match(/\$(\d+)/);
  if (!match) return 2;
  const lower = parseInt(match[1], 10);
  if (lower < 50)  return 1;
  if (lower < 150) return 2;
  return 3;
}

export function seasonOverlap(a: string | undefined, b: string | undefined): number {
  if (!a && !b) return 0.5;
  if (!a || !b) return 0.5;
  const setA = parseMonthSet(a);
  const setB = parseMonthSet(b);
  if (setA.size === 0 || setB.size === 0) return 0.5;
  let overlap = 0;
  setA.forEach((m) => { if (setB.has(m)) overlap++; });
  return overlap / 12;
}

export interface SimilarCity {
  slug: string;
  score: number;
  reason: string;
  matchedVibes: string[];
}

function buildReason(
  source: City,
  candidate: City,
  matchedVibes: string[],
): string {
  if (matchedVibes.length >= 3) return `Very similar vibe to ${source.name}`;
  if (matchedVibes.length === 2)
    return `Similar ${matchedVibes[0].toLowerCase()} & ${matchedVibes[1].toLowerCase()} destination`;
  if (matchedVibes.length === 1)
    return `Also great for ${matchedVibes[0].toLowerCase()} travel`;
  if (source.country === candidate.country)
    return `Another great destination in ${candidate.country}`;
  const srcRegion = getRegion(source.country);
  const cndRegion = getRegion(candidate.country);
  if (srcRegion !== 'Unknown' && srcRegion === cndRegion)
    return `Popular destination in ${cndRegion}`;
  return 'Similar travel style';
}

export function scoreSimilarity(source: City, candidate: City): number {
  const sourceVibes    = source.vibes    ?? [];
  const candidateVibes = candidate.vibes ?? [];
  const matchedVibes   = sourceVibes.filter((v) => candidateVibes.includes(v));
  const maxVibes       = Math.max(sourceVibes.length, candidateVibes.length, 1);
  const vibeScore      = (matchedVibes.length / maxVibes) * 40;

  const budgetDiff  = Math.abs(
    normalizeBudget(source.stats?.budget) - normalizeBudget(candidate.stats?.budget),
  );
  const budgetScore = budgetDiff === 0 ? 25 : budgetDiff === 1 ? 12 : 0;

  const seasonScore = seasonOverlap(
    source.stats?.bestTime,
    candidate.stats?.bestTime,
  ) * 20;

  const srcRegion = getRegion(source.country);
  const cndRegion = getRegion(candidate.country);
  const regionScore = srcRegion !== 'Unknown' && srcRegion === cndRegion ? 10 : 0;

  const countryScore = source.country === candidate.country ? 5 : 0;

  return vibeScore + budgetScore + seasonScore + regionScore + countryScore;
}

export function getSimilarCities(
  city: City,
  all: City[],
  limit = 6,
): SimilarCity[] {
  const sourceVibes = city.vibes ?? [];

  return all
    .filter((c) => c.slug !== city.slug && !c.stub)
    .map((c): SimilarCity => {
      const score        = scoreSimilarity(city, c);
      const matchedVibes = sourceVibes.filter((v) => (c.vibes ?? []).includes(v));
      const reason       = buildReason(city, c, matchedVibes);
      return { slug: c.slug, score, reason, matchedVibes };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ── Pre-computed map: evaluated once at module load = build time for static pages ─

export const similarityMap: Record<string, SimilarCity[]> = (() => {
  const map: Record<string, SimilarCity[]> = {};
  for (const city of allCities) {
    map[city.slug] = getSimilarCities(city, allCities, 6);
  }
  return map;
})();
