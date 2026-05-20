'use client';

import { motion } from 'framer-motion';
import { Wallet, Home, UtensilsCrossed, Bus, Ticket, Lightbulb } from 'lucide-react';
import { City } from '@/lib/types';

const tierStyles = {
  Budget:     { bg: 'bg-teal/5',    border: 'border-teal/25',    badge: 'bg-teal/15 text-teal border-teal/30',    heading: 'text-teal',    dot: 'bg-teal' },
  'Mid-range':{ bg: 'bg-accent/5',  border: 'border-accent/25',  badge: 'bg-accent/15 text-accent border-accent/30',  heading: 'text-accent',  dot: 'bg-accent', highlight: true },
  Luxury:     { bg: 'bg-gold/5',    border: 'border-gold/25',    badge: 'bg-gold/15 text-gold border-gold/30',    heading: 'text-gold',    dot: 'bg-gold' },
} as const;

const rows = [
  { icon: Home,            label: 'Accommodation', key: 'accommodation' },
  { icon: UtensilsCrossed, label: 'Food',          key: 'food' },
  { icon: Bus,             label: 'Transport',     key: 'transport' },
  { icon: Ticket,          label: 'Activities',    key: 'activities' },
] as const;

export default function BudgetBreakdown({ city }: { city: City }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center">
              <Wallet size={15} className="text-teal" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              Budget Breakdown
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            How Much Does {city.name} Cost?
          </h2>
          <p className="mt-2 text-muted text-sm">{city.budgetBreakdown.disclaimer}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {city.budgetBreakdown.tiers.map((tier, i) => {
            const style = tierStyles[tier.label];
            const isHighlight = tier.label === 'Mid-range';
            return (
              <motion.div
                key={tier.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl border ${style.bg} ${style.border} overflow-hidden ${
                  isHighlight ? 'ring-1 ring-accent/30 shadow-lg shadow-accent/5' : ''
                }`}
              >
                {isHighlight && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
                )}
                {isHighlight && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="p-5 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{tier.icon}</span>
                    <span className={`text-sm font-bold ${style.heading}`}>{tier.label}</span>
                  </div>
                  <div className={`text-2xl font-heading font-bold ${style.heading}`}>
                    {tier.perDay}
                  </div>
                  <div className="text-xs text-muted mt-0.5">per day, per person</div>
                </div>

                {/* Breakdown rows */}
                <div className="p-5 space-y-3">
                  {rows.map(({ icon: Icon, label, key }) => (
                    <div key={label} className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-dark/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={12} className="text-muted" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-0.5">
                          {label}
                        </p>
                        <p className="text-xs text-primary-text/80 leading-relaxed">
                          {tier[key]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tip */}
                <div className="mx-4 mb-4 p-3 rounded-xl bg-dark/30 border border-white/5">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={12} className="text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-primary-text/70 leading-relaxed italic">
                      {tier.tip}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
