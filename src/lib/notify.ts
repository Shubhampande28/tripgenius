// Email notifications for automation events, via the Resend API (plain fetch,
// no SDK). Free tier (100 emails/day) far exceeds our volume (~5/day).
//
// Env:
//   RESEND_API_KEY     — from resend.com (free account)
//   NOTIFY_EMAIL_TO    — where notifications go
//   NOTIFY_EMAIL_FROM  — optional; defaults to onboarding@resend.dev, which
//                        works without domain verification
//
// Unconfigured = silent no-op, so the site runs fine without email set up.

import { logActivity, type ActivityEntry, type ActivitySource } from './activityLog';

const STATUS_EMOJI: Record<ActivityEntry['status'], string> = {
  ok: '✅', error: '🚨', skipped: '⏭️',
};

export async function sendEmail(subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!apiKey || !to) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.NOTIFY_EMAIL_FROM ?? 'TripGenius Bot <onboarding@resend.dev>',
        to: [to],
        subject,
        text,
      }),
    });
    if (!res.ok) console.error(`Resend failed (${res.status}): ${await res.text()}`);
    return res.ok;
  } catch (err) {
    console.error('Resend request error:', err);
    return false;
  }
}

/** Log the event to the activity file AND email it. Never throws. */
export async function notify(entry: {
  source: ActivitySource;
  status: ActivityEntry['status'];
  title: string;
  detail?: string;
  url?: string;
}): Promise<void> {
  await logActivity(entry);
  const subject = `${STATUS_EMOJI[entry.status]} [${entry.source}] ${entry.title}`;
  const body = [
    entry.title,
    entry.detail ?? '',
    entry.url ? `\n${entry.url}` : '',
    `\n— TripGenius automation · ${new Date().toISOString()}`,
    'Dashboard: https://www.tripgenius.in/admin',
  ].filter(Boolean).join('\n');
  await sendEmail(subject, body);
}
