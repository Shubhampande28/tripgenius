import Link from 'next/link';
import type { ReactNode } from 'react';
import { allCities, isIndexableCity } from './cities';
import { countries } from '@/data/countries';

// Auto-links the FIRST mention of any city/country we have a guide page for,
// inside blog body copy. Rules:
//   - only the first occurrence of each destination per page
//   - at most MAX_AUTO_LINKS links per post
//   - callers apply it only to paragraph/list text — never headings, callouts,
//     tables or blocks that already carry a link (link-cta)
//   - exact-case whole-word match ("Bali", not "bali" inside another word)
//   - only indexable city guides are link targets; on a name collision the
//     city guide wins over the country hub (it's the richer page)

const MAX_AUTO_LINKS = 8;

type Entry = { name: string; href: string; re: RegExp };

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const registry: Entry[] = (() => {
  const seen = new Set<string>();
  const entries: Entry[] = [];
  const add = (name: string, href: string) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ name, href, re: new RegExp(`\\b${esc(name)}\\b`) });
  };
  for (const c of allCities) if (isIndexableCity(c)) add(c.name, `/cities/${c.slug}`);
  for (const c of countries) add(c.name, `/countries/${c.slug}`);
  // longest first so "Sri Lanka" wins over any shorter overlapping name
  return entries.sort((a, b) => b.name.length - a.name.length);
})();

export type AutoLinker = (text: string) => ReactNode;

/** One linker per page render — it carries the used-set and the per-post cap. */
export function createAutoLinker(): AutoLinker {
  const used = new Set<string>();
  let count = 0;

  return function linkify(text: string): ReactNode {
    if (count >= MAX_AUTO_LINKS) return text;

    // Collect the first match of every not-yet-linked destination in this text
    const found: { start: number; end: number; entry: Entry }[] = [];
    for (const entry of registry) {
      if (used.has(entry.href)) continue;
      const m = entry.re.exec(text);
      if (m) found.push({ start: m.index, end: m.index + m[0].length, entry });
    }
    if (found.length === 0) return text;

    // Left-to-right, dropping overlaps (longer names were registered first,
    // so "Sri Lanka" beats "Lanka"-style collisions at the same position)
    found.sort((a, b) => a.start - b.start || b.end - a.end);
    const nodes: ReactNode[] = [];
    let cursor = 0;
    for (const { start, end, entry } of found) {
      if (start < cursor || count >= MAX_AUTO_LINKS) continue;
      used.add(entry.href);
      count++;
      nodes.push(text.slice(cursor, start));
      nodes.push(
        <Link key={`${entry.href}-${start}`} href={entry.href} className="text-accent hover:underline">
          {text.slice(start, end)}
        </Link>,
      );
      cursor = end;
    }
    nodes.push(text.slice(cursor));
    return nodes;
  };
}
