# Zone 4 Batch 2 — Candidate List (Track A + Track B)

> **⚠️ CORRECTION (2026-08-19) — Track B below is wrong. Do not build it.**
> The original "unmatched query" scan that produced Track B's 10 India
> hill-station/pilgrimage candidates had a name-matching bug: it checked
> queries against each city's exact `name` string, which fails for any city
> whose real name carries a parenthetical or compound form —
> `"Coorg (Kodagu)"`, `"Ooty (Udhagamandalam)"`, `"Spiti Valley"`,
> `"Leh Ladakh"`, `"Alleppey (Alappuzha)"`, `"Mysuru (Mysore)"`,
> `"Mathura & Vrindavan"` — none of those match a plain `"coorg"` /
> `"ooty"` substring check. **All 10 Track B cities already exist in the
> codebase and are already fully authored (12/12 months live)** — verified
> directly via `allCities`/`authoredMonthCitySlugs`, not the flawed script:
> `coorg`, `spiti`, `ooty`, `rameswaram` (not `rameshwaram` — spelling
> differs), `ladakh` (covers Leh), `alleppey`, `mcleod-ganj`, `mathura`,
> `mysuru` (not `mysore`), `bir-billing`. One of the build agents caught
> this before writing anything and correctly refused rather than create
> duplicate, cannibalizing pages — see its report for the line numbers.
>
> **What this actually means:** the GSC impressions behind Track B (Ooty's
> 764, Coorg's 376, etc.) are landing on pages that already exist, not
> missing ones. That's a genuinely different problem — a ranking/CTR gap on
> live pages, not a content gap — and needs its own investigation (check
> each page's actual current ranking position, title/meta, and whether the
> monthByMonth data on file is current) rather than a "build 10 cities"
> batch. Track A below is unaffected — its pool was built by excluding
> already-authored *slugs* directly, not by fuzzy name matching, and was
> independently re-verified against `authoredMonthCitySlugs` before Batch 2
> build work started.

Source: GSC export `Performance-on-Search-2026-08-12` (`Pages.csv` + `Queries.csv`,
28-day window, most recent available). Cross-referenced against the live
`allCities` export (493 cities: 184 authored/12-months-live, 215 non-stub with
no `monthByMonth` yet, 94 stubs with no real content at all).

## A note on how "Track A" actually maps onto the codebase

`/visit/[city]/[month]` has no partial-coverage state — `generateStaticParams`
builds all 12 months for every city in `authoredMonthCitySlugs`, and
`MonthByMonth.months` is a fixed 12-tuple at the type level, so a city is
either 0/12 or 12/12. **There's no "city missing 4 months" bucket to fill.**

What the two tracks actually differ on is **how much of the guide already
exists**, which is exactly what Batch 1's validation found too (Vadodara,
the "pre-flagged exception," was the one city that already had a full guide
and was just missing `monthByMonth`):

- **Track A** = city already has a real, non-stub guide (`description`,
  `thingsToDo`, hotels, etc.) — adding `monthByMonth` is the *only* work.
  Same shape as 15 of Batch 1's 16 cities.
- **Track B** = city doesn't exist in the data model at all (or exists only
  as a stub) — needs a full guide **and** `monthByMonth`. Bigger lift, same
  shape as if Batch 1 had had to build Edinburgh from zero instead of just
  adding its months.

---

## TRACK A — existing guide, `monthByMonth`-only (low, uniform effort)

27 non-stub cities show real GSC impressions with **zero clicks** — mostly
landing on their existing `/best-time-to-visit/[city]` page, which is a
single generic page, not the 12-page month-specific series. That's the
Batch 1 thesis exactly: real search visibility, nothing built yet to
convert it. Ranked by impressions (the only real differentiator — CTR is
0% across the board *because* the deep page doesn't exist yet, so it can't
be used to rank within this track).

| # | City | Country | Impr (28d) | Clicks | Signal source |
|---|---|---|---:|---:|---|
| 1 | **Kandy** | Sri Lanka | 67 | 0 | `/best-time-to-visit/kandy` (47) + matched query *"best time to visit kandy"* (20) |
| 2 | **Casablanca** | Morocco | 49 | 0 | `/best-time-to-visit/casablanca` |
| 3 | **Sharjah** | UAE | 37 | 0 | `/best-time-to-visit/sharjah` |
| 4 | **Basel** | Switzerland | 34 | 0 | `/best-time-to-visit/basel` |
| 5 | **Fujairah** | UAE | 31 | 0 | `/best-time-to-visit/fujairah` |
| 6 | **Frankfurt** | Germany | 24 | 0 | `/best-time-to-visit/frankfurt` |
| 7 | **Lamu** | Kenya | 23 | 0 | `/best-time-to-visit/lamu` |
| 8 | **Punakha** | Bhutan | 21 | 0 | `/cities/punakha` |
| 9 | **Christchurch** | New Zealand | 20 | 0 | `/best-time-to-visit/christchurch` |
| 10 | **Seville** | Spain | 19 | 0 | `/best-time-to-visit/seville` |
| 11 | **Zermatt** | Switzerland | 19 | 0 | `/best-time-to-visit/zermatt` |
| 12 | **Calgary** | Canada | 18 | 0 | `/best-time-to-visit/calgary` |
| 13 | **Dunedin** | New Zealand | 17 | 0 | `/best-time-to-visit/dunedin` |
| 14 | **Zurich** | Switzerland | 15 | 0 | `/cities/zurich` |
| 15 | **Wellington** | New Zealand | 15 | 0 | `/best-time-to-visit/wellington` |

*(12 more below the fold at 10-14 impressions each: Gold Coast AU, Valencia
ES, Busan KR, Boracay PH, Siargao PH, Mombasa KE, Dubrovnik HR, Lombok ID,
Cologne DE, Milan IT, Ella LK, Penang MY — same pattern, smaller signal.)*

**Country-cluster read:** three countries show *multiple* cities on this
list independently — **Switzerland** (Basel, Zermatt, Zurich), **New
Zealand** (Christchurch, Dunedin, Wellington), and to a lesser extent
**UAE** (Sharjah, Fujairah) and **Spain** (Seville, Valencia). That's a
stronger, more specific signal than any single city's impression count —
worth treating as "go deep on this country" the way Batch 1 did for
Italy/UK/Canada/Australia, rather than picking one city and stopping.

**Recommended Batch 2 Track A pick: top 15 above** (mirrors Batch 1's
scope). All are `monthByMonth`-only — no new guide content, no new images,
no new city routing. Fastest possible conversion path.

---

## TRACK B — new city, full guide + `monthByMonth` (high, uniform-ish effort)

Zero of the 94 *stub* cities show any GSC signal — expected, they have no
real content to rank on, so this track can't be validated through existing
stub entries. Instead I scanned `Queries.csv` for real search volume on
place names **that don't exist anywhere in `allCities`, not even as a
stub**, and aggregated every phrasing variant per place:

| # | City | State/Region | Impr (28d) | Clicks | Query variants | Pattern |
|---|---|---|---:|---:|---:|---|
| 1 | **Ooty** | Tamil Nadu, India | **764** | 0 | 20 | "ooty in [month]", "ooty vs darjeeling", "is ooty good to visit in [month]" |
| 2 | **Coorg** | Karnataka, India | 376 | 2 | 13 | "coorg in [month]", "coorg weather/temperature in [month]" |
| 3 | **Leh / Ladakh** | Ladakh, India | 186 | 0 | 13 | "ladakh/leh weather in [month] 2026" |
| 4 | **Spiti Valley** | Himachal, India | 143 | 0 | 7 | "spiti temperature/weather in [month]" |
| 5 | **Rameshwaram** | Tamil Nadu, India | 139 | 2 | 6 | "rameshwaram in [month]", "is [month] good to visit rameshwaram" |
| 6 | **Alleppey** | Kerala, India | 114 | 0 | 3 | "alleppey in/weather [month]" |
| 7 | **McLeodganj** | Himachal, India | 73 | 0 | 1 | "mcleodganj in august" |
| 8 | **Mathura (+Vrindavan)** | UP, India | 57 | 1 | 4 | "mathura vrindavan in/weather [month]" |
| 9 | **Mysore** | Karnataka, India | 49 | 0 | 3 | "mysore in/weather [month]" |
| 10 | **Bir (Bir Billing)** | Himachal, India | 47 | 1 | 3 | "bir billing in/weather [month]" |

**Every single query behind these ten is exactly the intent
`/visit/[city]/[month]` exists to capture** — "X in [month]" or "X weather
in [month]" — with a combined **~1,930 impressions and 6 clicks** currently
converting nowhere, because none of these ten cities exist on the site at
all. Ooty alone (764 impr, 0 clicks) is a bigger single-city opportunity
than the entire Track A list combined.

**Important scope note — this list is India-only, and that's a finding, not
a filter.** Your Track B hypothesis was "cities adjacent to proven
fame-tier cities" (Liverpool near Edinburgh/Manchester, Montreal near
Toronto/Vancouver, Milan near Venice/Florence, etc.). **I checked — none of
those international adjacency candidates show any real query volume in the
current data.** They're a reasonable editorial bet, but unlike the ten
above, they'd be going in with zero GSC validation, same risk profile as
the 7 countries Batch 1 dropped for exactly this reason (Jordan, Croatia,
Switzerland, New Zealand, Sri Lanka, Nepal, Cambodia — all *sounded*
plausible, all had 0 real clicks). The account's real signal is still ~90%
India by volume; the ten above are where that signal is actually pointing.

**Recommended Batch 2 Track B pick: all 10 above.** If you want an
international bet anyway, Frankfurt/Basel/Zurich/Calgary/Seville are
already covered in **Track A** (existing guides, just needs months) — pull
from there instead of guessing blind on a brand-new international city.

---

## Bonus finding — free wins, not part of either track

Three *already-authored* cities are losing clicks to alias/informal-name
queries that don't match their page copy:

- **Varanasi** ← "banaras in september/july/august" (275 impr) + "kashi in
  september/august" (42 impr) — Banaras and Kashi are the same city.
- **Ho Chi Minh City** ← "ho chi minh in august" (62 impr) — missing the
  "City" suffix.
- **Rio de Janeiro** ← "rio in november/october" (49 impr) — short form.

No new pages needed — add these as recognized alt-names in each page's
copy/metadata (a title or intro line mentioning the alias is usually
enough for Google to associate the query). Small, essentially free, worth
doing alongside Batch 2 rather than as its own batch.

---

## Suggested build order

1. **Track B #1-2 first** (Ooty, Coorg) — the two single biggest
   opportunities in the entire dataset, bigger than anything in Track A.
2. **Track A top 15** — fastest per-page conversion (guide already exists),
   good parallel work while Track B's new guides are being researched.
3. **Track B #3-10** (Leh/Ladakh through Bir) — same pattern, smaller
   individual signal, same India hill-station/pilgrimage cluster.
4. **Alias fixes** — same day as either, ~30 minutes of copy edits.

Total scope if all of Track A (15) + Track B (10) ship: 25 new
`monthByMonth` authorships → **300 new `/visit/[city]/[month]` pages**
(vs. Batch 1's 192), plus 10 new full city guides for Track B.

*Every number above is a real, unrounded pull from `Pages.csv`/`Queries.csv`
— no estimation or country-level proxying this time (Batch 1 had to
substitute country-level GSC for missing Trends data; this batch had real
page- and query-level data for both tracks). Validate CTR assumptions again
after Batch 2 ships, same as Batch 1's post-publish check.*
