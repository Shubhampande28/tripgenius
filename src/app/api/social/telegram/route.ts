// Telegram posting endpoint — triggered by an n8n Cron node (not a VPS crontab
// line, unlike /api/social/daily), so the schedule lives in n8n where it's
// visible/editable without touching this repo.
//
// Auth: requires `Authorization: Bearer <CRON_SECRET>` — same secret n8n's
// HTTP Request node sends, same one the VPS crontab uses for /api/social/daily.
//   curl -H "Authorization: Bearer $CRON_SECRET" \
//     "https://www.tripgenius.in/api/social/telegram?slot=midday&dry=1"
//
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID (see src/lib/telegramPublisher.ts)
//
// ?dry=1 returns the post without sending — use it to preview any slot.

import { NextResponse } from 'next/server';
import { buildTelegramSlotPost, TG_SLOTS, type TgSlot } from '@/lib/socialQueue';
import { publishTelegramPhotoPost, isTelegramConfigured } from '@/lib/telegramPublisher';
import { notify } from '@/lib/notify';

export const maxDuration = 60;

function slotForNow(now: Date): TgSlot {
  // Runs are expected around 11:00 and 18:00 IST (05:30 / 12:30 UTC) — see
  // the n8n Cron node. Anything before 09:00 UTC counts as the midday slot.
  return now.getUTCHours() < 9 ? 'midday' : 'evening';
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
  const slot: TgSlot = (TG_SLOTS as string[]).includes(slotParam ?? '') ? (slotParam as TgSlot) : slotForNow(now);

  const post = buildTelegramSlotPost(now, slot);
  if (!post) {
    await notify({ source: 'telegram', status: 'skipped', title: `${slot} slot ran but no post was built`, detail: 'Queue produced nothing (no indexable cities?).' });
    return NextResponse.json({ slot, posted: false, reason: 'empty queue' });
  }

  // Telegram supports clickable links in captions (like Facebook, unlike
  // Instagram) — swap the "link in bio" IG line for the real URL.
  const caption = post.igCaption.replace(
    /Full free travel guide → link in bio \(tripgenius\.in\)/,
    `Full free travel guide → ${post.link}`,
  );

  if (dry) {
    return NextResponse.json({ dry: true, slot, post: { ...post, tgCaption: caption } });
  }

  if (!isTelegramConfigured()) {
    await notify({ source: 'telegram', status: 'skipped', title: `${slot} slot ran but nothing was posted`, detail: 'TELEGRAM_BOT_TOKEN / TELEGRAM_CHANNEL_ID not configured.' });
    return NextResponse.json({ slot, posted: false, reason: 'not configured' });
  }

  try {
    const { id } = await publishTelegramPhotoPost({ imageUrl: post.igImageUrl, caption });
    await notify({ source: 'telegram', status: 'ok', title: `Posted ${post.cityName} (${post.style}, ${slot} slot)`, detail: `message id ${id}`, url: post.link });
    return NextResponse.json({ slot, posted: true, id, city: post.citySlug, style: post.style });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    await notify({ source: 'telegram', status: 'error', title: `FAILED posting ${post.cityName} (${slot} slot)`, detail: error });
    return NextResponse.json({ slot, posted: false, error }, { status: 502 });
  }
}
