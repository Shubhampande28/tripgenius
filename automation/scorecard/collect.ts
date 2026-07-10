// Weekly marketing scorecard — data collection.
// Pulls Search Console + GA4 for the last 7 full days and the 7 days before,
// so report.ts can render week-over-week deltas. GSC data lags ~2–3 days, so
// "last 7 full days" ends 3 days ago.
//
// Auth: service account JSON, base64-encoded in env GOOGLE_SA_KEY. The service
// account email must be added as a user in GSC (Full) and GA4 (Viewer).

import { JWT } from 'google-auth-library';

const SITE = 'https://www.tripgenius.in/';
const GSC_ENDPOINT =
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;

export interface GscTotals {
  clicks: number;
  impressions: number;
  ctr: number;      // 0..1
  position: number;
}

export interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface Ga4Channels {
  /** sessions keyed by channel group (Organic Search, Direct, …) */
  channels: Record<string, number>;
  redditSessions: number;
  pinterestSessions: number;
  engagementRate: number;          // 0..1
  avgEngagementSeconds: number;
  landingPages: { page: string; sessions: number; engagementSeconds: number }[];
}

export interface WeekData {
  label: string;                   // "2026-06-29 → 2026-07-05"
  gscTotal: GscTotals;
  gscItinerary: GscTotals;
  gscVisit: GscTotals;
  topQueries: GscRow[];
  topPages: GscRow[];
  /** 20+ impressions, 0 clicks, position <= 12 — the "one push from clicks" set */
  opportunities: GscRow[];
  ga4: Ga4Channels;
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export function weekRanges(): { current: [string, string]; previous: [string, string] } {
  // GSC lag buffer: window ends 3 days ago.
  return {
    current: [isoDaysAgo(9), isoDaysAgo(3)],
    previous: [isoDaysAgo(16), isoDaysAgo(10)],
  };
}

function loadServiceAccount(): { client_email: string; private_key: string } {
  const b64 = process.env.GOOGLE_SA_KEY;
  if (!b64) throw new Error('GOOGLE_SA_KEY env var is not set (base64-encoded service-account JSON)');
  const json = Buffer.from(b64, 'base64').toString('utf-8');
  return JSON.parse(json);
}

async function accessToken(scopes: string[]): Promise<string> {
  const sa = loadServiceAccount();
  const jwt = new JWT({ email: sa.client_email, key: sa.private_key, scopes });
  const { token } = await jwt.getAccessToken();
  if (!token) throw new Error('Failed to obtain Google access token');
  return token;
}

async function gscQuery(token: string, body: Record<string, unknown>): Promise<GscRow[]> {
  const res = await fetch(GSC_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GSC query failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return (data.rows ?? []) as GscRow[];
}

function totalsOf(rows: GscRow[]): GscTotals {
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  // Weight avg position by impressions.
  const position = impressions
    ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions
    : 0;
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

async function gscForRange(token: string, [start, end]: [string, string]) {
  const base = { startDate: start, endDate: end };
  const pathFilter = (contains: string) => ({
    dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'contains', expression: contains }] }],
  });

  // Date-dimension rows give exact totals without a row cap issue.
  const [byDate, itByDate, visitByDate, topQueries, topPages, queryRows] = await Promise.all([
    gscQuery(token, { ...base, dimensions: ['date'], rowLimit: 25000 }),
    gscQuery(token, { ...base, dimensions: ['date'], rowLimit: 25000, ...pathFilter('/itinerary/') }),
    gscQuery(token, { ...base, dimensions: ['date'], rowLimit: 25000, ...pathFilter('/visit/') }),
    gscQuery(token, { ...base, dimensions: ['query'], rowLimit: 10, orderBy: undefined }),
    gscQuery(token, { ...base, dimensions: ['page'], rowLimit: 10 }),
    gscQuery(token, { ...base, dimensions: ['query'], rowLimit: 5000 }),
  ]);

  const opportunities = queryRows
    .filter((r) => r.impressions >= 20 && r.clicks === 0 && r.position <= 12)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);

  return {
    gscTotal: totalsOf(byDate),
    gscItinerary: totalsOf(itByDate),
    gscVisit: totalsOf(visitByDate),
    topQueries,
    topPages,
    opportunities,
  };
}

async function ga4Report(token: string, propertyId: string, body: Record<string, unknown>) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(`GA4 runReport failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function ga4ForRange(token: string, [start, end]: [string, string]): Promise<Ga4Channels> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) throw new Error('GA4_PROPERTY_ID env var is not set');
  const dateRanges = [{ startDate: start, endDate: end }];

  const [channels, sources, engagement, landing] = await Promise.all([
    ga4Report(token, propertyId, {
      dateRanges,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
    }),
    ga4Report(token, propertyId, {
      dateRanges,
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
    }),
    ga4Report(token, propertyId, {
      dateRanges,
      metrics: [{ name: 'engagementRate' }, { name: 'userEngagementDuration' }, { name: 'activeUsers' }],
    }),
    ga4Report(token, propertyId, {
      dateRanges,
      dimensions: [{ name: 'landingPage' }],
      metrics: [{ name: 'sessions' }, { name: 'userEngagementDuration' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    }),
  ]);

  const channelMap: Record<string, number> = {};
  for (const row of channels.rows ?? []) {
    channelMap[row.dimensionValues[0].value] = Number(row.metricValues[0].value);
  }

  let reddit = 0;
  let pinterest = 0;
  for (const row of sources.rows ?? []) {
    const src = String(row.dimensionValues[0].value).toLowerCase();
    const sessions = Number(row.metricValues[0].value);
    if (src.includes('reddit')) reddit += sessions;
    if (src.includes('pinterest')) pinterest += sessions;
  }

  const engRow = engagement.rows?.[0];
  const engagementRate = engRow ? Number(engRow.metricValues[0].value) : 0;
  const totalEngagement = engRow ? Number(engRow.metricValues[1].value) : 0;
  const activeUsers = engRow ? Number(engRow.metricValues[2].value) : 0;

  return {
    channels: channelMap,
    redditSessions: reddit,
    pinterestSessions: pinterest,
    engagementRate,
    avgEngagementSeconds: activeUsers ? totalEngagement / activeUsers : 0,
    landingPages: (landing.rows ?? []).map((row: any) => ({
      page: row.dimensionValues[0].value,
      sessions: Number(row.metricValues[0].value),
      engagementSeconds: Number(row.metricValues[1].value),
    })),
  };
}

export async function collectWeek(range: [string, string]): Promise<WeekData> {
  const gscToken = await accessToken(['https://www.googleapis.com/auth/webmasters.readonly']);
  const ga4Token = await accessToken(['https://www.googleapis.com/auth/analytics.readonly']);
  const gsc = await gscForRange(gscToken, range);
  const ga4 = await ga4ForRange(ga4Token, range);
  return { label: `${range[0]} → ${range[1]}`, ...gsc, ga4 };
}
