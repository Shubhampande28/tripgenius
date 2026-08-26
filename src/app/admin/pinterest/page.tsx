// /admin/pinterest — human-in-the-loop alternative to the automated Pinterest
// pipeline (automation/pinterest/publish.ts + the pinterest.yml GitHub Action).
// Shows the same "next pending" entry that publish.ts would pick, rendered
// with the same renderPin(), captioned with the same pinTitle/pinDescription/
// pinLink, so a manual post looks identical to an automated one. The GitHub
// Actions pipeline keeps running independently — this exists for days it
// fails, or before it's fully trusted. Access: /admin/pinterest?key=<ADMIN_KEY>
// (same env var and pattern as /admin).

import type { Metadata } from 'next';
import Link from 'next/link';
import { isAdminAuthorized } from '@/lib/adminAuth';
import AdminDenied from '@/components/admin/AdminDenied';
import CopyBlock from '@/components/admin/CopyBlock';
import { readQueue, nextPendingEntry } from '@/lib/pinterestQueue';
import { BOARDS, pinTitle, pinDescription, pinLink } from '../../../../automation/pinterest/publish';
import { markPosted } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Pinterest — Manual Posting' },
  robots: { index: false, follow: false },
};

function entrySubtitle(e: ReturnType<typeof readQueue>[number]): string {
  return e.type === 'itinerary'
    ? `${e.country} · ${e.days} days`
    : `${e.city} · ${e.month}`;
}

export default async function AdminPinterestPage(
  { searchParams }: { searchParams: Promise<{ key?: string; skip?: string }> },
) {
  const { key, skip } = await searchParams;
  if (!isAdminAuthorized(key)) return <AdminDenied title="Pinterest — admin access" />;

  const queue = readQueue();
  const totalPending = queue.filter((e) => e.status === 'pending').length;
  const skipSlugs = new Set((skip ?? '').split(',').filter(Boolean));
  const entry = nextPendingEntry(queue, skipSlugs);

  const keyParam = `key=${encodeURIComponent(key!)}`;
  const skipHref = entry
    ? `/admin/pinterest?${keyParam}&skip=${encodeURIComponent([...skipSlugs, entry.slug].join(','))}`
    : null;
  const resetSkipHref = `/admin/pinterest?${keyParam}`;

  const imgSrc = (variant: 'a' | 'b') =>
    entry ? `/admin/pinterest/image/${encodeURIComponent(entry.slug)}/${variant}?${keyParam}` : '';

  return (
    <main className="min-h-screen bg-dark py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-heading text-2xl font-bold text-primary-text">Pinterest — Manual Posting</h1>
          <Link href={`/admin?${keyParam}`} className="text-xs text-accent hover:underline">← Dashboard</Link>
        </div>
        <p className="text-sm text-muted mb-8">
          {totalPending} pending in queue.json · same order the automated pipeline uses ·
          skipped entries stay pending and reappear next session.
        </p>

        {!entry && totalPending === 0 && (
          <div className="bg-surface border border-border rounded-2xl p-8 text-center">
            <p className="text-primary-text font-semibold mb-1">Queue empty — nothing pending. 🎉</p>
            <p className="text-sm text-muted">Run <code>build-queue.ts</code> to refresh from live site data.</p>
          </div>
        )}

        {!entry && totalPending > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-8 text-center">
            <p className="text-primary-text font-semibold mb-1">You&apos;ve skipped every pending entry this session.</p>
            <Link href={resetSkipHref} className="text-sm text-accent hover:underline">Start over from the top of the queue</Link>
          </div>
        )}

        {entry && (
          <div className="space-y-6">
            {/* Entry header */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-accent mb-1">
                    {entry.type} · board: {BOARDS[entry.type]}
                  </p>
                  <h2 className="font-heading text-lg font-bold text-primary-text">{entry.headline}</h2>
                  <p className="text-sm text-muted mt-0.5">{entrySubtitle(entry)} — {entry.subline}</p>
                </div>
                <a href={entry.url} target="_blank" rel="noreferrer" className="flex-shrink-0 text-xs text-accent hover:underline whitespace-nowrap">
                  View page ↗
                </a>
              </div>
            </div>

            {/* Rendered variants */}
            <div>
              <h3 className="text-sm font-semibold text-primary-text mb-3">Pin image — both variants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['a', 'b'] as const).map((variant) => (
                  <div key={variant} className="bg-surface border border-border rounded-2xl overflow-hidden">
                    <img src={imgSrc(variant)} alt={`Variant ${variant.toUpperCase()}`} className="w-full block" />
                    <p className="text-xs text-muted text-center py-2">Variant {variant.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div>
              <h3 className="text-sm font-semibold text-primary-text mb-3">Caption — copy into Pinterest</h3>
              <CopyBlock
                text={[
                  `Title: ${pinTitle(entry)}`,
                  '',
                  `Description: ${pinDescription(entry)}`,
                  '',
                  `Link: ${pinLink(entry)}`,
                ].join('\n')}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <form action={markPosted}>
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="slug" value={entry.slug} />
                <button type="submit" className="bg-accent text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-accent/90 transition-colors">
                  Mark as posted
                </button>
              </form>
              {skipHref && (
                <Link href={skipHref} className="text-sm text-muted hover:text-primary-text border border-border rounded-xl px-5 py-2.5 transition-colors">
                  Skip to next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
