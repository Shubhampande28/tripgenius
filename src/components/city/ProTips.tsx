'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { City } from '@/lib/types';

export default function ProTips({ city }: { city: City }) {
  if (!city.proTips?.length) return null;
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">
            Insider Knowledge
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Pro Tips for {city.name}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {city.proTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-4 p-5 bg-surface border border-border rounded-xl group hover:border-gold/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                <Lightbulb size={16} className="text-gold" />
              </div>
              <p className="text-sm text-primary-text/80 leading-relaxed pt-1.5">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
