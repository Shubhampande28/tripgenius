# Itinerary Day-Fill Audit — `/itinerary/[country]-[days]-days`

**Status: implemented.** All three fix groups below (A, 2a, 2b) have been applied and verified — see "Implementation" at the bottom. This file is kept as the record of what was found and why each page got the fix it got.

**Scope:** Audit-only originally — every page from `generateStaticParams()` (i.e. every real `getAllItinerarySlugs()` slug) was rendered against the site's own logic (`buildItineraryDays`, then the exact `thingsToDo.slice(activityIndex*3, activityIndex*3+3)` the page component used at the time) via a temporary read-only script, not by reading source data alone. A "thin day" = a rendered day whose activity list has **fewer than 2 items** (0 or 1).

Scripts (kept for reproducibility): `audit/scripts/itinerary-day-fill-audit.ts` (pre-fix repro, now shows only the 2a/2b slugs since it doesn't know about the recaptioning), `audit/scripts/itinerary-day-fill-verify-final.ts` (post-fix verification — confirms 0 unaddressed thin days).

## Headline

**43 of the itinerary pages had at least one thin day.** The 3-day variant was *not* categorically safe — 6 of the 43 were `-3-days` pages. All 43 split cleanly into two root causes that needed opposite fixes:

| Root cause | Pages | Fix |
|---|---|---|
| **A — Rendering bug.** The city had real, distinct place data sitting unused in `city.areas[].spots[]` that never reached the itinerary card because the day-fill logic only ever read `city.thingsToDo` (fixed at 10 items for these cities). | **28** | Fixed the rendering/fill logic (§2) |
| **B — Genuine data gap.** The city's total inventory of distinct places (`thingsToDo` + `areas.spots`, deduped) truly wasn't enough to fill every advertised day with 2+ activities. | **15** | Honest reframe (2a, 7 pages) or noindex+coming-soon (2b, 8 pages) (§3) |

Confirmed the original hypothesis: **Hong Kong 7-days and 5-days were both broken**, but the cause was Root Cause A (fixable by rendering, not a content gap).

---

## 1. Full list of the 43 originally-broken pages, sorted by thin-day count

| Slug | Country | Cities | Thin days / total | Thin days (day #, city, activities rendered) | Root cause |
|---|---|---|---|---|---|
| bulgaria-7-days | Bulgaria | 1 (Varna) | 5/7 | 3,4,5,6,7 — Varna, 0 each | B → 2b |
| slovakia-7-days | Slovakia | 1 (Bratislava) | 5/7 | 3,4,5,6,7 — Bratislava, 0 each | B → 2b |
| estonia-7-days | Estonia | 1 (Tallinn) | 5/7 | 3,4,5,6,7 — Tallinn, 0 each | B → 2b |
| singapore-7-days | Singapore | 1 | 4/7 | 4(1),5(0),6(0),7(0) | A |
| maldives-7-days | Maldives | 1 | 4/7 | 4(1),5(0),6(0),7(0) | A |
| czech-republic-7-days | Czech Republic | 1 (Prague) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| hungary-7-days | Hungary | 1 (Budapest) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| brazil-7-days | Brazil | 1 (Rio) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| argentina-7-days | Argentina | 1 (Buenos Aires) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| peru-7-days | Peru | 1 (Cusco) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| oman-7-days | Oman | 1 (Muscat) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| georgia-7-days | Georgia | 1 (Tbilisi) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| azerbaijan-7-days | Azerbaijan | 1 (Baku) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| qatar-7-days | Qatar | 1 (Doha) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| tanzania-7-days | Tanzania | 1 (Zanzibar) | 4/7 | 4(1),5(0),6(0),7(0) | A |
| mauritius-7-days | Mauritius | 1 | 4/7 | 4(1),5(0),6(0),7(0) | A |
| **hong-kong-7-days** | **Hong Kong** | **1** | **4/7** | **4(1),5(0),6(0),7(0)** | **A** |
| bulgaria-5-days | Bulgaria | 1 (Varna) | 3/5 | 3,4,5 — 0 each | B → 2b |
| serbia-7-days | Serbia | 2 (Belgrade, Novi Sad) | 3/7 | 3(0),4(0) Belgrade; 7(0) Novi Sad | B → 2b |
| montenegro-7-days | Montenegro | 2 (Kotor, Budva) | 3/7 | 3(0),4(0) Kotor; 7(0) Budva | B → 2b |
| slovakia-5-days | Slovakia | 1 (Bratislava) | 3/5 | 3,4,5 — 0 each | B → 2b |
| estonia-5-days | Estonia | 1 (Tallinn) | 3/5 | 3,4,5 — 0 each | B → 2b |
| slovenia-7-days | Slovenia | 3 (Ljubljana, Lake Bled, Piran) | 2/7 | 3(0) Ljubljana; 6(0) Lake Bled | B → 2a |
| singapore-5-days | Singapore | 1 | 2/5 | 4(1),5(0) | A |
| maldives-5-days | Maldives | 1 | 2/5 | 4(1),5(0) | A |
| czech-republic-5-days | Czech Republic | 1 | 2/5 | 4(1),5(0) | A |
| hungary-5-days | Hungary | 1 | 2/5 | 4(1),5(0) | A |
| brazil-5-days | Brazil | 1 | 2/5 | 4(1),5(0) | A |
| argentina-5-days | Argentina | 1 | 2/5 | 4(1),5(0) | A |
| peru-5-days | Peru | 1 | 2/5 | 4(1),5(0) | A |
| oman-5-days | Oman | 1 | 2/5 | 4(1),5(0) | A |
| georgia-5-days | Georgia | 1 | 2/5 | 4(1),5(0) | A |
| azerbaijan-5-days | Azerbaijan | 1 | 2/5 | 4(1),5(0) | A |
| qatar-5-days | Qatar | 1 | 2/5 | 4(1),5(0) | A |
| tanzania-5-days | Tanzania | 1 | 2/5 | 4(1),5(0) | A |
| mauritius-5-days | Mauritius | 1 | 2/5 | 4(1),5(0) | A |
| **hong-kong-5-days** | **Hong Kong** | **1** | **2/5** | **4(1),5(0)** | **A** |
| bulgaria-3-days | Bulgaria | 1 (Varna) | 1/3 | 3 — 0 | B → 2a |
| serbia-5-days | Serbia | 2 | 1/5 | 3(0) Belgrade | B → 2a |
| montenegro-5-days | Montenegro | 2 | 1/5 | 3(0) Kotor | B → 2a |
| slovakia-3-days | Slovakia | 1 | 1/3 | 3 — 0 | B → 2a |
| estonia-3-days | Estonia | 1 | 1/3 | 3 — 0 | B → 2a |
| bahrain-7-days | Bahrain | 2 (Manama, Muharraq) | 1/7 | 4(1) Manama | B → 2a |

**3-day variants:** all were checked, not assumed clean; 6 of them *did* show the same problem (Bulgaria, Slovakia, Estonia — each 1/3 thin).

---

## 2. Root cause A — rendering bug (28 pages, 14 countries × {5,7}-day) — FIXED

**The bug:** `page.tsx` computed each day's activities as `d.city.thingsToDo?.slice(d.activityIndex * 3, d.activityIndex * 3 + 3)`. `activityIndex` is the day's 0-based index *within that city* (`itineraries.ts`), so day N for a city consumed a fresh, non-overlapping window of 3 items from `thingsToDo`. Every one of these 14 cities (Hong Kong, Singapore, Maldives, Prague, Budapest, Rio, Buenos Aires, Cusco, Muscat, Tbilisi, Baku, Doha, Zanzibar, Mauritius) has exactly **10** `thingsToDo` entries — enough for 3 full days, then a 1-item day, then nothing.

**The data wasn't actually missing** — every one of these cities also has a hand-authored `city.areas[].spots[]` list naming real, distinct places largely absent from `thingsToDo`:

| City | thingsToDo | areas.spots (raw) | Distinct extra places not in thingsToDo | Combined pool |
|---|---|---|---|---|
| Hong Kong | 10 | 15 | 12 | 22 |
| Singapore | 10 | 20 | 15 | 25 |
| Maldives | 10 | 15 | 15 | 25 |
| Prague | 10 | 15 | 11 | 21 |
| Budapest | 10 | 20 | 14 | 24 |
| Rio de Janeiro | 10 | 15 | 11 | 21 |
| Buenos Aires | 10 | 15 | 14 | 24 |
| Cusco | 10 | 15 | 10 | 20 |
| Muscat | 10 | 20 | 18 | 28 |
| Tbilisi | 10 | 20 | 18 | 28 |
| Baku | 10 | 20 | 19 | 29 |
| Doha | 10 | 20 | 17 | 27 |
| Zanzibar | 10 | 20 | 17 | 27 |
| Mauritius | 10 | 20 | 16 | 26 |

**Fix applied:** added `buildCityActivityPool(city)` in `src/lib/itineraries.ts` — merges `thingsToDo` with `areas.spots` entries that don't fuzzy-match an existing pool item by normalized name (so "Star Ferry Crossing" vs "Star Ferry crossing" doesn't double up), and `src/app/itinerary/[slug]/page.tsx` now slices that pool instead of `thingsToDo` alone. `areas.spots` items render as name-only bullets (no description) using the existing conditional description rendering. Data-neutral — no copy, duration, or index-status changes. Resolves all 28 pages, verified by `audit/scripts/itinerary-day-fill-verify-final.ts`.

---

## 3. Root cause B — genuine data gap (15 pages, 7 countries) — REFRAMED OR NOINDEXED

No rescuable extra data existed for any of these cities (same distinct-place check came back empty):

- **Varna (Bulgaria), Bratislava (Slovakia), Tallinn (Estonia)** — 6 `highlights`, `areas.spots` derived 1:1 from the same 6. 2 real solid days, full stop.
- **Belgrade & Novi Sad (Serbia), Kotor & Budva (Montenegro), Ljubljana & Lake Bled (Slovenia), Manama & Muharraq (Bahrain)** — same shape, 6 or 10 items per city.

### Per-page fix applied

Decision line: **≤29% thin → honest reframe, keep indexed (2a); ≥43% thin → noindex + coming-soon (2b).**

| Slug | Thin ratio | Fix applied | Detail |
|---|---|---|---|
| bulgaria-3-days | 33% | **2a** | Day 3 recaptioned "Flexible Day — Beach & Rest" |
| slovakia-3-days | 33% | **2a** | Day 3 recaptioned "Flexible Day — Optional Day Trip" |
| estonia-3-days | 33% | **2a** | Day 3 recaptioned "Flexible Day — Slow Morning" |
| serbia-5-days | 20% | **2a** | Day 3 recaptioned "Flexible Day — Belgrade at Your Pace" |
| montenegro-5-days | 20% | **2a** | Day 3 recaptioned "Flexible Day — Kotor at Your Pace" |
| slovenia-7-days | 29% | **2a** | Days 3 & 6 recaptioned (Ljubljana / Lake Bled "at Your Pace") |
| bahrain-7-days | 14% | **2a** | Day 4 recaptioned "Manama Wrap-Up & Transfer to Muharraq" |
| bulgaria-5-days | 60% | **2b** | noindex + coming-soon, points to bulgaria-3-days |
| bulgaria-7-days | 71% | **2b** | noindex + coming-soon, points to bulgaria-3-days |
| slovakia-5-days | 60% | **2b** | noindex + coming-soon, points to slovakia-3-days |
| slovakia-7-days | 71% | **2b** | noindex + coming-soon, points to slovakia-3-days |
| estonia-5-days | 60% | **2b** | noindex + coming-soon, points to estonia-3-days |
| estonia-7-days | 71% | **2b** | noindex + coming-soon, points to estonia-3-days |
| serbia-7-days | 43% | **2b** | noindex + coming-soon, points to serbia-5-days |
| montenegro-7-days | 43% | **2b** | noindex + coming-soon, points to montenegro-5-days |

The durable long-term fix behind all of B is authoring more real, distinct places for these 10 cities (or adding a second/third city to the thin single-city countries) — a content task, out of scope for this code change.

---

## 4. Implementation

1. **Root cause A (28 pages):** `buildCityActivityPool()` added to `src/lib/itineraries.ts`; `src/app/itinerary/[slug]/page.tsx` day-fill now uses it. No copy, duration, or index-status changes.
2. **Root cause B, 2a (7 pages):** `ITINERARY_FLEXIBLE_PLANS` in `src/lib/itineraries.ts` names the exact day(s) and an honest, city-specific suggestion per slug. Threaded through: the visible day card (heading + suggestion text replace the activity checklist), the hero answer-box ("N of these are packed sightseeing days..."), all four FAQ answers in `buildItineraryFaqs`, `dayListSchema`, and `touristTripSchema` — so the visible copy and every schema field that references day counts agree.
3. **Root cause B, 2b (8 pages):** `ITINERARY_COMING_SOON` in `src/lib/itineraries.ts` maps each slug to the shorter duration for that country that *is* fully real. `generateMetadata` returns `robots: { index: false, follow: false }` and coming-soon title/description; the page component renders a maintenance state (explanation + link to the honest shorter itinerary + link to the country guide) instead of the full itinerary body — no JSON-LD emitted for these.

**Verified:** `npm run build` succeeds; `audit/scripts/itinerary-day-fill-verify-final.ts` confirms 0 remaining unaddressed thin days across all 213 itinerary pages (28 fixed by rendering, 8 flex-day instances intentionally recaptioned across the 7 reframed pages, 8 pages noindexed with no day cards rendered).
