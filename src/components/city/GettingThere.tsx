'use client';

import { motion } from 'framer-motion';
import { Plane, Building2, Clock, ArrowRight, Lightbulb, Tag } from 'lucide-react';
import { flightUrl } from '@/lib/affiliateLinks';
import { City } from '@/lib/types';

export default function GettingThere({ city }: { city: City }) {
  if (!city.gettingThere) return null;
  const data = city.gettingThere;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Plane size={15} className="text-accent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Getting There
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Flying to {city.name}
          </h2>
          <p className="mt-2 text-muted text-sm max-w-2xl leading-relaxed">{data.summary}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Flight routes */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-primary-text mb-4">
              Flight Times from Major Cities
            </h3>
            <div className="space-y-2 mb-8">
              {data.topRoutes.map((route, i) => (
                <motion.div
                  key={route.from}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="flex items-start gap-4 p-4 bg-surface border border-border rounded-xl hover:border-accent/20 transition-colors group"
                >
                  <span className="text-xl flex-shrink-0">{route.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                      <span className="font-semibold text-sm text-primary-text group-hover:text-accent transition-colors">
                        {route.from}
                      </span>
                      <ArrowRight size={12} className="text-muted hidden sm:block" />
                      <span className="font-bold text-sm text-accent">{route.duration}</span>
                    </div>
                    <p className="text-xs text-muted">{route.airlines}</p>
                    {route.note && (
                      <p className="text-xs text-teal italic mt-1">{route.note}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Booking tip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-teal/5 border border-teal/20 rounded-xl flex gap-3"
            >
              <Tag size={16} className="text-teal flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-teal mb-1 uppercase tracking-wide">
                  Best Time to Buy
                </p>
                <p className="text-xs text-primary-text/80 leading-relaxed">
                  {data.bestTimeToBuyTip}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Airports + CTA */}
          <div className="space-y-5">
            {/* Airport cards */}
            {data.airports.map((airport, i) => (
              <motion.div
                key={airport.code}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-surface border border-border rounded-2xl overflow-hidden"
              >
                {/* Airport header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-muted" />
                      <h4 className="text-sm font-semibold text-primary-text">{airport.name}</h4>
                    </div>
                    <p className="text-xs text-muted mt-0.5 ml-5">{airport.note}</p>
                  </div>
                  <div className="flex-shrink-0 ml-3 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
                    <span className="font-bold text-accent text-sm tracking-wider">{airport.code}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Distance + time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-elevated rounded-lg">
                      <p className="text-xs text-muted mb-1">Distance</p>
                      <p className="text-xs font-medium text-primary-text leading-snug">
                        {airport.distanceFromCity}
                      </p>
                    </div>
                    <div className="p-2.5 bg-elevated rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock size={10} className="text-muted" />
                        <p className="text-xs text-muted">Transfer time</p>
                      </div>
                      <p className="text-xs font-medium text-primary-text leading-snug">
                        {airport.transferTime}
                      </p>
                    </div>
                  </div>

                  {/* Transfer options */}
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                      How to get to the city
                    </p>
                    <ul className="space-y-2">
                      {airport.transferOptions.map((opt, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-primary-text/75 leading-relaxed">
                          <span className="text-accent mt-0.5 flex-shrink-0">›</span>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pro booking tip */}
            <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl flex gap-3">
              <Lightbulb size={15} className="text-gold flex-shrink-0 mt-0.5" />
              <p className="text-xs text-primary-text/80 leading-relaxed italic">
                {data.bookingTip}
              </p>
            </div>

            {/* Flight search CTA */}
            <a
              href={flightUrl(city.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/20"
            >
              <Plane size={15} />
              Search Flights to {city.name}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
