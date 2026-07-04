// Daily social-posting cron. Vercel Cron calls this route (see vercel.json);
// it posts today's queue to Pinterest and a smaller slice to Instagram.
//
// Auth: requires `Authorization: Bearer <CRON_SECRET>` — Vercel Cron adds this
// automatically when the CRON_SECRET env var is set. You can also trigger it
// manually:  curl -H "Authorization: Bearer $CRON_SECRET" \
//              "https://www.tripgenius.in/api/social/daily?dry=1"
//
// Env:
//   CRON_SECRET               — shared secret (required)
//   PINTEREST_ACCESS_TOKEN    — Pinterest API token (pins:write)
//   PINTEREST_BOARD_ID        — target board
//   SOCIAL_PINS_PER_DAY       — Pinterest pins per run (default 10)
//   SOCIAL_IG_PER_DAY         — Instagram posts per run (default 1; IG is far
//                               stricter about repetitive promotional posts)
//   INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_BUSINESS_ACCOUNT_ID — existing IG setup
//
// ?dry=1 returns the queue without posting — use it to preview any day.

import { NextResponse } from 'next/server';
import { buildDailyQueue } from '@/lib/socialQueue';
import { createPin } from '@/lib/pinterestPublisher';
import { publishInstagramImagePost } from '@/lib/instagramPublisher';

export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }
  const auth = request.headers.get('authorization') ?? '';
  if (auth.replace(/^Bearer\s+/i, '').trim() !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const dry = url.searchParams.get('dry') === '1';
  const pinsPerDay = Math.min(Number(process.env.SOCIAL_PINS_PER_DAY ?? 10) || 10, 25);
  const igPerDay = Math.min(Number(process.env.SOCIAL_IG_PER_DAY ?? 1) || 1, 3);

  const queue = buildDailyQueue(new Date(), pinsPerDay);

  if (dry) {
    return NextResponse.json({ dry: true, pinsPerDay, igPerDay, queue });
  }

  const results: { platform: string; city: string; style: string; ok: boolean; id?: string; error?: string }[] = [];

  // Pinterest — whole queue
  for (const item of queue) {
    try {
      const { id } = await createPin({
        title: item.title,
        description: item.description,
        link: item.link,
        imageUrl: item.imageUrl,
      });
      results.push({ platform: 'pinterest', city: item.citySlug, style: item.style, ok: true, id });
    } catch (e) {
      results.push({ platform: 'pinterest', city: item.citySlug, style: item.style, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Instagram — first N items only (IG uses the square places image; its API
  // rejects 2:3 portraits and its spam systems dislike high-volume promo posts)
  const igConfigured = Boolean(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
  if (igConfigured) {
    for (const item of queue.slice(0, igPerDay)) {
      try {
        const { id } = await publishInstagramImagePost({ imageUrl: item.igImageUrl, caption: item.igCaption });
        results.push({ platform: 'instagram', city: item.citySlug, style: item.style, ok: true, id });
      } catch (e) {
        results.push({ platform: 'instagram', city: item.citySlug, style: item.style, ok: false, error: e instanceof Error ? e.message : String(e) });
      }
    }
  }

  const failed = results.filter(r => !r.ok).length;
  return NextResponse.json({ posted: results.length - failed, failed, igConfigured, results });
}
