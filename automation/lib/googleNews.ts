// Shared Google News RSS discovery + article fetching, used by both
// automation/news/generate.ts and automation/trending/generate.ts.
//
// Replicates .claude/skills/news-writer/news_topics.py in TypeScript (no
// Python in CI): Google News RSS needs no API key, just a query string.
// https://news.google.com/rss/search?q=<query>&hl=en-IN&gl=IN&ceid=IN:en

import * as cheerio from 'cheerio';

const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export interface NewsHeadline {
  title: string;
  source: string;
  pubDate: string | null; // ISO date, if parseable
  link: string;           // Google News redirect link
  query: string;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export async function fetchGoogleNewsRSS(query: string, opts?: { hl?: string; gl?: string; ceid?: string }): Promise<NewsHeadline[]> {
  const hl = opts?.hl ?? 'en-IN';
  const gl = opts?.gl ?? 'IN';
  const ceid = opts?.ceid ?? 'IN:en';
  const url = `${GOOGLE_NEWS_RSS}?${new URLSearchParams({ q: query, hl, gl, ceid }).toString()}`;

  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    console.log(`    fetch failed for ${JSON.stringify(query)}: ${res.status}`);
    return [];
  }
  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const items: NewsHeadline[] = [];
  $('item').each((_, el) => {
    const $el = $(el);
    let title = $el.find('title').first().text().trim();
    const link = $el.find('link').first().text().trim();
    const pubDateRaw = $el.find('pubDate').first().text().trim();
    const source = $el.find('source').first().text().trim();

    if (source && title.endsWith(` - ${source}`)) {
      title = title.slice(0, -(` - ${source}`.length)).trim();
    }
    if (!title) return;

    let pubDate: string | null = null;
    if (pubDateRaw) {
      const d = new Date(pubDateRaw);
      if (!Number.isNaN(d.getTime())) pubDate = d.toISOString();
    }

    items.push({ title, source, pubDate, link, query });
  });
  return items;
}

export async function fetchManyQueries(queries: string[]): Promise<NewsHeadline[]> {
  const collected: NewsHeadline[] = [];
  for (const q of queries) {
    console.log(`  querying ${JSON.stringify(q)} ...`);
    try {
      const items = await fetchGoogleNewsRSS(q);
      console.log(`    -> ${items.length} headlines`);
      collected.push(...items);
    } catch (err) {
      console.log(`    fetch error for ${JSON.stringify(q)}: ${(err as Error).message}`);
    }
  }
  return collected;
}

/** Dedupe by normalized title, keep first occurrence, filter to last N days. */
export function dedupeAndFilterFresh(items: NewsHeadline[], days = 14): NewsHeadline[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const seen = new Set<string>();
  const out: NewsHeadline[] = [];
  for (const it of items) {
    const key = normalizeTitle(it.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    if (it.pubDate && new Date(it.pubDate).getTime() < cutoff) continue;
    out.push(it);
  }
  // Newest first; undated sink to the bottom.
  out.sort((a, b) => {
    const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });
  return out;
}

/**
 * Resolve a Google News redirect link to the real publisher URL by following
 * redirects and reading response.url. Google News links are sometimes a
 * client-side redirect page rather than a plain HTTP 3xx, so this also falls
 * back to scraping a canonical/meta-refresh URL out of the HTML if the fetch
 * lands back on news.google.com.
 */
export async function resolvePublisherUrl(googleNewsLink: string): Promise<string | null> {
  try {
    const res = await fetch(googleNewsLink, { redirect: 'follow', headers: { 'User-Agent': UA } });
    const finalUrl = res.url || googleNewsLink;
    if (!finalUrl.includes('news.google.com')) return finalUrl;

    // Still on Google News — look for a meta-refresh / canonical link in the body.
    const html = await res.text();
    const $ = cheerio.load(html);
    const canonical = $('link[rel="canonical"]').attr('href');
    if (canonical && !canonical.includes('news.google.com')) return canonical;
    const metaRefresh = $('meta[http-equiv="refresh"]').attr('content');
    const m = metaRefresh?.match(/url=(\S+)/i);
    if (m && !m[1].includes('news.google.com')) return m[1];

    return null;
  } catch (err) {
    console.log(`    redirect resolution failed: ${(err as Error).message}`);
    return null;
  }
}

/** Fetch a publisher page and reduce it to plain text for grounding a prompt. */
export async function fetchArticleText(url: string, maxChars = 8000): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, style, noscript, nav, header, footer, form, svg').remove();
    const text = $('article').text().trim() || $('body').text().trim();
    const collapsed = text.replace(/\s+/g, ' ').trim();
    return collapsed.slice(0, maxChars);
  } catch (err) {
    console.log(`    article fetch failed for ${url}: ${(err as Error).message}`);
    return null;
  }
}

/** Slugify a headline into a short kebab-case slug, matching the skill's convention. */
export function slugify(title: string, maxWords = 8): string {
  return title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, maxWords)
    .join('-');
}
