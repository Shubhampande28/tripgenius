/**
 * Unit tests for similarity.ts pure functions.
 * The allCities import is mocked to prevent loading the full city dataset
 * (which would slow test startup and create unnecessary coupling).
 */

// Mock must be declared before any import that transitively loads cities.ts
jest.mock('@/lib/cities', () => ({
  allCities: [],
  getCityBySlug: () => undefined,
  getAllCitySlugs: () => [],
  getFeaturedCities: () => [],
}));

import type { City } from '../types';
import {
  normalizeBudget,
  seasonOverlap,
  scoreSimilarity,
  getSimilarCities,
} from '../similarity';

// ── Fixture helper ─────────────────────────────────────────────────────────

function city(
  slug: string,
  overrides: {
    country?: string;
    vibes?: string[];
    budget?: string;
    bestTime?: string;
    stub?: boolean;
  } = {},
): City {
  return {
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    country: overrides.country ?? 'Testland',
    flag: '🏳️',
    tagline: '',
    description: '',
    heroDescription: '',
    stats: {
      bestTime: overrides.bestTime ?? 'Jan – Dec',
      budget:   overrides.budget   ?? '$50–$100/day',
      language: 'English',
      currency: 'USD',
    },
    vibes:       overrides.vibes ?? [],
    gradient:    '',
    accentColor: '',
    image:       '',
    heroImage:   '',
    stub:        overrides.stub ?? false,
  };
}

// ── normalizeBudget ────────────────────────────────────────────────────────

describe('normalizeBudget', () => {
  it('returns 1 for budget destinations (lower < 50)', () => {
    expect(normalizeBudget('$20–$50/day')).toBe(1);
    expect(normalizeBudget('$15–$60/day')).toBe(1);
    expect(normalizeBudget('$40–$200/day')).toBe(1);
  });

  it('returns 2 for mid-range destinations (50 ≤ lower < 150)', () => {
    expect(normalizeBudget('$50–$150/day')).toBe(2);
    expect(normalizeBudget('$80–$200/day')).toBe(2);
    expect(normalizeBudget('$120–$350/day')).toBe(2);
  });

  it('returns 3 for luxury destinations (lower ≥ 150)', () => {
    expect(normalizeBudget('$150+/day')).toBe(3);
    expect(normalizeBudget('$150–$400/day')).toBe(3);
    expect(normalizeBudget('$200–$600/day')).toBe(3);
  });

  it('returns 2 as safe default for undefined', () => {
    expect(normalizeBudget(undefined)).toBe(2);
  });

  it('returns 2 as safe default for empty string', () => {
    expect(normalizeBudget('')).toBe(2);
  });

  it('returns 2 for strings with no parseable number', () => {
    expect(normalizeBudget('free')).toBe(2);
    expect(normalizeBudget('varies')).toBe(2);
  });
});

// ── seasonOverlap ──────────────────────────────────────────────────────────

describe('seasonOverlap', () => {
  it('Apr–Oct overlapping with Jun–Sep returns ~0.33', () => {
    const result = seasonOverlap('Apr – Oct', 'Jun – Sep');
    expect(result).toBeCloseTo(4 / 12, 1); // 4 months overlap / 12
  });

  it('Oct–Mar (wrap) overlapping with Nov–Feb returns ~0.33', () => {
    const result = seasonOverlap('Oct – Mar', 'Nov – Feb');
    expect(result).toBeCloseTo(4 / 12, 1);
  });

  it('Jan–Dec (all year) overlapping with Apr–Oct returns ~0.58', () => {
    const result = seasonOverlap('Jan – Dec', 'Apr – Oct');
    expect(result).toBeCloseTo(7 / 12, 1);
  });

  it('Apr–Oct and Nov–Mar share no months → returns 0', () => {
    expect(seasonOverlap('Apr – Oct', 'Nov – Mar')).toBe(0);
  });

  it('handles multi-range bestTime strings (e.g. Seoul)', () => {
    // "Apr – Jun" = months 3,4,5 and "Sep – Nov" = months 8,9,10
    // "Sep – Nov" = months 8,9,10 → overlap with "Sep – Nov" is 3 months
    const result = seasonOverlap('Apr – Jun, Sep – Nov', 'Sep – Nov');
    expect(result).toBeCloseTo(3 / 12, 1);
  });

  it('returns 0.5 (neutral) when first arg is undefined', () => {
    expect(seasonOverlap(undefined, 'Apr – Oct')).toBe(0.5);
  });

  it('returns 0.5 (neutral) when both args are undefined', () => {
    expect(seasonOverlap(undefined, undefined)).toBe(0.5);
  });
});

// ── scoreSimilarity ────────────────────────────────────────────────────────

describe('scoreSimilarity', () => {
  it('scores > 70 for highly similar cities (same vibes, budget, season, country)', () => {
    const source    = city('src',  { country: 'Japan', vibes: ['Cultural', 'Foodie', 'Adventure'], budget: '$80–$200/day', bestTime: 'Apr – Oct' });
    const candidate = city('cand', { country: 'Japan', vibes: ['Cultural', 'Foodie', 'Romantic'], budget: '$80–$200/day', bestTime: 'Apr – Oct' });
    expect(scoreSimilarity(source, candidate)).toBeGreaterThan(70);
  });

  it('scores < 15 for very dissimilar cities (different continent, no vibe overlap, different budget, no season overlap)', () => {
    const source    = city('src',  { country: 'Japan',   vibes: ['Cultural', 'Foodie'],   budget: '$80–$200/day',  bestTime: 'Mar – May' });
    const candidate = city('cand', { country: 'Brazil',  vibes: ['Beach', 'Party'],        budget: '$150–$400/day', bestTime: 'Oct – Feb' });
    expect(scoreSimilarity(source, candidate)).toBeLessThan(15);
  });

  it('grants region bonus for same-continent cities', () => {
    const japan  = city('japan',  { country: 'Japan',      vibes: [], budget: '$80–$200/day', bestTime: 'Apr – Oct' });
    const korea  = city('korea',  { country: 'South Korea', vibes: [], budget: '$80–$200/day', bestTime: 'Apr – Oct' });
    const france = city('france', { country: 'France',      vibes: [], budget: '$80–$200/day', bestTime: 'Apr – Oct' });
    expect(scoreSimilarity(japan, korea)).toBeGreaterThan(scoreSimilarity(japan, france));
  });
});

// ── getSimilarCities ───────────────────────────────────────────────────────

describe('getSimilarCities', () => {
  const bali    = city('bali',   { country: 'Indonesia', vibes: ['Spiritual', 'Romantic', 'Adventure'], budget: '$40–$200/day', bestTime: 'Apr – Oct' });
  const lombok  = city('lombok', { country: 'Indonesia', vibes: ['Beach', 'Adventure', 'Nature'],       budget: '$30–$80/day',  bestTime: 'Apr – Oct' });
  const london  = city('london', { country: 'UK',        vibes: ['Cultural', 'Foodie', 'Luxury'],       budget: '$120–$350/day', bestTime: 'May – Sep' });
  const stubCity = city('stub-place', { stub: true, vibes: ['Adventure'] });
  const allTestCities = [bali, lombok, london, stubCity];

  it('excludes the source city from results', () => {
    const results = getSimilarCities(bali, allTestCities, 6);
    expect(results.some((r) => r.slug === 'bali')).toBe(false);
  });

  it('excludes stub cities from results', () => {
    const results = getSimilarCities(bali, allTestCities, 6);
    expect(results.some((r) => r.slug === 'stub-place')).toBe(false);
  });

  it('returns results sorted descending by score', () => {
    const results = getSimilarCities(bali, allTestCities, 6);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it('respects the limit parameter', () => {
    const results = getSimilarCities(bali, allTestCities, 1);
    expect(results).toHaveLength(1);
  });

  it('returns an empty array when no non-stub candidates exist', () => {
    const results = getSimilarCities(bali, [bali, stubCity], 6);
    expect(results).toHaveLength(0);
  });

  it('provides a non-empty reason string for every result', () => {
    const results = getSimilarCities(bali, allTestCities, 6);
    results.forEach((r) => {
      expect(typeof r.reason).toBe('string');
      expect(r.reason.length).toBeGreaterThan(0);
    });
  });

  it('returns matchedVibes as an array for every result', () => {
    const results = getSimilarCities(bali, allTestCities, 6);
    results.forEach((r) => {
      expect(Array.isArray(r.matchedVibes)).toBe(true);
    });
  });
});
