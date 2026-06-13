'use client';

import Link from 'next/link';
import { Hotel, Plane, Ticket, Shield, ArrowRight, Sparkles, Map } from 'lucide-react';
import { City } from '@/lib/types';
import { hotelUrl, flightUrl, activitiesUrl, activitiesLabel } from '@/lib/affiliateLinks';
import { cityHasMapBuilder } from '@/lib/mapUtils';

export default function BookingPanel({ city }: { city: City }) {
  const links = [
    {
      icon: Hotel,
      label: 'Hotels',
      sub: 'Best rates · Free cancellation',
      href: hotelUrl(city.name),
      provider: 'Booking.com',
    },
    {
      icon: Ticket,
      label: 'Tours & Activities',
      sub: `Top-rated experiences in ${city.name}`,
      href: activitiesUrl(city.slug, city.name),
      provider: activitiesLabel(city.slug),
    },
    {
      icon: Plane,
      label: 'Flights',
      sub: 'Compare 500+ airlines',
      href: flightUrl(city.name),
      provider: 'Skyscanner',
    },
    {
      icon: Shield,
      label: 'Travel Insurance',
      sub: 'Medical · Cancellation · Baggage',
      href: 'https://www.worldnomads.com/',
      provider: 'World Nomads',
    },
  ];

  return (
    <section className="py-12 border-t border-border">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Ready to go?</p>
        <h2 className="font-heading text-2xl font-semibold text-primary-text">
          Plan &amp; Book Your {city.name} Trip
        </h2>
      </div>

      {/* Free itinerary planner CTA */}
      <Link
        href={`/plan?destination=${encodeURIComponent(city.name)}`}
        className="group flex items-center justify-between gap-4 mb-3 p-5 rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent hover:border-accent/40 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-text group-hover:text-accent transition-colors">
              Get a Free {city.name} Itinerary
            </p>
            <p className="text-xs text-muted mt-0.5">Day-by-day plan, budget &amp; packing list — generated instantly</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold flex-shrink-0 group-hover:bg-accent/90 transition-colors">
          Plan My Trip
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>

      {/* Interactive map builder CTA — only for cities with attraction coordinates */}
      {cityHasMapBuilder(city) && (
        <Link
          href={`/plan/${city.slug}`}
          className="group flex items-center justify-between gap-4 mb-3 p-5 rounded-2xl border border-teal/20 bg-gradient-to-r from-teal/10 via-teal/5 to-transparent hover:border-teal/40 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal/15 border border-teal/20 flex items-center justify-center flex-shrink-0">
              <Map size={20} className="text-teal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-text group-hover:text-teal transition-colors">
                Build Your {city.name} Itinerary on a Map
              </p>
              <p className="text-xs text-muted mt-0.5">Browse places, pin your picks, and arrange them day by day</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal text-white text-sm font-semibold flex-shrink-0 group-hover:bg-teal/90 transition-colors">
            Open Map
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map(({ icon: Icon, label, sub, href, provider }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-accent/30 hover:bg-accent/4 transition-all duration-200"
          >
            {/* Unified neutral icon box — no 4 different colours */}
            <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
              <Icon size={18} className="text-muted group-hover:text-accent transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-text group-hover:text-accent transition-colors">{label}</p>
              <p className="text-xs text-muted mt-0.5">{sub}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] text-muted/60 font-medium hidden sm:block">{provider}</span>
              <ArrowRight size={13} className="text-muted/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-muted/40 mt-4 text-center">
        We may earn a small commission if you book — at no extra cost to you.
      </p>
    </section>
  );
}
