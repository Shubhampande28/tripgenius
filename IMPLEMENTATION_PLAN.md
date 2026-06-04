# TripGenius — Implementation Plan
**Version:** 1.0  
**Date:** 2026-06-04  
**Based on:** FEATURE_SPEC.md  
**Constraint:** Every task completable and independently testable in < 2 hours.

---

## How to read this document

Each task contains:
- **Goal** — one sentence on what gets built
- **Files affected** — exact paths, action (Create / Edit / None)
- **Acceptance criteria** — observable pass/fail conditions
- **Unit test requirement** — what must be covered by automated tests
- **Performance requirement** — measurable threshold that must be met
- **Rollback** — how to undo this task in < 5 minutes
- **Depends on** — prerequisite task IDs (none = independently shippable)

Tasks within each phase are ordered. Tasks with no dependency can be parallelised.

---

---

# Phase 1 — Similar Destinations
**Feature:** F4 — Smart recommendation engine replacing the same-country `RelatedCities` filter.  
**Goal:** Surface cross-destination links to increase pages-per-session.  
**New infrastructure:** None.  
**Database changes:** None.

---

## Task 1.1 — Budget tier normalizer
**Goal:** Create a pure function that maps a `stats.budget` string (e.g. `"$40–$200/day"`) to a numeric tier (1 = Budget, 2 = Mid-range, 3 = Luxury).

### Files affected
| File | Action |
|---|---|
| `src/lib/similarity.ts` | **Create** |

### Acceptance criteria
- `normalizeBudget("$20–$50/day")` returns `1`
- `normalizeBudget("$50–$150/day")` returns `2`
- `normalizeBudget("$150+/day")` returns `3`
- `normalizeBudget(undefined)` returns `2` (safe default)
- Any string not matching a known pattern returns `2`

### Unit test requirement
File: `src/lib/__tests__/similarity.test.ts`  
Cover: all four cases above plus two edge cases (empty string, malformed string).  
Tool: Jest (via `next test` or standalone).

### Performance requirement
Function executes in < 1ms for any input.

### Rollback
Delete `src/lib/similarity.ts`. No other files modified.

### Depends on
Nothing.

---

## Task 1.2 — Season overlap calculator
**Goal:** Add a `seasonOverlap` function to `similarity.ts` that parses two `bestTime` strings (e.g. `"Apr – Oct"`, `"Oct – Mar"`) into month sets and returns a 0–1 overlap ratio.

### Files affected
| File | Action |
|---|---|
| `src/lib/similarity.ts` | **Edit** (add function) |

### Acceptance criteria
- `seasonOverlap("Apr – Oct", "Jun – Sep")` returns `0.33` (±0.05)
- `seasonOverlap("Oct – Mar", "Nov – Feb")` returns `0.33` (±0.05)
- `seasonOverlap("Jan – Dec", "Apr – Oct")` returns `0.58` (±0.05)
- `seasonOverlap("Apr – Oct", "Nov – Mar")` returns `0` (no overlap)
- Wrapping seasons (Oct – Mar) are handled correctly (span year boundary)
- `seasonOverlap(undefined, "Apr – Oct")` returns `0.5` (neutral default)

### Unit test requirement
Add to `src/lib/__tests__/similarity.test.ts`.  
Cover: all six cases above, plus a case where both inputs are undefined.

### Performance requirement
Function executes in < 1ms for any input.

### Rollback
Revert the added function from `similarity.ts`. No other files modified.

### Depends on
Task 1.1 (file must exist to edit).

---

## Task 1.3 — Similarity scoring function
**Goal:** Add the main `scoreSimilarity(source: City, candidate: City): number` function to `similarity.ts` using the weighted formula from FEATURE_SPEC.md, and a `getSimilarCities(city: City, all: City[], limit: number)` function that returns ranked results with a `reason` string.

### Files affected
| File | Action |
|---|---|
| `src/lib/similarity.ts` | **Edit** (add two functions) |

### Scoring formula (as specified)
```
score = (vibe_overlap × 40)
      + (budget_tier_match × 25)
      + (season_overlap × 20)
      + (region_bonus × 10)
      + (country_bonus × 5)
```
Region bonus: same continent (Asia, Europe, Americas, Africa, Oceania).  
Budget tier match: exact = 25, adjacent = 12, two apart = 0.

### Acceptance criteria
- A city with the same vibes, budget, and season as the source scores > 70
- A city on a different continent with no matching vibes scores < 15
- The source city itself never appears in results
- `stub: true` cities are excluded from results
- Results are sorted descending by score
- `limit` is respected
- The `reason` string is non-empty for every result

### Unit test requirement
Add to `src/lib/__tests__/similarity.test.ts`.  
Cover: high-similarity pair, low-similarity pair, stub exclusion, self-exclusion, limit enforcement, reason non-empty.

### Performance requirement
`getSimilarCities` completes in < 50ms for 160 cities.

### Rollback
Revert the two added functions. No UI components reference this file yet.

### Depends on
Tasks 1.1, 1.2.

---

## Task 1.4 — Build-time similarity pre-compute script
**Goal:** Create a Node script that imports `allCities`, runs `getSimilarCities` for every city, and writes the result to `src/lib/similarityMap.ts` as a typed export. Hook this into `npm run build` as a pre-build step.

### Files affected
| File | Action |
|---|---|
| `scripts/computeSimilarity.ts` | **Create** |
| `src/lib/similarityMap.ts` | **Create** (generated file, do not edit manually) |
| `package.json` | **Edit** (`"prebuild": "npx ts-node --project tsconfig.scripts.json scripts/computeSimilarity.ts"`) |
| `tsconfig.scripts.json` | **Create** (ts-node config for scripts dir) |

### Acceptance criteria
- Running `npx ts-node scripts/computeSimilarity.ts` generates `src/lib/similarityMap.ts`
- Generated file exports `similarityMap: Record<string, SimilarCity[]>` where `SimilarCity = { slug, score, reason }`
- Every city slug in `allCities` has an entry in the map
- Each entry has between 1 and 6 results
- No city appears in its own results
- Build succeeds after the prebuild step runs

### Unit test requirement
Integration test: run the script in a test, assert the output file is valid JSON-parseable TypeScript and contains at least 10 city entries.

### Performance requirement
Script completes in < 10 seconds for the full city list.

### Rollback
Delete `scripts/computeSimilarity.ts` and `src/lib/similarityMap.ts`. Remove `prebuild` from `package.json`. Restore previous `package.json` with `git checkout package.json`.

### Depends on
Task 1.3.

---

## Task 1.5 — SimilarDestinationCard component
**Goal:** Create a presentational card component showing city photo, name, country, budget, best time, matching vibe tags, and the similarity reason string.

### Files affected
| File | Action |
|---|---|
| `src/components/city/SimilarDestinationCard.tsx` | **Create** |

### Props interface
```
interface Props {
  city: City;
  reason: string;
  matchedVibes: string[];
  rank: number;       // for analytics position tracking
}
```

### Acceptance criteria
- Card renders city photo using `SafeImage` with `loading="lazy"`
- City name is wrapped in a `<Link href="/cities/[slug]">` with descriptive anchor text: `"[Name] travel guide"`
- `matchedVibes` are rendered as accent-coloured pill chips (max 2 visible)
- `reason` string renders below vibe chips in muted text
- Budget and bestTime stats are shown
- Card is keyboard-navigable (link is focusable, visible focus ring)
- Component renders correctly with zero `matchedVibes`

### Unit test requirement
Snapshot test: renders without crashing for a full city fixture and for a city with no vibes/matchedVibes.

### Performance requirement
Component renders in < 16ms (single frame) in a benchmark test.

### Rollback
Delete `src/components/city/SimilarDestinationCard.tsx`. Not yet imported anywhere.

### Depends on
Nothing (purely presentational, uses existing `City` type and `SafeImage`).

---

## Task 1.6 — SimilarDestinations section component
**Goal:** Create the section component that reads from `similarityMap`, picks the top results for the current city, and renders 4–6 `SimilarDestinationCard`s with the section heading and vibe filter chips.

### Files affected
| File | Action |
|---|---|
| `src/components/city/SimilarDestinations.tsx` | **Create** |

### Acceptance criteria
- Section renders an `<h2>` with text `"You Might Also Like"`
- Active matching vibes render as filter chips below the heading
- Exactly 4 cards render on desktop, scrollable row of 2.5 visible on mobile
- If `similarityMap` has no entry for the city, the section renders `null` silently (no error)
- Section is server-rendered (no `'use client'` directive) — all markup in HTML source
- `id="similar-destinations"` is present on the `<section>` tag

### Unit test requirement
Render test: given a mock `similarityMap` with results, assert the heading and correct number of cards render. Render test: given no entry in map, assert `null` renders.

### Performance requirement
Server render time < 5ms (no dynamic data fetching — all from static import).

### Rollback
Delete `src/components/city/SimilarDestinations.tsx`. Not yet imported in page.

### Depends on
Tasks 1.4, 1.5.

---

## Task 1.7 — Wire SimilarDestinations into city page
**Goal:** Import `SimilarDestinations` in `src/app/cities/[slug]/page.tsx`, position it above the existing `RelatedCities`, and retire `RelatedCities` by conditionally suppressing it when `SimilarDestinations` renders.

### Files affected
| File | Action |
|---|---|
| `src/app/cities/[slug]/page.tsx` | **Edit** (add import, add component after `<ProTips />`, before `<BookingPanel />`) |
| `src/components/city/RelatedCities.tsx` | **Edit** (add `if (hasSmartRecommendations) return null` guard using a prop) |

### Acceptance criteria
- Navigating to `/cities/bali` shows the "You Might Also Like" section
- The section is visible in the HTML source (verify via curl or View Source)
- The existing `RelatedCities` section is suppressed (not duplicated)
- No TypeScript errors on build
- Lighthouse Performance score does not regress by > 3 points vs baseline

### Unit test requirement
Page render integration test: render the `[slug]` page for "bali", assert both `SimilarDestinations` and suppressed `RelatedCities` render as expected.

### Performance requirement
`next build` completes without increase in build time > 15 seconds.

### Rollback
Revert `page.tsx` with `git checkout src/app/cities/\\[slug\\]/page.tsx`. Revert `RelatedCities.tsx` with `git checkout`. Both files are tracked in git.

### Depends on
Task 1.6.

---

## Task 1.8 — Blog post related cities widget
**Goal:** Create `BlogRelatedCities` component that maps a blog post's `tags` and `citySlug` through the similarity algorithm and renders 2–3 related city cards at the end of blog posts.

### Files affected
| File | Action |
|---|---|
| `src/components/blog/BlogRelatedCities.tsx` | **Create** |
| `src/app/blog/[slug]/page.tsx` | **Edit** (import and add before `</article>` close) |

### Tag-to-vibe mapping (static lookup)
Tags like "Beach", "Adventure", "Budget", "Spiritual" map directly to city `vibes`. Unknown tags map to nothing (city still scored by `citySlug` match).

### Acceptance criteria
- Blog post `/blog/bali-vs-thailand-indian-travellers` renders 2–3 city cards
- Blog post with no `citySlug` and no matching tags renders `null`
- Heading text: `"Explore These Destinations"`
- Cards are clickable links to city pages
- Component is server-rendered

### Unit test requirement
Render test with a blog fixture that has a `citySlug` and tags. Render test with a blog fixture that has neither.

### Performance requirement
Render in < 5ms (static data).

### Rollback
Remove the import and component usage from `blog/[slug]/page.tsx`. Delete `BlogRelatedCities.tsx`.

### Depends on
Task 1.6 (reuses `SimilarDestinationCard`).

---

### Phase 1 Summary

| Task | Est. Time | Parallelisable? |
|---|---|---|
| 1.1 Budget tier normalizer | 30 min | Yes (standalone) |
| 1.2 Season overlap calculator | 45 min | After 1.1 |
| 1.3 Scoring function | 60 min | After 1.2 |
| 1.4 Pre-compute script | 60 min | After 1.3 |
| 1.5 SimilarDestinationCard | 60 min | Yes (standalone UI) |
| 1.6 SimilarDestinations section | 60 min | After 1.4, 1.5 |
| 1.7 Wire into city page | 30 min | After 1.6 |
| 1.8 Blog widget | 60 min | After 1.6 |

**Frontend changes:** New components in `src/components/city/` and `src/components/blog/`. Edit to city and blog `page.tsx`.  
**Backend changes:** None.  
**Database changes:** None.  
**Testing strategy:** Unit tests for all pure functions (Tasks 1.1–1.3). Render tests for all components. Integration test for full page render. Manual test: navigate to 5 city pages and verify recommendations are not obviously wrong (e.g. Bali should never recommend only Indian cities).

---

---

# Phase 2 — Bookmark System
**Feature:** F2 — Save cities and blog posts to a localStorage collection with a `/saved` page and shareable URL.  
**New infrastructure:** None.  
**Database changes:** None (Phase 1 only — localStorage).

---

## Task 2.1 — useBookmarks hook
**Goal:** Create the `useBookmarks` custom hook that reads and writes to localStorage under key `tg_v1_bookmarks`, dispatches a `tg_bookmarks_updated` custom event on every change, and exposes `{ saved, isSaved, toggle, remove, clear }`.

### Files affected
| File | Action |
|---|---|
| `src/hooks/useBookmarks.ts` | **Create** |

### localStorage schema
```json
[
  { "itemType": "city", "slug": "bali", "savedAt": 1748000000000 },
  { "itemType": "blog", "slug": "bali-vs-thailand-indian-travellers", "savedAt": 1748000001000 }
]
```

### Acceptance criteria
- `toggle("city", "bali")` adds the item if absent; removes it if present
- `isSaved("city", "bali")` returns `true` after toggle; `false` after second toggle
- All hook methods are wrapped in `try/catch` — localStorage unavailability does not throw
- `saved` is `[]` on first render (SSR-safe: localStorage only accessed in `useEffect`)
- `tg_bookmarks_updated` custom event is dispatched on every `toggle` and `remove`
- `clear()` removes all items and dispatches the event

### Unit test requirement
File: `src/hooks/__tests__/useBookmarks.test.ts`  
Use `@testing-library/react` `renderHook`.  
Cover: add, remove, toggle, clear, isSaved, localStorage unavailable (mock `localStorage.setItem` to throw).

### Performance requirement
`toggle` executes in < 5ms including localStorage write.

### Rollback
Delete `src/hooks/useBookmarks.ts`. Not yet imported anywhere.

### Depends on
Nothing.

---

## Task 2.2 — BookmarkButton component
**Goal:** Create a client-side bookmark toggle button (heart icon using Lucide `Heart`) that uses `useBookmarks` and shows filled/unfilled state with a Framer Motion scale animation on click.

### Files affected
| File | Action |
|---|---|
| `src/components/bookmarks/BookmarkButton.tsx` | **Create** |

### Props interface
```
interface Props {
  itemType: 'city' | 'blog';
  slug: string;
  label?: string;        // e.g. "Bali" — used in aria-label
  variant?: 'icon' | 'button';  // icon = icon only, button = icon + text
  onToggle?: (isSaved: boolean) => void;
}
```

### Acceptance criteria
- Clicking once fills the heart and fires `onToggle(true)`
- Clicking again empties the heart and fires `onToggle(false)`
- `aria-label` reads "Save [label] to your list" / "Remove [label] from your list"
- `aria-pressed` reflects current saved state
- Keyboard activation (Enter/Space) works identically to click
- Component listens for `tg_bookmarks_updated` events and re-syncs state (so two buttons for the same item on the same page stay in sync)

### Unit test requirement
Render test: initial state unfilled, click → filled, click again → unfilled. Event listener sync test: dispatch `tg_bookmarks_updated` and assert the button re-renders.

### Performance requirement
Animation completes in ≤ 200ms.

### Rollback
Delete `src/components/bookmarks/BookmarkButton.tsx`. Not yet imported anywhere.

### Depends on
Task 2.1.

---

## Task 2.3 — BookmarkToast component
**Goal:** Create a slide-in toast notification that appears for 3 seconds after a bookmark is added, with text "Saved to your list" and an inline "View list →" link to `/saved`.

### Files affected
| File | Action |
|---|---|
| `src/components/bookmarks/BookmarkToast.tsx` | **Create** |

### Acceptance criteria
- Toast appears within 100ms of `show()` being called
- Toast auto-dismisses after 3000ms
- "View list →" link navigates to `/saved` and dismisses the toast
- Clicking the X button dismisses immediately
- Only one toast is visible at a time (second call replaces first)
- Toast is positioned `fixed bottom-6 left-6 z-[60]` on desktop, `bottom-20 left-4` on mobile (above the MobileCTA bar)
- Toast is announced to screen readers via `role="status"` and `aria-live="polite"`

### Unit test requirement
Render test: toast not visible initially, call `show("Bali")`, assert it appears, wait 3100ms, assert it disappears. Test X button dismissal.

### Performance requirement
CSS transition in / out ≤ 300ms.

### Rollback
Delete `src/components/bookmarks/BookmarkToast.tsx`. Not yet imported anywhere.

### Depends on
Nothing (standalone).

---

## Task 2.4 — Add BookmarkButton to CityHero
**Goal:** Add `BookmarkButton` to the `CityHero` component in the top-right corner of the hero content area, positioned absolutely above the gradient overlay.

### Files affected
| File | Action |
|---|---|
| `src/components/city/CityHero.tsx` | **Edit** (add `BookmarkButton` and `BookmarkToast`, pass `city.slug` and `city.name`) |

### Acceptance criteria
- Button is visible on the hero on `/cities/bali`
- Button position: `absolute top-4 right-4` inside the hero `relative` container (on desktop)
- Clicking toggles the saved state and triggers the toast
- Button does not overlap the city name or stats chips
- On mobile: button is still visible, positioned at top-right of the hero image
- Build produces no TypeScript errors

### Unit test requirement
Render test: `CityHero` renders with `BookmarkButton` present in the DOM. Assert `aria-label` contains the city name.

### Performance requirement
Adding `BookmarkButton` (client component) to `CityHero` (already a client component) adds < 2KB to the JS bundle.

### Rollback
Revert `CityHero.tsx` with `git checkout src/components/city/CityHero.tsx`.

### Depends on
Tasks 2.2, 2.3.

---

## Task 2.5 — Add BookmarkButton to MobileCTA
**Goal:** Add a bookmark icon button as a third action in the `MobileCTA` sticky bar on mobile, between the existing Hotel and Flight buttons.

### Files affected
| File | Action |
|---|---|
| `src/components/city/MobileCTA.tsx` | **Edit** (import `BookmarkButton`, add as a compact icon-only button) |

### Acceptance criteria
- A heart icon button appears between "Book Hotels" and "Find Flights" in the mobile bar
- The button is icon-only (variant="icon") to preserve space
- Tap toggles saved state and shows toast
- The hotel and flight buttons still fill correctly — use `flex: 0 0 auto` for the bookmark button, `flex: 1` for the two CTAs
- No layout shift or overflow at 375px viewport width

### Unit test requirement
Snapshot test at 375px: assert three elements render in the flex row and no overflow is detected.

### Performance requirement
No Cumulative Layout Shift (CLS) increase vs baseline.

### Rollback
Revert `MobileCTA.tsx` with `git checkout src/components/city/MobileCTA.tsx`.

### Depends on
Task 2.2.

---

## Task 2.6 — SavedPageCard component
**Goal:** Create a card component for the `/saved` page that displays a saved city or blog post with its image, title, and a remove button.

### Files affected
| File | Action |
|---|---|
| `src/components/bookmarks/SavedPageCard.tsx` | **Create** |

### Props interface
```
interface Props {
  itemType: 'city' | 'blog';
  slug: string;
  title: string;
  subtitle: string;       // country for cities, category for blogs
  image: string;
  onRemove: () => void;
}
```

### Acceptance criteria
- Card renders image, title (as a link to the city/blog page), subtitle, and an X remove button
- `onRemove` is called when X is clicked
- Link uses correct paths: `/cities/[slug]` or `/blog/[slug]`
- Card is keyboard navigable
- Card shows a placeholder image if the image URL is empty or fails

### Unit test requirement
Render test: card renders all props. Click X, assert `onRemove` is called.

### Performance requirement
Renders in < 16ms.

### Rollback
Delete `src/components/bookmarks/SavedPageCard.tsx`. Not yet imported in any page.

### Depends on
Nothing.

---

## Task 2.7 — /saved page
**Goal:** Create the `/saved` route as a client page that reads from `useBookmarks`, looks up city and blog metadata from static arrays, and renders `SavedPageCard`s with empty-state handling.

### Files affected
| File | Action |
|---|---|
| `src/app/saved/page.tsx` | **Create** |

### Acceptance criteria
- Route `/saved` renders without errors
- Empty state: renders "No saved places yet" with a link to `/destinations`
- With saves: renders one `SavedPageCard` per saved item
- Items are sorted by `savedAt` descending (newest first)
- Removing an item updates the list immediately without a page reload
- Page title metadata: "My Saved Places | TripGenius"
- `<meta name="robots" content="noindex">` is present
- Page renders correctly if a saved slug no longer exists in the static data (orphan = silently skipped)

### Unit test requirement
Render test with mocked `useBookmarks` returning two items: assert two cards render. Render test with empty `saved`: assert empty state renders.

### Performance requirement
Page hydrates in < 500ms on a mid-range mobile device (Lighthouse Lab data).

### Rollback
Delete `src/app/saved/page.tsx`. The route simply stops existing — no other pages link to it yet.

### Depends on
Tasks 2.1, 2.6.

---

## Task 2.8 — ShareListButton and shareable URL
**Goal:** Add a "Share list" button to the `/saved` page that encodes saved slugs into a URL query string (`/saved?list=bali,tokyo`) and copies it to the clipboard (or invokes Web Share API on mobile). Make `/saved?list=…` render as a read-only view of those cities.

### Files affected
| File | Action |
|---|---|
| `src/components/bookmarks/ShareListButton.tsx` | **Create** |
| `src/app/saved/page.tsx` | **Edit** (read `searchParams.list` prop, render read-only mode if present) |

### Acceptance criteria
- "Share list" button is only visible when `saved.length > 0`
- Clicking copies `https://tripgenius.in/saved?list=[comma-separated slugs]` to clipboard
- On mobile (Web Share API available): native share sheet opens instead
- A "Copied!" confirmation replaces the button text for 2 seconds
- `/saved?list=bali,tokyo` renders two city cards in read-only mode (no remove buttons, no "Share" button)
- Slugs in the `list` param are validated against `getAllCitySlugs()` — unknown slugs are silently ignored
- `noindex` robots meta is still present on shared URLs

### Unit test requirement
Unit test: `buildShareUrl(["bali", "tokyo"])` returns the correct URL string. Render test: page with `searchParams.list="bali"` renders one card with no remove button.

### Performance requirement
Clipboard write completes in < 50ms.

### Rollback
Revert `saved/page.tsx`. Delete `ShareListButton.tsx`.

### Depends on
Task 2.7.

---

## Task 2.9 — Navbar "My Saves" entry
**Goal:** Add a "Saved" icon link (bookmark icon with badge count) to the Navbar desktop nav and mobile drawer. Badge only renders when `saved.length > 0`.

### Files affected
| File | Action |
|---|---|
| `src/components/Navbar.tsx` | **Edit** (add `BookmarkNavItem` inline or as a separate small component) |

### Acceptance criteria
- On desktop: a bookmark icon (Lucide `Bookmark`) appears to the right of the "Compare" link
- Badge count (e.g. `3`) appears as a red circle on the icon when items are saved
- Badge is hidden when count is 0
- Clicking navigates to `/saved`
- In the mobile drawer: "My Saves" text link with count in parentheses appears above "Explore Guides" CTA
- Badge count updates in real-time (listens to `tg_bookmarks_updated` event)
- On SSR: badge is hidden (no hydration mismatch — use `useEffect` to read count)

### Unit test requirement
Render test: Navbar with 0 bookmarks → no badge. With 2 bookmarks (mock hook) → badge shows "2".

### Performance requirement
Adding this to the Navbar adds < 1KB to the JS bundle (hook is already loaded).

### Rollback
Revert `Navbar.tsx` with `git checkout src/components/Navbar.tsx`.

### Depends on
Task 2.1 (useBookmarks hook).

---

### Phase 2 Summary

| Task | Est. Time | Parallelisable? |
|---|---|---|
| 2.1 useBookmarks hook | 60 min | Yes (standalone) |
| 2.2 BookmarkButton | 45 min | After 2.1 |
| 2.3 BookmarkToast | 45 min | Yes (standalone) |
| 2.4 BookmarkButton → CityHero | 30 min | After 2.2, 2.3 |
| 2.5 BookmarkButton → MobileCTA | 20 min | After 2.2 |
| 2.6 SavedPageCard | 30 min | Yes (standalone) |
| 2.7 /saved page | 60 min | After 2.1, 2.6 |
| 2.8 ShareListButton + shareable URL | 60 min | After 2.7 |
| 2.9 Navbar "My Saves" | 30 min | After 2.1 |

**Frontend changes:** New `src/components/bookmarks/` directory with 4 components. New `src/hooks/useBookmarks.ts`. New `src/app/saved/page.tsx`. Edits to `CityHero`, `MobileCTA`, `Navbar`.  
**Backend changes:** None.  
**Database changes:** None.  
**Testing strategy:** Hook unit tests with renderHook. Component render tests with testing-library. Manual: save 3 cities, reload page, verify persistence. Clear localStorage, verify empty state. Test in private/incognito (localStorage blocked) — verify graceful degradation.

---

---

# Phase 3 — PDF Download
**Feature:** F3 — Server-generated PDF of city guides and AI trip plans.  
**New infrastructure:** `@react-pdf/renderer` package. Optional: Upstash Redis for rate limiting.  
**Database changes:** None.

---

## Task 3.1 — Library installation and rendering spike
**Goal:** Install `@react-pdf/renderer`, verify it compiles under Next.js 16 App Router, and render a single-page "Hello World" PDF from an API route to confirm the setup works end-to-end.

### Files affected
| File | Action |
|---|---|
| `package.json` | **Edit** (add `@react-pdf/renderer`) |
| `src/app/api/pdf/test/route.ts` | **Create** (temporary spike route — deleted after task) |

### Acceptance criteria
- `npm install @react-pdf/renderer` completes without peer dependency errors
- `GET /api/pdf/test` returns a binary PDF response with Content-Type `application/pdf`
- Opening the PDF in a browser shows text "TripGenius PDF Test"
- `npm run build` succeeds — `@react-pdf/renderer` must be usable in the Next.js server build
- The spike route is deleted before marking this task done

### Unit test requirement
None for the spike route. The acceptance criteria above are the test.

### Performance requirement
PDF generation for the single-page test PDF completes in < 3 seconds.

### Rollback
`npm uninstall @react-pdf/renderer`. Delete the spike route. Revert `package.json`.

### Depends on
Nothing.

---

## Task 3.2 — PDF shared helpers and design tokens
**Goal:** Create `src/lib/pdf/pdfHelpers.ts` with shared constants (font sizes, colours, spacing, TripGenius brand colours) and helper functions used by both city and itinerary PDF templates.

### Files affected
| File | Action |
|---|---|
| `src/lib/pdf/pdfHelpers.ts` | **Create** |

### Contents
- `BRAND` object: primary colour, accent colour, font families registered with `@react-pdf/renderer`
- `formatBudget(budget: string): string` — normalises budget strings for PDF display
- `truncateText(text: string, maxChars: number): string`
- `sectionHeading(text: string)` — returns a reusable `<View>` + `<Text>` structure for section headers
- `PAGE_SIZE`, `PAGE_MARGIN` constants

### Acceptance criteria
- All exported functions are pure (no side effects)
- `truncateText("hello world", 5)` returns `"hello…"`
- `formatBudget("$40–$200/day")` returns `"$40 – $200 / day"` (spaced, readable)
- Fonts registered without throwing (call `Font.register(...)` with a bundled fallback font, not a remote URL)

### Unit test requirement
File: `src/lib/pdf/__tests__/pdfHelpers.test.ts`  
Cover: `truncateText` (normal case, exact boundary, empty string), `formatBudget` (normal, already-formatted, undefined).

### Performance requirement
All functions execute in < 1ms.

### Rollback
Delete `src/lib/pdf/pdfHelpers.ts`. Not yet imported anywhere.

### Depends on
Task 3.1 (confirms `@react-pdf/renderer` is available).

---

## Task 3.3 — City PDF template
**Goal:** Create `src/lib/pdf/CityPdfDocument.tsx` — a `@react-pdf/renderer` React document component that accepts a `City` object and renders a complete, styled A4 travel guide PDF.

### Files affected
| File | Action |
|---|---|
| `src/lib/pdf/CityPdfDocument.tsx` | **Create** |

### Sections to include (in order)
1. Header bar: TripGenius wordmark + city name
2. AtAGlance stats (4 key facts in a 2×2 grid)
3. ThingsToDo (up to 8, with icon, name, category badge, description truncated to 120 chars)
4. WhereToStay (up to 4 hotels: name, type, price range)
5. WhereToEat (up to 4 restaurants: name, cuisine, price range, must-try dish)
6. ProTips (up to 6 bullet points)
7. BudgetBreakdown (3-tier table if available)
8. Footer: `tripgenius.in/cities/[slug]` URL + "Free travel guides for 160+ cities"

### Acceptance criteria
- Component renders without throwing for the Bali city fixture
- Component renders without throwing for a minimal city fixture (only `slug`, `name`, `country`, `stats`, and no optional arrays)
- Output PDF is < 3MB
- All text is selectable (not a rasterised image)
- Footer URL is correct for every city

### Unit test requirement
Render test using `@react-pdf/renderer`'s test utils: render `<CityPdfDocument city={baliFixture} />` and assert no errors thrown. Assert the document has at least 1 page.

### Performance requirement
`renderToBuffer()` completes in < 5 seconds for the Bali fixture (largest city data).

### Rollback
Delete `src/lib/pdf/CityPdfDocument.tsx`. Not yet imported in any API route.

### Depends on
Task 3.2.

---

## Task 3.4 — City PDF API route
**Goal:** Create `GET /api/pdf/city/[slug]` that validates the slug, renders the PDF using `CityPdfDocument`, and streams it as a file download.

### Files affected
| File | Action |
|---|---|
| `src/app/api/pdf/city/[slug]/route.ts` | **Create** |

### Response spec
```
HTTP 200
Content-Type: application/pdf
Content-Disposition: attachment; filename="TripGenius-[CityName]-Guide.pdf"
Cache-Control: public, max-age=86400, s-maxage=86400
X-Content-Type-Options: nosniff
```

```
HTTP 404 — { "error": "City not found" }
HTTP 429 — { "error": "Too many requests" }  (if rate limiting enabled)
HTTP 500 — { "error": "PDF generation failed" }
```

### Acceptance criteria
- `GET /api/pdf/city/bali` returns a valid PDF binary (Content-Type: application/pdf)
- `GET /api/pdf/city/nonexistent` returns 404 JSON
- The filename in Content-Disposition uses the real city name (not slug) with spaces replaced by hyphens
- Route validates slug against `getAllCitySlugs()` — rejects unknown slugs
- Route does not expose stack traces in error responses

### Unit test requirement
API route test (using `next test` or a Jest + node-fetch approach):  
- GET valid slug → 200 + application/pdf Content-Type  
- GET invalid slug → 404  
- Response body for valid slug is a non-empty Buffer

### Performance requirement
Response time (time to first byte) < 6 seconds on a cold Vercel serverless function.

### Rollback
Delete `src/app/api/pdf/city/[slug]/route.ts`. No frontend components reference this yet.

### Depends on
Task 3.3.

---

## Task 3.5 — DownloadGuideButton component
**Goal:** Create a `DownloadGuideButton` client component with loading state that calls `/api/pdf/city/[slug]` and triggers a browser file download using a blob URL.

### Files affected
| File | Action |
|---|---|
| `src/components/city/DownloadGuideButton.tsx` | **Create** |

### Props
```
interface Props {
  citySlug: string;
  cityName: string;
  variant?: 'sidebar' | 'mobile';
}
```

### Acceptance criteria
- Button label: "Download Guide (PDF)" (sidebar) / "PDF" (mobile)
- Click → button shows spinner + "Generating…" and is disabled
- On success: browser downloads the PDF and button resets to default state
- On failure: button resets and a small error message appears below it for 4 seconds
- Double-clicking during loading does not trigger a second request (button is disabled)
- `variant="mobile"` renders a compact icon + "PDF" label

### Unit test requirement
Render test: button renders with correct label. Mock `fetch` to resolve → assert button shows loading state then resets. Mock `fetch` to reject → assert error message appears.

### Performance requirement
Time from click to download dialog appearing ≤ PDF generation time + 200ms network overhead.

### Rollback
Delete `src/components/city/DownloadGuideButton.tsx`. Not yet mounted anywhere.

### Depends on
Task 3.4.

---

## Task 3.6 — Add DownloadGuideButton to CitySidebar and MobileCTA
**Goal:** Mount `DownloadGuideButton` in `CitySidebar` (Quick Actions section, above Book Your Trip) and in `MobileCTA` (as a tertiary small button).

### Files affected
| File | Action |
|---|---|
| `src/components/city/CitySidebar.tsx` | **Edit** (add Quick Actions card above the Quick Facts card, containing BookmarkButton + DownloadGuideButton) |
| `src/components/city/MobileCTA.tsx` | **Edit** (add compact PDF button next to bookmark button) |

### Acceptance criteria
- "Download Guide (PDF)" button is visible in the sidebar on desktop at `/cities/bali`
- A compact PDF button appears in the mobile CTA bar
- MobileCTA bar remains a single row on 375px viewport — no wrapping
- CitySidebar Quick Actions card has correct heading, clear visual separation from Quick Facts
- `CitySidebar` becomes a client component (add `'use client'`) or isolate `DownloadGuideButton` in a separate client island within the sidebar

### Unit test requirement
Snapshot test: `CitySidebar` renders with `DownloadGuideButton` present in the DOM.

### Performance requirement
CitySidebar going from server component to client component (if necessary) must not increase LCP by > 100ms — verify with Lighthouse.

### Rollback
Revert `CitySidebar.tsx` and `MobileCTA.tsx` via `git checkout`.

### Depends on
Task 3.5.

---

## Task 3.7 — Itinerary PDF template
**Goal:** Create `src/lib/pdf/ItineraryPdfDocument.tsx` — a `@react-pdf/renderer` document component that accepts a `TripItinerary` object and renders a day-by-day trip plan PDF.

### Files affected
| File | Action |
|---|---|
| `src/lib/pdf/ItineraryPdfDocument.tsx` | **Create** |

### Sections to include
1. Header: TripGenius logo, trip title (e.g. "Bali — 7 Day Adventure Itinerary"), dates
2. Overview paragraph
3. Day-by-day breakdown (each day on its own sub-section: theme + morning/afternoon/evening blocks)
4. Budget table
5. Packing tips (bulleted list)
6. Best advice callout
7. Footer: `tripgenius.in/plan` — "Plan your own trip free"

### Acceptance criteria
- Renders without throwing for a 7-day `TripItinerary` fixture
- Each day is clearly delineated (day number, date, theme)
- Activity `tip` fields render in a visually distinct style when present
- Budget table has aligned columns
- PDF is < 5MB for a 7-day itinerary

### Unit test requirement
Render test: assert no throw for a 7-day fixture. Assert document page count ≥ 2 (a 7-day itinerary won't fit on one page).

### Performance requirement
`renderToBuffer()` for a 7-day itinerary completes in < 8 seconds.

### Rollback
Delete `src/lib/pdf/ItineraryPdfDocument.tsx`. Not yet imported anywhere.

### Depends on
Task 3.2.

---

## Task 3.8 — Itinerary PDF API route
**Goal:** Create `POST /api/pdf/itinerary` that accepts a `TripItinerary` JSON body, validates it, and returns a PDF.

### Files affected
| File | Action |
|---|---|
| `src/app/api/pdf/itinerary/route.ts` | **Create** |

### Validation rules
- `destination`: non-empty string, max 100 chars
- `days`: array, 1–14 items
- Each day: `day` (number), `date` (string), `morning/afternoon/evening` (objects with `activity` string)
- Reject any extra fields at the top level (whitelist validation)

### Response spec
Same as Task 3.4 but filename: `TripGenius-[Destination]-[Duration]-Itinerary.pdf`

### Acceptance criteria
- `POST /api/pdf/itinerary` with a valid 7-day body returns a PDF
- `POST` with `days: []` returns 400 with `{ "error": "Itinerary must have between 1 and 14 days" }`
- `POST` with a `destination` containing `<script>` tags returns 400 (injection rejected)
- `POST` with a body > 100KB returns 413

### Unit test requirement
API route test: valid body → 200 + PDF. Empty days → 400. Malformed body → 400. Oversized body → 413.

### Performance requirement
Response time < 10 seconds for a 14-day itinerary.

### Rollback
Delete `src/app/api/pdf/itinerary/route.ts`.

### Depends on
Task 3.7.

---

## Task 3.9 — DownloadItineraryButton on /plan page
**Goal:** Add a `DownloadItineraryButton` to `ItineraryDisplay` that calls `/api/pdf/itinerary` with the current itinerary data.

### Files affected
| File | Action |
|---|---|
| `src/components/plan/DownloadItineraryButton.tsx` | **Create** |
| `src/components/plan/ItineraryDisplay.tsx` | **Edit** (add button at the top-right of the itinerary card) |

### Acceptance criteria
- Button only renders when an itinerary result is present (not during loading or before generation)
- Button label: "Download PDF"
- Clicking triggers the same loading/success/error flow as `DownloadGuideButton`
- Filename: `TripGenius-[destination]-Itinerary.pdf` (sanitised, no spaces)
- Button is positioned at the top-right of the itinerary display card

### Unit test requirement
Render test: `ItineraryDisplay` with a mock itinerary renders the button. Without itinerary data renders without the button.

### Performance requirement
No additional JS loaded until the user has already generated an itinerary (lazy concern — acceptable).

### Rollback
Revert `ItineraryDisplay.tsx`. Delete `DownloadItineraryButton.tsx`.

### Depends on
Task 3.8.

---

## Task 3.10 — Rate limiting on PDF routes
**Goal:** Add IP-based rate limiting to both PDF API routes using the `X-Forwarded-For` header and an in-memory sliding window (no external Redis required for Phase 1 — use a simple `Map` singleton).

### Files affected
| File | Action |
|---|---|
| `src/lib/rateLimit.ts` | **Create** (in-memory sliding window rate limiter) |
| `src/app/api/pdf/city/[slug]/route.ts` | **Edit** (add rate limit check) |
| `src/app/api/pdf/itinerary/route.ts` | **Edit** (add rate limit check) |

### Limits
- City PDF: 10 requests per IP per 60 seconds
- Itinerary PDF: 5 requests per IP per 60 seconds

### Acceptance criteria
- 11th request from the same IP within 60 seconds returns 429 with `Retry-After` header
- Counter resets after the window expires
- Rate limiter does not crash if `X-Forwarded-For` is missing (falls back to a generic key)
- In-memory limiter works on a single serverless instance (note: not shared across instances — acceptable for Phase 1)

### Unit test requirement
Unit test for `rateLimit(key, limit, windowMs)`: call 10 times → allowed. 11th → denied. Wait window → allowed again.

### Performance requirement
Rate limit check adds < 2ms overhead per request.

### Rollback
Remove rate limit calls from both route files. Delete `src/lib/rateLimit.ts`.

### Depends on
Tasks 3.4, 3.8.

---

### Phase 3 Summary

| Task | Est. Time | Parallelisable? |
|---|---|---|
| 3.1 Library spike | 30 min | Yes (first) |
| 3.2 PDF helpers | 45 min | After 3.1 |
| 3.3 City PDF template | 90 min | After 3.2 |
| 3.4 City PDF route | 45 min | After 3.3 |
| 3.5 DownloadGuideButton | 45 min | After 3.4 |
| 3.6 Mount in CitySidebar + MobileCTA | 30 min | After 3.5 |
| 3.7 Itinerary PDF template | 90 min | After 3.2 (parallel with 3.3) |
| 3.8 Itinerary PDF route | 45 min | After 3.7 |
| 3.9 DownloadItineraryButton | 30 min | After 3.8 |
| 3.10 Rate limiting | 45 min | After 3.4, 3.8 |

**Frontend changes:** New components `DownloadGuideButton`, `DownloadItineraryButton`. Edits to `CitySidebar`, `MobileCTA`, `ItineraryDisplay`.  
**Backend changes:** Two new API routes: `/api/pdf/city/[slug]` and `/api/pdf/itinerary`.  
**Database changes:** None.  
**Testing strategy:** Unit tests for all helpers and the rate limiter. API route integration tests. Manual: generate PDFs for 3 cities and the trip planner, verify layout is readable. Test PDF opens correctly on iOS Safari (inline viewer), Android Chrome (download). Test rate limiting by rapid-clicking 11 times.

---

---

# Phase 4 — Interactive Maps
**Feature:** F1 — Leaflet-based interactive map on every city page with attraction pins, layer switching, and fullscreen mode.  
**New infrastructure:** `leaflet` + `react-leaflet` packages. No API key required (OpenStreetMap tiles).  
**Database changes:** None (coordinate data added to static TypeScript files).

---

## Task 4.1 — Add coordinate types to types.ts
**Goal:** Add optional `coordinates` fields to the `City`, `ThingToDo`, `Neighbourhood`, and `CityArea` interfaces in `src/lib/types.ts`.

### Files affected
| File | Action |
|---|---|
| `src/lib/types.ts` | **Edit** (add `coordinates?: { lat: number; lng: number }` to 4 interfaces) |

### Acceptance criteria
- `City.coordinates?: { lat: number; lng: number }` added
- `ThingToDo.coordinates?: { lat: number; lng: number }` added
- `Neighbourhood.coordinates?: { lat: number; lng: number }` added
- `CityArea.coordinates?: { lat: number; lng: number }` added
- All fields are optional — no existing city objects fail TypeScript compilation
- `npm run build` passes with zero TypeScript errors

### Unit test requirement
Type-check test: create a TypeScript fixture file that assigns a city object with and without coordinates and assert `tsc --noEmit` passes.

### Performance requirement
No runtime impact — types are compile-time only.

### Rollback
Revert `src/lib/types.ts` with `git checkout`. Since all fields are optional, no data files break.

### Depends on
Nothing.

---

## Task 4.2 — Add coordinates to top 10 cities
**Goal:** Add city-level `coordinates` to the 10 highest-traffic cities: Bali, Delhi, Jaipur, Goa, Mumbai, Tokyo, Paris, Bangkok, Singapore, Dubai.

### Files affected
| File | Action |
|---|---|
| `src/lib/cities.ts` | **Edit** (add `coordinates` to Bali, Tokyo, Paris, Bangkok, Singapore, Dubai) |
| `src/lib/indianCities.ts` | **Edit** (add `coordinates` to Delhi, Jaipur, Goa, Mumbai) |

### Coordinate format
City-level coordinates are the geographic centre of the city (not the airport). Source: Wikipedia infobox coordinates or GeoNames.

### Acceptance criteria
- All 10 cities have a valid `coordinates: { lat, lng }` value
- Coordinates are in decimal degrees (not DMS)
- Bali: `{ lat: -8.4095, lng: 115.1889 }` (as a correctness reference)
- `npm run build` passes — no TypeScript errors
- Running `getAllCitySlugs()` still returns the same slugs (no data regression)

### Unit test requirement
Data validation test: iterate `allCities`, for every city that has `coordinates`, assert `lat` is between -90 and 90, `lng` is between -180 and 180.

### Performance requirement
No runtime impact.

### Rollback
Revert `cities.ts` and `indianCities.ts` via `git checkout`. The `coordinates` field is optional so reverting is safe.

### Depends on
Task 4.1.

---

## Task 4.3 — Map utility helpers
**Goal:** Create `src/lib/mapUtils.ts` with helper functions for the map: pin colour by category, layer configuration, coordinate validation, and building the pin data array from a `City` object.

### Files affected
| File | Action |
|---|---|
| `src/lib/mapUtils.ts` | **Create** |

### Exported functions
- `getCategoryColour(category: string): string` — returns a hex colour per activity category
- `buildAttractionPins(city: City): MapPin[]` — filters `thingsToDo` to those with coordinates
- `buildNeighbourhoodPins(city: City): MapPin[]` — filters `neighbourhoods` with coordinates
- `buildAreaPins(city: City): MapPin[]` — filters `areas` with coordinates
- `LAYER_CONFIG: LayerConfig[]` — array of `{ id, label, emoji, builder }` objects

### `MapPin` type
```
interface MapPin {
  lat: number;
  lng: number;
  label: string;
  category: string;
  description: string;
  icon: string;
  sectionId?: string;   // for scroll-to-section on popup click
}
```

### Acceptance criteria
- `buildAttractionPins(baliFixture)` returns an array of pins only for ThingsToDo with coordinates
- `buildAttractionPins(cityWithNoCoords)` returns `[]` without throwing
- `getCategoryColour("Cultural")` returns a non-empty hex string
- All categories in the existing data map to a colour (no fallback to `undefined`)

### Unit test requirement
File: `src/lib/__tests__/mapUtils.test.ts`  
Cover: `buildAttractionPins` with full fixture, with empty fixture. `getCategoryColour` for known and unknown categories.

### Performance requirement
`buildAttractionPins` for the largest city fixture completes in < 5ms.

### Rollback
Delete `src/lib/mapUtils.ts`. Not yet imported anywhere.

### Depends on
Task 4.1.

---

## Task 4.4 — Install Leaflet and react-leaflet
**Goal:** Install `leaflet`, `react-leaflet`, and `@types/leaflet`. Verify they import correctly in the Next.js App Router environment and fix any known SSR issues (Leaflet's default icon path problem).

### Files affected
| File | Action |
|---|---|
| `package.json` | **Edit** |
| `src/lib/leafletFix.ts` | **Create** (fixes default marker icon path for Next.js) |

### Acceptance criteria
- `npm install leaflet react-leaflet @types/leaflet` completes without errors
- `npm run build` succeeds — no Leaflet import errors in the build output
- The icon fix in `leafletFix.ts` (overriding `L.Icon.Default.prototype._getIconUrl`) does not produce errors when called from a client component
- A simple `<MapContainer>` imported with `next/dynamic` renders in a test page without hydration errors

### Unit test requirement
Build verification: `npm run build` exit code 0 is the test.

### Performance requirement
`leaflet` + `react-leaflet` add < 200KB to the client bundle (verified with `next build --analyze` if bundle analyzer is configured, otherwise check bundle output).

### Rollback
`npm uninstall leaflet react-leaflet @types/leaflet`. Delete `src/lib/leafletFix.ts`. Revert `package.json`.

### Depends on
Nothing (independent of other map tasks — run in parallel with 4.1–4.3).

---

## Task 4.5 — CityMapPopup component
**Goal:** Create `CityMapPopup.tsx` — the popup content card that renders inside a Leaflet `Popup` when a pin is clicked: icon, name, category badge, description (truncated to 80 chars), and a "View Details" link that smooth-scrolls to the relevant section.

### Files affected
| File | Action |
|---|---|
| `src/components/city/CityMapPopup.tsx` | **Create** |

### Props
```
interface Props {
  pin: MapPin;
  onViewDetails?: () => void;   // called before scroll to allow map to close
}
```

### Acceptance criteria
- Renders icon, label, category badge (styled as a pill), truncated description
- "View Details →" button fires `onViewDetails` then scrolls to `#[sectionId]`
- If `sectionId` is absent, "View Details" link is hidden
- Popup is styled with Tailwind classes (requires `ReactDOM.createPortal` or `renderToString` approach for Leaflet)
- Width is fixed at 220px — does not overflow the map on mobile

### Unit test requirement
Render test: given a full `MapPin` fixture, all fields render. Given a pin without `sectionId`, "View Details" is absent.

### Performance requirement
Popup renders in < 16ms.

### Rollback
Delete `CityMapPopup.tsx`. Not yet mounted.

### Depends on
Tasks 4.3, 4.4.

---

## Task 4.6 — CityMapLayerPills component
**Goal:** Create `CityMapLayerPills.tsx` — a row of toggle pill buttons that switch the active pin layer on the map (Attractions / Neighbourhoods / Areas).

### Files affected
| File | Action |
|---|---|
| `src/components/city/CityMapLayerPills.tsx` | **Create** |

### Props
```
interface Props {
  layers: LayerConfig[];        // from LAYER_CONFIG in mapUtils
  activeLayer: string;
  availableLayers: string[];    // only layers with ≥1 pin for this city
  onChange: (layerId: string) => void;
}
```

### Acceptance criteria
- Only layers with at least 1 pin for the current city are shown
- Active layer pill has accent background
- Inactive pills have border-only style
- Keyboard navigation: left/right arrow keys cycle through pills
- `onChange` fires on click and keyboard activation
- If only 1 layer is available, the pills row is hidden

### Unit test requirement
Render test: 3 layers available → 3 pills render. 1 layer → no pills. Click second pill → `onChange` called with its ID.

### Performance requirement
State update (layer switch) causes re-render in < 50ms.

### Rollback
Delete `CityMapLayerPills.tsx`. Not yet mounted.

### Depends on
Task 4.3.

---

## Task 4.7 — CityMap main component
**Goal:** Create the main `CityMap.tsx` client component that assembles `MapContainer`, `TileLayer`, pins as `Marker` + `Popup` components, `CityMapLayerPills`, and a fullscreen toggle button. Uses `next/dynamic` to avoid SSR.

### Files affected
| File | Action |
|---|---|
| `src/components/city/CityMap.tsx` | **Create** |

### Behaviour
- Centred on `city.coordinates` (if absent, renders a fallback message: "Map coming soon for [City]")
- Default zoom: 12 (city level)
- Default layer: "attractions"
- Switching layers re-renders pins for the selected set
- Pin click opens `CityMapPopup`
- Fullscreen button (`⛶`) toggles `position: fixed; inset: 0` on the map container
- "Open in Google Maps" link at bottom-right: `https://www.google.com/maps/search/[CityName]` (external, `target="_blank"`)
- Map tiles: OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`), attribution required
- `import 'leaflet/dist/leaflet.css'` is done inside this component (client-only CSS)

### Acceptance criteria
- Map renders on `/cities/bali` without hydration errors
- Switching layer pills updates visible pins without a full re-mount
- Clicking a pin opens a popup with the correct data
- Fullscreen toggle works on desktop and mobile
- "Map coming soon" renders for a city without coordinates (no crash)
- Component is wrapped in a `<section id="city-map">` with an `<h2>` for SEO

### Unit test requirement
Mock `react-leaflet` in tests (Leaflet requires a real DOM/browser).  
Test: given a city with coordinates and 3 attractions with coordinates, 3 markers are rendered.  
Test: given a city without coordinates, the fallback message renders.

### Performance requirement
- Map component JS added to page: < 200KB gzipped (shared with Leaflet from Task 4.4)
- Map `loading="lazy"` — does not block page load; initial load deferred until component enters viewport
- `next/dynamic` import must include a loading skeleton (visible during Leaflet load)

### Rollback
Delete `CityMap.tsx`. City page does not import it yet (added in Task 4.8).

### Depends on
Tasks 4.3, 4.4, 4.5, 4.6.

---

## Task 4.8 — Register Map section in CityTOC and CityQuickNav
**Goal:** Add a "Map" entry to the `SECTIONS` array in both `CityTOC.tsx` and `CityQuickNav.tsx`, conditioned on the city having `coordinates` defined.

### Files affected
| File | Action |
|---|---|
| `src/components/city/CityTOC.tsx` | **Edit** (add `{ id: 'city-map', label: 'Map', emoji: '🗺️' }` to `SECTIONS` and add condition: `return !!city.coordinates`) |
| `src/components/city/CityQuickNav.tsx` | **Edit** (same change) |

### Acceptance criteria
- "Map" entry appears in the TOC and QuickNav for Bali (has coordinates after Task 4.2)
- "Map" entry does not appear for a city without coordinates
- Clicking "Map" in the TOC smooth-scrolls to `#city-map`
- Active state in `CityTOC` highlights "Map" when the map section is in view
- `npm run build` passes with zero TypeScript errors

### Unit test requirement
Render test: `CityTOC` with a city that has `coordinates` → "Map" entry present. Without coordinates → absent.

### Performance requirement
No performance impact — change is in the render logic of a small component.

### Rollback
Revert both files with `git checkout`.

### Depends on
Task 4.2 (coordinates on cities), Task 4.7 (section ID must exist before TOC links to it — or order: add the section first in 4.9, then add TOC link in 4.8).

---

## Task 4.9 — Insert CityMap into the city page
**Goal:** Import `CityMap` (via `next/dynamic`) in `src/app/cities/[slug]/page.tsx` and insert it between `ThingsToDo` and `OffbeatPlaces`.

### Files affected
| File | Action |
|---|---|
| `src/app/cities/[slug]/page.tsx` | **Edit** (add `const CityMap = dynamic(...)` and mount `<CityMap city={city} />`) |

### Acceptance criteria
- Navigating to `/cities/bali` shows the map section below ThingsToDo
- The section heading "Explore Bali on the Map" is visible in the HTML source
- For cities without coordinates, nothing renders in that position (no error, no blank space)
- Lighthouse Performance score does not regress > 5 points vs Phase 3 baseline
- Core Web Vitals: LCP, CLS, and FID are within acceptable thresholds (CLS < 0.1)

### Unit test requirement
Page integration test: render the page for "bali", assert `<section id="city-map">` is present. Render for a city without coordinates, assert the section is absent.

### Performance requirement
- Map section uses `next/dynamic` with `loading={<MapSkeleton />}` — a static placeholder that occupies the correct height to prevent CLS
- `MapSkeleton` must be the same height as the map (400px desktop / 240px mobile) so there is zero CLS when Leaflet loads

### Rollback
Revert `page.tsx` with `git checkout src/app/cities/\\[slug\\]/page.tsx`. The map disappears but the page is fully functional.

### Depends on
Tasks 4.7, 4.8.

---

## Task 4.10 — TouristAttraction structured data for mapped POIs
**Goal:** Add `TouristAttraction` JSON-LD structured data to the city page for every `ThingToDo` that has `coordinates`, to give Google additional semantic signals about the attractions.

### Files affected
| File | Action |
|---|---|
| `src/app/cities/[slug]/page.tsx` | **Edit** (add a `<script type="application/ld+json">` block after the existing JSON-LD) |

### Schema shape (per attraction)
```json
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Tanah Lot Temple",
  "description": "Watch the sun melt into...",
  "address": { "@type": "PostalAddress", "addressLocality": "Bali", "addressCountry": "ID" },
  "geo": { "@type": "GeoCoordinates", "latitude": -8.621, "longitude": 115.087 }
}
```

### Acceptance criteria
- The JSON-LD block renders in the HTML source for Bali (has attractions with coordinates)
- No block renders for cities without any attractions with coordinates
- JSON is valid (parseable, no syntax errors)
- `addressCountry` is the ISO 3166-1 alpha-2 country code (add a `countryCode` field to `City` type or derive from `country` name via a lookup map)
- Google's Rich Results Test tool accepts the schema without errors

### Unit test requirement
Unit test: `buildTouristAttractionSchema(baliCity)` returns an array of valid objects. Assert that `@type` is "TouristAttraction", `geo.latitude` is a number, and the array length matches the number of ThingsToDo with coordinates.

### Performance requirement
Adds < 5KB to the HTML payload for the largest city (Bali has ~10 attractions with coordinates).

### Rollback
Revert `page.tsx`. Structured data is additive — removing it has no negative SEO effect.

### Depends on
Task 4.2 (coordinates on cities and their POIs).

---

### Phase 4 Summary

| Task | Est. Time | Parallelisable? |
|---|---|---|
| 4.1 Add coordinate types | 15 min | Yes (first) |
| 4.2 Add coordinates to 10 cities | 90 min | After 4.1 |
| 4.3 Map utility helpers | 45 min | After 4.1 |
| 4.4 Install Leaflet | 30 min | Yes (parallel with 4.1–4.3) |
| 4.5 CityMapPopup | 45 min | After 4.3, 4.4 |
| 4.6 CityMapLayerPills | 30 min | After 4.3 |
| 4.7 CityMap main component | 90 min | After 4.5, 4.6 |
| 4.8 Register in CityTOC + CityQuickNav | 30 min | After 4.2, 4.7 |
| 4.9 Insert into city page | 30 min | After 4.7, 4.8 |
| 4.10 TouristAttraction structured data | 45 min | After 4.2 (parallel with 4.5–4.7) |

**Frontend changes:** New components `CityMap`, `CityMapPopup`, `CityMapLayerPills`. Edits to `CityTOC`, `CityQuickNav`, `city/[slug]/page.tsx`. New `src/lib/mapUtils.ts`.  
**Backend changes:** None (tiles served by OSM).  
**Database changes:** None (coordinates added to static TypeScript files).  
**Testing strategy:** Unit tests for `mapUtils.ts`. Render tests mocking `react-leaflet`. Integration test for city page rendering with and without coordinates. Manual: open `/cities/bali` on desktop and mobile, verify map loads, pins click correctly, fullscreen works, layer switching works. Verify no hydration warnings in browser console. Run Lighthouse to confirm no CLS regression.

---

---

# Cross-Phase Testing Strategy

## Test types by layer

| Layer | Tool | Run on |
|---|---|---|
| Pure function unit tests | Jest | Every commit (CI) |
| React component render tests | `@testing-library/react` | Every commit (CI) |
| API route integration tests | Jest + `node-fetch` | Pull request |
| End-to-end smoke tests | Manual checklist (Playwright optional) | Before each phase deployment |
| Visual regression | Manual screenshot comparison | Before each phase deployment |
| Lighthouse audit | `next build` + Lighthouse CLI | Before each phase deployment |

## Regression test checklist (run before each phase ships)

- [ ] Homepage loads without errors
- [ ] `/cities/bali` renders all existing sections
- [ ] `/destinations` grid renders
- [ ] `/blog` listing renders
- [ ] `/plan` AI planner generates an itinerary
- [ ] Mobile navigation opens and closes
- [ ] Dark/light theme toggles correctly
- [ ] Affiliate links (Booking.com, Skyscanner) are present

## Performance budgets

| Metric | Budget |
|---|---|
| Lighthouse Performance (mobile) | ≥ 80 after each phase |
| First Contentful Paint | < 2.5s |
| Largest Contentful Paint | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| Total Blocking Time | < 300ms |
| JS bundle increase per phase | < 50KB gzipped (except Phase 4: < 200KB) |

---

# Rollback Runbook

In all cases, every task is on a separate git branch. The rollback for any phase is:

```
# Rollback a single task
git revert <commit-hash>

# Rollback an entire phase
git revert <phase-merge-commit>

# Emergency: revert to last known-good state
git checkout main
git reset --hard <last-good-tag>
```

**Vercel-specific:** Every Vercel deployment retains the previous build. In the Vercel dashboard: Deployments → select previous build → Promote to Production. This is a < 2-minute rollback for any phase.

No database migrations are involved in any phase (all data is static TypeScript). There is no risk of data loss on rollback.

---

# Dependency Graph Summary

```
Phase 1 (Similar Destinations)
  1.1 → 1.2 → 1.3 → 1.4 ─┐
                            ├→ 1.6 → 1.7
  1.5 ───────────────────┘      └→ 1.8

Phase 2 (Bookmarks)
  2.1 → 2.2 → 2.4
      → 2.9
  2.3 → 2.4
  2.1 → 2.6 → 2.7 → 2.8
  2.2 → 2.5

Phase 3 (PDF)
  3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6
            └→ 3.7 → 3.8 → 3.9
  3.4 + 3.8 → 3.10

Phase 4 (Maps)
  4.1 → 4.2 → 4.10
      → 4.3 ─┐
  4.4 ───────├→ 4.5 ─┐
             └→ 4.6 ─┴→ 4.7 → 4.8 → 4.9
```

Tasks with no incoming arrows in their phase are independently startable by a second engineer in parallel.
