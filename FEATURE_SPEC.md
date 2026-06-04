# TripGenius.in Engagement Feature Specification

Version: 2.0
Date: 2026-06-04
Scope: Interactive destination maps, save/bookmark system, itinerary PDF download, and similar destination recommendations.
Constraint: Do not introduce AI-generated itineraries as part of these features.

## Executive Summary

TripGenius is currently a static-content travel discovery site built with Next.js App Router. The strongest engagement strategy is to add low-friction discovery loops and retention mechanics around existing destination content:

- Similar destinations should ship first because it improves page views per session and SEO internal linking with no new backend.
- Bookmarks should follow because they create returning-user behavior without requiring auth.
- PDF downloads should target high-intent users who want offline planning material and branded takeaways.
- Interactive maps should deepen city-page exploration, but they carry the most data-entry and dependency complexity.

The best implementation approach is progressive enhancement. Keep public content server-rendered and crawlable. Add client-only interactivity where required, store anonymous user state in localStorage first, and design backend APIs/schema for future authenticated sync without making auth a launch dependency.

## Existing Architecture Analysis

### Current System

| Area | Current State |
|---|---|
| Framework | Next.js 16.2.6 App Router, React 19, TypeScript |
| Routing | `src/app` with static routes for cities, blogs, plan, compare, cheatsheet |
| Styling | Tailwind CSS v4 with global CSS variables |
| Data source | Static TypeScript data in `src/lib/cities.ts`, `src/lib/indianCities.ts`, `src/lib/worldCities.ts`, `src/lib/blog.ts` |
| Database | None |
| Auth | None |
| Analytics | GA4 through `src/lib/analytics.ts` and layout script |
| City pages | `src/app/cities/[slug]/page.tsx` server-rendered with JSON-LD |
| Itinerary page | `/plan` plus `/api/plan`; should not be expanded into new AI itinerary generation for this scope |
| Current engagement components | City TOC, quick nav, sidebar, mobile CTA, related/similar destination areas |
| Partial feature work observed | Leaflet/react-leaflet dependencies, map utilities/components, similarity utilities/components, coordinate fields in types/data |

### Architecture Implications

- Server-render city/blog/recommendation content for SEO.
- Use client islands only for maps, bookmark state, analytics tracking, and download interactions.
- Avoid adding a database for the initial version. The site can achieve meaningful engagement gains with static data plus localStorage.
- Treat the existing static city model as the source of truth. Add optional fields cautiously and support graceful fallbacks for incomplete data.
- Keep feature components modular under `src/components/city`, `src/components/saved`, `src/components/pdf`, and shared hooks under `src/lib` or `src/hooks`.

### Recommended Implementation Strategy

1. Preserve static rendering for all destination content and recommendations.
2. Use localStorage for saves/bookmarks with a namespaced key such as `tripgenius:v1:saves`.
3. Use dynamic client-only loading for Leaflet maps to avoid SSR and hydration issues.
4. Generate PDFs through a dedicated API route or route handler after a short technical spike.
5. Track every feature interaction through the existing `trackEvent` wrapper.
6. Add backend schema only as a future migration path, not as a launch blocker.

---

# Feature 1: Interactive Destination Maps

## Product Goal

Help users understand where attractions, neighborhoods, restaurants, and areas sit within a destination so they spend longer exploring the city page and jump between sections more naturally.

## User Journey

1. User opens a city guide such as `/cities/bali`.
2. The quick nav and table of contents include a "Map" anchor.
3. User scrolls to "Explore Bali on the Map".
4. A lightweight skeleton appears while the interactive map loads.
5. The map centers on the city using city-level coordinates.
6. Pins appear for attractions with coordinates.
7. User taps a pin and sees a compact popup with name, category, duration, and a link to the relevant guide section.
8. User filters pins by layer: Attractions, Areas, Neighborhoods, Food.
9. On mobile, user can expand the map to a fullscreen overlay.
10. User can open the destination in Google Maps for external navigation.

## UX Wireframe Description

Desktop section:

```text
Section: Explore [City] on the Map

[Attractions] [Neighborhoods] [Food] [Areas]          [Open in Google Maps]

+---------------------------------------------------------------+
| Interactive map                                                |
|                                                               |
|   Pin: Temple         Pin: Beach                              |
|                                                               |
|   Popup                                                       |
|   +-----------------------------+                             |
|   | Tanah Lot Temple            |                             |
|   | Cultural | 2-3 hours        |                             |
|   | Watch the sun melt...       |                             |
|   | View details                |                             |
|   +-----------------------------+                             |
|                                                               |
|                                             [Fullscreen icon]  |
+---------------------------------------------------------------+

Below map: screen-reader-accessible list of mapped places.
```

Mobile section:

```text
[Explore Bali on the Map]
[Layer pills in horizontal scroll]

+---------------------------+
| 240px map preview         |
| pins visible              |
| [expand]                  |
+---------------------------+

Fullscreen mode:
- Map fills viewport.
- Bottom sheet shows selected pin.
- Close button fixed at top right.
```

## Database Schema Changes

Initial release: no database.

Static data additions:

```ts
Coordinates {
  lat: number
  lng: number
  isApproximate?: boolean
}

City.coordinates?: Coordinates
ThingToDo.coordinates?: Coordinates
Neighbourhood.coordinates?: Coordinates
CityArea.coordinates?: Coordinates
Restaurant.coordinates?: Coordinates
```

Recommended rollout:

- Add city-level coordinates for all publishable cities.
- Add POI-level coordinates for the top 20 traffic cities first.
- Mark approximate coordinates with `isApproximate: true` when exact POI data is not available.

Future database model, if content moves to a CMS:

```sql
CREATE TABLE destination_pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_slug TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('thing_to_do', 'neighbourhood', 'restaurant', 'area')),
  source_key TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  is_approximate BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(city_slug, source_type, source_key)
);
```

## API Endpoints

Initial release: no required application API endpoint. City pages already receive static data at build/render time.

Optional future endpoint:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/cities/[slug]/map-pins` | Return map pins only, reducing city-page HTML/data size if coordinates become large |

Response shape:

```json
{
  "city": { "slug": "bali", "lat": -8.4095, "lng": 115.1889 },
  "pins": [
    {
      "id": "thing-to-do:tanah-lot-temple",
      "type": "thing_to_do",
      "name": "Tanah Lot Temple",
      "category": "Cultural",
      "lat": -8.6211,
      "lng": 115.0868
    }
  ]
}
```

## Frontend Component Structure

Recommended structure:

```text
src/components/city/
  CityMapWrapper.tsx          client boundary using dynamic import
  CityMap.tsx                 Leaflet map, markers, tile layer
  CityMapPopup.tsx            pin popup content
  CityMapLayerControls.tsx    layer filters
  CityMapFullscreen.tsx       mobile/fullscreen overlay
  MapSkeleton.tsx             loading state

src/lib/
  mapUtils.ts                 pin building, category color, bounds helpers
```

Placement:

- Add the map after `ThingsToDo` and before neighborhoods/areas.
- Add `id="city-map"` and ensure quick nav points to the same anchor.
- Keep the outer section server-rendered; only the Leaflet map is client-rendered.

## SEO Considerations

- Use a crawlable section heading: `Explore [City] on the Map`.
- Render mapped place names as normal HTML or a visually hidden list, not only inside Leaflet popups.
- Add coordinates to `TouristAttraction` JSON-LD when available.
- Keep internal "View details" anchors descriptive, such as `Tanah Lot Temple details`.
- Avoid indexing separate map API URLs if introduced later.

## Performance Considerations

- Leaflet must be dynamically imported with SSR disabled.
- Show `MapSkeleton` while the map bundle loads.
- Do not load the map until the section is near viewport if Core Web Vitals regress.
- Cap initial markers or cluster when a city has more than 25 pins.
- Use OSM tiles carefully; for production traffic, consider a paid tile provider or MapTiler/Mapbox to avoid violating fair-use expectations.
- Keep pin data per city, not in a global client bundle.

## Mobile Considerations

- Default map height should be 220-260px.
- Provide a clear fullscreen control.
- Use bottom-sheet popups on small screens because Leaflet popups can be cramped.
- Disable scroll-wheel zoom on desktop and avoid trapping page scroll on mobile.
- Use large tap targets for layer controls and close buttons.

## Security Considerations

- Sanitize or escape popup content if any content ever becomes user-generated or CMS-authored HTML.
- If Mapbox/MapTiler is used, restrict public tokens by domain.
- Update CSP for tile/image/connect domains.
- Do not expose private location data; all POIs are public travel-guide data.

## Analytics Events

| Event | Parameters |
|---|---|
| `map_viewed` | `city_slug`, `pin_count` |
| `map_pin_clicked` | `city_slug`, `pin_type`, `pin_name`, `pin_category` |
| `map_layer_changed` | `city_slug`, `layer_name`, `visible_pin_count` |
| `map_fullscreen_opened` | `city_slug` |
| `map_fullscreen_closed` | `city_slug` |
| `map_google_maps_clicked` | `city_slug` |
| `map_detail_anchor_clicked` | `city_slug`, `pin_name`, `target_section` |

---

# Feature 2: Save Itinerary / Bookmark System

## Product Goal

Give users a lightweight way to save destinations, blogs, comparisons, and itinerary pages so they return later and build a personal travel shortlist.

## User Journey

1. User opens a city guide, blog post, or itinerary page.
2. A bookmark icon appears near the page title/hero and in mobile sticky actions.
3. User clicks save.
4. The icon changes to a filled state and a toast confirms the item was saved.
5. Navbar shows a "Saved" link with a count badge after at least one item exists.
6. User opens `/saved`.
7. Saved items appear grouped by type: Destinations, Itineraries, Articles.
8. User removes items, opens saved items, or shares a read-only saved list URL.
9. Returning users see the same saves restored from localStorage.

## UX Wireframe Description

City hero:

```text
+-------------------------------------------------------------+
| [Hero image]                                      [Save icon] |
| Bali, Indonesia                                             |
| Island of the Gods                                          |
+-------------------------------------------------------------+
```

Toast:

```text
+--------------------------------------------------+
| Saved to your list                         View  |
+--------------------------------------------------+
```

Saved page:

```text
My Saved Trips                                           [Share]

Destinations (3)
+----------------+  +----------------+  +----------------+
| image          |  | image          |  | image          |
| Bali           |  | Tokyo          |  | Jaipur         |
| Indonesia      |  | Japan          |  | India          |
| [Open] [Remove]|  | [Open] [Remove]|  | [Open] [Remove]|
+----------------+  +----------------+  +----------------+

Articles (2)
...

Empty state:
"No saved trips yet" + "Explore destinations" CTA.
```

## Database Schema Changes

Initial release: no database. Use localStorage.

LocalStorage shape:

```json
{
  "version": 1,
  "items": [
    {
      "type": "city",
      "slug": "bali",
      "title": "Bali",
      "subtitle": "Indonesia",
      "image": "https://...",
      "url": "/cities/bali",
      "savedAt": "2026-06-04T10:00:00.000Z"
    }
  ]
}
```

Future database model for authenticated sync:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('city', 'blog', 'itinerary', 'compare')),
  item_slug TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, item_type, item_slug)
);

CREATE INDEX saved_items_user_saved_at_idx ON saved_items(user_id, saved_at DESC);
```

## API Endpoints

Initial anonymous release:

| Method | Path | Purpose |
|---|---|---|
| None | None | All save state is localStorage-based |

Future authenticated sync:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/saved` | List current user's saved items |
| POST | `/api/saved` | Save an item |
| DELETE | `/api/saved/[type]/[slug]` | Remove an item |
| POST | `/api/saved/import` | Merge localStorage saves after login |

Shareable list:

| Method | Path | Purpose |
|---|---|---|
| GET | `/saved?list=city:bali,city:tokyo,blog:goa-guide` | Client/server resolves slugs into a read-only shared list |

## Frontend Component Structure

```text
src/components/saved/
  SaveButton.tsx              reusable icon button
  SaveToast.tsx               confirmation message
  SavedCountBadge.tsx         navbar count
  SavedItemsPage.tsx          /saved page UI
  SavedItemCard.tsx           city/blog/itinerary card
  ShareSavedListButton.tsx    encoded share URL

src/hooks/
  useSavedItems.ts            localStorage state and subscription

src/lib/
  savedItems.ts               serialization, validation, item resolver

src/app/saved/
  page.tsx                    saved list route
```

Integration points:

- `CityHero`: save button for city.
- `MobileCTA`: compact save action.
- `Navbar`: saved link and badge.
- Blog post pages: save button near title or sticky action area.
- Itinerary display: save generated or curated itinerary snapshots without creating new AI generation behavior.

## SEO Considerations

- `/saved` should be `noindex` because it is personalized or query-driven.
- Shared saved-list URLs should also be `noindex` unless the product later supports curated public collections.
- Save buttons should not hide primary crawlable links or headings.
- Internal discovery should rely on saved item cards linking to canonical pages.

## Performance Considerations

- Keep localStorage payload small; store item references and display metadata, not full page content.
- Use `useSyncExternalStore` or a custom browser event so navbar badge and buttons stay in sync.
- Avoid reading localStorage during server render.
- Lazy-load saved page groups if the list grows beyond 100 items.
- Keep share URLs capped; if users save too many items, share only selected items or move to future server-backed share IDs.

## Mobile Considerations

- Save button should be reachable in the sticky mobile CTA.
- Toast should appear above bottom navigation/sticky CTA.
- Saved page should use single-column cards with clear remove buttons.
- Share action should use Web Share API on mobile when available, with clipboard fallback.

## Security Considerations

- Validate item type and slug against allowlisted static content before rendering shared query-list items.
- Do not trust localStorage metadata for URLs; resolve canonical URLs from known content when possible.
- Escape all displayed text.
- Prevent oversized query strings from causing rendering or URL parsing issues.
- Future APIs require authentication and CSRF-conscious handling.

## Analytics Events

| Event | Parameters |
|---|---|
| `save_item_clicked` | `item_type`, `item_slug`, `source_page` |
| `item_saved` | `item_type`, `item_slug`, `save_count` |
| `item_unsaved` | `item_type`, `item_slug`, `save_count` |
| `saved_page_viewed` | `item_count`, `city_count`, `blog_count`, `itinerary_count` |
| `saved_item_opened` | `item_type`, `item_slug`, `position` |
| `saved_list_shared` | `item_count`, `share_method` |
| `saved_empty_cta_clicked` | `target` |

---

# Feature 3: Download Itinerary as PDF

## Product Goal

Let high-intent users take TripGenius content offline as a polished, branded itinerary or city-guide PDF, increasing perceived value and encouraging return visits through QR/backlinks.

## User Journey

City guide PDF:

1. User reads a city guide.
2. In the sidebar and mobile CTA, user sees a download icon labeled "PDF".
3. User clicks download.
4. A loading state appears: "Preparing PDF".
5. Browser downloads `tripgenius-bali-guide.pdf`.
6. PDF includes summary, best time, budget, top things to do, where to stay/eat, tips, and canonical link back to the city page.

Itinerary PDF:

1. User views an existing itinerary page or generated plan result.
2. User clicks "Download PDF".
3. PDF is generated from the displayed itinerary only.
4. User receives a branded day-by-day PDF.

Important: This feature must not create new AI-generated itinerary flows. It only exports content already visible to the user.

## UX Wireframe Description

Desktop city sidebar:

```text
+-----------------------------+
| Plan Bali                   |
| [Book stays]                |
| [Download PDF icon]         |
| [Save icon]                 |
+-----------------------------+
```

Mobile sticky CTA:

```text
+--------------------------------------+
| [Save]        [PDF]        [Explore] |
+--------------------------------------+
```

PDF document:

```text
TripGenius logo
Bali Travel Guide
Best time: Apr-Oct | Budget: $40-$200/day

1. At a glance
2. Top things to do
3. Suggested areas/neighborhoods
4. Food and stays
5. Local tips

Footer: tripgenius.in/cities/bali + QR code
```

## Database Schema Changes

Initial release: no database.

Optional future table for observability/caching:

```sql
CREATE TABLE pdf_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('city', 'itinerary')),
  item_slug TEXT,
  user_id UUID,
  request_hash TEXT,
  generated_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  ip_hash TEXT,
  user_agent_hash TEXT
);

CREATE INDEX pdf_downloads_item_idx ON pdf_downloads(item_type, item_slug, created_at DESC);
```

## API Endpoints

Recommended initial endpoints:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/pdf/city/[slug]` | Generate/download city guide PDF |
| POST | `/api/pdf/itinerary` | Generate/download PDF from displayed itinerary payload |

`GET /api/pdf/city/[slug]`:

- Validate slug against static city data.
- Return `application/pdf`.
- Filename: `tripgenius-[slug]-travel-guide.pdf`.

`POST /api/pdf/itinerary`:

- Accept only the already-rendered itinerary data shape.
- Validate payload size and fields.
- Return `application/pdf`.
- Rate-limit because POST can be abused.

Optional future:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/pdf/city/[slug]/status` | Status for async generation if PDFs are pre-rendered or queued |

## Frontend Component Structure

```text
src/components/pdf/
  DownloadPdfButton.tsx       shared trigger
  PdfLoadingState.tsx         loading/progress UI
  PdfErrorToast.tsx           retry/error UI

src/components/city/
  CityPdfButton.tsx           city-specific wrapper

src/components/plan/
  ItineraryPdfButton.tsx      exports displayed itinerary

src/lib/
  pdfPayload.ts               validation-safe payload builders
```

Server-side PDF module:

```text
src/lib/pdf/
  cityGuidePdf.ts             city PDF renderer
  itineraryPdf.ts             itinerary PDF renderer
  pdfTheme.ts                 typography, spacing, colors
```

Library options:

- Preferred spike: `@react-pdf/renderer` for structured server-side PDFs.
- Fallback: pre-generated static PDFs for top city guides.
- Avoid heavy client-side screenshot generation as the default because it hurts mobile performance and often produces brittle output.

## SEO Considerations

- PDF download URLs should not be indexed unless dedicated PDF landing pages are intentionally created.
- Add canonical city URL inside the PDF.
- Include TripGenius branding and QR code linking back to the canonical guide.
- Do not replace HTML content with PDFs; PDFs are an engagement/export layer.
- Use `rel="nofollow"` only if external affiliate links are embedded in PDFs.

## Performance Considerations

- Spike PDF library compatibility with Next.js route handlers before committing.
- Keep PDFs text-first and image-light.
- Avoid embedding large hero images; use compressed low-resolution versions or no hero image.
- Cache city-guide PDFs because static city content rarely changes.
- Limit itinerary POST payload size.
- Add rate limiting to avoid repeated expensive generation.
- Consider build-time generation for top cities if runtime PDF generation exceeds Vercel limits.

## Mobile Considerations

- Use an icon-first PDF action in sticky CTA.
- Show clear loading state; mobile downloads can feel silent.
- Provide "Open PDF" after generation if browser download behavior is inconsistent.
- Keep PDF file size under roughly 2 MB for mobile networks.

## Security Considerations

- Validate slugs and itinerary payloads.
- Strip or escape HTML from itinerary text before PDF rendering.
- Rate-limit PDF endpoints by IP or anonymous session.
- Do not include secrets in generated PDFs.
- Use safe filename generation.
- Avoid server-side fetching of arbitrary URLs from user payloads.

## Analytics Events

| Event | Parameters |
|---|---|
| `pdf_download_clicked` | `item_type`, `item_slug`, `source_component` |
| `pdf_generation_started` | `item_type`, `item_slug` |
| `pdf_generation_completed` | `item_type`, `item_slug`, `duration_ms`, `file_size_kb` |
| `pdf_generation_failed` | `item_type`, `item_slug`, `error_type` |
| `pdf_opened_after_download` | `item_type`, `item_slug` |

---

# Feature 4: Similar Destinations Recommendations

## Product Goal

Increase page views per session and improve SEO internal linking by recommending destinations that are meaningfully similar in vibe, budget, season, and region, not just same-country links.

## User Journey

1. User reaches the lower portion of a city guide.
2. A section titled "Similar destinations to Bali" or "You might also like" appears.
3. Cards show destinations with image, country, matching vibe tags, and a short reason.
4. User clicks a destination card.
5. User lands on another city guide and continues exploring.

## UX Wireframe Description

```text
Similar destinations to Bali
Based on: Spiritual, Romantic, Adventure

+----------------+ +----------------+ +----------------+ +----------------+
| image          | | image          | | image          | | image          |
| Phuket         | | Goa            | | Sri Lanka      | | Chiang Mai     |
| Also beachy    | | Similar budget | | Nature + surf  | | Spiritual vibe |
| [Guide link]   | | [Guide link]   | | [Guide link]   | | [Guide link]   |
+----------------+ +----------------+ +----------------+ +----------------+
```

Mobile:

- Horizontal scroll row.
- 2 to 2.5 cards visible.
- Keep reason text short and avoid tooltips.

## Similarity Algorithm

Use deterministic static scoring, not AI.

```text
score =
  vibe_overlap * 40
  + budget_tier_match * 25
  + season_overlap * 20
  + same_region_bonus * 10
  + same_country_bonus * 5
```

Definitions:

- `vibe_overlap`: matched vibes divided by max vibe count.
- `budget_tier_match`: exact tier = 1, adjacent = 0.5, different = 0.
- `season_overlap`: overlapping best-time months divided by 12.
- `same_region_bonus`: same continent or major travel region.
- `same_country_bonus`: smaller bonus so recommendations do not collapse into only same-country results.

Manual editorial overrides:

- Allow a small list of pinned pairs for obvious travel alternatives.
- Allow exclusions for poor matches that score well accidentally.
- Keep override data static and documented.

## Database Schema Changes

Initial release: no database.

Static data only:

```text
src/lib/similarity.ts
src/lib/similarityOverrides.ts
optional generated: src/lib/similarityMap.ts
```

Future database model:

```sql
CREATE TABLE destination_recommendations (
  source_slug TEXT NOT NULL,
  target_slug TEXT NOT NULL,
  score NUMERIC NOT NULL,
  reason TEXT,
  algorithm_version TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(source_slug, target_slug)
);
```

## API Endpoints

Initial release: no API required. Recommendations should be server-rendered from static data.

Optional future endpoint:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/recommendations/city/[slug]?limit=6` | Return ranked recommendations for experimentation or dynamic clients |

Security constraints for optional API:

- Validate slug.
- Cap limit at 12.
- Return only public destination metadata.

## Frontend Component Structure

```text
src/components/city/
  SimilarDestinations.tsx
  SimilarDestinationCard.tsx
  SimilarDestinationsAnalytics.tsx

src/lib/
  similarity.ts
  similarityOverrides.ts
```

Placement:

- Put section after the main city guide content and before footer.
- Consider also adding compact recommendation blocks on blog posts and comparison pages.

## SEO Considerations

- Server-render all recommendation links.
- Use descriptive anchor text: `Phuket travel guide`, not `Read more`.
- Section heading should include target entity terms where natural: `Similar destinations to Bali`.
- Use recommendations to distribute internal links from high-traffic city pages to under-discovered guides.
- Avoid linking to `stub` or `noindex` city pages.
- Keep card image alt text destination-specific.

## Performance Considerations

- Precompute or memoize recommendations at module load/build time.
- Do not ship the full city array to the browser for scoring.
- Use lazy-loaded optimized images.
- Keep analytics in a tiny client island rather than making the whole section client-side.
- Unit-test parsing/scoring utilities because silent recommendation bugs hurt UX and SEO.

## Mobile Considerations

- Horizontal scroll cards with stable widths.
- Avoid long reason text.
- Keep card tap target large.
- Ensure image aspect ratios are stable to avoid layout shift.

## Security Considerations

- Static trusted data only in initial version.
- If future API exists, validate all params and avoid exposing unpublished destinations.
- Escape all displayed reason text if editorial overrides are ever managed through a CMS.

## Analytics Events

| Event | Parameters |
|---|---|
| `similar_destinations_viewed` | `source_city`, `recommended_slugs`, `algorithm_version` |
| `similar_destination_clicked` | `source_city`, `target_city`, `rank`, `score`, `matched_vibes` |
| `similar_destination_card_viewed` | `source_city`, `target_city`, `rank` |
| `similar_algorithm_empty_result` | `source_city` |

---

# Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Coordinate data is incomplete or inaccurate | High | Start with city-level coordinates and top-20 POI enrichment; show graceful fallback |
| Leaflet hydration or CSS issues | High | Keep Leaflet behind a client-only dynamic wrapper and test city pages on desktop/mobile |
| OSM tile usage at scale | Medium | Use production tile provider if traffic grows; cache and attribution must be correct |
| Bookmark state lost across devices | Medium | Accept for Phase 1; design future auth sync |
| localStorage corruption or quota issues | Low | Validate payload, use try/catch, allow reset |
| Share URLs become too long | Medium | Cap shared items or add future server-backed share IDs |
| PDF generation exceeds runtime limits | High | Spike early; cache city PDFs; consider build-time PDFs |
| PDF endpoint abuse | Medium | Rate-limit and validate payload sizes |
| Recommendation algorithm feels wrong | Medium | Add editorial overrides, tests, and analytics monitoring |
| Feature scope creep into AI itinerary generation | High | PDF exports only displayed content; no new itinerary-generation UX in this scope |

# Dependencies

## Internal Dependencies

| Feature | Dependency |
|---|---|
| Maps | City and POI coordinate data |
| Maps | `CityQuickNav` / `CityTOC` anchor support |
| Maps | CSP/tile-provider decision |
| Saves | Shared save-state hook and localStorage validation |
| Saves | Navbar and mobile CTA integration |
| Saves | `/saved` route |
| PDF | PDF library spike |
| PDF | Route handler support and deployment limits |
| PDF | Stable city and itinerary payload builders |
| Similar destinations | City data quality: vibes, budget, best time, country |
| Similar destinations | Analytics event wrapper |

## External Dependencies

| Feature | Dependency | Notes |
|---|---|---|
| Maps | `leaflet`, `react-leaflet` | Already present in current dependencies |
| Maps | Tile provider | OSM for prototype; consider MapTiler/Mapbox for production |
| PDF | `@react-pdf/renderer` or equivalent | Needs compatibility spike |
| PDF | Optional rate limiting | Upstash or platform-native middleware |
| Saves | None for Phase 1 | Future auth provider if cross-device sync is added |
| Analytics | GA4 | Existing wrapper can be extended |

# Implementation Effort Estimate

| Feature | Complexity | Estimated Effort | Notes |
|---|---:|---:|---|
| Similar destinations | Low | 3-4 engineering days | Some groundwork appears present; finish tests, copy, analytics, SEO polish |
| Save/bookmark system | Medium | 4-6 engineering days | No backend needed; includes `/saved`, share URL, navbar/mobile states |
| PDF download | Medium | 5-8 engineering days | Includes 1-day PDF library spike and route hardening |
| Interactive maps | Medium-High | 7-12 engineering days | Depends heavily on coordinate quality and mobile/fullscreen polish |

Total sequential effort: 19-30 engineering days.

With parallel content/data enrichment for coordinates, calendar time can be reduced by roughly 1 week.

# Suggested Implementation Order

## Phase 1: Similar Destinations

Why first:

- Highest SEO upside.
- Lowest infrastructure risk.
- Directly increases page views per session.
- Can be server-rendered and measured quickly.

Deliverables:

- Deterministic scoring.
- Recommendation cards on city pages.
- Analytics events.
- Unit tests for scoring.
- Manual overrides for editorial control.

## Phase 2: Save/Bookmark System

Why second:

- Creates returning-user behavior.
- Does not require auth.
- Builds a durable engagement surface via `/saved`.

Deliverables:

- Save buttons on city/blog/itinerary pages.
- Navbar count.
- `/saved` page.
- Shareable read-only list URL.
- Analytics events.

## Phase 3: PDF Download

Why third:

- High-value feature for users who are ready to plan.
- Requires a technical spike and endpoint hardening.
- Works better once save actions and city content surfaces are stable.

Deliverables:

- City guide PDF.
- Itinerary export PDF for already displayed plans.
- Rate limiting.
- Download analytics.
- Branded PDF template with canonical links.

## Phase 4: Interactive Maps

Why fourth:

- Richest exploratory UX but highest data and integration burden.
- Best implemented after city page structure is stable.
- Can be rolled out city-by-city.

Deliverables:

- Map component with layer controls.
- Fullscreen mobile mode.
- POI popups and detail anchors.
- Coordinate enrichment for top destinations.
- Map analytics.

# Success Metrics

| Metric | Target |
|---|---:|
| Pages per session | +20-30% within 90 days |
| Average engagement time on city pages | +15-25% within 90 days |
| Returning visitor rate | +10-15% within 90 days |
| Similar destination CTR | 10-15% section CTR |
| Save rate | 2-4% of city/blog page sessions |
| Saved page return visits | 15% of users with at least 2 saves |
| PDF download rate | 1-3% of city guide sessions |
| Map interaction rate | 25-40% of users who reach the map section |

# Open Product Decisions

1. Should saved items include blog posts and comparisons in v1, or only cities and itineraries?
2. Should PDF downloads require email capture, or stay frictionless for engagement?
3. Which tile provider should production maps use if traffic exceeds OSM fair-use expectations?
4. Should similar destinations use the heading "Similar destinations to [City]" for SEO, or the softer "You might also like" for UX?
5. Should shareable saved lists be anonymous query strings in v1, or postponed until server-backed share IDs exist?

