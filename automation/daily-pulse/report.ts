// Daily Pulse — a light, every-day version of the Weekly Scorecard.
//
// Reuses scorecard/collect.ts's collectWeek() as-is, on the exact same
// rolling-window math (trailing 7 full days vs the 7 before, both ending 3
// days ago for GSC's reporting lag) — just recomputed every day instead of
// only Monday. That's deliberate, not a shortcut: TripGenius's daily click
// volume is small enough (single digits outside India) that a literal
// yesterday-vs-day-before comparison is mostly noise ("0 vs 1 click" reads as
// an "infinite%" swing). A 7-day rolling window refreshed daily smooths that
// out while still surfacing real trend shifts within a day of them forming.
//
// Adds one thing the weekly scorecard doesn't: a short plain-English read
// from Claude, so the numbers arrive with a "what does this actually mean"
// line instead of a bare table — this is the "connect GA/GSC to Claude"
// piece specifically.
//
// Usage:
//   npx tsx automation/daily-pulse/report.ts             # writes report.md, summary.json, appends history.csv
//   npx tsx automation/daily-pulse/report.ts --dry-run    # prints, writes nothing, skips the Claude call

import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { collectWeek, weekRanges, type WeekData } from '../scorecard/collect';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const REPORT_FILE = path.join(DIR, 'report.md');
const SUMMARY_FILE = path.join(DIR, 'summary.json');
const HISTORY_FILE = path.join(DIR, 'history.csv');

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

function delta(cur: number, prev: number): string {
  if (prev === 0 && cur === 0) return '—';
  const diff = cur - prev;
  const arrow = diff === 0 ? '＝' : diff > 0 ? '▲' : '▼';
  const rel = prev !== 0 ? ` ${diff > 0 ? '+' : ''}${((diff / prev) * 100).toFixed(0)}%` : '';
  return `${arrow}${rel}`;
}

function numbersBlock(cur: WeekData, prev: WeekData): string {
  const aiCur = cur.ga4.channels['AI'] ?? cur.ga4.channels['Organic AI'] ?? 0;
  const aiPrev = prev.ga4.channels['AI'] ?? prev.ga4.channels['Organic AI'] ?? 0;
  return [
    `GSC clicks: ${cur.gscTotal.clicks} (${delta(cur.gscTotal.clicks, prev.gscTotal.clicks)} vs prior 7 days)`,
    `GSC impressions: ${cur.gscTotal.impressions} (${delta(cur.gscTotal.impressions, prev.gscTotal.impressions)})`,
    `GSC CTR: ${pct(cur.gscTotal.ctr)} (was ${pct(prev.gscTotal.ctr)})`,
    `GSC avg position: ${cur.gscTotal.position.toFixed(1)} (was ${prev.gscTotal.position.toFixed(1)})`,
    `Pinterest sessions: ${cur.ga4.pinterestSessions} (${delta(cur.ga4.pinterestSessions, prev.ga4.pinterestSessions)})`,
    `Reddit sessions: ${cur.ga4.redditSessions} (${delta(cur.ga4.redditSessions, prev.ga4.redditSessions)})`,
    `AI-assistant sessions: ${aiCur} (${delta(aiCur, aiPrev)})`,
    `Engagement rate: ${pct(cur.ga4.engagementRate)} (was ${pct(prev.ga4.engagementRate)})`,
    `Top queries this window: ${cur.topQueries.slice(0, 5).map((q) => `"${q.keys[0]}" (${q.clicks}c/${q.impressions}i)`).join(', ') || 'none'}`,
    `Opportunities (impressions, 0 clicks, position ≤12): ${cur.opportunities.length}`,
  ].join('\n');
}

async function writeClaudesRead(numbers: string): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 300,
    system:
      'You are reading a daily analytics pulse for a small, early-stage travel-planning site ' +
      '(TripGenius, Indian-traveller audience). Traffic is genuinely tiny — read single-digit and ' +
      'low-double-digit numbers as normal, not alarming, and never manufacture excitement or panic ' +
      'that the data does not support. Write 3-5 plain-English sentences: what actually moved, ' +
      'whether it is a real signal or noise given the volume, and ONE concrete, specific next action ' +
      'if the data genuinely suggests one (skip the action if nothing concrete stands out — do not ' +
      'invent generic advice). No headers, no bullet points, no emoji, just prose.',
    messages: [{ role: 'user', content: `Today's rolling 7-day-vs-prior-7-day numbers:\n\n${numbers}` }],
  });
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim() || null;
}

function buildReport(cur: WeekData, prev: WeekData, claudesRead: string | null): string {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];
  lines.push(`# 📈 TripGenius Daily Pulse — ${today}`);
  lines.push('');
  lines.push(`_Rolling 7-day window ending ${cur.label.split(' → ')[1]}, vs the 7 days before that._`);
  lines.push('');
  if (claudesRead) {
    lines.push('## Claude\'s read');
    lines.push('');
    lines.push(claudesRead);
    lines.push('');
  }
  lines.push('## Numbers');
  lines.push('');
  lines.push(numbersBlock(cur, prev).split('\n').map((l) => `- ${l}`).join('\n'));
  lines.push('');
  return lines.join('\n');
}

function appendHistory(cur: WeekData): void {
  const header = 'date,gsc_clicks,gsc_impressions,gsc_ctr,gsc_position,pinterest_sessions,reddit_sessions,engagement_rate\n';
  const today = new Date().toISOString().slice(0, 10);
  const row = [
    today,
    cur.gscTotal.clicks,
    cur.gscTotal.impressions,
    cur.gscTotal.ctr.toFixed(4),
    cur.gscTotal.position.toFixed(1),
    cur.ga4.pinterestSessions,
    cur.ga4.redditSessions,
    cur.ga4.engagementRate.toFixed(4),
  ].join(',') + '\n';

  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, header);
  const existing = fs.readFileSync(HISTORY_FILE, 'utf-8');
  if (existing.includes(`\n${today},`) || existing.startsWith(`${today},`)) {
    console.log(`history.csv already has a row for ${today} — skipping append`);
    return;
  }
  fs.appendFileSync(HISTORY_FILE, row);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const { current, previous } = weekRanges();
  console.log(`Collecting: current ${current.join(' → ')}, previous ${previous.join(' → ')}`);

  const [cur, prev] = await Promise.all([collectWeek(current), collectWeek(previous)]);
  const numbers = numbersBlock(cur, prev);
  const claudesRead = dryRun ? null : await writeClaudesRead(numbers);
  const report = buildReport(cur, prev, claudesRead);

  if (dryRun) {
    console.log('\n--- DRY RUN — report below, nothing written ---\n');
    console.log(report);
    return;
  }

  fs.writeFileSync(REPORT_FILE, report);
  appendHistory(cur);
  fs.writeFileSync(SUMMARY_FILE, JSON.stringify({
    title: `Daily pulse: ${cur.gscTotal.clicks} clicks, ${cur.ga4.engagementRate ? pct(cur.ga4.engagementRate) : '—'} engagement (rolling 7d)`,
    detail: claudesRead ?? numbers,
  }, null, 2));
  console.log(`Wrote ${REPORT_FILE}, ${SUMMARY_FILE}, updated history.csv`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
