# TripGenius Feature Specification
**Version:** 1.0  
**Date:** 2026-06-04  
**Author:** Product / Engineering  
**Scope:** Four engagement features to increase session duration, page views per session, and returning visitors.

---

## Architecture Baseline

| Dimension | Current State |
|---|---|
| Framework | Next.js 16.2.6 — App Router, React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS variables, Framer Motion |
| Data layer | Static TypeScript arrays in `src/lib/` — **no database** |
| Auth | None — fully anonymous |
| Analytics | GA4 (`G-GZN2V0V66B`) in `layout.tsx` |
| Content | ~160 cities, 50+ blog posts — all in-memory at build time |
| Existing maps | None |
| Existing bookmarks | None |
| Existing PDF | None |
| Existing recommendations | `RelatedCities` — same-country filter only |

All four features must work within this constraint set. The guiding principle is **progressive enhancement**: features work for anonymous users with localStorage, and optionally sync to a backend if auth is added later.

---

---

# Feature 1: Interactive Destination Maps

## Overview
Embed an interactive, pannable/zoomable map on every city page showing key attractions, neighbourhoods, and points of interest — allowing users to spatially orient themselves and explore a destination visually.

## User Journey
1. User lands on `/cities/bali`.
2. They scroll past the hero and AtAGlance sections and encounter a sticky "Map" tab in the `CityTOC` / `CityQuickNav` navigation.
3. Clicking "Map" scrolls to and expands the `CityMap` component (below ThingsToDo).
4. The map renders centred on the city with cluster pins for each ThingToDo and Neighbourhood.
5. User taps/clicks a pin → a popup appears with: name, icon, category badge, 1-line description, and a "View Details" link that smooth-scrolls to the relevant section.
6. User can switch layers: **Attractions**, **Neighbourhoods**, **Restaurants**, **Areas** using a toggle pill row above the map.
7. On mobile, the map is fullscreen-toggle-capable via a button in the top-right corner.
8. A "Open in Google Maps" link at bottom-right launches Google Maps with the city's coordinates for turn-by-turn navigation.

## UX Wireframe Description

```
┌─────────────────────────────────────────────────────┐
│  [Attractions] [Neighbourhoods] [Eat] [Areas]        │  ← layer pills
├─────────────────────────────────────────────────────┤
│                                                      │
│       🗺  Interactive Map (400px tall on desktop,    │
│           240px on mobile, expandable to fullscreen) │
│                                                      │
│   📍 Tanah Lot      📍 Tegallalang                   │
│         ↕ popup on click                             │
│   ┌──────────────────────────────┐                   │
│   │ 🛕 Tanah Lot Temple          │                   │
│   │ Cultural · 2–3 hours         │                   │
│   │ Watch the sun melt into...   │                   │
│   │ [View Details ↗]             │                   │
│   └──────────────────────────────┘                   │
│                                          [⛶ Expand] │
│                              [Open in Google Maps ↗] │
└─────────────────────────────────────────────────────┘
```

## Data Requirements

### City coordinate data
Add a `coordinates` field to the `City` type and a `coordinates` field to `ThingToDo`, `Neighbourhood`, and `CityArea`:

```
City.coordinates: { lat: number; lng: number }
ThingToDo.coordinates?: { lat: number; lng: number }
Neighbourhood.coordinates?: { lat: number; lng: number }
CityArea.coordinates?: { lat: number; lng: number }
```

City-level coordinates cover all 160+ cities. POI-level coordinates are optional — they can be populated gradually (high-value cities first).

### Fallback strategy
If a POI has no coordinates, it is excluded from the map silently. The map still renders with city-level centre and any POIs that do have coordinates.

### No schema migration needed
This is a data enrichment task on the existing static TypeScript files — add fields to the objects.

## API Endpoints
None required. All data is static. The map library fetches map tiles directly from the tile provider (OpenStreetMap or Mapbox).

Optional future endpoint:
- `GET /api/cities/[slug]/pois` — returns coordinates JSON for dynamic loading (avoids embedding all coords in the HTML).

## Frontend Component Structure

```
src/
  components/
    city/
      CityMap.tsx               ← main map component (client component)
      CityMapPopup.tsx          ← popup card for a pin click
      CityMapLayerPills.tsx     ← layer toggle pills
      CityMapFullscreenButton.tsx
  lib/
    mapUtils.ts                 ← coordinate helpers, pin colour by category
```

**Library choice:** Leaflet.js via `react-leaflet` v4 (MIT, free, no API key for OSM tiles). Alternative: `mapbox-gl` with a free-tier Mapbox token (better styling, higher bundle cost).

**Rendering:** `'use client'` — the map component must be client-rendered. Use `next/dynamic` with `ssr: false` to avoid hydration mismatch (Leaflet manipulates the DOM directly).

```
// In city [slug]/page.tsx
const CityMap = dynamic(() => import('@/components/city/CityMap'), { ssr: false });
```

## SEO Considerations
- The `<section>` wrapping the map gets an `id="map"` and an `<h2>` heading ("Explore [City] on the Map") for section anchor indexing.
- Map pins data (attraction names, categories) is also rendered as a hidden `<ul>` (visually hidden, screen-reader accessible) so crawlers index the place names.
- Structured data: add `TouristAttraction` schema entries for each ThingToDo that has coordinates.
- The map itself is `aria-label="Interactive map of [City]"`.

## Performance Considerations
- Leaflet + react-leaflet adds ~40KB gzipped. Use `next/dynamic` with a loading skeleton to prevent blocking initial page render.
- Map tiles are lazy-loaded by Leaflet natively; no action needed.
- Limit initial visible pins to 20; cluster remaining with `leaflet.markercluster`.
- For cities without any POI coordinates, render a static Google Maps embed screenshot (image) as a graceful fallback.
- Do NOT bundle city coordinate data into the global bundle — import per-city coordinates only on the relevant city page.

## Mobile Considerations
- Default map height: 240px on mobile, 400px on desktop (CSS responsive).
- Fullscreen button opens a `position: fixed` overlay covering the full viewport.
- Touch interactions: pinch-to-zoom and swipe-pan are native Leaflet behaviours.
- Popup cards must be thumb-reachable — position anchored to bottom of the map on small screens.
- "Open in Google Maps" link uses a `geo:` URI on mobile for native maps app handoff.

## Security Considerations
- If using Mapbox: store token in `NEXT_PUBLIC_MAPBOX_TOKEN` env var. Restrict the token to `tripgenius.in` referrer in the Mapbox dashboard.
- No user input is processed by the map — no injection risk.
- CSP: add `tile.openstreetmap.org` (or Mapbox CDN) to `img-src` and `connect-src` directives.

## Analytics Events to Track

| Event | Parameters |
|---|---|
| `map_viewed` | `city_slug`, `city_name` |
| `map_pin_clicked` | `city_slug`, `poi_name`, `poi_category`, `layer` |
| `map_layer_changed` | `city_slug`, `layer_name` |
| `map_fullscreen_toggled` | `city_slug`, `state: 'open' | 'close'` |
| `map_google_maps_opened` | `city_slug` |

---

---

# Feature 2: Save Itinerary / Bookmark System

## Overview
Allow users to bookmark/save city pages and blog posts for later reference, creating a persistent "My Saved Places" collection — accessible without login via localStorage, optionally promotable to an account-based system later.

## User Journey
1. User is on `/cities/bali`.
2. A **bookmark icon button** (heart or bookmark shape) appears in:
   - The `CityHero` component top-right (desktop).
   - The `MobileCTA` sticky bar on mobile.
3. User clicks it → icon animates to filled state, a toast notification slides in: *"Bali saved to your list"* with an inline "View saved" link.
4. Saved state persists across page refreshes (localStorage).
5. A **"My Saves" link** appears in the `Navbar` (icon + badge count) once ≥1 item is saved.
6. Clicking "My Saves" opens `/saved` — a page listing all saved cities and blog posts as cards.
7. On `/saved`, each card has an "X Remove" button, a "Share my list" button (copies a URL with encoded slugs to clipboard).
8. The shareable URL `/saved?list=bali,tokyo,jaipur` renders a read-only version of the list for anyone who opens it.

## UX Wireframe Description

### Bookmark button (hero area)
```
┌─────────────────────────────────────┐
│  [city hero image]       [♡ Save]   │  ← top-right button
│  Bali · Indonesia                   │
│  Island of the Gods                 │
└─────────────────────────────────────┘
```

### Toast notification
```
┌──────────────────────────────────────────┐
│  ✓  Bali saved to your list  [View list] │  ← 3s auto-dismiss, bottom-left
└──────────────────────────────────────────┘
```

### /saved page
```
┌─────────────────────────────────────────────────────┐
│  My Saved Places (4)                [Share list ↗]  │
├──────────────────────────────────────────────────────│
│  [Bali img]  Bali · Indonesia                [×]    │
│  [Tokyo img] Tokyo · Japan                   [×]    │
│  [post img]  Blog: Bali vs Thailand…         [×]    │
└─────────────────────────────────────────────────────┘
```

## Database Schema Changes
**Phase 1 (localStorage only) — no schema changes needed.**

**Phase 2 (optional server sync — design only, not in initial scope):**

```sql
-- Users table (if auth added via NextAuth / Clerk)
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  item_type   TEXT NOT NULL CHECK (item_type IN ('city', 'blog')),
  item_slug   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, item_type, item_slug)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
```

## API Endpoints
**Phase 1:** None — pure client-side.

**Phase 2 (optional):**
- `GET  /api/bookmarks` — returns user's saved items (auth required)
- `POST /api/bookmarks` — body: `{ itemType, itemSlug }` — adds bookmark
- `DELETE /api/bookmarks/[itemType]/[slug]` — removes bookmark
- `GET  /api/bookmarks/shared?list=bali,tokyo` — validates slugs and returns public card data

## Frontend Component Structure

```
src/
  components/
    bookmarks/
      BookmarkButton.tsx        ← heart/bookmark icon, animated, accepts itemType + slug
      BookmarkToast.tsx         ← slide-in notification
      SavedPageCard.tsx         ← card on /saved page
      ShareListButton.tsx       ← copy-to-clipboard with encoded URL
  hooks/
    useBookmarks.ts             ← localStorage read/write, React state, event dispatch
  app/
    saved/
      page.tsx                  ← /saved route — SSR shell, client hydrated
```

### `useBookmarks` hook interface
```typescript
interface BookmarkItem {
  itemType: 'city' | 'blog';
  slug: string;
  savedAt: number; // timestamp
}

// Returns:
{
  saved: BookmarkItem[];
  isSaved: (itemType, slug) => boolean;
  toggle: (itemType, slug) => void;   // adds or removes
  remove: (itemType, slug) => void;
  clear: () => void;
}
```

The hook dispatches a `bookmarks_updated` custom DOM event so all mounted `BookmarkButton` instances update in sync without a global state library.

## SEO Considerations
- `/saved` is `noindex` (user-specific content, no SEO value).
- The shareable `/saved?list=…` URL is also `noindex`.
- Bookmark buttons are `aria-label="Save Bali to your list"` / `aria-pressed` for accessibility.
- No impact on crawlable pages.

## Performance Considerations
- localStorage read is synchronous — call during client hydration only (inside `useEffect`) to avoid SSR/hydration mismatch.
- Bookmark state is stored as a JSON string under key `tg_bookmarks`.
- The `/saved` page fetches city metadata from the static `allCities` array — no network request.
- `BookmarkButton` is a tiny client component; keep it isolated so the server-rendered city page is not forced to become a full client component.
- Toast uses CSS transitions only — no animation library dependency.

## Mobile Considerations
- The bookmark button in `MobileCTA` is always thumb-reachable (sticky bar at bottom).
- On `/saved`, cards are full-width stacked on mobile.
- "Share list" falls back to `navigator.share()` (Web Share API) on mobile when available; falls back to clipboard copy on desktop.
- Badge count on Navbar disappears on mobile (space constraints) — replaced by a heart icon without count.

## Security Considerations
- localStorage is origin-scoped — no cross-site risk.
- The shareable URL only encodes city/blog slugs (allowlisted values) — no user data is encoded.
- Phase 2 API endpoints require auth tokens (JWT / session cookie) — validate ownership server-side before every read/write.
- Rate-limit Phase 2 POST/DELETE endpoints: 60 req/min per IP.

## Analytics Events to Track

| Event | Parameters |
|---|---|
| `bookmark_added` | `item_type`, `item_slug`, `item_name`, `source` (hero/mobile_cta/blog) |
| `bookmark_removed` | `item_type`, `item_slug`, `source` (saved_page/button) |
| `saved_page_viewed` | `items_count` |
| `saved_list_shared` | `items_count` |
| `saved_list_share_opened` | `items_count` (when recipient opens shared URL) |

---

---

# Feature 3: Download Itinerary as PDF

## Overview
Allow users to download a print-ready PDF of any city guide page — formatted as a clean travel document with key sections: AtAGlance stats, ThingsToDo, WhereToStay, WhereToEat, ProTips, BudgetBreakdown, and Getting There.

Scope also covers downloading AI-generated trip plans from `/plan`.

## User Journey

### City guide PDF
1. User is on `/cities/bali` (or any city page).
2. A **"Download Guide (PDF)"** button appears in:
   - The `CitySidebar` (desktop).
   - The `MobileCTA` sticky bar (mobile, secondary action).
3. User clicks → a loading spinner replaces the button label for 1–2 seconds.
4. A PDF named `TripGenius-Bali-Guide.pdf` downloads automatically.
5. The PDF opens in a clean 2-column A4 layout with: TripGenius logo/wordmark, city hero image, all key sections, affiliate booking links as QR codes in the footer.

### AI trip plan PDF
1. User generates a plan on `/plan` — the `ItineraryDisplay` component renders the result.
2. A **"Download PDF"** button appears at the top-right of the itinerary.
3. Click → same flow as above. PDF named `TripGenius-Bali-7Day-Itinerary.pdf`.

## UX Wireframe Description

### PDF button placement (sidebar)
```
┌──────────────────────────────┐
│  Quick Actions               │
│  [♡ Save this city]          │
│  [⬇ Download Guide (PDF)]    │  ← sidebar button
│  [📤 Share]                  │
└──────────────────────────────┘
```

### PDF layout (A4 page)
```
┌────────────────────────────────────────┐
│  TripGenius     BALI TRAVEL GUIDE      │  ← header
│  ─────────────────────────────────     │
│  [hero image spanning full width]      │
│                                        │
│  AT A GLANCE          BEST TIME        │
│  Budget: $40–200/day  Apr – Oct        │
│  Language: Balinese   Currency: IDR    │
│  ─────────────────────────────────     │
│  THINGS TO DO                          │
│  🛕 Tanah Lot Temple                   │
│     Cultural · 2–3 hrs                 │
│     Watch the sun melt into…           │
│  ─────────────────────────────────     │
│  WHERE TO STAY / WHERE TO EAT          │
│  [two-column layout]                   │
│  ─────────────────────────────────     │
│  PRO TIPS                              │
│  ─────────────────────────────────     │
│  [footer: tripgenius.in | QR code]     │
└────────────────────────────────────────┘
```

## Database Schema Changes
None. PDF is generated entirely from existing static city data.

## API Endpoints

### `GET /api/pdf/city/[slug]`
- Generates a PDF for the given city slug.
- Returns `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="TripGenius-[CityName]-Guide.pdf"`.
- Validates slug against `allCities` — 404 if not found.
- Rate-limited: 10 requests/minute per IP.

### `POST /api/pdf/itinerary`
- Body: `TripItinerary` JSON (same shape as `/api/plan` response).
- Returns PDF of the AI-generated trip plan.
- Rate-limited: 5 requests/minute per IP (heavier generation).

## Frontend Component Structure

```
src/
  components/
    city/
      DownloadGuideButton.tsx     ← button with loading state, handles fetch + download
    plan/
      DownloadItineraryButton.tsx ← same pattern for AI plan
  lib/
    pdf/
      cityPdfTemplate.ts          ← HTML/CSS template string for city PDF
      itineraryPdfTemplate.ts     ← HTML/CSS template for trip plan PDF
      pdfHelpers.ts               ← shared: currency format, section builders
  app/
    api/
      pdf/
        city/[slug]/route.ts      ← server route
        itinerary/route.ts        ← server route
```

### PDF generation library choice

**Option A — Puppeteer (headless Chrome):**
- Renders a hidden HTML page then prints to PDF.
- Produces pixel-perfect output matching the site's design.
- Cold start: ~2–3s on serverless. Bundle size: ~300MB (requires a separate Docker layer or `@sparticuz/chromium` for Vercel).
- Best for: high-quality output, complex layouts.

**Option B — `jsPDF` + `html2canvas` (client-side):**
- Runs entirely in the browser — no server route needed.
- Takes a DOM screenshot and converts to PDF.
- Pros: zero server cost, works offline.
- Cons: output quality depends on viewport/DPI, heavy bundle (~200KB).
- Best for: lower infrastructure cost, acceptable quality.

**Option C — `@react-pdf/renderer` (server-side):**
- Declarative React components rendered to PDF via PDFKit.
- No Puppeteer dependency — works on serverless with no special config.
- Cons: custom layout system (not HTML/CSS), requires re-expressing design in `react-pdf` primitives.
- Best for: serverless-first deployment on Vercel with no Docker.

**Recommendation: Option C (`@react-pdf/renderer`)** for Vercel/serverless compatibility. Fall back to Option B (client-side) if the `react-pdf` output quality is insufficient for the design.

## SEO Considerations
- PDF download links do not affect crawlable HTML.
- PDF files themselves can be indexed by Google — include the city name, URL, and date in the PDF metadata (`title`, `author`, `subject` fields).
- Add `robots: noindex` headers to `/api/pdf/*` routes so the API endpoints are not indexed.
- The PDF QR code in the footer pointing to `tripgenius.in/cities/[slug]` drives return traffic.

## Performance Considerations
- PDF generation is CPU-intensive — run it on a dedicated API route, never inline.
- Cache generated PDFs in Vercel KV (or Cloudflare Cache) with a 24-hour TTL, keyed by `city-slug + content-hash` of the city data.
- Show a loading state in the button (spinner) to prevent double-clicks.
- For client-side Option B: lazy-load `jsPDF` and `html2canvas` only when the button is clicked (dynamic import).
- PDF file size target: < 3MB per city guide.

## Mobile Considerations
- On iOS Safari, PDFs open inline in the browser rather than downloading — provide a "Tap and hold → Share → Save to Files" hint in a tooltip.
- On Android Chrome, the `Content-Disposition: attachment` header triggers a native download.
- The download button is visible and tappable in `MobileCTA`; label shortens to "PDF" on screens < 375px.
- Consider offering a "Print-friendly" view (`/cities/[slug]/print`) as a simpler alternative that uses `@media print` CSS — lower implementation cost, same utility.

## Security Considerations
- Rate-limit `/api/pdf/*` aggressively (10 req/min/IP) — PDF generation is expensive and can be DoS'd.
- Validate all slug inputs against the allowlist (`getAllCitySlugs()`) before generating.
- If using Puppeteer: run in a sandboxed process, do not allow user-controlled HTML injection.
- For `/api/pdf/itinerary` (POST): validate the body against the `TripItinerary` schema before rendering — reject payloads with unexpected fields.
- Set `X-Content-Type-Options: nosniff` and appropriate CORS headers on PDF routes.

## Analytics Events to Track

| Event | Parameters |
|---|---|
| `pdf_download_initiated` | `item_type` (city/itinerary), `item_slug`, `source` |
| `pdf_download_completed` | `item_type`, `item_slug`, `file_size_kb` |
| `pdf_download_failed` | `item_type`, `item_slug`, `error_reason` |
| `print_view_opened` | `item_type`, `item_slug` |

---

---

# Feature 4: Similar Destinations Recommendations

## Overview
Replace the current same-country-only `RelatedCities` filter with a smart, attribute-based recommendation engine that surfaces genuinely similar destinations — based on vibe, budget tier, travel season, and activity type — driving cross-destination page views.

## User Journey
1. User is on `/cities/bali` after reading the full guide.
2. Before the footer, a **"You might also like"** section presents 4–6 destination cards.
3. Cards show: city photo, name, country, best time, budget range, matching vibe tags highlighted in accent colour, and a similarity reason ("Also great for beach & spiritual travel").
4. User clicks a card → navigates to that city page → section view begins again.
5. On blog posts, a similar "Explore these destinations" widget appears using the blog post's `citySlug` and `tags` as matching signals.

## UX Wireframe Description

```
┌─────────────────────────────────────────────────────────┐
│  You Might Also Like                                     │
│  Based on: Beach · Spiritual · Budget-friendly           │  ← tag chips
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ [img]    │  │ [img]    │  │ [img]    │  │ [img]    ││
│  │ Phuket   │  │ Lombok   │  │ Goa      │  │ Sri Lanka││
│  │ Thailand │  │ Indonesia│  │ India    │  │          ││
│  │ ★ Beach  │  │ ★ Beach  │  │ ★ Beach  │  │ ★ Spiritual│
│  │ ★ Party  │  │ ★ Nature │  │ ★ Budget │  │ ★ Nature ││
│  │ $30–100  │  │ $30–80   │  │ $20–60   │  │ $35–120  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
└─────────────────────────────────────────────────────────┘
```

## Similarity Algorithm (Pure TypeScript, no ML)

Compute a **similarity score** between the current city and every other city using weighted attribute matching:

```
Score = (vibe_overlap × 40)
      + (budget_tier_match × 25)
      + (season_overlap × 20)
      + (region_bonus × 10)
      + (country_bonus × 5)
      - (same_city_penalty × 100)
```

### Attribute definitions

**Vibe overlap (0–40):** Count of matching `vibes[]` strings divided by max possible, multiplied by 40.  
Example: Bali vibes = `["Spiritual", "Romantic", "Adventure"]`. Phuket vibes = `["Beach", "Party", "Adventure"]`. Overlap = 1 ("Adventure") → score = 1/3 × 40 ≈ 13.

**Budget tier match (0–25):** Normalise `stats.budget` to a tier (Budget / Mid / Luxury). Exact match = 25, adjacent = 12, two apart = 0.

**Season overlap (0–20):** Parse `stats.bestTime` strings (e.g. "Apr – Oct") into month ranges. Count overlapping months / 12 × 20.

**Region bonus (0–10):** Cities in the same geographic region (Asia, Europe, Americas, Africa) get +10.

**Country bonus (0–5):** Same country as current city gets +5 (reinforces the existing "more in Indonesia" discovery).

**Same city penalty:** Ensures the current city never appears.

Return top 6 by score, shuffle the top 3 slightly (add ±random 2) to avoid always showing the same order.

### Explanation string
Generate a human-readable reason from matched vibes:
- 1 match: "Also great for [vibe]"
- 2 matches: "Similar beach & budget destination"
- 3+ matches: "Very similar vibe to [current city]"

## Database Schema Changes
None. The algorithm operates on the existing `allCities` static array at build time.

**Optional:** Pre-compute similarity scores at build time and store as a static JSON map:

```
src/lib/similarityMap.ts
// { [citySlug]: Array<{ slug: string; score: number; reason: string }> }
```

This file is generated by a script (`scripts/computeSimilarity.ts`) run as part of `next build` — adds ~50KB to the build output but makes rendering instant.

## API Endpoints
None required for Phase 1 (static pre-computed).

**Optional Phase 2:**
- `GET /api/recommendations/city/[slug]?limit=6` — returns similar cities with scores. Allows A/B testing algorithm variants without a full rebuild.

## Frontend Component Structure

```
src/
  components/
    city/
      SimilarDestinations.tsx      ← replaces / augments RelatedCities
      SimilarDestinationCard.tsx   ← card with matched vibe chips
      SimilarityReasonTag.tsx      ← small "Why similar" chip
  lib/
    similarity.ts                  ← scoring algorithm
    similarityMap.ts               ← pre-computed results (generated at build)
  scripts/
    computeSimilarity.ts           ← build-time script
```

`SimilarDestinations` accepts `city: City` and returns 4–6 cards. On blog pages, a `BlogRelatedCities` variant accepts `tags: string[]` and `citySlug?: string` and maps tags to vibes for the same algorithm.

## SEO Considerations
- `SimilarDestinations` is server-rendered — all city names and links are in the HTML source for crawlers.
- Internal links from high-authority city pages (Bali, Tokyo, Paris) to lower-traffic pages boosts their crawl frequency and PageRank distribution.
- Add `relatedLink` structured data (or `mentions` in JSON-LD) to connect city pages semantically.
- The section heading includes target keywords: "Similar destinations to Bali" / "Places like Bali in Asia".
- Use descriptive anchor text on cards: "Phuket travel guide" not just "Phuket".

## Performance Considerations
- Pre-compute all similarity maps at build time (`scripts/computeSimilarity.ts`). No runtime computation per request.
- The component is server-rendered — zero client JS for the recommendations themselves.
- Images use `next/image` with `sizes` tuned to the card grid: `"(max-width: 640px) 50vw, 25vw"`.
- Cards are below the fold — `loading="lazy"` on images.
- The similarity map JSON adds ~50KB to the build; this is negligible at build time but does not affect bundle size (it's server-only data).

## Mobile Considerations
- Cards render in a horizontal scroll row on mobile (2.5 cards visible, peek of 3rd → invites scroll).
- On desktop: 4-column grid.
- Vibe tags on cards truncate to 2 max on mobile screens < 375px.
- "Why similar" tooltip is omitted on mobile; vibe tags carry that meaning.

## Security Considerations
- Algorithm uses only allowlisted city data — no user input involved.
- No risk of injection or data exposure.
- If Phase 2 API is built: validate `slug` param against `getAllCitySlugs()`, cap `limit` at 12.

## Analytics Events to Track

| Event | Parameters |
|---|---|
| `similar_destinations_viewed` | `source_city`, `recommended_cities[]` (array of slugs) |
| `similar_destination_clicked` | `source_city`, `target_city`, `similarity_score`, `rank_position` |
| `similar_recommendation_shown` | `source_city`, `algorithm_version`, `count` |
| `blog_related_city_clicked` | `blog_slug`, `target_city`, `source_tags[]` |

---

---

# Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Leaflet hydration mismatch on SSR | High | Always use `next/dynamic` with `ssr: false` |
| PDF generation timeouts on Vercel (10s limit) | High | Use `@react-pdf/renderer` (sync) or pre-generate PDFs at build time for known cities |
| localStorage unavailable (private browsing, iOS restrictions) | Medium | Wrap all localStorage calls in try/catch; degrade gracefully (bookmarks not persisted) |
| City coordinate data entry effort (160+ cities) | High | Start with top-20 cities; render a static map screenshot for others |
| Similarity algorithm producing obviously wrong results | Medium | Unit-test the scoring function; add a manual override array in `src/lib/similarity.ts` to pin specific pairs |
| PDF size bloat (hero images) | Medium | Compress images before embedding; use low-res versions for PDF |
| `@react-pdf/renderer` incompatible with Next.js 16 App Router | Medium | Test early in a spike; have client-side jsPDF as a fallback |
| Bookmark localStorage collisions (key name conflicts) | Low | Namespace all keys under `tg_v1_*` |
| Similarity pre-compute script adding significant build time | Low | Script is O(n²) for ~160 cities = ~25,600 comparisons — completes in < 1s |

---

# Dependencies

## External Libraries to Add

| Feature | Library | License | Size |
|---|---|---|---|
| Maps | `leaflet` + `react-leaflet` | BSD-2 / MIT | ~150KB minified |
| Maps (optional) | `leaflet.markercluster` | MIT | ~30KB |
| PDF (server) | `@react-pdf/renderer` | MIT | ~400KB server-only |
| PDF (client fallback) | `jsPDF` + `html2canvas` | MIT | ~200KB gzipped |
| Rate limiting | `@upstash/ratelimit` + `@upstash/redis` | MIT | Requires Upstash account |

## Internal Dependencies

| Feature | Depends On |
|---|---|
| Maps | City coordinate data in `src/lib/cities.ts`, `indianCities.ts`, etc. |
| Maps | `CityQuickNav` / `CityTOC` must add "Map" as a section anchor |
| Bookmarks | `MobileCTA` must add bookmark button slot |
| Bookmarks | `Navbar` must add "My Saves" icon |
| PDF (city) | All city page section components must remain self-contained |
| PDF (itinerary) | `ItineraryDisplay` output shape must stay stable |
| Similar Destinations | Build script must run as part of `npm run build` |
| Similar Destinations | `RelatedCities` component replaced or augmented |

## Environment Variables to Add

```
# Required for Maps (if Mapbox chosen over OSM)
NEXT_PUBLIC_MAPBOX_TOKEN=

# Required for PDF rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

# Implementation Effort Estimates

| Feature | Complexity | Engineering Days | Notes |
|---|---|---|---|
| **F4 – Similar Destinations** | Low | 3–4 days | Pure TypeScript, no new infra, high SEO impact |
| **F2 – Bookmark System** | Low–Medium | 4–5 days | localStorage only (Phase 1); no DB or auth needed |
| **F3 – PDF Download** | Medium | 5–7 days | Includes library spike (react-pdf vs jsPDF), rate limiting, caching |
| **F1 – Interactive Maps** | Medium–High | 8–10 days | Map library integration + coordinate data entry for top cities |
| **Total** | — | **~20–26 days** | One engineer, sequential |

*Coordinate data entry for F1 is the largest effort multiplier. Parallel data work can compress the timeline.*

---

# Suggested Implementation Order

## Phase 1 — Immediate impact, low risk (Week 1–2)
**F4: Similar Destinations**
- Replaces existing weak `RelatedCities` component.
- Zero new infrastructure.
- Immediately increases pages-per-session by surfacing cross-destination links.
- High SEO value via improved internal linking.

## Phase 2 — Engagement & retention (Week 2–3)
**F2: Bookmark System (localStorage)**
- Gives users a reason to return ("I saved these places").
- Creates the psychological ownership effect.
- No backend or auth required — ships fast.
- Establishes the `/saved` page for Phase 2 server sync later.

## Phase 3 — Conversion & depth (Week 3–5)
**F3: PDF Download**
- Targets the high-intent user who has read the full guide.
- The PDF becomes a brand touchpoint (TripGenius logo, QR code back to site).
- Spike the library choice first (1 day) before committing to full build.

## Phase 4 — Visual exploration (Week 5–8)
**F1: Interactive Maps**
- Highest complexity and coordinate data burden.
- Delivers the richest UX but requires the most external dependency management.
- Build after other features are live so the team has stable city page structure to integrate into.

---

# Success Metrics

| Metric | Current Baseline | 90-day Target |
|---|---|---|
| Pages per session | Measure at launch | +25% |
| Session duration | Measure at launch | +20% |
| Return visitor rate | Measure at launch | +15% |
| PDF downloads / city page view | 0 | > 1% |
| Bookmark adds / city page view | 0 | > 2% |
| Similar destination CTR | ~5% (current RelatedCities) | > 12% |
| Map section engagement (scroll into view) | 0 | > 40% of city page sessions |
