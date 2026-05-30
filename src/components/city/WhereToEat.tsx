'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import { City } from '@/lib/types';
import { cardHover } from '@/lib/animations';

export default function WhereToEat({ city }: { city: City }) {
  if (!city.restaurants?.length) return null;
  return (
    <section id="where-to-eat" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">
            Dining
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            What to Eat in {city.name}: Best Local Food & Restaurants
          </h2>
          <p className="mt-2 text-muted text-sm max-w-2xl">
            From street food to fine dining — the dishes you must try and the restaurants locals actually go to.
          </p>
        </motion.div>

        <div className="space-y-5">
          {city.restaurants.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -3, boxShadow: '0 16px 36px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.99 }}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 p-6 bg-surface border border-border rounded-2xl items-start group hover:border-gold/30 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed size={20} className="text-gold" />
              </div>

              {/* Content */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1.5">
                  <h3 className="font-semibold text-primary-text group-hover:text-gold transition-colors">
                    {r.name}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-elevated border border-border text-muted">
                    {r.cuisine}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">{r.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted/60">Must try:</span>
                  <span className="text-xs font-medium text-gold italic">{r.mustTry}</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-muted mb-1">Price range</div>
                <div className="text-sm font-semibold text-primary-text">{r.priceRange}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
