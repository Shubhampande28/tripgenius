'use client';

import { motion } from 'framer-motion';
import { MapPin, Hotel, Check, X } from 'lucide-react';
import { City } from '@/lib/types';

const priceLabel: Record<string, { label: string; color: string }> = {
  '$':    { label: 'Budget',    color: 'text-teal bg-teal/10 border-teal/25' },
  '$$':   { label: 'Mid-range', color: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
  '$$$':  { label: 'Upscale',   color: 'text-accent bg-accent/10 border-accent/25' },
  '$$$$': { label: 'Luxury',    color: 'text-gold bg-gold/10 border-gold/25' },
};

export default function Neighbourhoods({ city }: { city: City }) {
  if (!city.neighbourhoods?.length) return null;
  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <MapPin size={15} className="text-accent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Where to Base Yourself
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Best Neighbourhoods in {city.name}
          </h2>
          <p className="mt-2 text-muted max-w-2xl leading-relaxed">
            Location shapes your entire trip. Each neighbourhood has a different personality
            — here's who each one is really for.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {city.neighbourhoods.map((n, i) => {
            const price = priceLabel[n.priceRange] ?? priceLabel['$$'];
            return (
              <motion.div
                key={n.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-elevated border border-border rounded-2xl overflow-hidden group hover:border-accent/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="p-5 border-b border-border/50">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-heading text-2xl font-semibold text-primary-text group-hover:text-accent transition-colors">
                      {n.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${price.color}`}>
                        {n.priceRange} · {price.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-muted italic mb-3">{n.vibe}</p>
                  <p className="text-sm text-primary-text/75 leading-relaxed">{n.description}</p>
                </div>

                {/* Body */}
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Best for */}
                  <div>
                    <p className="text-xs font-semibold text-teal uppercase tracking-wide mb-2">
                      Best for
                    </p>
                    <ul className="space-y-1.5">
                      {n.bestFor.map((tag) => (
                        <li key={tag} className="flex items-center gap-2 text-xs text-primary-text/80">
                          <Check size={11} className="text-teal flex-shrink-0" />
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights */}
                  <div>
                    <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-2">
                      Highlights
                    </p>
                    <ul className="space-y-1.5">
                      {n.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-xs text-primary-text/80">
                          <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Not for */}
                <div className="px-5 pb-4 pt-1 border-t border-border/50 flex items-start gap-2">
                  <X size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted italic leading-relaxed">
                    <span className="text-red-400 font-medium not-italic">Skip if: </span>
                    {n.notFor}
                  </p>
                </div>

                {/* Book CTA */}
                <div className="px-5 pb-5">
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors text-xs font-semibold text-accent"
                  >
                    <Hotel size={13} />
                    Find hotels in {n.name}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
