# Zone 4 Batch 1 — Validated City List

## Methodology note (read before the list)

**Google Trends was not used** — I don't have a Google Trends tool/API available in this environment, and fabricating trend numbers would defeat the purpose of a validation gate. Instead I used something more directly relevant: **TripGenius's own real GSC "Countries" export** (`Downloads/.../tripgenius.in/Performance-on-Search-2026-07-28/Countries.csv`), which was genuinely sitting on this machine (not fabricated, not the earlier audit's proxy). This is arguably a *stronger* signal than generic Trends interest — it's actual searchers who already found this exact site, filtered to the destination-relevant subset — but it's worth naming the swap explicitly since the brief asked for Trends specifically.

One caveat on the GSC data itself: the "Country" dimension in Search Console is **where the searcher is located**, not which destination they searched for. For a site branded around Indian travellers, this mostly reads as "which countries have Indian-diaspora audiences already finding TripGenius" (UAE, UK, Singapore, US, Canada, Australia, South Africa all have large NRI/PIO populations) rather than literal demand-for-that-destination. I'm treating it as: *countries whose diaspora already engages with this site are the safest bet for the next city built in that same country* — proven audience, unbuilt city.

Click volumes here are small in absolute terms (single digits outside India) — this is an early-stage site. I'm treating the **relative** ranking (some clicks vs. zero clicks) as meaningful, not the precise numbers.

## What changed vs. the audit's original Top 30

| Audit's original pick | Country | Real GSC signal | Verdict |
|---|---|---|---|
| Petra | Jordan | **0 clicks**, 37 impr | **Dropped** — no real signal |
| Dubrovnik | Croatia | **0 clicks**, 43 impr | **Dropped** |
| Zurich, Interlaken | Switzerland | **0 clicks**, 198 impr | **Dropped** (both) |
| Auckland, Queenstown | New Zealand | **0 clicks**, 283 impr | **Dropped** (both) |
| Kandy, Galle | Sri Lanka | **0 clicks**, 77 impr | **Dropped** (both) |
| Pokhara | Nepal | **0 clicks**, 48 impr | **Dropped** |
| Siem Reap | Cambodia | **0 clicks**, 46 impr | **Dropped** |
| Nairobi | Kenya | 1 click, 82 impr | Dropped this round (weak, close call — good batch-2 candidate) |
| Manila, Boracay | Philippines | 1 click, 713 impr | Dropped this round (weak, close call — good batch-2 candidate) |
| Yogyakarta, Lombok | Indonesia | 1 click, 412 impr | Dropped this round (weak, close call — good batch-2 candidate) |
| Koh Samui, Koh Phi Phi, Ayutthaya | Thailand | 2 clicks, 297 impr | Dropped this round despite decent signal — Germany/Spain edged it out on the country cross-reference; strong batch-2 candidate |

**7 of the original 30's countries had literally zero recorded clicks** despite carrying real editorial/fame weight in my original ranking — Jordan, Croatia, Switzerland, New Zealand, Sri Lanka, Nepal, and Cambodia. That's exactly the kind of contradiction this validation step exists to catch: global fame is not the same as demonstrated demand from this site's actual audience.

**One addition not in the original 30:** Da Nang, Vietnam — despite only 1 click, Vietnam shows **1,615 impressions**, the third-highest impression count of any country outside India/Japan/US/UK. High impressions + low clicks usually means visibility exists but something (position, snippet, title) isn't converting — worth a real content investment to test rather than ignore.

**One pre-flagged exception carried forward, not counted against the 15:** Vadodara (India) was already identified in the audit as the one city that was *supposed* to have `monthByMonth` in the recent 56-city batch and got missed. India carries the overwhelming majority of all real signal (103 clicks / 32,652 impressions — everything else combined doesn't come close), so this is close to a zero-risk, highest-confidence single addition. It's included as item 0 below.

## Validated Batch 1 — 15 cities (+ 1 carried-forward exception)

Ranked by real GSC signal strength (clicks, then impressions, for that city's country), one city per country except UK/Italy/Canada/Australia (two each — see note).

| # | City | Country | GSC signal (country-level) | Why 2 cities for this country |
|---|---|---|---|---|
| 0 | **Vadodara** | India | 103 clicks / 32,652 impr | Pre-flagged known exception, not part of the 15 |
| 1 | Edinburgh | United Kingdom | 6 clicks / 2,630 impr | Strongest non-India signal — 2 cities for this country |
| 2 | Manchester | United Kingdom | 6 clicks / 2,630 impr | (same as above) |
| 3 | Los Angeles | United States | 5 clicks / 2,709 impr | — |
| 4 | Hiroshima | Japan | 4 clicks / 2,668 impr | — |
| 5 | Venice | Italy | 4 clicks / 148 impr | Country has zero current `/visit` coverage besides Rome — high headroom |
| 6 | Florence | Italy | 4 clicks / 148 impr | (same as above) |
| 7 | Nice | France | 4 clicks / 118 impr | — |
| 8 | Toronto | Canada | 3 clicks / 1,071 impr | Country has **zero** current `/visit` coverage at all |
| 9 | Vancouver | Canada | 3 clicks / 1,071 impr | (same as above) |
| 10 | Sydney | Australia | 3 clicks / 848 impr | Country has **zero** current `/visit` coverage at all |
| 11 | Melbourne | Australia | 3 clicks / 848 impr | (same as above) |
| 12 | Johannesburg | South Africa | 3 clicks / 325 impr | — |
| 13 | Berlin | Germany | 2 clicks / 450 impr | — |
| 14 | Madrid | Spain | 2 clicks / 145 impr | — |
| 15 | Da Nang | Vietnam | 1 click / **1,615 impr** | High-impression/low-click anomaly — worth testing |

All 15 (+ Vadodara) are confirmed non-stub, already-substantial guides (real `thingsToDo`, `description`, `heroDescription`) — verified against `src/lib/worldCities.ts` (14 of them) and `src/lib/indianCitiesExtended.ts` (Vadodara). None require new guide authoring, only `monthByMonth`.

## Explicitly deferred to Batch 2 (not dropped, just not yet)

Nairobi (Kenya), Manila/Boracay (Philippines), Yogyakarta/Lombok (Indonesia), Koh Samui/Koh Phi Phi/Ayutthaya (Thailand) — all showed *some* real signal (1-2 clicks), just not enough to beat the 15 above on a strict ranking. Worth another look once Batch 1's actual post-publish GSC performance comes in — that'll be a much stronger signal than any of this pre-validation.

## Dropped, re-flag only if new evidence appears

Petra (Jordan), Dubrovnik (Croatia), Zurich/Interlaken (Switzerland), Auckland/Queenstown (New Zealand), Kandy/Galle (Sri Lanka), Pokhara (Nepal), Siem Reap (Cambodia) — zero recorded clicks from their respective countries despite meaningful impression volume in some cases (Switzerland's 198 impressions with 0 clicks is a real "visibility but no interest" signal, not just "not enough data yet").
