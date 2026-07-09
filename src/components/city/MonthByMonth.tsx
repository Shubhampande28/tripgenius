import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { City, MonthRating } from '@/lib/types';
import { hasAuthoredMonths } from '@/lib/cities';

const GROUP_CONFIG: Record<string, { rating: MonthRating[]; label: string; color: string; bg: string; border: string }> = {
  best:  { rating: ['excellent'],          label: 'Best Months',  color: 'text-teal',     bg: 'bg-teal/20',     border: 'border-teal/40' },
  good:  { rating: ['good'],               label: 'Good',         color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/35' },
  okay:  { rating: ['average'],            label: 'Okay',         color: 'text-gold',     bg: 'bg-gold/25',     border: 'border-gold/45' },
  avoid: { rating: ['avoid'],              label: 'Avoid',        color: 'text-red-400',  bg: 'bg-red-500/15',  border: 'border-red-500/30' },
};

const MONTH_FULL: Record<string, string> = {
  Jan: 'january', Feb: 'february', Mar: 'march', Apr: 'april',
  May: 'may', Jun: 'june', Jul: 'july', Aug: 'august',
  Sep: 'september', Oct: 'october', Nov: 'november', Dec: 'december',
};

export default function MonthByMonth({ city }: { city: City }) {
  if (!city.monthByMonth) return null;
  const { months, summary } = city.monthByMonth;
  // Link each month chip to its /visit/[city]/[month] page — those pages rank
  // positions 6–12 in GSC and need internal links from the city hub to climb.
  const linkable = hasAuthoredMonths(city.slug);

  return (
    <section id="best-time-to-visit" className="py-12 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div        >
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays size={14} className="text-accent" />
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">When to Visit</p>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary-text mb-3">
            When Is the Best Time to Visit {city.name}?
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-6 max-w-2xl">{summary}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(GROUP_CONFIG).map(([key, cfg]) => {
              const group = months.filter((m) => cfg.rating.includes(m.rating));
              if (!group.length) return null;
              return (
                <div key={key} className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${cfg.color}`}>
                    {cfg.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.map((m) => {
                      const chipClass = `text-xs px-2.5 py-1 rounded-full font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`;
                      const fullMonth = MONTH_FULL[m.short.slice(0, 3)];
                      return linkable && fullMonth ? (
                        <Link
                          key={m.short}
                          href={`/visit/${city.slug}/${fullMonth}`}
                          className={`${chipClass} hover:brightness-125 transition`}
                          title={`${city.name} in ${m.month}: ${m.weather} · ${m.temp}`}
                        >
                          {m.short.slice(0, 3)}
                        </Link>
                      ) : (
                        <span
                          key={m.short}
                          className={chipClass}
                          title={`${m.month}: ${m.weather} · ${m.temp}`}
                        >
                          {m.short.slice(0, 3)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {linkable && (
            <Link
              href={`/best-time-to-visit/${city.slug}`}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Full month-by-month guide for {city.name} →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
