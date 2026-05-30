'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { City } from '@/lib/types';
import { stagger, fadeUp, VIEWPORT } from '@/lib/animations';

export default function ProTips({ city }: { city: City }) {
  if (!city.proTips?.length) return null;
  return (
    <section id="pro-tips" className="py-16">
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

        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {city.proTips.map((tip, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -3, boxShadow: '0 14px 32px rgba(0,0,0,0.28)' }}
              whileTap={{ scale: 0.99 }}
              className="flex gap-4 p-5 bg-surface border border-border rounded-xl group hover:border-gold/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                <Lightbulb size={16} className="text-gold" />
              </div>
              <p className="text-sm text-primary-text/80 leading-relaxed pt-1.5">{tip}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
