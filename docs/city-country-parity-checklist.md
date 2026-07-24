# City and Country Feature-Parity Checklist

Reference city guides: Bali, Bangkok, Dubai, Goa, Paris, and Tokyo.

## Architecture and data integrity

- [x] Define one canonical city-guide chronology.
- [x] Define one canonical country-hub chronology.
- [x] Attach every city to exactly one country hub.
- [x] Normalize country-label aliases without changing public URLs.
- [x] Track whether section content is authored or safely derived.
- [x] Keep fabricated businesses out of visible copy and structured data.

## City guides (303)

- [x] Move Top Things to Do before the Where to Go & What to Do area module.
- [x] Retain the map module and allow Map Data Coming Soon where coordinates are absent.
- [x] Show safe Hidden Gems guidance for every city.
- [x] Show safe food guidance for every city.
- [x] Show safe local transport guidance for every city.
- [x] Show safe practical tips for every city.
- [x] Show an FAQ module for every city.
- [x] Show authored articles or useful planning-resource fallbacks for every city.
- [x] Show a country-hub module even when a country has only one city.
- [x] Keep authored-only schema rules for hotels, restaurants, and FAQs.
- [x] Keep incomplete pages noindexed until their editorial quality threshold is met.

## Country hubs (49)

- [x] Keep the same section order on every country hub.
- [x] Show top experiences and destinations on every hub.
- [x] Show itineraries on every hub.
- [x] Show authored articles or planning-resource fallbacks on every hub.
- [x] Show destination groupings on every hub.
- [x] Show budget and seasonal guidance on every hub.
- [x] Show visa/travel essentials and FAQs on every hub.
- [x] Show related countries on every hub.

## Validation

- [x] Add a repository-wide city/country completeness validator.
- [x] Assert unique city and country slugs.
- [x] Assert every country city reference resolves.
- [x] Assert every city belongs to exactly one country.
- [x] Assert every city has the canonical baseline sections/data.
- [x] Assert all local card and hero images resolve.
- [x] Run targeted ESLint and TypeScript.
- [x] Run unit tests.
- [x] Run the complete production build.
- [x] Inspect representative authored, derived, stub, single-city-country, and missing-map pages.
