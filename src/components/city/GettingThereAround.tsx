'use client';

import { motion } from 'framer-motion';
import {
  Plane, Building2, Clock, Navigation,
  ArrowRight, Lightbulb, Tag, Smartphone
} from 'lucide-react';
import { City } from '@/lib/types';

// Essential apps per city slug
const essentialApps: Record<string, { name: string; use: string }[]> = {
  bali:     [{ name: 'Gojek', use: 'Rides & food' }, { name: 'Grab', use: 'Rides' }, { name: 'Google Maps', use: 'Navigation' }],
  bangkok:  [{ name: 'Grab', use: 'Rides & delivery' }, { name: 'Google Maps', use: 'Transit routes' }, { name: 'Klook', use: 'Tours & tickets' }],
  paris:    [{ name: 'Bonjour RATP', use: 'Metro routes' }, { name: 'Uber', use: 'Taxis' }, { name: 'Google Maps', use: 'Navigation' }],
  tokyo:    [{ name: 'Suica/Pasmo', use: 'Transit card' }, { name: 'Google Maps', use: 'Train routes' }, { name: 'Hyperdia', use: 'Train planner' }],
  dubai:    [{ name: 'Careem', use: 'Rides' }, { name: 'RTA Dubai', use: 'Metro info' }, { name: 'Google Maps', use: 'Navigation' }],
  goa:      [{ name: 'Goa Miles', use: 'Metered taxis' }, { name: 'Rapido', use: 'Bike taxis' }, { name: 'Google Maps', use: 'Navigation' }],
};

export default function GettingThereAround({ city }: { city: City }) {
  if (!city.gettingThere && !city.gettingAround?.length) return null;

  const apps = essentialApps[city.slug] ?? [];

  return (
    <section className="py-16 bg-surface">
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
            <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center">
              <Plane size={15} className="text-teal" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              Getting There &amp; Around
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            How to Get To &amp; Around {city.name}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Getting There */}
          {city.gettingThere && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                Flying In
              </p>
              <p className="text-sm text-muted leading-relaxed mb-5">
                {city.gettingThere.summary}
              </p>

              {/* Airports */}
              <div className="space-y-3 mb-5">
                {city.gettingThere.airports.map((airport) => (
                  <div key={airport.code} className="p-4 bg-elevated border border-border rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-accent text-base px-2.5 py-1 bg-accent/10 rounded-lg">
                        {airport.code}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-primary-text leading-tight">
                          {airport.name}
                        </p>
                        <p className="text-xs text-muted">{airport.distanceFromCity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock size={11} className="text-teal" />
                      <span className="text-xs text-teal">{airport.transferTime}</span>
                    </div>
                    <ul className="space-y-1">
                      {airport.transferOptions.slice(0, 2).map((opt, j) => (
                        <li key={j} className="text-xs text-muted/80 flex gap-1.5">
                          <span className="text-accent">›</span> {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Top flight routes */}
              <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
                Flight Times from Major Cities
              </p>
              <div className="space-y-2 mb-4">
                {city.gettingThere.topRoutes.slice(0, 5).map((route) => (
                  <div key={route.from} className="flex items-center gap-3 p-3 bg-elevated rounded-xl border border-border">
                    <span className="text-base flex-shrink-0">{route.flag}</span>
                    <span className="text-sm font-medium text-primary-text flex-1">{route.from}</span>
                    <ArrowRight size={12} className="text-muted" />
                    <span className="text-sm font-bold text-accent">{route.duration}</span>
                  </div>
                ))}
              </div>

              {/* Best time to buy */}
              <div className="p-3.5 bg-teal/5 border border-teal/20 rounded-xl flex gap-3">
                <Tag size={14} className="text-teal flex-shrink-0 mt-0.5" />
                <p className="text-xs text-primary-text/80 leading-relaxed">
                  <span className="font-semibold text-teal">Best time to book: </span>
                  {city.gettingThere.bestTimeToBuyTip}
                </p>
              </div>

              {/* Flight search CTA */}
              <a
                href="#"
                className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                <Plane size={14} />
                Search Flights to {city.name}
              </a>
            </motion.div>
          )}

          {/* Right: Getting Around + Essential Apps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Getting Around */}
            {city.gettingAround && city.gettingAround.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold mb-4">
                  Getting Around
                </p>
                <div className="space-y-3">
                  {city.gettingAround.map((tip, i) => (
                    <div key={i} className="flex gap-3 p-3.5 bg-elevated border border-border rounded-xl">
                      <Navigation size={14} className="text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-primary-text/80 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Essential Apps */}
            {apps.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
                  Essential Apps
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {apps.map((app) => (
                    <div key={app.name} className="flex items-center gap-2 px-3 py-2 bg-elevated border border-border rounded-xl">
                      <Smartphone size={12} className="text-teal" />
                      <div>
                        <p className="text-xs font-semibold text-primary-text">{app.name}</p>
                        <p className="text-xs text-muted">{app.use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking tip */}
            {city.gettingThere?.bookingTip && (
              <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl flex gap-3">
                <Lightbulb size={15} className="text-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-primary-text/80 leading-relaxed italic">
                  {city.gettingThere.bookingTip}
                </p>
              </div>
            )}

            {/* Building */}
            <div className="p-4 bg-surface border border-border rounded-xl flex gap-3 items-center">
              <Building2 size={16} className="text-muted" />
              <p className="text-xs text-muted leading-relaxed">
                <span className="text-primary-text font-semibold">Airport → City: </span>
                {city.gettingThere?.airports[0]?.transferTime ?? 'See airport info'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
