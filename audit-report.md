# TripGenius Site Audit — 2026-07-05

Read-only audit. No changes were made. Scope: content inventory, JSON-LD schema,
dead links, metadata, thin pages, images, performance.

Context for numbers: recent remediation (PRs #1–#11) gated indexing to 70 city
guides, 70 best-time pages, 693 month pages and 14 blog posts; 36 thin blog
posts 301-redirect to canonical hubs. This audit reflects the post-remediation
state; several "160+ cities" claims in copy predate it.

---

## PRIORITIZED FIX LIST

| # | Priority | Issue | Where |
|---|---|---|---|
| 1 | **HIGH** | 70 of 92 blog posts carry "2025" in title or slug — 6 of the 14 *indexable* posts look stale in SERPs (incl. `best-time-to-visit-bali`, `bangkok-budget-travel-guide`, `best-beaches-india-2025`). Titles are cheap to bump to 2026; **slugs with 2025 need a redirect if renamed** | `src/lib/blog.ts` |
| 2 | **HIGH** | `dateModified` (`updated` field) set on only **1 of 92** posts — Article schema emits stale freshness signals sitewide | `src/lib/blog.ts` |
| 3 | **MED** | `/privacy-policy` and `/terms` define no canonical → they **inherit the root canonical (`https://www.tripgenius.in`)**, telling Google both pages are duplicates of the homepage | `src/app/privacy-policy/page.tsx`, `src/app/terms/page.tsx` (root default: `src/app/layout.tsx:42`) |
| 4 | **MED** | Homepage (`src/app/page.tsx`) is one big `'use client'` component — no server rendering benefit, largest JS payload on the most-visited page | `src/app/page.tsx:1` |
| 5 | **MED** | Blog body images render as raw `<img>` without width/height → CLS risk on every image-bearing post | `src/app/blog/[slug]/page.tsx:142` |
| 6 | **LOW** | `keywords` meta emitted from 13 files — ignored by Google since 2009; pure noise, trivial to remove | see §4 |
| 7 | **LOW** | 3 × `href="#"` placeholder CTAs — but both components are **dead code (never imported)**; delete the files | `CitySnapshot.tsx`, `Neighbourhoods.tsx` |
| 8 | **LOW** | Marketing copy still says "160+ cities" in root metadata/OG while only 70 city guides are indexable — harmless to users, slightly inconsistent for reviewers | `src/app/layout.tsx:49,56`, `src/app/cities/layout.tsx` |
| 9 | **LOW** | A few generic `alt` texts (`alt={city.name}`, `alt={country.name}`) | `FeaturedCities.tsx:71`, `CountriesExplorer.tsx:176` |

---

## 1. Content inventory (blog)

- **92 posts** in `src/lib/blog.ts`. 56 prerendered (36 retired → 308 redirects to hubs), **14 indexable** (≥600 words), rest `noindex`.
- **70 posts flagged** containing "2025" in title or slug (full machine-readable list: run the inventory script; flags below are the ones that matter — the *indexable* set):

| Indexable post | 2025 flag | date | updated |
|---|---|---|---|
| bali-vs-thailand-indian-travellers | ok | 2025-06-03 | — |
| visa-free-countries-indian-passport-**2025** | **slug+title** | 2025-06-02 | — |
| bali-itinerary-indian-tourists | ok | 2025-06-04 | — |
| best-time-to-visit-bali ("(2025)" in title) | **title** | 2025-05-20 | — |
| goa-vs-kerala ("2025" in title) | **title** | 2025-05-15 | — |
| bangkok-budget-travel-guide ("2025" in title) | **title** | 2025-05-10 | — |
| first-time-japan-travel-tips ("(2025)") | **title** | 2025-05-05 | — |
| best-beaches-india-**2025** | **slug+title** | 2025-04-28 | — |
| rajasthan-7-day-itinerary | ok | 2025-06-03 | — |

- The Dubai/Thailand cluster (retired, redirected) mostly says "2026" in titles but several have `2025` in the **slug** (e.g. `dubai-travel-guide-2025`) — moot while redirected, but don't resurrect those slugs.
- **`updated` (dateModified) is set on exactly 1 of 92 posts.** The blog Article schema falls back to `date`, so freshness signals are stale.

**Recommendation:** bump titles/meta to 2026 with a genuine content-refresh pass (change something real, then set `updated`); keep 2025 slugs as-is (renaming requires 301s) except `best-beaches-india-2025` / `visa-free-countries-indian-passport-2025` where a rename+redirect is worth it long-term.

## 2. JSON-LD schema by page type

| Page type | File | Schema types emitted |
|---|---|---|
| All pages (root) | `src/app/layout.tsx` | `Organization`, `WebSite` (+`SearchAction`/`EntryPoint`) |
| Home | `src/app/page.tsx` | `FAQPage` |
| City guide | `src/app/cities/[slug]/page.tsx` | `TouristDestination`+`TouristAttraction`, `BreadcrumbList`, `FAQPage` (hand-authored only), `ItemList`, `WebPage`, `Place`/`Country`/`PostalAddress`, `LodgingBusiness`/`Restaurant` (**only when hand-authored** — synthetic suppressed), `TravelAction`, `ImageObject` |
| Country hub | `src/app/countries/[country]/page.tsx` | `BreadcrumbList`, `ItemList` of `TouristTrip`, `FAQPage` |
| Countries index | `src/app/countries/page.tsx` | `BreadcrumbList` |
| Blog post | `src/app/blog/[slug]/page.tsx` | `Article` (+`Organization` publisher, `ImageObject`), `BreadcrumbList`, `FAQPage`, `WebPage` |
| Compare | `src/app/compare/[slug]/page.tsx` | `FAQPage` only — **no Breadcrumb, no ItemList** (gap) |
| Best-time | `src/app/best-time-to-visit/[city]/page.tsx` | `FAQPage` only — **no Breadcrumb** (gap) |
| Month page | `src/app/visit/[city]/[month]/page.tsx` | `FAQPage`, `BreadcrumbList` |
| Itinerary | `src/app/itinerary/[slug]/page.tsx` | `TouristTrip`, `Article`, `ItemList`, `BreadcrumbList`, `TouristAttraction` |
| About | `src/app/about/page.tsx` | `Organization` + `ContactPoint` |

Gaps worth filling: `BreadcrumbList` on compare + best-time pages; `ItemList` on compare pages.

## 3. Dead links

| File:line | Link | Reality |
|---|---|---|
| `src/components/city/CitySnapshot.tsx:236` | `href="#"` — "Find Hotels in {city}" CTA | **Component is never imported — dead code, does not ship** |
| `src/components/city/CitySnapshot.tsx:243` | `href="#"` — "Flights" CTA | same |
| `src/components/city/Neighbourhoods.tsx:116` | `href="#"` — "Find hotels in {n.name}" | **Never imported — dead code** (live pages use `NeighbourhoodsAreas`/`WhereToStay`, which link real affiliate URLs) |

No `href=""` or `javascript:void` found. Footer/nav/social links are real. **Fix = delete the two unused files** rather than patch the links.

## 4. Metadata

- **Unique title/description/canonical/OG per page type: PASS** for all indexable dynamic routes (city, country, blog post, compare, itinerary, best-time, visit) — each has `generateMetadata` with per-page canonical and OG. Listing pages get metadata via segment `layout.tsx` files (blog, cities, destinations, plan, contact) — all with canonicals.
- **FLAG — canonical inheritance bug:** `privacy-policy` and `terms` define `title` but no `alternates.canonical`; they inherit the root layout's `canonical: SITE` (`layout.tsx:42`), i.e. both claim to be the homepage. Add per-page canonicals (or drop the root-level canonical and rely on `metadataBase`).
- **FLAG — `keywords` meta exists** in 13 files (root layout; blog/cities/destinations/plan layouts; city, country, countries-index, blog-post, compare, itinerary, best-time, visit pages). Google ignores it; remove for cleanliness.
- Noindex correctness spot-checked live: thin city → `noindex,nofollow`, strong city → `index,follow` ✅; `/carousel`, `/cheatsheet` noindex ✅.

## 5. Thin pages (10-city sample, visible unique words)

Estimated from displayed data fields under current rendering rules (synthetic
restaurants/pro-tips/offbeat/getting-around hidden):

| City | Indexable | ~Visible words |
|---|---|---|
| Bali | Y | 2,383 |
| Tokyo | Y | 2,118 |
| Zanzibar | Y | 1,085 |
| Baku | Y | 1,018 |
| Jaipur | Y | 915 |
| Tbilisi | Y | 906 |
| Cusco | Y | 870 |
| Cape Town | Y | 814 |
| Hampi | Y | 700 |
| Amritsar | Y | 624 |

**None under 300 words — PASS.** Two caveats: (a) the ~233 noindexed cities still *render* synthetic month summaries and 2 template neighbourhood cards ("Quieter Local Base") — fine for robots, but a human reviewer clicking around can still see them; (b) the neighbourhood fallback cards also appear on some indexable non-flagship cities via `WhereToStay` — the one remaining displayed-synthetic surface.

## 6. Images

- Core image component `SafeImage` wraps `next/image` ✅; 24 `sizes=` usages across city/blog components; `CityHero` uses `priority` ✅; below-fold images rely on next/image default lazy loading ✅.
- **FLAG:** blog content-block images are raw `<img>` (`blog/[slug]/page.tsx:142`) — `loading="lazy"` is set but **no width/height** → CLS on every image-bearing post. Convert to `next/image` with dimensions or add explicit aspect-ratio.
- Raw `<img>` also in `Navbar.tsx` (logo — minor; add width/height) and `CountriesExplorer.tsx`.
- Alt text: mostly descriptive (`alt={`${city.name} travel guide — ${tagline}, ${country}`}` pattern ✅). 3 intentional `alt=""` decorative cases (acceptable). Generic alts at `FeaturedCities.tsx:71` (`alt={city.name}`) and `CountriesExplorer.tsx:176` (`alt={country.name}`) — enrich.

## 7. Performance red flags

- **`'use client'` on 6 route pages** — `page.tsx` (home), `blog/page.tsx`, `cities/page.tsx`, `destinations/page.tsx`, `contact/page.tsx`, `plan/page.tsx`. The homepage is the biggest offender: it's fully client-rendered (useMemo/useState for shuffle + search), shipping the whole page as JS. Splitting the static hero/sections into server components with small client islands would cut LCP/TBT on the highest-traffic page. Blog/cities/destinations listings could likewise be server components with a client search island.
- **Fonts:** `next/font` with `display: "swap"` for both families ✅ (`layout.tsx:14,21`).
- **Third-party scripts:** AdSense loads with `strategy="lazyOnload"` ✅ (non-blocking); GA4 `afterInteractive` ✅. No render-blocking third-party scripts found.
- **framer-motion** is imported across ~all city section components — meaningful JS weight on city pages; consider CSS animations or `LazyMotion`.
- Leaflet map loads via wrapper (`CityMapWrapper`) — verify it stays dynamically imported (it appeared code-split in build output ✅).

---

*Generated by audit run 2026-07-05. No files were modified.*
