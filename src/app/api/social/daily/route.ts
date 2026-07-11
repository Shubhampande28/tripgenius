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
import { buildDailyQueue, buildInstagramSlotPost, IG_SLOTS, type IgSlot } from '@/lib/socialQueue';
import { createPin } from '@/lib/pinterestPublisher';
import { publishInstagramImagePost } from '@/lib/instagramPublisher';
import { publishFacebookPhotoPost, isFacebookConfigured } from '@/lib/facebookPublisher';
import { notify } from '@/lib/notify';

export const maxDuration = 300;

// The cron fires 3×/day (see vercel.json — 9:00 / 14:00 / 20:00 IST). The slot
// is inferred from the run's UTC hour so a single route serves all three;
// ?slot=morning|afternoon|night overrides it for manual runs and previews.
function slotForNow(now: Date): IgSlot {
  const h = now.getUTCHours(); // 3:30 / 8:30 / 14:30 UTC
  if (h < 6) return 'morning';
  if (h < 12) return 'afternoon';
  return 'night';
}

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
  const now = new Date();
  const slotParam = url.searchParams.get('slot');
  const slot: IgSlot = (IG_SLOTS as string[]).includes(slotParam ?? '') ? (slotParam as IgSlot) : slotForNow(now);
  const pinsPerDay = Math.min(Number(process.env.SOCIAL_PINS_PER_DAY ?? 10) || 10, 25);

  // Pinterest posts its whole daily queue once, on the morning run only —
  // the afternoon/night runs are Instagram-only.
  const pinQueue = slot === 'morning' ? buildDailyQueue(now, pinsPerDay) : [];
  const igPost = buildInstagramSlotPost(now, slot);

  if (dry) {
    return NextResponse.json({ dry: true, slot, pinsPerDay, igPost, pinQueue });
  }

  const results: { platform: string; city: string; style: string; ok: boolean; id?: string; error?: string }[] = [];

  for (const item of pinQueue) {
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

  // Instagram — exactly one post per slot (3/day), design rotated by
  // buildInstagramSlotPost so no design repeats back-to-back.
  const igConfigured = Boolean(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
  if (igConfigured && igPost) {
    try {
      const { id } = await publishInstagramImagePost({ imageUrl: igPost.igImageUrl, caption: igPost.igCaption });
      results.push({ platform: 'instagram', city: igPost.citySlug, style: igPost.style, ok: true, id });
    } catch (e) {
      results.push({ platform: 'instagram', city: igPost.citySlug, style: igPost.style, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Facebook Page — same image and slot as Instagram, but the caption carries
  // a clickable link (FB allows it; IG doesn't), so posts drive traffic direct.
  if (isFacebookConfigured() && igPost) {
    try {
      const fbCaption = igPost.igCaption.replace(
        /Full free travel guide → link in bio \(tripgenius\.in\)/,
        `Full free travel guide → ${igPost.link}`,
      );
      const { id } = await publishFacebookPhotoPost({ imageUrl: igPost.igImageUrl, caption: fbCaption });
      results.push({ platform: 'facebook', city: igPost.citySlug, style: igPost.style, ok: true, id });
    } catch (e) {
      results.push({ platform: 'facebook', city: igPost.citySlug, style: igPost.style, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  const failed = results.filter(r => !r.ok).length;

  // Log + email every outcome so /admin and the inbox show what actually ran.
  for (const r of results) {
    await notify({
      source: r.platform === 'instagram' ? 'instagram'
        : r.platform === 'facebook' ? 'facebook'
        : 'pinterest',
      status: r.ok ? 'ok' : 'error',
      title: r.ok
        ? `Posted ${r.city} (${r.style}, ${slot} slot)`
        : `FAILED posting ${r.city} (${slot} slot)`,
      detail: r.ok ? `post id ${r.id}` : r.error,
    });
  }
  if (results.length === 0) {
    await notify({
      source: 'instagram',
      status: 'skipped',
      title: `${slot} slot ran but nothing was posted`,
      detail: igConfigured
        ? 'Queue produced no post for this slot.'
        : 'INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_BUSINESS_ACCOUNT_ID not configured.',
    });
  }

  return NextResponse.json({ slot, posted: results.length - failed, failed, igConfigured, results });
}
