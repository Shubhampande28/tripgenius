'use client';

import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, MinusCircle, XCircle } from 'lucide-react';
import { City, MonthRating } from '@/lib/types';

export default function MonthByMonth({ city }: { city: City }) {
  if (!city.monthByMonth) return null;
  const data = city.monthByMonth;

  // Group months by rating
  const groups: Record<MonthRating, string[]> = {
    excellent: [],
    good: [],
    average: [],
    avoid: [],
  };
  data.months.forEach((m) => groups[m.rating].push(m.short));

  const bestMonths  = [...groups.excellent, ...groups.good];
  const okayMonths  = groups.average;
  const avoidMonths = groups.avoid;

  return (
    <section className="py-12 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-start gap-8"
        >
          {/* Left: heading + summary */}
          <div className="sm:w-64 lg:w-80 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays size={15} className="text-gold" />
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                When to Visit
              </p>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary-text leading-tight mb-3">
              Best Time to Visit {city.name}
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Right: three rows */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Best */}
            {bestMonths.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 w-20 flex-shrink-0 pt-0.5">
                  <CheckCircle2 size={15} className="text-teal flex-shrink-0" />
                  <span className="text-xs font-bold text-teal uppercase tracking-wide">Best</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bestMonths.map((m) => (
                    <span
                      key={m}
                      className="text-sm font-semibold px-3 py-1.5 rounded-full bg-teal/10 text-teal border border-teal/25"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Okay */}
            {okayMonths.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 w-20 flex-shrink-0 pt-0.5">
                  <MinusCircle size={15} className="text-gold flex-shrink-0" />
                  <span className="text-xs font-bold text-gold uppercase tracking-wide">Okay</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {okayMonths.map((m) => (
                    <span
                      key={m}
                      className="text-sm font-semibold px-3 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/25"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Avoid */}
            {avoidMonths.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 w-20 flex-shrink-0 pt-0.5">
                  <XCircle size={15} className="text-red-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wide">Avoid</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {avoidMonths.map((m) => (
                    <span
                      key={m}
                      className="text-sm font-semibold px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </section>
  );
}
