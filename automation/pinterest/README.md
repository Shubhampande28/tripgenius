# Pinterest Pin Factory

Generates 1000×1500 pin images from the site's own itinerary/month-page data
(satori + resvg — no Canva, no browser) and publishes 1 pin per weekday at
20:00 IST via the Pinterest API v5.

- `build-queue.ts` — rebuilds `queue.json` from site data; GSC-priority
  itineraries first, then remaining itineraries, then authored month pages.
  Re-running preserves `posted` status.
- `render.ts` — two templates, alternated per pin for later A/B comparison:
  **A** full-bleed photo + gradient, **B** dark color block + photo bottom half.
  Fonts (Poppins) are committed in `fonts/`. Test: `npx tsx automation/pinterest/render.ts brazil-5-days`
- `publish.ts` — ensures boards exist, renders the next pending entry, POSTs
  `/v5/pins` (base64 upload), marks it posted. UTM-tagged links
  (`utm_source=pinterest`) so the scorecard can attribute sessions.
  On auth errors the workflow opens a "Pinterest token expired" issue; on 429s
  the run simply skips and the next cron slot retries.

Boards: *Day-by-Day Itineraries* (itinerary pins), *Best Time to Visit* (month
pins), *Budget Travel from India* (created for manual use).

Dry run (renders image, prints API payload, posts nothing):

```sh
npx tsx automation/pinterest/publish.ts --dry-run --slug=brazil-5-days
```
