/**
 * Inserts link-cta blocks into the 3 new posts for internal cross-linking.
 * Run once: node scripts/add-internal-links.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dir, '../src/lib/blog.ts');

let content = readFileSync(filePath, 'utf8');

// Each insertion: find `anchor` (unique string already in file), insert `block` after the
// closing brace/bracket of that block.
// Strategy: find the anchor, then find the next `},` or `},` that ends the block, insert after it.

function insertAfterBlock(fileContent, anchor, newBlock) {
  const idx = fileContent.indexOf(anchor);
  if (idx === -1) throw new Error(`Anchor not found: ${anchor.slice(0, 60)}`);

  // Walk forward from anchor to find the end of the current content block
  // Content blocks end with `},` on their own line (with leading spaces)
  // Find the first `},` that appears after the anchor on its own line
  const afterAnchor = fileContent.indexOf('\n', idx);
  // Find the closing }, of the block containing the anchor
  // We look for pattern: newline + spaces + },
  const closePattern = /\n( +)\},/g;
  closePattern.lastIndex = afterAnchor;
  const match = closePattern.exec(fileContent);
  if (!match) throw new Error(`Could not find block close after: ${anchor.slice(0, 60)}`);

  const insertPos = match.index + match[0].length;
  return fileContent.slice(0, insertPos) + '\n' + newBlock + fileContent.slice(insertPos);
}

// ── Insertions ────────────────────────────────────────────────────────────────

const insertions = [

  // ── BALI ITINERARY post ───────────────────────────────────────────────────
  // 1. After the VOA callout → link to visa-free post
  {
    anchor: `'Carry exactly USD 35 in crisp notes specifically for the VOA counter.`,
    block: `      { type: 'link-cta', text: 'Planning other destinations too? See the full list of countries Indians can visit without a visa.', href: '/blog/visa-free-countries-indian-passport-2025' },`,
  },
  // 2. After the cost-table budget callout → link to bali-vs-thailand
  {
    anchor: `'Budget tip: book flights 3–4 months ahead for May or September travel.`,
    block: `      { type: 'link-cta', text: 'Comparing Bali with Thailand? Read our honest side-by-side guide for Indian travellers.', href: '/blog/bali-vs-thailand-indian-travellers' },`,
  },

  // ── VISA-FREE post ────────────────────────────────────────────────────────
  // 3. After Asia table section intro paragraph → link to bali-itinerary
  {
    anchor: `'Conditions change frequently. Always verify entry requirements on the official embassy website`,
    block: `      { type: 'link-cta', text: 'Planning a Bali trip? We have a complete 7-day Bali itinerary for Indian tourists with costs in INR.', href: '/blog/bali-itinerary-indian-tourists' },`,
  },
  // 4. After "Countries Opening Up" last paragraph → link to bali-vs-thailand
  {
    anchor: `'Thailand made its visa-free access for Indians permanent in 2024.`,
    block: `      { type: 'link-cta', text: 'Torn between Bali and Thailand? Read our comparison guide for Indian travellers.', href: '/blog/bali-vs-thailand-indian-travellers' },`,
  },

  // ── BALI VS THAILAND post ─────────────────────────────────────────────────
  // 5. After the visa comparison paragraph → link to visa-free post
  {
    anchor: `'Thailand gives Indians a 30-day visa-free entry (as of 2024, made permanent after a successful trial).`,
    block: `      { type: 'link-cta', text: 'See the full list of visa-free and visa-on-arrival countries for Indian passport holders.', href: '/blog/visa-free-countries-indian-passport-2025' },`,
  },
  // 6. After the final verdict paragraph → link to bali-itinerary
  {
    anchor: `'Already decided on Bali? Here is the more complete one-island experience.`,
    block: `      { type: 'link-cta', text: 'Already decided on Bali? Read our 7-day Bali itinerary for Indians with a full cost breakdown in INR.', href: '/blog/bali-itinerary-indian-tourists' },`,
  },
];

// Run insertions in reverse order of position so indexes don't shift
// First, find all positions
const positioned = insertions.map((ins, i) => {
  const idx = content.indexOf(ins.anchor);
  if (idx === -1) {
    console.error(`ANCHOR NOT FOUND [${i}]: ${ins.anchor.slice(0, 80)}`);
    return null;
  }
  return { ...ins, pos: idx, i };
}).filter(Boolean);

// Sort descending by position so later insertions don't shift earlier anchors
positioned.sort((a, b) => b.pos - a.pos);

for (const ins of positioned) {
  try {
    content = insertAfterBlock(content, ins.anchor, ins.block);
    console.log(`✓ Inserted link-cta [${ins.i}]`);
  } catch (e) {
    console.error(`✗ Failed [${ins.i}]: ${e.message}`);
  }
}

writeFileSync(filePath, content, 'utf8');
console.log('\nDone.');
