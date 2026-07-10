// Weekly marketing scorecard — report generation.
//
// Usage:
//   npx tsx automation/scorecard/report.ts             # writes report.md + appends history.csv
//   npx tsx automation/scorecard/report.ts --dry-run   # prints, writes nothing
//
// The GitHub Action turns report.md into the weekly scorecard issue and
// commits history.csv so a trendline accumulates in the repo.

import fs from 'node:fs';
import path from 'node:path';
import { collectWeek, weekRanges, type WeekData, type GscTotals } from './collect';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const REPORT_FILE = path.join(DIR, 'report.md');
const HISTORY_FILE = path.join(DIR, 'history.csv');

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const pos = (n: number) => n.toFixed(1);

function delta(cur: number, prev: number, opts: { invert?: boolean } = {}): string {
  if (prev === 0 && cur === 0) return '—';
  const diff = cur - prev;
  const up = opts.invert ? diff < 0 : diff > 0;
  const arrow = diff === 0 ? '＝' : up ? '▲' : '▼';
  const rel = prev !== 0 ? ` (${diff > 0 ? '+' : ''}${((diff / prev) * 100).toFixed(0)}%)` : '';
  return `${arrow}${rel}`;
}

function headlineRow(label: string, cur: number, prev: number, fmt: (n: number) => string, invert = false) {
  return `| ${label} | ${fmt(cur)} | ${fmt(prev)} | ${delta(cur, prev, { invert })} |`;
}

function gscTable(rows: WeekData['topQueries'], keyHeader: string): string {
  if (rows.length === 0) return '_No data._';
  const lines = [
    `| ${keyHeader} | Clicks | Impressions | CTR | Position |`,
    '|---|---:|---:|---:|---:|',
  ];
  for (const r of rows) {
    const key = r.keys[0].replace(/^https:\/\/www\.tripgenius\.in/, '');
    lines.push(`| ${key} | ${r.clicks} | ${r.impressions} | ${pct(r.ctr)} | ${pos(r.position)} |`);
  }
  return lines.join('\n');
}

function anomalies(cur: WeekData, prev: WeekData): string[] {
  const out: string[] = [];
  if (prev.gscTotal.clicks > 0) {
    const drop = (prev.gscTotal.clicks - cur.gscTotal.clicks) / prev.gscTotal.clicks;
    if (drop > 0.3) {
      out.push(`🚨 GSC clicks dropped ${(drop * 100).toFixed(0)}% week-over-week (${prev.gscTotal.clicks} → ${cur.gscTotal.clicks}).`);
    }
  }
  const curPagesWithClicks = new Set(cur.topPages.filter((p) => p.clicks > 0).map((p) => p.keys[0]));
  for (const p of prev.topPages) {
    if (p.clicks > 0 && !curPagesWithClicks.has(p.keys[0])) {
      out.push(`⚠️ ${p.keys[0].replace('https://www.tripgenius.in', '')} had ${p.clicks} click(s) last week, zero this week.`);
    }
  }
  return out;
}

function buildReport(cur: WeekData, prev: WeekData): string {
  const g = (t: GscTotals) => t;
  const lines: string[] = [];
  lines.push(`# 📊 TripGenius Scorecard — week of ${cur.label}`);
  lines.push('');
  lines.push(`_Compared with ${prev.label}. GSC windows end 3 days ago to allow for reporting lag._`);
  lines.push('');
  lines.push('## Headline');
  lines.push('');
  lines.push('| Metric | This week | Last week | Δ |');
  lines.push('|---|---:|---:|---|');
  lines.push(headlineRow('GSC clicks', g(cur.gscTotal).clicks, g(prev.gscTotal).clicks, String));
  lines.push(headlineRow('GSC impressions', cur.gscTotal.impressions, prev.gscTotal.impressions, String));
  lines.push(headlineRow('GSC CTR', cur.gscTotal.ctr, prev.gscTotal.ctr, pct));
  lines.push(headlineRow('GSC avg position', cur.gscTotal.position, prev.gscTotal.position, pos, true));
  lines.push(headlineRow('/itinerary/ CTR', cur.gscItinerary.ctr, prev.gscItinerary.ctr, pct));
  lines.push(headlineRow('/visit/ CTR', cur.gscVisit.ctr, prev.gscVisit.ctr, pct));
  lines.push(headlineRow('Pinterest sessions', cur.ga4.pinterestSessions, prev.ga4.pinterestSessions, String));
  lines.push(headlineRow('Reddit sessions', cur.ga4.redditSessions, prev.ga4.redditSessions, String));
  const aiCur = cur.ga4.channels['AI'] ?? cur.ga4.channels['Organic AI'] ?? 0;
  const aiPrev = prev.ga4.channels['AI'] ?? prev.ga4.channels['Organic AI'] ?? 0;
  lines.push(headlineRow('AI-assistant sessions', aiCur, aiPrev, String));
  lines.push(headlineRow('Engagement rate', cur.ga4.engagementRate, prev.ga4.engagementRate, pct));
  lines.push('');

  lines.push('## Sessions by channel');
  lines.push('');
  lines.push('| Channel | This week | Last week |');
  lines.push('|---|---:|---:|');
  const allChannels = new Set([...Object.keys(cur.ga4.channels), ...Object.keys(prev.ga4.channels)]);
  for (const ch of [...allChannels].sort((a, b) => (cur.ga4.channels[b] ?? 0) - (cur.ga4.channels[a] ?? 0))) {
    lines.push(`| ${ch} | ${cur.ga4.channels[ch] ?? 0} | ${prev.ga4.channels[ch] ?? 0} |`);
  }
  lines.push('');

  lines.push('## Opportunities — impressions but zero clicks (position ≤ 12, ≥ 20 impressions)');
  lines.push('');
  lines.push(cur.opportunities.length ? gscTable(cur.opportunities, 'Query') : '_None this week._');
  lines.push('');

  const anom = anomalies(cur, prev);
  lines.push('## Anomalies');
  lines.push('');
  lines.push(anom.length ? anom.map((a) => `- ${a}`).join('\n') : '_None detected._');
  lines.push('');

  lines.push('## Top queries');
  lines.push('');
  lines.push(gscTable(cur.topQueries, 'Query'));
  lines.push('');
  lines.push('## Top pages');
  lines.push('');
  lines.push(gscTable(cur.topPages, 'Page'));
  lines.push('');
  lines.push('## Top landing pages (GA4)');
  lines.push('');
  lines.push('| Landing page | Sessions | Engagement (s, total) |');
  lines.push('|---|---:|---:|');
  for (const lp of cur.ga4.landingPages) {
    lines.push(`| ${lp.page} | ${lp.sessions} | ${Math.round(lp.engagementSeconds)} |`);
  }
  lines.push('');
  return lines.join('\n');
}

function appendHistory(cur: WeekData): void {
  const header = 'week_start,gsc_clicks,gsc_impressions,gsc_ctr,gsc_position,itinerary_ctr,visit_ctr,pinterest_sessions,reddit_sessions,engagement_rate\n';
  const weekStart = cur.label.split(' ')[0];
  const row = [
    weekStart,
    cur.gscTotal.clicks,
    cur.gscTotal.impressions,
    cur.gscTotal.ctr.toFixed(4),
    cur.gscTotal.position.toFixed(1),
    cur.gscItinerary.ctr.toFixed(4),
    cur.gscVisit.ctr.toFixed(4),
    cur.ga4.pinterestSessions,
    cur.ga4.redditSessions,
    cur.ga4.engagementRate.toFixed(4),
  ].join(',') + '\n';

  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, header);
  const existing = fs.readFileSync(HISTORY_FILE, 'utf-8');
  if (existing.includes(`\n${weekStart},`) || existing.startsWith(`${weekStart},`)) {
    console.log(`history.csv already has a row for ${weekStart} — skipping append`);
    return;
  }
  fs.appendFileSync(HISTORY_FILE, row);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const { current, previous } = weekRanges();
  console.log(`Collecting: current ${current.join(' → ')}, previous ${previous.join(' → ')}`);

  const [cur, prev] = await Promise.all([collectWeek(current), collectWeek(previous)]);
  const report = buildReport(cur, prev);

  if (dryRun) {
    console.log('\n--- DRY RUN — report below, nothing written ---\n');
    console.log(report);
    return;
  }
  fs.writeFileSync(REPORT_FILE, report);
  appendHistory(cur);
  console.log(`Wrote ${REPORT_FILE} and updated history.csv`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
