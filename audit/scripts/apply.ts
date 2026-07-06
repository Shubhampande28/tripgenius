import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'src/lib/cityImages.ts';
const results = JSON.parse(readFileSync('audit/image-fix-results.json', 'utf8')) as {
  fixed: Record<string, string>;
};
const fixed = results.fixed;

const lines = readFileSync(FILE, 'utf8').split('\n');

// Bound edits to the verifiedCityImages object only (never touch cityAccentColors).
const start = lines.findIndex((l) => l.includes('export const verifiedCityImages'));
let end = lines.length;
for (let i = start + 1; i < lines.length; i++) {
  if (/^\};/.test(lines[i])) { end = i; break; }
}

// Matches an image entry line:  <indent><'slug'|slug>: { ... card: ... }
const ENTRY = /^(\s*)(?:'([^']+)'|([A-Za-z0-9_-]+))\s*:\s*\{.*card:/;

let fixedCount = 0;
let removed = 0;
const out: string[] = [];

for (let i = 0; i < lines.length; i++) {
  if (i <= start || i >= end) { out.push(lines[i]); continue; }
  const m = lines[i].match(ENTRY);
  if (!m) { out.push(lines[i]); continue; }

  const indent = m[1];
  const quoted = m[2];
  const bare = m[3];
  const slug = quoted ?? bare;
  const keyToken = quoted ? `'${quoted}'` : bare;

  if (slug === 'bodh_gaya') { removed++; continue; } // drop literal-duplicate slug

  if (slug in fixed) {
    const url = fixed[slug];
    out.push(`${indent}${keyToken}: { card: '${url}', hero: '${url}' },`);
    fixedCount++;
  } else {
    out.push(lines[i]);
  }
}

writeFileSync(FILE, out.join('\n'));
console.log(`Updated ${fixedCount} entries, removed ${removed} (bodh_gaya) in ${FILE}`);
