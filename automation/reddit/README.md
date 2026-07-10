# Reddit Opportunity Scanner

Finds fresh Reddit threads that TripGenius pages can genuinely answer, matches
each to the single best page (city+month page > itinerary > city hub), and
drafts a reply with Claude grounded **only** in that page's real data.

## This tool drafts only — posting is manual by design

Auto-posting gets accounts banned and destroys the authenticity that makes
Reddit answers work. The weekly digest issue gives you the thread, the matched
page, a confidence score, and a copyable draft. Before posting:

- **Personalize every draft** — add a detail from your own experience, react to
  something specific in the thread.
- **Max 3–4 link-answers per week.**
- **Keep answering some threads WITHOUT links** to maintain account health.

## How it works

- `scan.ts` — searches 8 travel subreddits for last-7-days question threads
  matching patterns derived from the live page inventory (countries, authored
  city+month pages). Filters: score ≥ 2 or ≥ 3 comments, question-shaped title,
  not in `seen.json`. Uses the authenticated script-app API when Reddit creds
  are set; public JSON endpoints otherwise.
- `draft.ts` — matches threads to pages by term overlap (drops anything below
  confidence 3 — a bad link suggestion is worse than none), then asks Claude
  (`claude-sonnet-4-6`) for a 5–8 line answer using only the page's data; the
  model outputs `SKIP` when the data can't genuinely answer.

Run locally: `npx tsx automation/reddit/draft.ts --dry-run`
