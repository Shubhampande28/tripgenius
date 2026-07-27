import fs from 'fs';
import path from 'path';

// Evergreen "trending" articles live as markdown files in content/trending/
// (written by automation/trending/generate.ts, mirroring the manual
// news-writer skill for content/news/ — see src/lib/news.ts). This module is
// the reader: it parses frontmatter + a small markdown subset at build time.
// Server-only (uses fs) — import from server components / route handlers only.
//
// Tone note: trending pieces are EVERGREEN, not lede-first news. Titles and
// structure should read fine 3 months from now — "why X is trending", "best
// value destinations right now", seasonal/deal-season framing — not "today,
// X happened". Hard news with a specific dateline belongs in content/news/.

export type TrendingCategory = 'Destinations' | 'Deals' | 'Planning' | 'Culture' | 'Food';

export type TrendingBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string };

export interface TrendingArticle {
  slug: string;
  title: string;
  description: string;
  date: string;            // YYYY-MM-DD
  category: TrendingCategory;
  coverPhoto: string;      // Unsplash photo id, e.g. photo-1506905925346-21bda4d32df4
  tags: string[];
  sources: string[];
  readTime: number;        // minutes, derived from word count
  content: TrendingBlock[];
}

const TRENDING_DIR = path.join(process.cwd(), 'content', 'trending');

const VALID_CATEGORIES = new Set<string>(['Destinations', 'Deals', 'Planning', 'Culture', 'Food']);

function unquote(v: string): string {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

// Minimal YAML subset: `key: value`, inline arrays `[a, b]`, and block lists
// (`key:` followed by `  - item` lines). Same shape as news.ts's parser.
function parseFrontmatter(raw: string): { data: Record<string, string | string[]>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, string | string[]> = {};
  let currentListKey: string | null = null;
  for (const line of m[1].split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentListKey) {
      (data[currentListKey] as string[]).push(unquote(listItem[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value === '') {
      data[key] = [];
      currentListKey = key;
    } else if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map(s => unquote(s)).filter(Boolean);
      currentListKey = null;
    } else {
      data[key] = unquote(value);
      currentListKey = null;
    }
  }
  return { data, body: raw.slice(m[0].length) };
}

// Markdown subset: ## / ### headings, paragraphs, - lists, 1. lists, > blockquotes.
// Inline **bold** / [links](url) stay raw in `text` — rendered by <Inline/>.
function parseBody(body: string): TrendingBlock[] {
  const blocks: TrendingBlock[] = [];
  const lines = body.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '') { i++; continue; }
    if (line.startsWith('### ')) { blocks.push({ type: 'h3', text: line.slice(4).trim() }); i++; continue; }
    if (line.startsWith('## '))  { blocks.push({ type: 'h2', text: line.slice(3).trim() }); i++; continue; }
    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quote.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', text: quote.join(' ').trim() });
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }
    // Paragraph — join consecutive non-blank, non-structural lines.
    const para: string[] = [line];
    i++;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (next === '' || /^(#{2,3}\s|>\s?|[-*]\s|\d+\.\s)/.test(next)) break;
      para.push(next);
      i++;
    }
    blocks.push({ type: 'p', text: para.join(' ') });
  }
  return blocks;
}

function wordCount(blocks: TrendingBlock[]): number {
  let words = 0;
  for (const b of blocks) {
    const text = 'items' in b ? b.items.join(' ') : b.text;
    words += text.split(/\s+/).filter(Boolean).length;
  }
  return words;
}

function loadArticle(file: string): TrendingArticle | null {
  const raw = fs.readFileSync(path.join(TRENDING_DIR, file), 'utf-8');
  const { data, body } = parseFrontmatter(raw);
  const title = typeof data.title === 'string' ? data.title : '';
  const date = typeof data.date === 'string' ? data.date : '';
  if (!title || !date) return null; // malformed draft — don't publish it
  const content = parseBody(body);
  const category = typeof data.category === 'string' && VALID_CATEGORIES.has(data.category)
    ? (data.category as TrendingCategory)
    : 'Destinations';
  return {
    slug: file.replace(/\.md$/, ''),
    title,
    description: typeof data.description === 'string' ? data.description : '',
    date,
    category,
    coverPhoto: typeof data.coverPhoto === 'string' && data.coverPhoto
      ? data.coverPhoto
      : 'photo-1488646953014-85cb44e25828',
    tags: Array.isArray(data.tags) ? data.tags : [],
    sources: Array.isArray(data.sources) ? data.sources : [],
    readTime: Math.max(1, Math.round(wordCount(content) / 220)),
    content,
  };
}

export function getAllTrending(): TrendingArticle[] {
  if (!fs.existsSync(TRENDING_DIR)) return [];
  return fs.readdirSync(TRENDING_DIR)
    .filter(f => f.endsWith('.md'))
    .map(loadArticle)
    .filter((a): a is TrendingArticle => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getTrendingBySlug(slug: string): TrendingArticle | undefined {
  return getAllTrending().find(a => a.slug === slug);
}
