// Ingest endpoint for automation events from outside the VPS — the GitHub
// Actions pipelines POST their run results here so the /admin dashboard and
// email notifications cover everything, not just what runs on this server.
//
// Auth: Authorization: Bearer <CRON_SECRET> (same secret as /api/social/daily).
//
//   curl -X POST https://www.tripgenius.in/api/admin/log \
//     -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
//     -d '{"source":"reddit","status":"ok","title":"Weekly digest created","url":"..."}'

import { NextResponse } from 'next/server';
import { notify } from '@/lib/notify';
import type { ActivitySource } from '@/lib/activityLog';

const SOURCES: ActivitySource[] = [
  'instagram', 'pinterest', 'reddit', 'scorecard', 'seo-watchdog', 'news', 'deploy', 'other',
];

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }
  const auth = request.headers.get('authorization') ?? '';
  if (auth.replace(/^Bearer\s+/i, '').trim() !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const source = SOURCES.includes(body.source as ActivitySource)
    ? (body.source as ActivitySource)
    : 'other';
  const status = body.status === 'error' ? 'error' : body.status === 'skipped' ? 'skipped' : 'ok';
  const title = String(body.title ?? '').slice(0, 200);
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

  await notify({
    source,
    status,
    title,
    detail: body.detail ? String(body.detail).slice(0, 2000) : undefined,
    url: body.url ? String(body.url).slice(0, 500) : undefined,
  });

  return NextResponse.json({ ok: true });
}
