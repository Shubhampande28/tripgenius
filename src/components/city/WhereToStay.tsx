'use client';

import { motion } from 'framer-motion';
import { Star, DollarSign } from 'lucide-react';
import { hotelUrl } from '@/lib/affiliateLinks';
import { City } from '@/lib/types';

export default function WhereToStay({ city }: { city: City }) {
  if (!city.hotels?.length) return null;
  return (
    <section id="where-to-stay" className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-2">
            Accommodation
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Where to Stay in {city.name}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {city.hotels.map((hotel, i) => (
            <motion.div
              key={hotel.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-elevated border border-border rounded-2xl overflow-hidden group card-glow"
            >
              {/* Decorative top bar */}
              <div className="h-1 bg-gradient-to-r from-teal via-teal/60 to-transparent" />

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-primary-text group-hover:text-teal transition-colors">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">{hotel.type}</p>
                  </div>
                  <Star size={14} className="text-gold fill-gold flex-shrink-0 mt-0.5" />
                </div>

                <p className="text-sm text-muted leading-relaxed mb-4">{hotel.description}</p>

                <div className="p-3 bg-dark/50 rounded-xl border border-border/50 mb-4">
                  <p className="text-xs text-teal/80 mb-0.5">Highlight</p>
                  <p className="text-xs text-primary-text/80 italic">{hotel.highlight}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={13} className="text-gold" />
                    <span className="text-sm font-semibold text-primary-text">{hotel.priceRange}</span>
                  </div>
                  <a
                    href={hotelUrl(city.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-teal hover:text-teal/80 transition-colors"
                  >
                    Book now →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
