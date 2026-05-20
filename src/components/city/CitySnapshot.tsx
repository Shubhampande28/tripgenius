'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Zap, Clock, Wallet, Languages, Coins,
  MapPin, DollarSign, Plane, Hotel, Calendar,
  Star, ChevronRight
} from 'lucide-react';
import { City, MonthRating } from '@/lib/types';

const ratingBar: Record<MonthRating, string> = {
  excellent: 'bg-teal',
  good:      'bg-accent',
  average:   'bg-gold',
  avoid:     'bg-red-500/70',
};

const ratingHeight: Record<MonthRating, string> = {
  excellent: 'h-6',
  good:      'h-4',
  average:   'h-2.5',
  avoid:     'h-1',
};

export default function CitySnapshot({ city }: { city: City }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-teal to-teal/80 text-dark font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-teal/20"
      >
        <Zap size={15} />
        City Snapshot
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-dark border-l border-border z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-teal" />
                  <span className="text-xs font-bold uppercase tracking-widest text-teal">
                    City Snapshot
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center hover:border-accent hover:text-accent text-muted transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">

                {/* City hero */}
                <div className="px-5 py-5 border-b border-border">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{city.flag}</span>
                    <div>
                      <h2 className="font-heading text-3xl font-bold text-primary-text leading-none">
                        {city.name}
                      </h2>
                      <p className="text-xs text-muted mt-0.5">{city.country}</p>
                      <p className="text-sm text-primary-text/70 italic mt-1">{city.tagline}</p>
                    </div>
                  </div>

                  {/* Vibe tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {city.vibes.map((v) => (
                      <span key={v} className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-muted">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">At a Glance</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Clock,     label: 'Best Time', value: city.stats.bestTime, color: 'text-gold' },
                      { icon: Wallet,    label: 'Budget',    value: city.stats.budget,   color: 'text-teal' },
                      { icon: Languages, label: 'Language',  value: city.stats.language, color: 'text-accent' },
                      { icon: Coins,     label: 'Currency',  value: city.stats.currency, color: 'text-purple-400' },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="flex items-start gap-2 p-2.5 rounded-xl bg-surface border border-border">
                        <Icon size={12} className={`${color} mt-0.5 flex-shrink-0`} />
                        <div className="min-w-0">
                          <p className="text-xs text-muted leading-none mb-0.5">{label}</p>
                          <p className="text-xs font-semibold text-primary-text truncate">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top 5 things to do */}
                {city.thingsToDo && city.thingsToDo.length > 0 && (
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Top Things To Do</p>
                  <div className="space-y-2">
                    {city.thingsToDo.slice(0, 5).map((item, i) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-heading text-xs font-bold text-accent">{i + 1}</span>
                        </div>
                        <span className="text-xs text-primary-text">{item.icon} {item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Budget tiers */}
                {city.budgetBreakdown && (
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Daily Budget</p>
                  <div className="grid grid-cols-3 gap-2">
                    {city.budgetBreakdown.tiers.map((tier) => (
                      <div key={tier.label} className="text-center p-2.5 rounded-xl bg-surface border border-border">
                        <p className="text-base mb-1">{tier.icon}</p>
                        <p className="text-xs text-muted mb-1">{tier.label}</p>
                        <p className="text-xs font-bold text-primary-text leading-tight">{tier.perDay}</p>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Month grid */}
                {city.monthByMonth && (
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Best Time to Visit</p>
                  <div className="flex gap-1 items-end h-8 mb-2">
                    {city.monthByMonth.months.map((m) => (
                      <div key={m.short} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full rounded-sm ${ratingBar[m.rating]} ${ratingHeight[m.rating]}`} title={`${m.month}: ${m.rating}`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {city.monthByMonth.months.map((m) => (
                      <div key={m.short} className="flex-1 text-center">
                        <span className="text-[8px] text-muted/60">{m.short.slice(0, 1)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {city.monthByMonth.bestMonths.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/25 font-medium">{m}</span>
                    ))}
                  </div>
                </div>
                )}

                {/* Neighbourhoods */}
                {city.neighbourhoods && city.neighbourhoods.length > 0 && (
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Best Neighbourhoods</p>
                  <div className="space-y-2">
                    {city.neighbourhoods.slice(0, 3).map((n) => (
                      <div key={n.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border">
                        <MapPin size={12} className="text-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-primary-text">{n.name}</p>
                          <p className="text-xs text-muted truncate">{n.vibe}</p>
                        </div>
                        <span className="text-xs text-muted flex-shrink-0">{n.priceRange}</span>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Getting there */}
                {city.gettingThere && (
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Getting There</p>
                  {city.gettingThere.airports.slice(0, 1).map((airport) => (
                    <div key={airport.code} className="p-3 rounded-xl bg-surface border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-accent text-sm">{airport.code}</span>
                        <ChevronRight size={10} className="text-muted" />
                        <span className="text-xs text-primary-text truncate">{airport.name.split(' ')[0]} {airport.name.split(' ')[1]}</span>
                      </div>
                      <p className="text-xs text-muted">{airport.distanceFromCity}</p>
                      <p className="text-xs text-teal mt-1">⏱ {airport.transferTime.split('·')[0].trim()}</p>
                    </div>
                  ))}
                  <p className="text-xs text-muted/70 italic mt-2 leading-relaxed">{city.gettingThere.bestTimeToBuyTip}</p>
                </div>
                )}

                {/* Pro tip */}
                {city.proTips && city.proTips.length > 0 && (
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-gold/5 border border-gold/20">
                    <Star size={13} className="text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-primary-text/80 leading-relaxed italic">{city.proTips[0]}</p>
                  </div>
                </div>
                )}

                {/* CTAs */}
                <div className="px-5 py-5 space-y-3">
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
                  >
                    <Hotel size={14} />
                    Find Hotels in {city.name}
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-teal/10 border border-teal/30 text-teal font-semibold text-sm hover:bg-teal/20 transition-colors"
                  >
                    <Plane size={14} />
                    Search Flights to {city.name}
                  </a>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
