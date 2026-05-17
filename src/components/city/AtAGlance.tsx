'use client';

import { motion } from 'framer-motion';
import { Calendar, Wallet, Languages, Coins } from 'lucide-react';
import { City } from '@/lib/types';

const stats = (city: City) => [
  { icon: Calendar, label: 'Best Time to Visit', value: city.stats.bestTime, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
  { icon: Wallet, label: 'Daily Budget', value: city.stats.budget, color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/20' },
  { icon: Languages, label: 'Language', value: city.stats.language, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
  { icon: Coins, label: 'Currency', value: city.stats.currency, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

export default function AtAGlance({ city }: { city: City }) {
  return (
    <section className="py-12 bg-dark border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">
            At a Glance
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats(city).map(({ icon: Icon, label, value, color, bg, border }) => (
              <div
                key={label}
                className={`${bg} border ${border} rounded-xl p-4`}
              >
                <Icon size={18} className={`${color} mb-3`} />
                <p className="text-xs text-muted mb-1">{label}</p>
                <p className="text-sm font-semibold text-primary-text">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
