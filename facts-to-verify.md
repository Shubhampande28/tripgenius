# Facts to Verify — 2026 Content Refresh (2026-07-06)

The year refresh updated **mechanical** year references only ("2025" → "2026"
in titles, headings, and generic prose). The claims below are **year-sensitive
facts that were NOT auto-updated** — a human must verify each against current
sources and edit `src/lib/blog.ts` accordingly (then bump that post's
`updated` field again).

## 1. Visa rules (HIGH priority — regulatory facts)

| File:line | Post | Claim to verify |
|---|---|---|
| `src/lib/blog.ts:216` | visa-free-countries-indian-passport-2025 (old, redirected) | "Indian passport holders can travel to **57+ countries** either completely visa-free or with a simple visa on arrival" — count changes yearly (Henley/official sources) |
| `src/lib/blog.ts:482` | **visa-free-countries-indian-passport-2026 (LIVE — verify first)** | Same "57+ countries" claim, plus the **entire country list, visa-on-arrival fees, and e-visa rules in the post body** — the whole post is regulatory content republished under a 2026 title; verify against MEA/embassy sources before promoting it |
| `src/lib/blog.ts:2814` | europe-backpacking-guide-india | Title kept "Visa, Budget" promise — verify **Schengen visa fee and application process** claims in the body |

## 2. Price claims in refreshed titles (verify body numbers still hold)

These titles were bumped to 2026, but their headline price promises were
written in 2025 — confirm the numbers are still realistic or update them:

| File:line | Post | Price claim |
|---|---|---|
| `src/lib/blog.ts:1116` | bangkok-budget-travel-guide | "See the City for **Under ₹4,000/Day**" (+ per-item costs in body) |
| `src/lib/blog.ts:2480` | maldives-budget-travel-guide | "How to Visit for **Under $100/Day**" |
| `src/lib/blog.ts:3274` | paris-travel-guide-2026 (title) | "How Much It Costs" — body cost tables |
| `src/lib/blog.ts:3478` | santorini-travel-guide | "(and the Price)" — body cost figures |
| `src/lib/blog.ts:3546` | london-travel-guide-2026 (title) | "How Much It Costs" — body cost tables |

## 3. Not touched (out of scope, unreachable)

- **23 retired posts** (Dubai/Thailand cluster) still contain "2025" in titles
  or slugs — they 301-redirect to canonical hubs and never render; no action
  needed unless they are ever un-retired.
- Original publish `date:` fields legitimately contain 2025 and were preserved
  everywhere (schema `datePublished` must not change).

## How the refresh was applied (for reference)

- 44 live posts: mechanical year bumps (46 replacements) + `updated: '2026-07-06'`
- 6 further posts: title year bumped, price claims listed above
- `visa-free-countries-indian-passport-2025` → cloned to `…-2026`
  (301 in `src/lib/postRedirects.ts`, drives `next.config` + build exclusion);
  3 internal links updated to the new slug
- Blog template now shows "Last updated: {Month Year}" under the H1 (from
  `updated`); Article JSON-LD already emitted `datePublished` + `dateModified`
- Sitemap `lastmod` now uses `updated ?? date`
