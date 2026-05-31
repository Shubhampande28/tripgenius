'use client';

import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { City, MonthRating } from '@/lib/types';

const GROUP_CONFIG: Record<string, { rating: MonthRating[]; label: string; color: string; bg: string; border: string }> = {
  best:  { rating: ['excellent'],          label: 'Best Months',  color: 'text-teal',     bg: 'bg-teal/20',     border: 'border-teal/40' },
  good:  { rating: ['good'],               label: 'Good',         color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/35' },
  okay:  { rating: ['average'],            label: 'Okay',         color: 'text-gold',     bg: 'bg-gold/25',     border: 'border-gold/45' },
  avoid: { rating: ['avoid'],              label: 'Avoid',        color: 'text-red-400',  bg: 'bg-red-500/15',  border: 'border-red-500/30' },
};

export default function MonthByMonth({ city }: { city: City }) {
  if (!city.monthByMonth) return null;
  const { months, summary } = city.monthByMonth;

  return (
    <section id="best-time-to-visit" className="py-12 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays size={14} className="text-gold" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">When to Visit</p>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary-text mb-3">
            Best Time to Visit {city.name}: Month-by-Month Guide
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
                    {group.map((m) => (
                      <span
                        key={m.short}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                        title={`${m.month}: ${m.weather} · ${m.temp}`}
                      >
                        {m.short.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
