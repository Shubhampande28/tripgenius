'use client';

import { motion } from 'framer-motion';
import { CalendarDays, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { City, MonthRating } from '@/lib/types';

const SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const ratingStyles: Record<MonthRating, { block: string; label: string; icon: typeof ThumbsUp; iconColor: string; chipBg: string; chipText: string }> = {
  excellent: { block: 'bg-teal',        label: 'Excellent',  icon: ThumbsUp,   iconColor: 'text-teal',       chipBg: 'bg-teal/10',       chipText: 'text-teal' },
  good:      { block: 'bg-accent/80',   label: 'Good',       icon: ThumbsUp,   iconColor: 'text-accent',     chipBg: 'bg-accent/10',     chipText: 'text-accent' },
  average:   { block: 'bg-gold/60',     label: 'Average',    icon: Minus,      iconColor: 'text-gold',       chipBg: 'bg-gold/10',       chipText: 'text-gold' },
  avoid:     { block: 'bg-red-500/70',  label: 'Avoid',      icon: ThumbsDown, iconColor: 'text-red-400',    chipBg: 'bg-red-500/10',    chipText: 'text-red-400' },
};

export default function MonthByMonth({ city }: { city: City }) {
  if (!city.monthByMonth) return null;
  const data = city.monthByMonth;

  return (
    <section className="py-14 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <CalendarDays size={15} className="text-gold" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">When to Visit</p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text mb-2">
            Best Time to Visit {city.name}
          </h2>
          <p className="text-sm text-muted mb-7 max-w-2xl leading-relaxed">{data.summary}</p>

          {/* 12-month colour strip */}
          <div className="bg-elevated border border-border rounded-2xl p-5 mb-6">
            <div className="grid grid-cols-12 gap-1 mb-2">
              {data.months.map((m) => {
                const s = ratingStyles[m.rating];
                return (
                  <div key={m.short} className="group relative flex flex-col items-center gap-1">
                    {/* Coloured block */}
                    <div className={`h-8 w-full rounded-md ${s.block} cursor-default`} />
                    {/* Month label */}
                    <span className="text-[9px] sm:text-[10px] text-muted font-medium">
                      {m.short.slice(0, 3)}
                    </span>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-dark border border-border rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl w-44 text-left">
                      <p className="text-xs font-bold text-primary-text mb-0.5">{m.month}</p>
                      <p className={`text-xs font-semibold ${s.iconColor} mb-1`}>{s.label}</p>
                      <p className="text-xs text-muted leading-snug">{m.weather}</p>
                      <p className="text-xs text-muted/60 mt-1">{m.temp} · Crowds: {m.crowds}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 pt-3 border-t border-border">
              {(Object.entries(ratingStyles) as [MonthRating, typeof ratingStyles[MonthRating]][]).map(([, s]) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${s.block}`} />
                  <span className="text-xs text-muted">{s.label}</span>
                </div>
              ))}
              <span className="ml-auto text-xs text-muted/40 italic hidden sm:block">Hover for details</span>
            </div>
          </div>

          {/* Best / Avoid chips */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 flex-wrap">
              <ThumbsUp size={13} className="text-teal" />
              <span className="text-xs font-bold text-muted uppercase tracking-wide">Best:</span>
              {data.bestMonths.map((m) => (
                <span key={m} className="text-xs px-3 py-1 rounded-full bg-teal/10 text-teal border border-teal/25 font-semibold">
                  {m}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <ThumbsDown size={13} className="text-red-400" />
              <span className="text-xs font-bold text-muted uppercase tracking-wide">Avoid:</span>
              {data.avoidMonths.map((m) => (
                <span key={m} className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
