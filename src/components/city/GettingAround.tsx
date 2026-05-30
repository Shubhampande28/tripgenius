'use client';

import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { City } from '@/lib/types';

export default function GettingAround({ city }: { city: City }) {
  if (!city.gettingAround?.length) return null;
  return (
    <section id="getting-around" className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
            Transport
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text mb-8">
            Getting Around {city.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {city.gettingAround.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex gap-4 p-4 bg-elevated border border-border rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Navigation size={14} className="text-accent" />
                </div>
                <p className="text-sm text-primary-text/80 leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
