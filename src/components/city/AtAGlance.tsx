'use client';

import { motion } from 'framer-motion';
import { Calendar, Wallet, Languages, Coins, Stamp } from 'lucide-react';
import { City } from '@/lib/types';

const statsConfig = (city: City) => [
  { icon: Calendar, label: 'Best Time', value: city.stats.bestTime, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
  { icon: Wallet, label: 'Daily Budget', value: city.stats.budget, color: 'text-teal', bg: 'bg-teal/10', border: 'border-teal/20' },
  { icon: Languages, label: 'Language', value: city.stats.language, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
  { icon: Coins, label: 'Currency', value: city.stats.currency, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

// Visa badge colour based on keywords
function visaColor(visa: string) {
  const v = visa.toLowerCase();
  if (v.includes('visa free') || v.includes('no visa')) return { dot: 'bg-teal', text: 'text-teal', bg: 'bg-teal/10 border-teal/25' };
  if (v.includes('on arrival') || v.includes('voa')) return { dot: 'bg-gold', text: 'text-gold', bg: 'bg-gold/10 border-gold/25' };
  if (v.includes('e-visa') || v.includes('evisa')) return { dot: 'bg-blue-400', text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/25' };
  return { dot: 'bg-accent', text: 'text-accent', bg: 'bg-accent/10 border-accent/25' };
}

export default function AtAGlance({ city }: { city: City }) {
  const vc = city.visa ? visaColor(city.visa) : null;

  return (
    <section className="py-10 bg-dark border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">
            At a Glance
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {statsConfig(city).map(({ icon: Icon, label, value, color, bg, border }) => (
              <div key={label} className={`${bg} border ${border} rounded-xl p-4`}>
                <Icon size={16} className={`${color} mb-2.5`} />
                <p className="text-xs text-muted mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-primary-text leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {/* Visa banner — only shown if visa data exists */}
          {city.visa && vc && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${vc.bg}`}>
              <Stamp size={15} className={vc.text} />
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${vc.dot}`} />
                <span className="text-xs font-semibold text-muted uppercase tracking-wide flex-shrink-0">
                  Visa:
                </span>
                <span className={`text-sm font-semibold ${vc.text} truncate`}>
                  {city.visa}
                </span>
              </div>
              <a
                href="https://molina.imigrasi.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-muted/60 hover:text-muted underline whitespace-nowrap flex-shrink-0"
              >
                Check official ↗
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
