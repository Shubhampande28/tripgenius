'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Users, DollarSign, Star } from 'lucide-react';
import { City, MonthRating } from '@/lib/types';

const ratingConfig: Record<MonthRating, { label: string; bar: string; text: string; bg: string; border: string }> = {
  excellent: { label: 'Excellent', bar: 'bg-teal',         text: 'text-teal',         bg: 'bg-teal/8',    border: 'border-teal/25' },
  good:      { label: 'Good',      bar: 'bg-accent',       text: 'text-accent',       bg: 'bg-accent/8',  border: 'border-accent/25' },
  average:   { label: 'Average',   bar: 'bg-gold',         text: 'text-gold',         bg: 'bg-gold/8',    border: 'border-gold/25' },
  avoid:     { label: 'Avoid',     bar: 'bg-red-500/70',   text: 'text-red-400',      bg: 'bg-red-500/5', border: 'border-red-500/20' },
};

const crowdColor: Record<string, string> = {
  Low:      'text-teal',
  Moderate: 'text-gold',
  High:     'text-accent',
  Peak:     'text-red-400',
};

const priceColor: Record<string, string> = {
  Low:      'text-teal',
  Moderate: 'text-gold',
  High:     'text-accent',
  Peak:     'text-red-400',
};

export default function MonthByMonth({ city }: { city: City }) {
  if (!city.monthByMonth) return null;
  const data = city.monthByMonth;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <CalendarDays size={15} className="text-gold" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              When to Visit
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            {city.name} Month by Month
          </h2>
          <p className="mt-2 text-muted text-sm max-w-2xl leading-relaxed">{data.summary}</p>
        </motion.div>

        {/* Best / Avoid quick tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <div className="flex items-center gap-2">
            <Star size={13} className="text-teal" />
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">Best:</span>
            {data.bestMonths.map((m) => (
              <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/25 font-medium">
                {m}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">Avoid:</span>
            {data.avoidMonths.map((m) => (
              <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                {m}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Month grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.months.map((m, i) => {
            const cfg = ratingConfig[m.rating];
            return (
              <motion.div
                key={m.month}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className={`rounded-xl border ${cfg.bg} ${cfg.border} overflow-hidden`}
              >
                {/* Rating bar at top */}
                <div className={`h-1 w-full ${cfg.bar}`} />

                <div className="p-3.5">
                  {/* Month + temp */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-primary-text">{m.short}</p>
                      <p className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-primary-text">{m.temp}</p>
                      <p className="text-xs text-muted">avg</p>
                    </div>
                  </div>

                  {/* Weather */}
                  <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">
                    {m.weather}
                  </p>

                  {/* Crowds + Price */}
                  <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2.5">
                    <div className="flex items-center gap-1">
                      <Users size={9} className="text-muted" />
                      <span className={`font-semibold ${crowdColor[m.crowds]}`}>{m.crowds}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={9} className="text-muted" />
                      <span className={`font-semibold ${priceColor[m.price]}`}>{m.price}</span>
                    </div>
                  </div>

                  {/* Highlight event */}
                  {m.highlight && (
                    <p className="text-xs text-muted/70 italic mt-2 pt-2 border-t border-white/5 line-clamp-2">
                      {m.highlight}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-border"
        >
          <span className="text-xs text-muted">Rating:</span>
          {(Object.entries(ratingConfig) as [MonthRating, typeof ratingConfig[MonthRating]][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${val.bar}`} />
              <span className="text-xs text-muted">{val.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
