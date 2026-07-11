// /admin — private automation dashboard. Shows every automation event (what
// posted, where, when, success/failure), pipeline health, and the latest news
// articles. Access: /admin?key=<ADMIN_KEY> (env var on the VPS). noindex +
// no internal links point here.

import type { Metadata } from 'next';
import { readActivity, latestBySource, type ActivitySource } from '@/lib/activityLog';
import { getAllNews } from '@/lib/news';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Automation Dashboard' },
  robots: { index: false, follow: false },
};

const STATUS_STYLE: Record<string, string> = {
  ok: 'bg-teal/15 text-teal border-teal/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
  skipped: 'bg-gold/15 text-gold border-gold/30',
};

// How stale each source may be before its health chip turns red.
const EXPECTED_INTERVAL_HOURS: Partial<Record<ActivitySource, number>> = {
  instagram: 12,       // 3 slots/day
  pinterest: 36,       // 1/weekday
  news: 30,            // daily routine
  'seo-watchdog': 30,  // daily
  scorecard: 8 * 24,   // weekly
  reddit: 8 * 24,      // weekly
};

function ago(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 48 * 60) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

function Denied() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-dark px-4">
      <form method="GET" className="bg-surface border border-border rounded-2xl p-8 max-w-sm w-full text-center">
        <h1 className="font-heading text-xl font-bold text-primary-text mb-4">Admin access</h1>
        <input
          type="password" name="key" placeholder="Admin key" autoFocus
          className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-sm text-primary-text mb-3 outline-none focus:border-accent"
        />
        <button type="submit" className="w-full bg-accent text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-accent/90">
          Open dashboard
        </button>
      </form>
    </main>
  );
}

export default async function AdminPage(
  { searchParams }: { searchParams: Promise<{ key?: string }> },
) {
  const { key } = await searchParams;
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || key !== adminKey) return <Denied />;

  const activity = await readActivity(150);
  const latest = await latestBySource();
  let news: ReturnType<typeof getAllNews> = [];
  try { news = getAllNews().slice(0, 8); } catch { /* content dir not traced — table just shows empty */ }
  const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_TO);

  const healthSources: { source: ActivitySource; label: string }[] = [
    { source: 'instagram', label: 'Instagram' },
    { source: 'pinterest', label: 'Pinterest' },
    { source: 'news', label: 'News' },
    { source: 'seo-watchdog', label: 'Watchdog' },
    { source: 'scorecard', label: 'Scorecard' },
    { source: 'reddit', label: 'Reddit' },
  ];

  return (
    <main className="min-h-screen bg-dark py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-heading text-2xl font-bold text-primary-text">Automation Dashboard</h1>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${emailConfigured ? STATUS_STYLE.ok : STATUS_STYLE.skipped}`}>
            {emailConfigured ? 'email alerts on' : 'email alerts NOT configured'}
          </span>
        </div>

        {/* Health strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {healthSources.map(({ source, label }) => {
            const last = latest[source];
            const maxHours = EXPECTED_INTERVAL_HOURS[source] ?? 48;
            const stale = last
              ? Date.now() - new Date(last.ts).getTime() > maxHours * 3600_000
              : true;
            const failed = last?.status === 'error';
            const chip = failed ? STATUS_STYLE.error : stale ? STATUS_STYLE.skipped : STATUS_STYLE.ok;
            return (
              <div key={source} className={`rounded-xl border p-3 ${chip}`}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1">{label}</p>
                <p className="text-[11px] leading-snug opacity-90">
                  {last ? `${last.status} · ${ago(last.ts)}` : 'no runs logged'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Latest news articles */}
        <h2 className="font-heading text-lg font-semibold text-primary-text mb-3">Latest news articles</h2>
        <div className="bg-surface border border-border rounded-2xl divide-y divide-border mb-10">
          {news.length === 0 && <p className="p-4 text-sm text-muted">No news articles found.</p>}
          {news.map((a) => (
            <div key={a.slug} className="flex items-center justify-between gap-4 p-3.5">
              <a href={`/news/${a.slug}`} className="text-sm text-primary-text hover:text-accent line-clamp-1">{a.title}</a>
              <span className="text-xs text-muted flex-shrink-0">{a.date}</span>
            </div>
          ))}
        </div>

        {/* Activity log */}
        <h2 className="font-heading text-lg font-semibold text-primary-text mb-3">
          Activity log <span className="text-muted text-sm font-normal">({activity.length} recent events)</span>
        </h2>
        <div className="bg-surface border border-border rounded-2xl divide-y divide-border">
          {activity.length === 0 && (
            <p className="p-4 text-sm text-muted">
              Nothing logged yet. Events appear here when the social cron runs on this
              server or a GitHub Actions pipeline reports in.
            </p>
          )}
          {activity.map((e, i) => (
            <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 p-3.5">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLE[e.status]}`}>
                {e.status}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted flex-shrink-0 w-20">{e.source}</span>
              <span className="text-sm text-primary-text flex-1 min-w-[200px]">
                {e.url ? <a href={e.url} className="hover:text-accent" target="_blank" rel="noreferrer">{e.title}</a> : e.title}
                {e.detail && <span className="text-muted"> — {e.detail.slice(0, 140)}</span>}
              </span>
              <span className="text-xs text-muted flex-shrink-0" title={e.ts}>{ago(e.ts)}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted mt-8">
          GitHub Actions runs: <a className="text-accent hover:underline" href="https://github.com/Shubhampande28/tripgenius/actions" target="_blank" rel="noreferrer">repo → Actions</a>
          {' · '}News routine: <a className="text-accent hover:underline" href="https://claude.ai/code/routines" target="_blank" rel="noreferrer">claude.ai/code/routines</a>
        </p>
      </div>
    </main>
  );
}
