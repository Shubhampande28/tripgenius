'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { City, MonthRating } from '@/lib/types';

const ratingStyle: Record<MonthRating, { bar: string; label: string; text: string; chip: string }> = {
  excellent: { bar: 'bg-teal',       label: 'Best',    text: 'text-teal',     chip: 'bg-teal/15 text-teal border-teal/30' },
  good:      { bar: 'bg-teal/60',    label: 'Good',    text: 'text-teal/80',  chip: 'bg-teal/8 text-teal/80 border-teal/20' },
  average:   { bar: 'bg-gold/50',    label: 'Okay',    text: 'text-gold',     chip: 'bg-gold/10 text-gold border-gold/25' },
  avoid:     { bar: 'bg-red-500/60', label: 'Avoid',   text: 'text-red-400',  chip: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function MonthByMonth({ city }: { city: City }) {
  if (!city.monthByMonth) return null;
  const data = city.monthByMonth;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Group months
  const best  = data.months.filter(m => m.rating === 'excellent' || m.rating === 'good');
  const okay  = data.months.filter(m => m.rating === 'average');
  const avoid = data.months.filter(m => m.rating === 'avoid');

  return (
    <section className="py-14 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays size={14} className="text-gold" />
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">When to Visit</p>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary-text">
                Best Time to Visit {city.name}
              </h2>
            </div>
            {/* Quick legend pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Best', style: 'bg-teal/15 text-teal border-teal/30' },
                { label: 'Okay', style: 'bg-gold/15 text-gold border-gold/30' },
                { label: 'Avoid', style: 'bg-red-500/10 text-red-400 border-red-500/20' },
              ].map(({ label, style }) => (
                <span key={label} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${style}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-muted leading-relaxed mb-6 max-w-2xl">{data.summary}</p>

          {/* ── Horizontal month strip ── */}
          <div className="bg-elevated border border-border rounded-2xl overflow-hidden">
            {/* Colour bar */}
            <div className="flex h-10">
              {data.months.map((m, i) => {
                const s = ratingStyle[m.rating];
                const isFirst = i === 0;
                const isLast  = i === data.months.length - 1;
                return (
                  <div
                    key={m.short}
                    className={`relative flex-1 ${s.bar} cursor-default transition-opacity duration-200 ${
                      hoveredIdx !== null && hoveredIdx !== i ? 'opacity-50' : 'opacity-100'
                    } ${isFirst ? 'rounded-tl-xl' : ''} ${isLast ? 'rounded-tr-xl' : ''}`}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Tooltip */}
                    {hoveredIdx === i && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-dark border border-border rounded-xl px-3 py-2.5 shadow-xl w-44 pointer-events-none">
                        <p className="text-xs font-bold text-primary-text">{m.month}</p>
                        <p className={`text-xs font-semibold ${s.text} mb-1`}>{s.label}</p>
                        <p className="text-xs text-muted leading-snug">{m.weather}</p>
                        <div className="flex gap-2 mt-1.5 text-[10px] text-muted/60">
                          <span>{m.temp}</span>
                          <span>·</span>
                          <span>Crowds: {m.crowds}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Month labels */}
            <div className="flex border-t border-border/50">
              {data.months.map((m) => (
                <div key={m.short} className="flex-1 text-center py-2">
                  <span className="text-[10px] font-medium text-muted">{m.short.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best / Okay / Avoid month chips */}
          <div className="mt-5 flex flex-wrap gap-5">
            {best.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-teal uppercase tracking-wide">Best:</span>
                {best.map(m => (
                  <span key={m.short} className="text-xs px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/25 font-semibold">
                    {m.short}
                  </span>
                ))}
              </div>
            )}
            {okay.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gold uppercase tracking-wide">Okay:</span>
                {okay.map(m => (
                  <span key={m.short} className="text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/25 font-semibold">
                    {m.short}
                  </span>
                ))}
              </div>
            )}
            {avoid.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Avoid:</span>
                {avoid.map(m => (
                  <span key={m.short} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                    {m.short}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
