/**
 * Populates the `cities: []` frontmatter field on every blog post in
 * src/lib/blog.ts. A post gets a city slug when:
 *   - its citySlug field matches, or
 *   - a tag equals the city name or slug (case-insensitive), or
 *   - the post title mentions the city name as a whole word.
 * Run once: node scripts/populate-post-cities.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const lib = (f) => join(__dir, '../src/lib', f);

// ── extract { slug, name } for every city across the five data files ────────
// City objects sit at 2-space indent; slug/name are their first 4-space fields.
const cityFiles = ['cities.ts', 'worldCities.ts', 'indianCities.ts', 'indianCitiesExtended.ts', 'newIndianCities.ts'];
const cityList = [];
for (const f of cityFiles) {
  const src = readFileSync(lib(f), 'utf8');
  // Handles all three styles across the data files: multi-line fields,
  // single-line inline objects, and JSON-style quoted keys.
  const re = /["']?slug["']?: ["']([a-z0-9-]+)["'],\s*["']?name["']?: ["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src)) !== null) cityList.push({ slug: m[1], name: m[2] });
}
const bySlug = new Map(cityList.map((c) => [c.slug, c]));
console.log(`cities found: ${cityList.length}`);
if (cityList.length < 50) throw new Error('city extraction looks broken — aborting');

// ── parse posts from blog.ts (top-level objects in allPosts) ─────────────────
const blog = readFileSync(lib('blog.ts'), 'utf8');
if (/^\s{4}cities:/m.test(blog)) throw new Error('cities: field already present — aborting');

const postStartRe = /^ {2}\{\r?\n {4}slug: '([^']+)',/gm;
const starts = [];
let m;
while ((m = postStartRe.exec(blog)) !== null) starts.push({ idx: m.index, slug: m[1] });
console.log(`posts found: ${starts.length}`);
if (starts.length < 50) throw new Error('post extraction looks broken — aborting');

// For each post, compute its cities and insert `cities: [...],` right after the
// tags array so it reads as frontmatter, not content.
let out = '';
let cursor = 0;
let touched = 0;
for (let i = 0; i < starts.length; i++) {
  const { idx } = starts[i];
  const end = i + 1 < starts.length ? starts[i + 1].idx : blog.indexOf('\n];', idx);
  const block = blog.slice(idx, end);

  // frontmatter region = everything before `content: [`
  const fmEnd = block.indexOf('content: [');
  const fm = fmEnd === -1 ? block : block.slice(0, fmEnd);

  const citySlugMatch = fm.match(/citySlug: '([^']+)'/);
  const titleMatch = fm.match(/title: '((?:[^'\\]|\\.)*)'/);
  const title = titleMatch ? titleMatch[1] : '';
  const tagsMatch = fm.match(/tags: \[([\s\S]*?)\]/);
  const tagVals = tagsMatch ? [...tagsMatch[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];

  const found = new Set();
  if (citySlugMatch && bySlug.has(citySlugMatch[1])) found.add(citySlugMatch[1]);
  for (const c of cityList) {
    if (tagVals.some((t) => t.toLowerCase() === c.name.toLowerCase() || t.toLowerCase() === c.slug)) {
      found.add(c.slug);
    } else if (new RegExp(`\\b${c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(title)) {
      found.add(c.slug);
    }
  }

  const citiesLine = `    cities: [${[...found].map((s) => `'${s}'`).join(', ')}],\n`;
  const tagsClose = block.indexOf('],', block.indexOf('tags: ['));
  const insertAt = block.indexOf('\n', tagsClose) + 1;
  const newBlock = block.slice(0, insertAt) + citiesLine + block.slice(insertAt);
  out += blog.slice(cursor, idx) + newBlock;
  cursor = end;
  touched++;
}
out += blog.slice(cursor);
writeFileSync(lib('blog.ts'), out);
console.log(`populated cities field on ${touched} posts`);
