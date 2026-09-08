# Content Integrity + Link + Mobile Audit — 2026-09-08

Commit: `97d5842` (Task 1, Task 2). No code changes for Task 3 — everything checked passed.

## Task 1 — 86 stub cities with fabricated content (priority)

**Verified before fixing anything:**
- Pulled 26 months of GSC history (the max Google retains) for the 8 previously-stub
  slugs upgraded in the prior batch: **zero impressions ever**, any path. `isIndexableCity()`
  correctly gates `robots: {index:false}` on `/cities/[slug]` and `/best-time-to-visit/[city]`,
  and `sitemap.ts` excludes all 86 remaining stub cities — verified programmatically, not assumed.
- `AdUnit` on `/cities/[slug]` only renders `if (isIndexableCity(city))` — no ad has ever
  served next to fabricated content.
- **But**: found a real internal-link exposure path. `/countries/[country]` built its
  destination-card grid from `country.cities` with no stub filter (unlike `/destinations`,
  which already had one). 3 of the 8 upgraded cities plus ~a dozen of the remaining 86 are
  listed in India's `cities` array and were reachable this way.

**Fixed (2 files, the ones the task named):**
- `src/app/countries/[country]/page.tsx` — added `!c.stub` to the `citiesData` filter (same
  pattern `/destinations/page.tsx` already used). Cascades correctly to `rankedCities`,
  `displayCities`, and the `ItemList` schema, all derived from it.
- `src/components/country/CountryDestinationsGrid.tsx` — added the same filter directly in
  the component as defense-in-depth, so a future caller can't reintroduce the bug by passing
  an unfiltered list.

**Full sweep — every location checked, per the task's explicit instruction not to assume
containment from one fix:**

| Location | Status |
|---|---|
| `destinations/page.tsx` | ✅ already filtered |
| `countries/[country]/page.tsx` | ❌ → ✅ fixed |
| `CountryDestinationsGrid.tsx` | ❌ → ✅ fixed (defense-in-depth) |
| `cities/page.tsx` (directory/search) | ❌ → ✅ fixed |
| `Hero.tsx` (homepage search bar) | ❌ → ✅ fixed — highest-visibility gap found |
| `HomeClient.tsx` (`FEATURED_POOL`, `FEATURED_SLUGS`) | ✅ already filtered / verified clean hardcoded list |
| `planEngine.ts` (`matchDestination`) | ❌ → ✅ fixed — **most consequential bug**: exact-slug match bypassed the stub filter the fuzzy-match path already had, so the trip planner would build a full itinerary from fabricated data |
| `plan/page.tsx`, `plan/[city]/page.tsx` | defensive `!c.stub` added; empirically 0 stub cities currently pass `cityHasMapBuilder`, verified, but that's a data fact not a structural guarantee |
| `RelatedCities.tsx` | ✅ already filtered |
| `autoLink.tsx` | ✅ already filtered via `isIndexableCity` |
| `searchSuggestions.ts` | ✅ already filtered |
| `similarity.ts` | ✅ already filtered (candidate side) |
| `siteStats.ts` (`REAL_CITY_COUNT`) | ✅ already filtered |
| `instagramDraft.ts`, `socialQueue.ts` | ✅ already filtered |
| `sitemap.ts` (all references) | ✅ fully gated |
| `itineraries.ts` | ✅ already filtered |
| `comparisons.ts` / `compare/[slug]` | hardcoded 29 curated pairs — verified programmatically that 0 involve a stub city |
| `SimilarDestinations.tsx` (+Card/+Analytics) | pure pass-through of already-filtered `similarity.ts` data — safe |
| `carousel/[city]`, `cheatsheet/[slug]` | always `noindex,nofollow` regardless of stub status — low risk, no fix needed |
| `Navbar.tsx` | no independent city search — safe |

**Not attempted**: converting the 86 stub cities to real content — out of scope per the task.

## Task 2 — Broken links + internal linking

**404/broken-link crawl**: a full crawl of 5,000+ pages wasn't practical in-session, so I did
a representative crawl instead — rebuilt, started the app locally, fetched 20 seed pages
(homepage, `/cities`, `/destinations`, `/countries` + 3 country hubs, `/blog`, `/plan`,
`/trending`, `/news`, 5 `/visit/[city]/[month]` pages spanning old/upgraded/new cities,
2 `/cities/[slug]`, 2 `/best-time-to-visit/[city]`), extracted all 623 unique internal link
targets, and checked each. **Result: 0 broken links, 0 links to stub cities** (confirms the
Task 1 fixes actually took effect in rendered output, not just in source).

**`/visit/[city]/[month]` internal linking — already NOT a dead end, no changes needed.**
Checked the template directly: every page already links to
1. the city's `/cities/[slug]` guide (breadcrumb + footer CTA),
2. `/best-time-to-visit/[slug]` (breadcrumb + a "See the full month-by-month guide" link),
3. the previous and next month for the same city (`/visit/[slug]/[prevMonth]` /
   `[nextMonth]`),
4. a "Better month?" link to the city's best-rated month when the current one isn't already
   the best, and
5. `/plan/[slug]` when the city has interactive-map support.

`/best-time-to-visit/[city]/page.tsx` in turn links out to all 12 (indexable) month pages
from its month-by-month table. So every month page reaches every other month for that city
within one hop via the hub — satisfying the task's own suggested bar ("a 'See other months'
block is enough") without any new code.

## Task 3 — Mobile/UX checks

No browser/screenshot tool is available in this environment, so these were verified via
static CSS/HTML analysis (checking for the actual patterns that cause each failure mode)
rather than pixel rendering at 375/390px. Flagging that limitation up front rather than
claiming a visual confirmation I didn't have.

| Check | Result |
|---|---|
| Horizontal scroll — `/`, `/blog`, `/visit/[city]/[month]` | **Pass.** Checked every fixed-pixel-width element found (`EmailWaitlist.tsx`'s 600px/400px decorative rings — parent has `overflow-hidden`; `Reviews.tsx`'s marquee cards — parent has `overflow-hidden`, intentional contained scroll). No un-contained fixed-width elements found. Desktop nav links (the ones using `whitespace-nowrap`) are `hidden lg:flex` — never rendered on mobile at all. |
| Favicon | **Pass.** Both `src/app/favicon.ico` and the dynamic `icon.tsx` route confirmed loading with a live 200 (`/favicon.ico` and `/icon`). |
| Listed email → `mailto:` | **Pass.** All three listed occurrences of `hello@tripgenius.in` (contact, privacy-policy, terms) are `<a href="mailto:...">`. One incidental plain-text mention inside a form error message (contact page) isn't a "listed" contact point — noted, not fixed, since it's not what the check is asking about; happy to make it a link too if you want full consistency. |
| Listed phone → `tel:` | **N/A.** No phone number is listed anywhere on the site. |
| "Things to do" list / data-table overflow | **Pass.** The blog's `<table>` renderer wraps every table in `overflow-x-auto` (`blog/[slug]/page.tsx`). The "Things to do" list on `/visit/[city]/[month]` uses a flex layout with wrapping text and no fixed widths. |

**Recommendation**: since I can't render pixels here, a quick manual check in Chrome DevTools
device mode (375px/390px) on the same 3 page types would be the real confirmation — the static
analysis found no cause for concern, but it's not a substitute for seeing it.

## Summary of what changed vs. what was verified-and-left-alone

- **Code changed**: 7 files (Task 1), 0 files (Task 2 — already correct), 0 files (Task 3 — all passed).
- **Verified with live data, not assumption**: GSC history for the 8 upgraded cities, live
  internal-link crawl of 623 targets, empirical check that 0 stub cities pass `cityHasMapBuilder`,
  empirical check that 0 of 29 `COMPARISONS` pairs involve a stub city.
- **Nothing fabricated**: every number in this report came from either reading the code or a
  live query (GSC API, local crawl) — no estimates presented as measurements.
