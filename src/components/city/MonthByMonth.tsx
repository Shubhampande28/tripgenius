'use client';

import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { City, MonthRating } from '@/lib/types';

const ratingConfig: Record<MonthRating, { color: string; label: string; dot: string }> = {
  excellent: { color: 'bg-teal',       label: 'Excellent', dot: 'bg-teal' },
  good:      { color: 'bg-accent',     label: 'Good',      dot: 'bg-accent' },
  average:   { color: 'bg-gold/70',    label: 'Average',   dot: 'bg-gold' },
  avoid:     { color: 'bg-red-500/60', label: 'Avoid',     dot: 'bg-red-500' },
};

const barHeight: Record<MonthRating, string> = {
  excellent: 'h-10',
  good:      'h-7',
  average:   'h-4',
  avoid:     'h-2',
};

export default function MonthByMonth({ city }: { city: City }) {
  if (!city.monthByMonth) return null;
  const data = city.monthByMonth;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <CalendarDays size={15} className="text-gold" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">When to Visit</p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text mb-2">
            Best Time to Visit {city.name}
          </h2>
          <p className="text-sm text-muted mb-8 max-w-2xl leading-relaxed">{data.summary}</p>

          {/* Best / Avoid chips */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-teal uppercase tracking-wide">Best:</span>
              {data.bestMonths.map((m) => (
                <span key={m} className="text-xs px-3 py-1 rounded-full bg-teal/10 text-teal border border-teal/25 font-semibold">
                  {m}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Avoid:</span>
              {data.avoidMonths.map((m) => (
                <span key={m} className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Visual bar chart */}
          <div className="bg-elevated border border-border rounded-2xl p-5">
            <div className="flex items-end gap-1.5 h-12 mb-2">
              {data.months.map((m, i) => {
                const cfg = ratingConfig[m.rating];
                return (
                  <div key={m.short} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-dark border border-border rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
                      <p className="text-xs font-semibold text-primary-text">{m.month}</p>
                      <p className="text-xs text-muted">{m.temp} · {cfg.label}</p>
                      <p className="text-xs text-muted/70 max-w-[160px] truncate">{m.weather}</p>
                    </div>
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80 ${cfg.color} ${barHeight[m.rating]}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Month labels */}
            <div className="flex gap-1.5">
              {data.months.map((m) => (
                <div key={m.short} className="flex-1 text-center">
                  <span className="text-[10px] text-muted font-medium">{m.short.slice(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
              {(Object.entries(ratingConfig) as [MonthRating, typeof ratingConfig[MonthRating]][]).map(([, val]) => (
                <div key={val.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${val.dot}`} />
                  <span className="text-xs text-muted">{val.label}</span>
                </div>
              ))}
              <span className="text-xs text-muted/50 ml-auto italic">Hover each bar for details</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
